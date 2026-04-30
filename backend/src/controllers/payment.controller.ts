import type { Request, Response } from "express";
import { z } from "zod";
import { PaymentProcessor } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logger } from "../lib/logger";
import { generateReceiptHTML } from "../services/receipt.service";

const checkoutSchema = z.object({
  planId: z.string(),
  region: z.enum(["global", "kr"]).default("global"),
});

export async function checkout(req: AuthenticatedRequest, res: Response) {
  const { planId, region } = checkoutSchema.parse(req.body);
  const processor = region === "kr" ? "toss" : "paddle";
  // Phase 1: return a stub checkout response; Phase 2 hits Paddle /Toss APIs.
  res.json({
    ok: true,
    processor,
    planId,
    checkoutUrl: null,
    demo: true,
  });
}

export async function paddleWebhook(req: Request, res: Response) {
  // Phase 2: verify Paddle signature with PADDLE_WEBHOOK_SECRET.
  const event = req.body;
  logger.info({ type: event?.event_type }, "paddle webhook");
  if (event?.event_type === "transaction.completed" && event?.data?.customer?.email) {
    await recordPayment({
      processor: PaymentProcessor.PADDLE,
      email: event.data.customer.email,
      externalId: event.data.id,
      amountCents: Number(event.data.details?.totals?.total ?? 0),
      currency: event.data.currency_code ?? "USD",
      status: "SUCCEEDED",
      raw: event,
    });
  }
  res.json({ received: true });
}

export async function tossWebhook(req: Request, res: Response) {
  const event = req.body;
  logger.info({ type: event?.eventType }, "toss webhook");
  if (event?.eventType === "PAYMENT_STATUS_CHANGED" && event?.data?.customerEmail) {
    await recordPayment({
      processor: PaymentProcessor.TOSS,
      email: event.data.customerEmail,
      externalId: event.data.paymentKey,
      amountCents: Number(event.data.totalAmount ?? 0) * 100,
      currency: event.data.currency ?? "KRW",
      status: event.data.status === "DONE" ? "SUCCEEDED" : "PENDING",
      raw: event,
    });
  }
  res.json({ received: true });
}

async function recordPayment(p: {
  processor: PaymentProcessor;
  email: string;
  externalId: string;
  amountCents: number;
  currency: string;
  status: "PENDING" | "SUCCEEDED" | "FAILED" | "REFUNDED";
  raw: unknown;
}) {
  const user = await prisma.user.findUnique({ where: { email: p.email } });
  if (!user) return;
  await prisma.payment.upsert({
    where: { externalId: p.externalId },
    update: { status: p.status, rawEvent: p.raw as object },
    create: {
      userId: user.id,
      processor: p.processor,
      externalId: p.externalId,
      amountCents: p.amountCents,
      currency: p.currency,
      status: p.status,
      rawEvent: p.raw as object,
    },
  });
}

export async function downloadReceipt(req: AuthenticatedRequest, res: Response) {
  const { purchaseId } = req.params;
  const purchase = await prisma.userPurchase.findFirst({
    where: { id: purchaseId, userId: req.userId! },
    include: {
      user: { select: { email: true, displayName: true } },
      package: { select: { name: true, nameEn: true } },
    },
  });
  if (!purchase) return res.status(404).json({ error: "purchase not found" });

  const html = generateReceiptHTML({
    userName: purchase.user.displayName,
    userEmail: purchase.user.email,
    packageName: purchase.package.nameEn ?? purchase.package.name,
    amount: purchase.amount,
    transactionId: purchase.id,
    purchaseDate: purchase.createdAt,
    expiresAt: purchase.expiresAt,
  });

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Disposition", `inline; filename="receipt-${purchase.id}.html"`);
  res.send(html);
}
