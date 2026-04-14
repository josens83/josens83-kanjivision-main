import type { Request, Response } from "express";
import { z } from "zod";
import { ExamCategory, Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

const listSchema = z.object({
  level: z.nativeEnum(ExamCategory).optional(),
  cursor: z.string().optional(),
  take: z.coerce.number().int().min(1).max(100).default(50),
});

export async function list(req: Request, res: Response) {
  const { level, cursor, take } = listSchema.parse(req.query);
  const where: Prisma.WordWhereInput = level ? { examCategory: level } : {};
  const words = await prisma.word.findMany({
    where,
    take,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: "asc" },
    include: { kanjiParts: { orderBy: { position: "asc" } } },
  });
  const nextCursor = words.length === take ? words[words.length - 1].id : null;
  res.json({ count: words.length, nextCursor, data: words });
}

export async function getOne(req: Request, res: Response) {
  const word = await prisma.word.findUnique({
    where: { id: req.params.id },
    include: { kanjiParts: { orderBy: { position: "asc" } } },
  });
  if (!word) return res.status(404).json({ error: "not found" });
  res.json({ word });
}

export async function byLevel(req: Request, res: Response) {
  const level = req.params.level as ExamCategory;
  const words = await prisma.word.findMany({
    where: { examCategory: level },
    include: { kanjiParts: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "asc" },
  });
  res.json({ level, count: words.length, data: words });
}
