import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";

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
