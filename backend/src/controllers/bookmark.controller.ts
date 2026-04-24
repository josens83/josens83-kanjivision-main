import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const wordInclude = {
  kanjiParts: { orderBy: { position: "asc" as const } },
  mnemonicImages: { orderBy: { createdAt: "desc" as const }, take: 1 },
};

export async function getBookmarks(req: AuthenticatedRequest, res: Response) {
  const rows = await prisma.bookmark.findMany({
    where: { userId: req.userId! },
    include: { word: { include: wordInclude } },
    orderBy: { createdAt: "desc" },
  });
  res.json({ count: rows.length, data: rows });
}

const addSchema = z.object({
  wordId: z.string(),
  notes: z.string().max(500).optional(),
});

export async function addBookmark(req: AuthenticatedRequest, res: Response) {
  const { wordId, notes } = addSchema.parse(req.body);
  const bookmark = await prisma.bookmark.upsert({
    where: { userId_wordId: { userId: req.userId!, wordId } },
    update: { notes },
    create: { userId: req.userId!, wordId, notes },
    include: { word: { include: wordInclude } },
  });
  res.status(201).json({ bookmark });
}

export async function removeBookmark(req: AuthenticatedRequest, res: Response) {
  await prisma.bookmark.deleteMany({
    where: { userId: req.userId!, wordId: req.params.wordId },
  });
  res.status(204).end();
}

export async function toggleBookmark(req: AuthenticatedRequest, res: Response) {
  const { wordId } = z.object({ wordId: z.string() }).parse(req.body);
  const existing = await prisma.bookmark.findUnique({
    where: { userId_wordId: { userId: req.userId!, wordId } },
  });
  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
    res.json({ bookmarked: false, wordId });
  } else {
    await prisma.bookmark.create({ data: { userId: req.userId!, wordId } });
    res.json({ bookmarked: true, wordId });
  }
}

export async function checkBookmark(req: AuthenticatedRequest, res: Response) {
  const row = await prisma.bookmark.findUnique({
    where: { userId_wordId: { userId: req.userId!, wordId: req.params.wordId } },
  });
  res.json({ bookmarked: !!row });
}
