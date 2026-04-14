import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: "validation error", issues: err.issues });
    return;
  }
  logger.error({ err }, "unhandled error");
  const message = err instanceof Error ? err.message : "internal error";
  res.status(500).json({ error: message });
}
