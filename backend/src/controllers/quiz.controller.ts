import type { Request, Response } from "express";
import { z } from "zod";
import { ExamCategory } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { unlockQuizPerfect } from "./achievement.controller";

const questionsSchema = z.object({
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
  count: z.coerce.number().int().min(1).max(30).default(10),
  type: z.enum(["multiple_choice", "fill", "match", "timed"]).default("multiple_choice"),
});

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export async function getQuestions(req: Request, res: Response) {
  const { exam, count, type } = questionsSchema.parse(req.query);

  const allWords = await prisma.word.findMany({
    where: { examCategory: exam },
    select: { id: true, lemma: true, reading: true, meaning: true },
  });

  if (allWords.length < 4) {
    return res.status(400).json({ error: "not enough words for quiz (need at least 4)" });
  }

  const selected = shuffle(allWords).slice(0, Math.min(count, allWords.length));

  const questions = selected.map((word) => {
    const wrongPool = allWords.filter((w) => w.id !== word.id);
    const wrongs = shuffle(wrongPool).slice(0, 3).map((w) => w.meaning);
    const options = shuffle([word.meaning, ...wrongs]);
    const correctIndex = options.indexOf(word.meaning);

    return {
      wordId: word.id,
      word: word.lemma,
      reading: word.reading,
      options,
      correctIndex,
    };
  });

  if (type === "fill") {
    const fillQ = selected.map((w) => ({
      wordId: w.id, meaning: w.meaning, answer: w.lemma, reading: w.reading,
    }));
    return res.json({ exam, type, count: fillQ.length, questions: fillQ });
  }
  if (type === "match") {
    const pairs = selected.slice(0, 5).map((w) => ({ wordId: w.id, word: w.lemma, meaning: w.meaning }));
    const shuffledMeanings = shuffle(pairs.map((p) => p.meaning));
    return res.json({ exam, type, pairs, shuffledMeanings });
  }
  if (type === "timed") {
    const timedQ = shuffle(allWords).slice(0, 20).map((word) => {
      const wrongs = shuffle(allWords.filter((w) => w.id !== word.id)).slice(0, 3).map((w) => w.meaning);
      const opts = shuffle([word.meaning, ...wrongs]);
      return { wordId: word.id, word: word.lemma, reading: word.reading, options: opts, correctIndex: opts.indexOf(word.meaning) };
    });
    return res.json({ exam, type, count: timedQ.length, questions: timedQ, timeLimit: 60 });
  }

  res.json({ exam, type, count: questions.length, questions });
}

const answerSchema = z.object({
  wordId: z.string(),
  selectedIndex: z.number().int().min(0).max(3),
});

const submitSchema = z.object({
  answers: z.array(answerSchema).min(1),
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
});

export async function submitQuiz(req: AuthenticatedRequest, res: Response) {
  const { answers, exam } = submitSchema.parse(req.body);

  const wordIds = answers.map((a) => a.wordId);
  const words = await prisma.word.findMany({
    where: { id: { in: wordIds } },
    select: { id: true, lemma: true, meaning: true },
  });
  const wordMap = new Map(words.map((w) => [w.id, w]));

  const allWords = await prisma.word.findMany({
    where: { examCategory: exam },
    select: { id: true, meaning: true },
  });

  let score = 0;
  const results = answers.map((a) => {
    const word = wordMap.get(a.wordId);
    if (!word) return { wordId: a.wordId, correct: false, correctAnswer: "unknown" };

    const wrongPool = allWords.filter((w) => w.id !== word.id);
    const wrongs = shuffle(wrongPool).slice(0, 3).map((w) => w.meaning);
    const options = [word.meaning, ...wrongs];

    const isCorrect = a.selectedIndex >= 0 && a.selectedIndex < options.length &&
      options[a.selectedIndex] === word.meaning;

    if (isCorrect) score += 1;

    return {
      wordId: a.wordId,
      word: word.lemma,
      correct: isCorrect,
      correctAnswer: word.meaning,
    };
  });

  if (req.userId && score > 0) {
    await prisma.user.update({
      where: { id: req.userId },
      data: { dailyProgress: { increment: score } },
    }).catch(() => {});
  }

  const total = answers.length;
  const percentage = Math.round((score / total) * 100);

  let achievementUnlocked: string | null = null;
  if (req.userId && percentage === 100) {
    achievementUnlocked = await unlockQuizPerfect(req.userId);
  }

  res.json({
    score,
    total,
    percentage,
    results,
    achievementUnlocked,
  });
}
