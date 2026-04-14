import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userTier?: "FREE" | "BASIC" | "PREMIUM";
}

interface JwtPayload {
  sub: string;
  tier?: "FREE" | "BASIC" | "PREMIUM";
}

export function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.header("authorization");
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "missing bearer token" });
    return;
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET ?? "dev") as JwtPayload;
    req.userId = payload.sub;
    req.userTier = payload.tier ?? "FREE";
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
}

export function requireTier(min: "FREE" | "BASIC" | "PREMIUM") {
  const order = { FREE: 0, BASIC: 1, PREMIUM: 2 } as const;
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const current = req.userTier ?? "FREE";
    if (order[current] < order[min]) {
      res.status(402).json({ error: "upgrade required", requiredTier: min });
      return;
    }
    next();
  };
}

export function signToken(userId: string, tier: "FREE" | "BASIC" | "PREMIUM"): string {
  return jwt.sign({ sub: userId, tier }, process.env.JWT_SECRET ?? "dev", {
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  });
}
