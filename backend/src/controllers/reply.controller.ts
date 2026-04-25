import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function createReply(req: AuthenticatedRequest, res: Response) {
  const { announcementId, body } = z.object({ announcementId: z.string(), body: z.string().min(1).max(2000) }).parse(req.body);
  const existing = await prisma.reply.findUnique({ where: { userId_announcementId: { userId: req.userId!, announcementId } } });
  if (existing) return res.status(409).json({ error: "already replied" });
  const reply = await prisma.reply.create({ data: { userId: req.userId!, announcementId, body } });
  res.status(201).json({ reply });
}

export async function myReplies(req: AuthenticatedRequest, res: Response) {
  const rows = await prisma.reply.findMany({ where: { userId: req.userId! }, include: { announcement: { select: { title: true } } }, orderBy: { createdAt: "desc" } });
  res.json({ replies: rows });
}

export async function adminListReplies(_req: Request, res: Response) {
  const rows = await prisma.reply.findMany({
    include: { user: { select: { email: true, displayName: true } }, announcement: { select: { title: true } } },
    orderBy: { createdAt: "desc" }, take: 100,
  });
  res.json({ replies: rows });
}

export async function adminUpdateStatus(req: Request, res: Response) {
  const { status } = z.object({ status: z.enum(["PENDING", "APPROVED", "REJECTED"]) }).parse(req.body);
  const reply = await prisma.reply.update({ where: { id: req.params.id }, data: { status } });
  res.json({ reply });
}
