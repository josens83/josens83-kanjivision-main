import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../lib/logger";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = "AppError";
  }
}

interface PrismaError {
  code?: string;
  meta?: { target?: string[] };
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: "not found" });
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  if (err instanceof ZodError) {
    res.status(400).json({ error: "validation error", issues: err.issues });
    return;
  }

  const prismaErr = err as PrismaError;
  if (prismaErr.code === "P2002") {
    const fields = prismaErr.meta?.target?.join(", ") ?? "unknown";
    res.status(409).json({ error: `duplicate: ${fields}` });
    return;
  }
  if (prismaErr.code === "P2025") {
    res.status(404).json({ error: "record not found" });
    return;
  }

  if (err instanceof Error) {
    if (err.name === "JsonWebTokenError") {
      res.status(401).json({ error: "invalid token" });
      return;
    }
    if (err.name === "TokenExpiredError") {
      res.status(401).json({ error: "token expired" });
      return;
    }
  }

  logger.error({ err }, "unhandled error");
  const message = err instanceof Error ? err.message : "internal error";
  res.status(500).json({ error: message });
}
