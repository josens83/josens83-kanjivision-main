import type { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { computeStreak } from "../utils/streak";

export async function listAchievements(req: Request, res: Response) {
  const userId = (req as AuthenticatedRequest).userId;
  const achievements = await prisma.achievement.findMany({ orderBy: { createdAt: "asc" } });

  if (!userId) {
    return res.json({
      achievements: achievements.map((a) => ({ ...a, unlocked: false, unlockedAt: null })),
    });
  }

  const unlocked = await prisma.userAchievement.findMany({
    where: { userId },
    select: { achievementId: true, unlockedAt: true },
  });
  const unlockedMap = new Map(unlocked.map((u) => [u.achievementId, u.unlockedAt]));

  res.json({
    achievements: achievements.map((a) => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id) ?? null,
    })),
  });
}

export async function checkAchievements(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!;

  const [allAchievements, existing, wordsLearned, bookmarkCount, progressRows] =
    await Promise.all([
      prisma.achievement.findMany(),
      prisma.userAchievement.findMany({ where: { userId }, select: { achievementId: true } }),
      prisma.progress.count({ where: { userId } }),
      prisma.bookmark.count({ where: { userId } }),
      prisma.progress.findMany({
        where: { userId },
        select: { interval: true, lastReviewedAt: true },
      }),
    ]);

  const existingIds = new Set(existing.map((e) => e.achievementId));
  const mastered = progressRows.filter((p) => p.interval >= 21).length;
  const reviewed = progressRows.map((p) => p.lastReviewedAt).filter((d): d is Date => !!d);
  const streak = computeStreak(reviewed);

  const newlyUnlocked: Array<{ id: string; key: string; name: string; icon: string }> = [];

  for (const ach of allAchievements) {
    if (existingIds.has(ach.id)) continue;

    let met = false;
    switch (ach.condition) {
      case "words_learned":
        met = wordsLearned >= ach.threshold;
        break;
      case "streak":
        met = streak.streakDays >= ach.threshold;
        break;
      case "bookmarks":
        met = bookmarkCount >= ach.threshold;
        break;
      case "mastered":
        met = mastered >= ach.threshold;
        break;
      case "quiz_perfect":
        met = false;
        break;
    }

    if (met) {
      await prisma.userAchievement.create({
        data: { userId, achievementId: ach.id },
      });
      newlyUnlocked.push({ id: ach.id, key: ach.key, name: ach.name, icon: ach.icon });
    }
  }

  res.json({ newlyUnlocked, total: allAchievements.length, unlocked: existingIds.size + newlyUnlocked.length });
}

export async function unlockQuizPerfect(userId: string): Promise<string | null> {
  const ach = await prisma.achievement.findUnique({ where: { key: "perfect_score" } });
  if (!ach) return null;
  const exists = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId: ach.id } },
  });
  if (exists) return null;
  await prisma.userAchievement.create({ data: { userId, achievementId: ach.id } });
  return ach.name;
}
