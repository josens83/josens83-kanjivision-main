import type { Response } from "express";
import { z } from "zod";
import { ExamCategory, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { review } from "../utils/srs";
import { computeStreak } from "../utils/streak";

const queueSchema = z.object({
  exam: z.nativeEnum(ExamCategory).optional(),
  size: z.coerce.number().int().min(1).max(100).default(20),
});

const startSchema = z.object({
  exam: z.nativeEnum(ExamCategory),
  size: z.coerce.number().int().min(1).max(100).default(20),
});

const gradeSchema = z.object({
  wordId: z.string(),
  quality: z.number().int().min(0).max(5),
});

const wordInclude = {
  kanjiParts: { orderBy: { position: "asc" as const } },
  mnemonicImages: { orderBy: { createdAt: "desc" as const }, take: 1 },
};

/**
 * Build a learning queue: due reviews first, then fresh words the user
 * has never studied before (up to `size`).
 */
export async function queue(req: AuthenticatedRequest, res: Response) {
  const { exam, size } = queueSchema.parse(req.query);
  const userId = req.userId!;
  const now = new Date();

  const examWhere: Prisma.WordWhereInput = exam ? { examCategory: exam } : {};

  // 1) Due reviews
  const due = await prisma.progress.findMany({
    where: {
      userId,
      dueAt: { lte: now },
      word: examWhere,
    },
    include: { word: { include: wordInclude } },
    orderBy: { dueAt: "asc" },
    take: size,
  });

  const dueCards = due.map((p) => ({ kind: "review" as const, progress: p, word: p.word }));
  const remaining = size - dueCards.length;

  let freshCards: Array<{ kind: "fresh"; word: typeof due[number]["word"] }> = [];
  if (remaining > 0) {
    const seenIds = await prisma.progress.findMany({
      where: { userId },
      select: { wordId: true },
    });
    const excludeIds = seenIds.map((s) => s.wordId);

    const fresh = await prisma.word.findMany({
      where: { ...examWhere, id: { notIn: excludeIds } },
      take: remaining,
      orderBy: { createdAt: "asc" },
      include: wordInclude,
    });
    freshCards = fresh.map((w) => ({ kind: "fresh" as const, word: w }));
  }

  res.json({
    count: dueCards.length + freshCards.length,
    dueCount: dueCards.length,
    freshCount: freshCards.length,
    cards: [...dueCards, ...freshCards],
  });
}

/** POST /learning/sessions — start a new study session. */
export async function startSession(req: AuthenticatedRequest, res: Response) {
  const { exam } = startSchema.parse(req.body);
  const session = await prisma.studySession.create({
    data: { userId: req.userId!, examCategory: exam },
  });
  res.status(201).json({ session });
}

/** GET /learning/sessions/:id */
export async function getSession(req: AuthenticatedRequest, res: Response) {
  const session = await prisma.studySession.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!session) return res.status(404).json({ error: "session not found" });
  res.json({ session });
}

/** POST /learning/sessions/:id/progress — record one card result within a session. */
export async function recordSessionProgress(req: AuthenticatedRequest, res: Response) {
  const { wordId, quality } = gradeSchema.parse(req.body);
  const userId = req.userId!;
  const sessionId = req.params.id;

  const session = await prisma.studySession.findFirst({
    where: { id: sessionId, userId },
  });
  if (!session) return res.status(404).json({ error: "session not found" });
  if (session.endedAt) return res.status(409).json({ error: "session already completed" });

  const existing = await prisma.progress.findUnique({
    where: { userId_wordId: { userId, wordId } },
  });
  const base = existing ?? { repetition: 0, interval: 0, easiness: 2.5 };
  const next = review(base, quality);

  const [progress, updatedSession] = await prisma.$transaction([
    prisma.progress.upsert({
      where: { userId_wordId: { userId, wordId } },
      update: { ...next },
      create: { userId, wordId, ...next },
    }),
    prisma.studySession.update({
      where: { id: sessionId },
      data: {
        cardsSeen: { increment: 1 },
        cardsCorrect: { increment: quality >= 3 ? 1 : 0 },
      },
    }),
  ]);

  res.json({ progress, session: updatedSession });
}

/** POST /learning/sessions/:id/complete */
export async function completeSession(req: AuthenticatedRequest, res: Response) {
  const updated = await prisma.studySession.updateMany({
    where: { id: req.params.id, userId: req.userId!, endedAt: null },
    data: { endedAt: new Date() },
  });
  if (updated.count === 0) {
    return res.status(404).json({ error: "session not found or already completed" });
  }
  const session = await prisma.studySession.findUnique({ where: { id: req.params.id } });
  res.json({ session });
}

/** GET /learning/stats — summary card for dashboard. */
export async function learningStats(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!;
  const now = new Date();

  const [progressRows, sessions] = await Promise.all([
    prisma.progress.findMany({
      where: { userId },
      select: { repetition: true, dueAt: true, lastReviewedAt: true },
    }),
    prisma.studySession.findMany({
      where: { userId, endedAt: { not: null } },
      select: { cardsSeen: true, cardsCorrect: true, startedAt: true, endedAt: true },
      orderBy: { startedAt: "desc" },
      take: 30,
    }),
  ]);

  const total = progressRows.length;
  const dueCount = progressRows.filter((r) => r.dueAt.getTime() <= now.getTime()).length;
  const mastered = progressRows.filter((r) => r.repetition >= 4).length;
  const reviewed = progressRows.map((r) => r.lastReviewedAt).filter((d): d is Date => !!d);
  const streak = computeStreak(reviewed, now);

  const seen = sessions.reduce((acc, s) => acc + s.cardsSeen, 0);
  const correct = sessions.reduce((acc, s) => acc + s.cardsCorrect, 0);
  const accuracy = seen > 0 ? Number((correct / seen).toFixed(3)) : null;

  res.json({
    total,
    dueCount,
    mastered,
    streakDays: streak.streakDays,
    longestStreakDays: streak.longestStreakDays,
    lastStudyDate: streak.lastStudyDate,
    sessionsLast30: sessions.length,
    cardsSeenLast30: seen,
    accuracyLast30: accuracy,
  });
}
