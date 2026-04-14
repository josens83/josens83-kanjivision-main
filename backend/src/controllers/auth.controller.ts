import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { signToken } from "../middleware/auth.middleware";

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  displayName: z.string().optional(),
});

export async function signup(req: Request, res: Response) {
  const { email, password, displayName } = credsSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, passwordHash, displayName },
  });
  const token = signToken(user.id, user.tier);
  res.status(201).json({ token, user: safe(user) });
}

export async function login(req: Request, res: Response) {
  const { email, password } = credsSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });
  const token = signToken(user.id, user.tier);
  res.json({ token, user: safe(user) });
}

export async function me(req: Request & { userId?: string }, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthenticated" });
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user: safe(user) });
}

function safe(u: { id: string; email: string; displayName: string | null; tier: string; locale: string }) {
  return { id: u.id, email: u.email, displayName: u.displayName, tier: u.tier, locale: u.locale };
}
