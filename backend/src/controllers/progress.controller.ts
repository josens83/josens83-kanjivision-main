import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { review } from "../lib/srs";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const gradeSchema = z.object({
  wordId: z.string(),
  quality: z.number().int().min(0).max(5),
});

export async function grade(req: AuthenticatedRequest, res: Response) {
  const { wordId, quality } = gradeSchema.parse(req.body);
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

export async function due(req: AuthenticatedRequest, res: Response) {
  const now = new Date();
  const rows = await prisma.progress.findMany({
    where: { userId: req.userId!, dueAt: { lte: now } },
    include: { word: { include: { kanjiParts: true } } },
    orderBy: { dueAt: "asc" },
    take: 50,
  });
  res.json({ count: rows.length, data: rows });
}

export async function stats(req: AuthenticatedRequest, res: Response) {
  const [total, mastered, due] = await Promise.all([
    prisma.progress.count({ where: { userId: req.userId! } }),
    prisma.progress.count({ where: { userId: req.userId!, repetition: { gte: 4 } } }),
    prisma.progress.count({ where: { userId: req.userId!, dueAt: { lte: new Date() } } }),
  ]);
  res.json({ total, mastered, due });
}
