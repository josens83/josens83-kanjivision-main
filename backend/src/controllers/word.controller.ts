import type { Request, Response } from "express";
import { ExamCategory, Prisma, UserTier } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getWordCount, setWordCount } from "../lib/cache";

const listSchema = z.object({
  exam: z.nativeEnum(ExamCategory).optional(),
  level: z.nativeEnum(UserTier).optional(),
  category: z.string().optional(),
  search: z.string().trim().min(1).optional(),
  take: z.coerce.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
});

const wordInclude = {
  kanjiParts: { orderBy: { position: "asc" as const } },
  mnemonicImages: { orderBy: { createdAt: "desc" as const }, take: 1 },
};

export async function list(req: Request, res: Response) {
  const q = listSchema.parse(req.query);
  const where: Prisma.WordWhereInput = {};
  if (q.exam) where.examCategory = q.exam;
  if (q.level) where.tierRequired = q.level;
  if (q.category) where.category = q.category;
  if (q.search) {
    where.OR = [
      { lemma: { contains: q.search } },
      { reading: { contains: q.search } },
      { meaning: { contains: q.search, mode: "insensitive" } },
    ];
  }

  const words = await prisma.word.findMany({
    where,
    take: q.take,
    ...(q.cursor ? { skip: 1, cursor: { id: q.cursor } } : {}),
    orderBy: { createdAt: "asc" },
    include: wordInclude,
  });
  const nextCursor = words.length === q.take ? words[words.length - 1].id : null;
  const total = await prisma.word.count({ where });
  res.json({ count: words.length, total, nextCursor, data: words });
}

export async function getOne(req: Request, res: Response) {
  const word = await prisma.word.findUnique({
    where: { id: req.params.id },
    include: { ...wordInclude, mnemonicImages: { orderBy: { createdAt: "desc" }, take: 5 } },
  });
  if (!word) return res.status(404).json({ error: "not found" });
  res.json({ word });
}

/**
 * Word of the day — deterministic for the current UTC day.
 * Optional ?exam=JLPT_N5 filter.
 */
export async function daily(req: Request, res: Response) {
  const exam = z.nativeEnum(ExamCategory).optional().parse(req.query.exam);
  const where: Prisma.WordWhereInput = exam ? { examCategory: exam } : {};
  const total = await prisma.word.count({ where });
  if (total === 0) return res.status(404).json({ error: "no words available" });

  const dayKey = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
  // Simple hash → index
  let hash = 0;
  for (const ch of dayKey) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  const skip = hash % total;

  const word = await prisma.word.findFirst({
    where,
    skip,
    orderBy: { createdAt: "asc" },
    include: wordInclude,
  });
  res.json({ date: dayKey, word });
}

export async function count(_req: Request, res: Response) {
  const cached = getWordCount<{ total: number; byExam: Record<string, number> }>();
  if (cached) return res.json(cached);

  const rows = await prisma.word.groupBy({
    by: ["examCategory"],
    _count: { _all: true },
  });
  const byExam = Object.fromEntries(rows.map((r) => [r.examCategory, r._count._all]));
  const total = rows.reduce((acc, r) => acc + r._count._all, 0);
  const result = { total, byExam };
  setWordCount(result, 3600);
  res.json(result);
}

const searchSchema = z.object({
  q: z.string().trim().min(1),
  take: z.coerce.number().int().min(1).max(50).default(20),
});

export async function search(req: Request, res: Response) {
  const { q, take } = searchSchema.parse(req.query);
  const rows = await prisma.word.findMany({
    where: {
      OR: [
        { lemma: { contains: q } },
        { reading: { contains: q } },
        { meaning: { contains: q, mode: "insensitive" } },
        { kanjiParts: { some: { char: { contains: q } } } },
      ],
    },
    take,
    include: wordInclude,
  });
  res.json({ count: rows.length, data: rows });
}

export async function byExam(req: Request, res: Response) {
  const exam = z.nativeEnum(ExamCategory).parse(req.params.exam);
  const rows = await prisma.word.findMany({
    where: { examCategory: exam },
    orderBy: { createdAt: "asc" },
    include: wordInclude,
  });
  res.json({ exam, count: rows.length, data: rows });
}

export async function related(req: Request, res: Response) {
  const word = await prisma.word.findUnique({
    where: { id: req.params.id },
    include: { kanjiParts: { select: { char: true } } },
  });
  if (!word) return res.status(404).json({ error: "not found" });

  const chars = word.kanjiParts.map((k) => k.char);
  if (chars.length === 0) return res.json({ data: [] });

  const rows = await prisma.word.findMany({
    where: {
      id: { not: word.id },
      kanjiParts: { some: { char: { in: chars } } },
    },
    take: 10,
    include: { kanjiParts: { orderBy: { position: "asc" } } },
  });
  res.json({ data: rows });
}
