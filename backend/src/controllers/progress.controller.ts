import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { review } from "../utils/srs";
import { computeStreak } from "../utils/streak";

const gradeSchema = z.object({
  quality: z.number().int().min(0).max(5),
});

export async function list(req: AuthenticatedRequest, res: Response) {
  const rows = await prisma.progress.findMany({
    where: { userId: req.userId! },
    include: { word: { include: { kanjiParts: true } } },
    orderBy: { dueAt: "asc" },
    take: 500,
  });
  res.json({ count: rows.length, data: rows });
}

export async function getOne(req: AuthenticatedRequest, res: Response) {
  const row = await prisma.progress.findUnique({
    where: { userId_wordId: { userId: req.userId!, wordId: req.params.wordId } },
    include: { word: { include: { kanjiParts: true } } },
  });
  if (!row) return res.status(404).json({ error: "no progress for this word" });
  res.json({ progress: row });
}

/** SM-2 grading for a specific word. Creates the progress row on first review. */
export async function grade(req: AuthenticatedRequest, res: Response) {
  const { quality } = gradeSchema.parse(req.body);
  const { wordId } = req.params;

  const existing = await prisma.progress.findUnique({
    where: { userId_wordId: { userId: req.userId!, wordId } },
  });
  const base = existing ?? { repetition: 0, interval: 0, easiness: 2.5 };
  const next = review(base, quality);

  const saved = await prisma.progress.upsert({
    where: { userId_wordId: { userId: req.userId!, wordId } },
    update: { ...next },
    create: { userId: req.userId!, wordId, ...next },
  });
  res.json({ progress: saved });
}

export async function remove(req: AuthenticatedRequest, res: Response) {
  await prisma.progress.deleteMany({
    where: { userId: req.userId!, wordId: req.params.wordId },
  });
  res.status(204).end();
}

export async function stats(req: AuthenticatedRequest, res: Response) {
  const now = new Date();
  const rows = await prisma.progress.findMany({
    where: { userId: req.userId! },
    select: { repetition: true, dueAt: true, lastReviewedAt: true },
  });
  const total = rows.length;
  const dueCount = rows.filter((r) => r.dueAt.getTime() <= now.getTime()).length;
  const mastered = rows.filter((r) => r.repetition >= 4).length;
  const reviewed = rows
    .map((r) => r.lastReviewedAt)
    .filter((d): d is Date => !!d);
  const streak = computeStreak(reviewed, now);

  res.json({
    total,
    dueCount,
    mastered,
    streakDays: streak.streakDays,
    longestStreakDays: streak.longestStreakDays,
    lastStudyDate: streak.lastStudyDate,
  });
}
