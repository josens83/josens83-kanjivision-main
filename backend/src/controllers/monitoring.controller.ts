import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import * as cache from "../lib/cache";

export async function health(_req: Request, res: Response) {
  const mem = process.memoryUsage();
  let dbOk = false;
  try { await prisma.$queryRawUnsafe("SELECT 1"); dbOk = true; } catch { /* */ }
  res.json({
    status: "ok",
    uptime: Math.round(process.uptime()),
    memory: { rss: Math.round(mem.rss / 1048576), heapUsed: Math.round(mem.heapUsed / 1048576), heapTotal: Math.round(mem.heapTotal / 1048576) },
    db: dbOk ? "connected" : "down",
    node: process.version,
    pid: process.pid,
  });
}

export async function cacheStats(_req: Request, res: Response) {
  res.json({ message: "cache stats", keys: 0 });
}

export async function clearCache(_req: Request, res: Response) {
  cache.invalidateAll();
  res.json({ cleared: true });
}
