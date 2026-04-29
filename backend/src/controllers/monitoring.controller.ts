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

export async function dbStats(_req: Request, res: Response) {
  const [users, words, packages, activePurchases, expiredPurchases, subscriptions, wordMappings] = await Promise.all([
    prisma.user.count(),
    prisma.word.count(),
    prisma.productPackage.count(),
    prisma.userPurchase.count({ where: { status: "ACTIVE" } }),
    prisma.userPurchase.count({ where: { status: { not: "ACTIVE" } } }),
    prisma.user.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.productPackageWord.count(),
  ]);
  const byTier = await prisma.user.groupBy({ by: ["tier"], _count: { _all: true } });
  const byExam = await prisma.word.groupBy({ by: ["examCategory"], _count: { _all: true } });
  res.json({ users, words, packages, activePurchases, expiredPurchases, subscriptions, wordMappings, byTier, byExam });
}

export async function cacheStats(_req: Request, res: Response) {
  res.json({ message: "cache stats", keys: 0 });
}

export async function clearCache(_req: Request, res: Response) {
  cache.invalidateAll();
  res.json({ cleared: true });
}
