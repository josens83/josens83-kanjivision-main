import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function health(_req: Request, res: Response) {
  let db = "unknown";
  try {
    await prisma.$queryRaw`SELECT 1`;
    db = "ok";
  } catch {
    db = "down";
  }
  res.json({
    service: "kanjivision-backend",
    status: "ok",
    db,
    time: new Date().toISOString(),
    version: process.env.npm_package_version ?? "0.1.0",
  });
}
