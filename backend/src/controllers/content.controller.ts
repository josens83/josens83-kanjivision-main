import type { Response } from "express";
import { z } from "zod";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";
import { logger } from "../lib/logger";

const mnemonicSchema = z.object({
  lemma: z.string(),
  reading: z.string(),
  meaning: z.string(),
});

/**
 * Generate a mnemonic for a word using Anthropic Claude.
 * Phase 1: returns a deterministic template; Phase 2 hits the Claude API.
 */
export async function generateMnemonic(req: AuthenticatedRequest, res: Response) {
  const { lemma, reading, meaning } = mnemonicSchema.parse(req.body);

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    const text = `Remember "${lemma}" (${reading}) = ${meaning}. Visualize the kanji as a tiny scene that makes the meaning obvious.`;
    return res.json({ mnemonic: text, provider: "stub" });
  }

  // Phase 2 pseudo-code:
  //  const resp = await fetch("https://api.anthropic.com/v1/messages", {...});
  //  return res.json({ mnemonic: resp.content[0].text, provider: "claude" });

  logger.info({ lemma }, "mnemonic generation requested");
  res.json({
    mnemonic: `${lemma} (${reading}) — ${meaning}. Visualize the scene.`,
    provider: "stub",
  });
}

export async function generateExample(req: AuthenticatedRequest, res: Response) {
  const { lemma, reading, meaning } = mnemonicSchema.parse(req.body);
  res.json({
    example: {
      jp: `これは${lemma}のれいぶんです。`,
      reading: `これは${reading}のれいぶんです。`,
      en: `This is an example sentence for "${meaning}".`,
    },
    provider: "stub",
  });
}
