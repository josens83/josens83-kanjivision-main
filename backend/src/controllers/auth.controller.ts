import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const ACCESS_TTL = "7d";
const REFRESH_TTL = "30d";
const BCRYPT_ROUNDS = 12;

const emailField = z.string().email().transform((e) => e.trim().toLowerCase());
const passwordField = z.string().min(8).max(128);

const signupSchema = z.object({
  email: emailField,
  password: passwordField,
  displayName: z.string().min(1).max(80).optional(),
  locale: z.string().min(2).max(8).optional(),
});

const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

interface TokenPayload {
  sub: string;
  tier: User["tier"];
  typ: "access" | "refresh";
}

function secret(): string {
  return process.env.JWT_SECRET ?? "dev-secret-change-me";
}

function issueTokens(user: User) {
  const accessToken = jwt.sign(
    { sub: user.id, tier: user.tier, typ: "access" } satisfies TokenPayload,
    secret(),
    { expiresIn: ACCESS_TTL }
  );
  const refreshToken = jwt.sign(
    { sub: user.id, tier: user.tier, typ: "refresh" } satisfies TokenPayload,
    secret(),
    { expiresIn: REFRESH_TTL }
  );
  return { accessToken, refreshToken, tokenType: "Bearer", expiresIn: ACCESS_TTL };
}

export function serializeUser(u: User) {
  // Drop passwordHash + any fields we don't want to leak.
  const { passwordHash: _pw, ...safe } = u;
  void _pw;
  return safe;
}

export async function signup(req: Request, res: Response) {
  const body = signupSchema.parse(req.body);
  const existing = await prisma.user.findUnique({ where: { email: body.email } });
  if (existing) {
    return res.status(409).json({ error: "email already registered" });
  }
  const passwordHash = await bcrypt.hash(body.password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      email: body.email,
      passwordHash,
      displayName: body.displayName,
      locale: body.locale ?? "en",
    },
  });
  const tokens = issueTokens(user);
  res.status(201).json({ user: serializeUser(user), ...tokens });
}

export async function login(req: Request, res: Response) {
  const body = loginSchema.parse(req.body);
  const user = await prisma.user.findUnique({ where: { email: body.email } });
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: "invalid credentials" });
  }
  const ok = await bcrypt.compare(body.password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "invalid credentials" });
  const tokens = issueTokens(user);
  res.json({ user: serializeUser(user), ...tokens });
}

export async function me(req: AuthenticatedRequest, res: Response) {
  if (!req.userId) return res.status(401).json({ error: "unauthenticated" });
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({ user: serializeUser(user) });
}

export async function refresh(req: Request, res: Response) {
  const { refreshToken } = refreshSchema.parse(req.body);
  let payload: TokenPayload;
  try {
    payload = jwt.verify(refreshToken, secret()) as TokenPayload;
  } catch {
    return res.status(401).json({ error: "invalid refresh token" });
  }
  if (payload.typ !== "refresh") {
    return res.status(401).json({ error: "not a refresh token" });
  }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user) return res.status(404).json({ error: "user not found" });
  const tokens = issueTokens(user);
  res.json({ user: serializeUser(user), ...tokens });
}

export async function logout(_req: AuthenticatedRequest, res: Response) {
  // JWT is stateless — nothing to invalidate server-side in Phase 1.
  // Phase 2: persist refresh-token JTIs and revoke here.
  res.status(204).end();
}
