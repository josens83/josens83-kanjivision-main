import type { Response } from "express";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function nextWords(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!;
  const now = new Date();

  // 1) SRS due words
  const dueWords = await prisma.progress.findMany({
    where: { userId, dueAt: { lte: now } },
    include: { word: { include: { kanjiParts: { orderBy: { position: "asc" } } } } },
    orderBy: { dueAt: "asc" },
    take: 5,
  });

  // 2) Category-based: find user's most-studied category, suggest more from it
  const recentProgress = await prisma.progress.findMany({
    where: { userId },
    include: { word: { select: { category: true } } },
    orderBy: { lastReviewedAt: "desc" },
    take: 20,
  });
  const cats = recentProgress.map((p) => p.word.category).filter(Boolean) as string[];
  const catCount: Record<string, number> = {};
  for (const c of cats) catCount[c] = (catCount[c] ?? 0) + 1;
  const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]?.[0];

  let categoryWords: typeof dueWords = [];
  if (topCat) {
    const studied = await prisma.progress.findMany({ where: { userId }, select: { wordId: true } });
    const studiedIds = new Set(studied.map((s) => s.wordId));
    const fresh = await prisma.word.findMany({
      where: { category: topCat, id: { notIn: [...studiedIds] } },
      include: { kanjiParts: { orderBy: { position: "asc" } } },
      take: 5,
    });
    categoryWords = fresh.map((w) => ({ word: w } as any));
  }

  // 3) Kanji-based: words sharing kanji with recently studied words
  const recentKanji = await prisma.kanjiPart.findMany({
    where: { word: { progress: { some: { userId } } } },
    select: { char: true },
    distinct: ["char"],
    take: 10,
  });
  const chars = recentKanji.map((k) => k.char);
  let kanjiWords: typeof dueWords = [];
  if (chars.length > 0) {
    const studied = await prisma.progress.findMany({ where: { userId }, select: { wordId: true } });
    const studiedIds = new Set(studied.map((s) => s.wordId));
    const shared = await prisma.word.findMany({
      where: {
        kanjiParts: { some: { char: { in: chars } } },
        id: { notIn: [...studiedIds] },
      },
      include: { kanjiParts: { orderBy: { position: "asc" } } },
      take: 5,
    });
    kanjiWords = shared.map((w) => ({ word: w } as any));
  }

  res.json({
    due: dueWords.map((d) => d.word),
    byCategory: categoryWords.map((d: any) => d.word),
    byKanji: kanjiWords.map((d: any) => d.word),
    topCategory: topCat ?? null,
  });
}
