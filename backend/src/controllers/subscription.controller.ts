import type { Response } from "express";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function list(req: AuthenticatedRequest, res: Response) {
  const subs = await prisma.subscription.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
  });
  res.json({ subscriptions: subs });
}

export async function cancel(req: AuthenticatedRequest, res: Response) {
  const updated = await prisma.subscription.updateMany({
    where: { userId: req.userId!, id: req.params.id, status: "ACTIVE" },
    data: { status: "CANCELED", canceledAt: new Date() },
  });
  res.json({ canceled: updated.count });
}
