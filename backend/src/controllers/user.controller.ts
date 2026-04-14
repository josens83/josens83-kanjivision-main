import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const updateSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  locale: z.string().min(2).max(8).optional(),
});

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json({ user });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const patch = updateSchema.parse(req.body);
  const user = await prisma.user.update({ where: { id: req.userId! }, data: patch });
  res.json({ user });
}

export async function deleteAccount(req: AuthenticatedRequest, res: Response) {
  await prisma.user.delete({ where: { id: req.userId! } });
  res.status(204).end();
}
