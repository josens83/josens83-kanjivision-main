import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

const LEVEL_TARGETS: Record<string, number> = {
  JLPT_N5: 800,
  JLPT_N4: 1500,
  JLPT_N3: 3750,
  JLPT_N2: 6000,
  JLPT_N1: 10000,
};

export async function collectContentStats(): Promise<Record<string, number>> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [newWords, newImages, newMappings, activeUsers] = await Promise.all([
    prisma.word.count({ where: { createdAt: { gte: since } } }),
    prisma.wordVisual.count({ where: { createdAt: { gte: since } } }),
    prisma.productPackageWord.count({ where: { createdAt: { gte: since } } }),
    prisma.progress.groupBy({ by: ["userId"], where: { reviewedAt: { gte: since } } }).then((r) => r.length),
  ]);

  const stats = { newWords, newImages, newMappings, activeUsers, timestamp: Date.now() };
  logger.info(stats, "daily content stats");
  return stats;
}

export async function getContentGaps(): Promise<Array<{ level: string; current: number; target: number; gap: number }>> {
  const counts = await prisma.word.groupBy({ by: ["examCategory"], _count: { _all: true } });
  const byLevel = Object.fromEntries(counts.map((c) => [c.examCategory, c._count._all]));

  return Object.entries(LEVEL_TARGETS).map(([level, target]) => {
    const current = byLevel[level] ?? 0;
    return { level, current, target, gap: Math.max(0, target - current) };
  }).filter((g) => g.gap > 0);
}
