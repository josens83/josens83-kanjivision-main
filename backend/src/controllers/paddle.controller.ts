import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const PRICE_MAP: Record<string, string | undefined> = {
  basic_monthly: process.env.PADDLE_PRICE_ID_BASIC_MONTHLY,
  basic_yearly: process.env.PADDLE_PRICE_ID_BASIC_YEARLY,
  premium_monthly: process.env.PADDLE_PRICE_ID_PREMIUM_MONTHLY,
  premium_yearly: process.env.PADDLE_PRICE_ID_PREMIUM_YEARLY,
};

const checkoutSchema = z.object({
  plan: z.enum(["basic", "premium"]),
  billingCycle: z.enum(["monthly", "yearly"]).default("monthly"),
});

export async function createCheckout(req: AuthenticatedRequest, res: Response) {
  const { plan, billingCycle } = checkoutSchema.parse(req.body);
  const priceKey = `${plan}_${billingCycle}`;
  const priceId = PRICE_MAP[priceKey];

  if (!priceId || !process.env.PADDLE_API_KEY) {
    return res.status(503).json({
      error: "Paddle not configured",
      plan,
      billingCycle,
      hint: "Set PADDLE_API_KEY and PADDLE_PRICE_ID_* environment variables",
    });
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "user not found" });

  const paddleRes = await fetch("https://api.paddle.com/transactions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PADDLE_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [{ price_id: priceId, quantity: 1 }],
      custom_data: { userId: req.userId!, plan, billingCycle },
      customer_id: undefined,
      checkout: { url: undefined },
    }),
  });

  if (!paddleRes.ok) {
    const err = await paddleRes.text();
    logger.error({ status: paddleRes.status, err }, "paddle transaction failed");
    return res.status(502).json({ error: "paddle error" });
  }

  const data = (await paddleRes.json()) as { data?: { id?: string } };
  res.json({ transactionId: data.data?.id, plan, billingCycle });
}

interface PaddleWebhookBody {
  event_type?: string;
  data?: {
    id?: string;
    status?: string;
    custom_data?: {
      userId?: string;
      plan?: string;
      billingCycle?: string;
      slug?: string;
      type?: string;
    };
    current_billing_period?: { ends_at?: string };
    scheduled_change?: { action?: string } | null;
  };
}

export async function webhook(req: Request, res: Response) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (secret) {
    const sig = req.headers["paddle-signature"] as string | undefined;
    if (!sig) {
      return res.status(401).json({ error: "missing signature" });
    }
  }

  const body = req.body as PaddleWebhookBody;
  const eventType = body.event_type;
  const data = body.data;

  if (!eventType || !data) {
    return res.status(400).json({ error: "invalid payload" });
  }

  logger.info({ eventType, subscriptionId: data.id }, "paddle webhook");

  const userId = data.custom_data?.userId;
  if (!userId) {
    return res.json({ received: true, note: "no userId in custom_data" });
  }

  const plan = data.custom_data?.plan;
  const billingCycle = data.custom_data?.billingCycle;
  const subscriptionPlan = plan && billingCycle ? `${plan}_${billingCycle}` : null;

  // Handle standalone pack purchase
  if (eventType === "transaction.completed" && data.custom_data?.type === "package" && data.custom_data?.slug) {
    const pkg = await prisma.productPackage.findUnique({ where: { slug: data.custom_data.slug } });
    if (pkg) {
      await prisma.userPurchase.create({
        data: {
          userId,
          packageId: pkg.id,
          amount: pkg.price,
          status: "ACTIVE",
          expiresAt: new Date(Date.now() + pkg.durationDays * 86400000),
        },
      }).catch(() => {});
      logger.info({ userId, slug: pkg.slug }, "package purchased");
    }
    return res.json({ received: true });
  }

  switch (eventType) {
    case "subscription.activated":
    case "subscription.updated": {
      const endsAt = data.current_billing_period?.ends_at;
      await prisma.user.update({
        where: { id: userId },
        data: {
          tier: plan === "premium" ? "PREMIUM" : "BASIC",
          subscriptionPlan,
          subscriptionStatus: "ACTIVE",
          subscriptionEnd: endsAt ? new Date(endsAt) : null,
          paddleSubscriptionId: data.id,
          autoRenewal: !data.scheduled_change,
        },
      });
      break;
    }
    case "subscription.canceled": {
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionStatus: "CANCELLED",
          autoRenewal: false,
        },
      });
      break;
    }
    case "subscription.past_due": {
      await prisma.user.update({
        where: { id: userId },
        data: { subscriptionStatus: "PAST_DUE" },
      });
      break;
    }
  }

  res.json({ received: true });
}

export async function getSubscription(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: {
      tier: true,
      subscriptionPlan: true,
      subscriptionStatus: true,
      subscriptionEnd: true,
      autoRenewal: true,
    },
  });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json(user);
}
