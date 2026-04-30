import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export async function dashboard(_req: Request, res: Response) {
  const now = new Date();
  const d7 = new Date(now.getTime() - 7 * 86400000);
  const d30 = new Date(now.getTime() - 30 * 86400000);

  const [totalUsers, newUsers7d, newUsers30d, totalWords, activeSubscriptions, activePurchases] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: d7 } } }),
    prisma.user.count({ where: { createdAt: { gte: d30 } } }),
    prisma.word.count(),
    prisma.user.count({ where: { subscriptionStatus: "ACTIVE" } }),
    prisma.userPurchase.count({ where: { status: "ACTIVE" } }),
  ]);

  // Daily signups (last 7 days)
  const signupRows = await prisma.$queryRawUnsafe<Array<{ day: string; count: bigint }>>(
    `SELECT DATE("createdAt") as day, COUNT(*)::bigint as count FROM "User" WHERE "createdAt" >= $1 GROUP BY DATE("createdAt") ORDER BY day`,
    d7
  );
  const dailySignups = signupRows.map((r) => ({ day: String(r.day).slice(0, 10), count: Number(r.count) }));

  // Daily active learners (last 7 days)
  const activeRows = await prisma.$queryRawUnsafe<Array<{ day: string; count: bigint }>>(
    `SELECT DATE("lastReviewedAt") as day, COUNT(DISTINCT "userId")::bigint as count FROM "Progress" WHERE "lastReviewedAt" >= $1 GROUP BY DATE("lastReviewedAt") ORDER BY day`,
    d7
  );
  const dailyActive = activeRows.map((r) => ({ day: String(r.day).slice(0, 10), count: Number(r.count) }));

  // Word distribution by exam
  const byExam = await prisma.word.groupBy({ by: ["examCategory"], _count: { _all: true } });
  const examDist = byExam.map((e) => ({ level: e.examCategory, count: e._count._all }));

  // Tier distribution
  const byTier = await prisma.user.groupBy({ by: ["tier"], _count: { _all: true } });
  const tierDist = byTier.map((t) => ({ tier: t.tier, count: t._count._all }));

  res.json({
    totalUsers, newUsers7d, newUsers30d, totalWords,
    activeSubscriptions, activePurchases,
    dailySignups, dailyActive, examDist, tierDist,
  });
}
