import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logger } from "../lib/logger";

const genSchema = z.object({
  wordId: z.string(),
  prompt: z.string().min(4).max(500),
});

/**
 * Generate a mnemonic image via Stability AI.
 * Phase 1: records a stub row; Phase 2 calls the Stability API + uploads to storage.
 */
export async function generate(req: AuthenticatedRequest, res: Response) {
  const { wordId, prompt } = genSchema.parse(req.body);
  const word = await prisma.word.findUnique({ where: { id: wordId } });
  if (!word) return res.status(404).json({ error: "word not found" });

  const key = process.env.STABILITY_API_KEY;
  if (!key) {
    const row = await prisma.mnemonicImage.create({
      data: {
        wordId,
        userId: req.userId,
        prompt,
        url: `https://placehold.co/512x512/ef4361/ffffff?text=${encodeURIComponent(word.lemma)}`,
        provider: "stub",
      },
    });
    return res.json({ image: row });
  }

  logger.info({ wordId }, "image generation requested");
  // Phase 2: hit Stability API, upload to storage, persist URL.
  res.status(501).json({ error: "stability provider not configured" });
}

export async function listForWord(req: AuthenticatedRequest, res: Response) {
  const rows = await prisma.mnemonicImage.findMany({
    where: { wordId: req.params.wordId },
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  res.json({ images: rows });
}
