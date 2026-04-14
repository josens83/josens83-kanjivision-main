import type { Response } from "express";
import { z } from "zod";
import { ExamCategory } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const startSchema = z.object({ examCategory: z.nativeEnum(ExamCategory) });
const endSchema = z.object({
  sessionId: z.string(),
  cardsSeen: z.number().int().min(0),
  cardsCorrect: z.number().int().min(0),
});

export async function start(req: AuthenticatedRequest, res: Response) {
  const { examCategory } = startSchema.parse(req.body);
  const session = await prisma.studySession.create({
    data: { userId: req.userId!, examCategory },
  });
  res.status(201).json({ session });
}

export async function end(req: AuthenticatedRequest, res: Response) {
  const { sessionId, cardsSeen, cardsCorrect } = endSchema.parse(req.body);
  const session = await prisma.studySession.update({
    where: { id: sessionId },
    data: { endedAt: new Date(), cardsSeen, cardsCorrect },
  });
  res.json({ session });
}

export async function listSessions(req: AuthenticatedRequest, res: Response) {
  const sessions = await prisma.studySession.findMany({
    where: { userId: req.userId! },
    orderBy: { startedAt: "desc" },
    take: 30,
  });
  res.json({ sessions });
}
