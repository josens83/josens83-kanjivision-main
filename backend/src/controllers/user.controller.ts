import type { Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { serializeUser } from "./auth.controller";

const profileSchema = z.object({
  displayName: z.string().min(1).max(80).optional(),
  locale: z.string().min(2).max(8).optional(),
  dailyGoal: z.number().int().min(1).max(100).optional(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});

export async function getProfile(req: AuthenticatedRequest, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user) return res.status(404).json({ error: "not found" });
  res.json({ user: serializeUser(user) });
}

export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  const patch = profileSchema.parse(req.body);
  const user = await prisma.user.update({ where: { id: req.userId! }, data: patch });
  res.json({ user: serializeUser(user) });
}

export async function changePassword(req: AuthenticatedRequest, res: Response) {
  const { currentPassword, newPassword } = passwordSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { id: req.userId! } });
  if (!user || !user.passwordHash) {
    return res.status(400).json({ error: "no password set" });
  }
  const ok = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "current password is incorrect" });
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({ where: { id: req.userId! }, data: { passwordHash } });
  res.json({ ok: true });
}

export async function deleteAccount(req: AuthenticatedRequest, res: Response) {
  await prisma.user.delete({ where: { id: req.userId! } });
  res.status(204).end();
}
