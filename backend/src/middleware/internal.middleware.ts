import type { NextFunction, Request, Response } from "express";

/**
 * Guards `/api/internal/*` endpoints. Callers must supply the shared secret
 * via either:
 *   - `x-internal-key` header (preferred, used by POST server-to-server calls)
 *   - `?key=...` query param (convenience for GET URLs pasted in a browser)
 *
 * If INTERNAL_API_KEY is not configured, the endpoint is hard-disabled
 * (503) to prevent it accidentally being open on a misconfigured deploy.
 *
 * Note: query-param keys leak into access logs, browser history, and
 * Referer headers. Prefer the header form for anything that hits a proxy
 * or shared log sink, and rotate INTERNAL_API_KEY after bootstrap.
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
  const fromHeader = req.header("x-internal-key");
  const rawQuery = req.query.key;
  const fromQuery = typeof rawQuery === "string" ? rawQuery : undefined;
  const got = fromHeader ?? fromQuery;
  if (got !== expected) {
    res.status(401).json({ error: "invalid internal key" });
    return;
  }
  next();
}
