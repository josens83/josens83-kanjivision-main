import type { NextFunction, Request, Response } from "express";

const CLEANUP_INTERVAL = 3_600_000;

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}, CLEANUP_INTERVAL);

function getKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") return forwarded.split(",")[0].trim();
  return req.ip ?? req.socket.remoteAddress ?? "unknown";
}

function createLimiter(windowMs: number, maxRequests: number, prefix = "") {
  return (req: Request, res: Response, next: NextFunction): void => {
    const key = `${prefix}:${getKey(req)}`;
    const now = Date.now();
    let entry = store.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 1, resetAt: now + windowMs };
      store.set(key, entry);
      next();
      return;
    }

    entry.count += 1;
    if (entry.count > maxRequests) {
      const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
      res.set("Retry-After", String(retryAfter));
      res.status(429).json({ error: "too many requests", retryAfter });
      return;
    }

    next();
  };
}

export const rateLimiter = createLimiter(60_000, 60, "global");
export const authLimiter = createLimiter(15 * 60_000, 15, "auth");
export const generateLimiter = createLimiter(60_000, 5, "gen");
export const writeLimiter = createLimiter(60_000, 30, "write");
