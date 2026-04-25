import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { getClaudeClient, CLAUDE_MODEL, joinTextContent } from "../lib/claude";
import { logger } from "../lib/logger";

const chatSchema = z.object({
  message: z.string().min(1).max(2000),
  wordId: z.string().optional(),
  history: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() })).max(10).default([]),
});

export async function chat(req: Request, res: Response) {
  const { message, wordId, history } = chatSchema.parse(req.body);

  let wordContext = "";
  if (wordId) {
    const word = await prisma.word.findUnique({
      where: { id: wordId },
      include: { kanjiParts: true },
    });
    if (word) {
      const parts = word.kanjiParts.map((k) => `${k.char}(${k.meaning})`).join(" + ");
      wordContext = `\nContext word: ${word.lemma} (${word.reading}) = "${word.meaning}". ${parts ? `Kanji: ${parts}.` : ""} ${word.mnemonic ?? ""}`;
    }
  }

  try {
    const client = getClaudeClient();
    const messages = [
      ...history.map((h) => ({ role: h.role as "user" | "assistant", content: h.content })),
      { role: "user" as const, content: message },
    ];

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1000,
      system: [{ type: "text" as const, text: `You are a Japanese language learning assistant for KanjiVision AI. Help users understand JLPT vocabulary, kanji decomposition, grammar, pronunciation, and mnemonics. Be concise and educational. Reply in the user's language.${wordContext}`, cache_control: { type: "ephemeral" as const } }],
      messages,
    });

    const content = joinTextContent(response.content);
    res.json({ content, suggestions: ["Explain the kanji", "Give me an example sentence", "How do I remember this?"] });
  } catch (err) {
    logger.error({ err }, "chat failed");
    res.status(503).json({ error: "AI chat unavailable", content: "Sorry, the AI assistant is temporarily unavailable. Please try again later." });
  }
}
