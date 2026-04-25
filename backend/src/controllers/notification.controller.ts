import type { Response } from "express";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function list(req: AuthenticatedRequest, res: Response) {
  const rows = await prisma.notification.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json({ notifications: rows });
}

export async function unreadCount(req: AuthenticatedRequest, res: Response) {
  const count = await prisma.notification.count({
    where: { userId: req.userId!, read: false },
  });
  res.json({ count });
}

export async function markRead(req: AuthenticatedRequest, res: Response) {
  await prisma.notification.updateMany({
    where: { id: req.params.id, userId: req.userId! },
    data: { read: true },
  });
  res.json({ ok: true });
}

export async function markAllRead(req: AuthenticatedRequest, res: Response) {
  await prisma.notification.updateMany({
    where: { userId: req.userId!, read: false },
    data: { read: true },
  });
  res.json({ ok: true });
}
