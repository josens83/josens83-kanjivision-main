import type { Response } from "express";
import { z } from "zod";
import { ExamCategory, UserTier, WordType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const createWordSchema = z.object({
  lemma: z.string(),
  reading: z.string(),
  meaning: z.string(),
  partOfSpeech: z.string(),
  examCategory: z.nativeEnum(ExamCategory),
  type: z.nativeEnum(WordType).default("WAGO"),
  tierRequired: z.nativeEnum(UserTier).default("FREE"),
  mnemonic: z.string().optional(),
  exampleJp: z.string().optional(),
  exampleReading: z.string().optional(),
  exampleEn: z.string().optional(),
  kanji: z
    .array(
      z.object({
        char: z.string(),
        reading: z.string(),
        meaning: z.string(),
        onyomi: z.array(z.string()).default([]),
        kunyomi: z.array(z.string()).default([]),
      })
    )
    .default([]),
});

export async function stats(_req: AuthenticatedRequest, res: Response) {
  const [users, words, subs] = await Promise.all([
    prisma.user.count(),
    prisma.word.count(),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);
  const byLevel = await prisma.word.groupBy({
    by: ["examCategory"],
    _count: { _all: true },
  });
  res.json({ users, words, activeSubscriptions: subs, byLevel });
}

export async function createWord(req: AuthenticatedRequest, res: Response) {
  const body = createWordSchema.parse(req.body);
  const word = await prisma.word.create({
    data: {
      lemma: body.lemma,
      reading: body.reading,
      meaning: body.meaning,
      partOfSpeech: body.partOfSpeech,
      examCategory: body.examCategory,
      type: body.type,
      tierRequired: body.tierRequired,
      mnemonic: body.mnemonic,
      exampleJp: body.exampleJp,
      exampleReading: body.exampleReading,
      exampleEn: body.exampleEn,
      kanjiParts: {
        create: body.kanji.map((k, i) => ({
          position: i,
          char: k.char,
          reading: k.reading,
          meaning: k.meaning,
          onyomi: k.onyomi,
          kunyomi: k.kunyomi,
        })),
      },
    },
    include: { kanjiParts: true },
  });
  res.status(201).json({ word });
}

export async function deleteWord(req: AuthenticatedRequest, res: Response) {
  await prisma.word.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
