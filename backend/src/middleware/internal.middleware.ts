import type { NextFunction, Request, Response } from "express";

/**
 * Guards `/api/internal/*` endpoints. Callers must supply
 * `x-internal-key: <process.env.INTERNAL_API_KEY>`.
 *
 * If INTERNAL_API_KEY is not configured, the endpoint is hard-disabled
 * (503) to prevent it accidentally being open on a misconfigured deploy.
 */
export function requireInternalKey(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const expected = process.env.INTERNAL_API_KEY;
  if (!expected) {
    res.status(503).json({ error: "internal API not configured" });
    return;
  }
  const got = req.header("x-internal-key");
  if (got !== expected) {
    res.status(401).json({ error: "invalid internal key" });
    return;
  }
  next();
}
