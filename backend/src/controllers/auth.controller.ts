import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { z } from "zod";
import type { User } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const ACCESS_TTL: SignOptions["expiresIn"] = "7d";
const REFRESH_TTL: SignOptions["expiresIn"] = "30d";
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

function secret(): Secret {
  return (process.env.JWT_SECRET ?? "dev-secret-change-me") as Secret;
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
  res.status(204).end();
}

// ---------- Google OAuth ----------

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo";

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

function getGoogleRedirectUri(req: Request): string {
  if (process.env.GOOGLE_REDIRECT_URI) return process.env.GOOGLE_REDIRECT_URI;
  const proto = req.headers["x-forwarded-proto"] ?? req.protocol;
  const host = req.headers["x-forwarded-host"] ?? req.get("host");
  return `${proto}://${host}/api/auth/callback/google`;
}

export async function googleAuth(req: Request, res: Response) {
  const config = getGoogleConfig();
  if (!config) return res.status(503).json({ error: "Google OAuth not configured" });

  const redirectUri = getGoogleRedirectUri(req);
  const frontendRedirect = (req.query.redirect_uri as string) || "";

  const params = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
    state: frontendRedirect,
  });
  res.redirect(`${GOOGLE_AUTH_URL}?${params.toString()}`);
}

interface GoogleTokenResponse {
  access_token: string;
  id_token?: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: string;
}

export async function googleCallback(req: Request, res: Response) {
  const config = getGoogleConfig();
  if (!config) return res.status(503).json({ error: "Google OAuth not configured" });

  const code = req.query.code as string;
  const state = (req.query.state as string) || "";
  if (!code) return res.status(400).json({ error: "missing code" });

  const redirectUri = getGoogleRedirectUri(req);

  // 1. code → access_token 교환
  const tokenRes = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    return res.status(400).json({ error: "google token exchange failed", detail: err });
  }
  const tokenData = (await tokenRes.json()) as GoogleTokenResponse;

  // 2. userinfo 조회
  const infoRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  if (!infoRes.ok) return res.status(400).json({ error: "google userinfo failed" });
  const info = (await infoRes.json()) as GoogleUserInfo;

  if (!info.email) return res.status(400).json({ error: "no email from google" });

  // 3. DB 조회/생성
  let user = await prisma.user.findFirst({
    where: { OR: [{ googleId: info.id }, { email: info.email.toLowerCase() }] },
  });

  if (user) {
    // 기존 유저 — googleId 연결 (이메일 가입 후 구글 로그인)
    if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId: info.id, provider: "GOOGLE" },
      });
    }
  } else {
    // 신규 유저
    user = await prisma.user.create({
      data: {
        email: info.email.toLowerCase(),
        displayName: info.name ?? null,
        provider: "GOOGLE",
        googleId: info.id,
      },
    });
  }

  // 4. JWT 발급 → 프론트엔드 콜백 페이지로 리다이렉트
  const tokens = issueTokens(user);
  const frontendOrigin =
    state ||
    process.env.FRONTEND_URL ||
    (req.headers.origin ?? "http://localhost:3000");
  const callbackUrl = new URL("/auth/callback/google", frontendOrigin);
  callbackUrl.searchParams.set("token", tokens.accessToken);
  res.redirect(callbackUrl.toString());
}

// ---------- Password Reset ----------

import crypto from "node:crypto";
import { sendPasswordResetEmail, sendWelcomeEmail } from "../services/email.service";

export async function forgotPassword(req: Request, res: Response) {
  const { email } = z.object({ email: emailField }).parse(req.body);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.json({ ok: true });
  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenExpiry = new Date(Date.now() + 3600_000);
  await prisma.user.update({
    where: { id: user.id },
    data: { resetToken, resetTokenExpiry },
  });
  const frontendUrl = process.env.FRONTEND_URL ?? "https://kanjivision.app";
  const resetUrl = `${frontendUrl}/auth/reset-password?token=${resetToken}`;
  sendPasswordResetEmail(email, resetUrl).catch(() => {});
  res.json({ ok: true });
}

export async function resetPassword(req: Request, res: Response) {
  const { token, newPassword } = z.object({
    token: z.string().min(1),
    newPassword: passwordField,
  }).parse(req.body);
  const user = await prisma.user.findFirst({
    where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
  });
  if (!user) return res.status(400).json({ error: "invalid or expired token" });
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetToken: null, resetTokenExpiry: null },
  });
  res.json({ ok: true });
}
