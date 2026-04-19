// LLM-powered JLPT word generator — admin-only endpoints.
//
// POST /api/internal/generate-words        { exam, count, category? }
// POST /api/internal/generate-words-batch  { exam, totalCount, category? }
//
// Both are gated by x-internal-key (see internal.middleware.ts).
// Claude returns a JSON array of words matching the documented shape; we
// dedupe against existing rows by (lemma, reading) and persist via
// prisma.word.create + kanjiParts nested create.

import type { Request, Response } from "express";
import { z } from "zod";
import {
  ExamCategory,
  Prisma,
  UserTier,
  WordType,
} from "@prisma/client";
import { prisma } from "../lib/prisma";
import {
  CLAUDE_MODEL,
  extractJsonArray,
  getClaudeClient,
  joinTextContent,
} from "../lib/claude";
import { logger } from "../lib/logger";
import {
  buildImagePrompt,
  generateStabilityImage,
} from "../lib/image.service";

// ---------- request schemas ----------

const generateSchema = z.object({
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
  count: z.number().int().min(1).max(25).default(10),
  category: z.string().optional(),
});

// GET form — same semantics, but all params arrive as query strings.
const generateQuerySchema = z.object({
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
  count: z.coerce.number().int().min(1).max(25).default(10),
  category: z.string().optional(),
});

const batchSchema = z.object({
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
  totalCount: z.number().int().min(1).max(200).default(20),
  category: z.string().optional(),
});

// GET batch — VocaVision-style param names: batchSize + totalTarget.
// batchSize is accepted for parity but ignored (we always chunk by 10 so a
// single batch fits comfortably in the Claude max_tokens budget).
const batchQuerySchema = z.object({
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
  batchSize: z.coerce.number().int().min(1).max(25).optional(),
  totalTarget: z.coerce.number().int().min(1).max(200).default(50),
  category: z.string().optional(),
});

// ---------- Claude output shape ----------

interface ClaudeExample {
  japanese: string;
  english: string;
}

interface ClaudeKanji {
  char: string;
  reading: string;
  meaning: string;
}

interface ClaudeWord {
  lemma: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  type?: "kanji" | "hiragana" | "katakana" | string;
  examples?: ClaudeExample[];
  collocations?: string[];
  kanjiParts?: ClaudeKanji[];
  mnemonic?: string;
  category?: string;
}

// ---------- mapping helpers ----------

const SYSTEM_PROMPT =
  "You are a Japanese language expert creating JLPT N5 vocabulary.";

function mapType(t: string | undefined): WordType {
  switch ((t ?? "").toLowerCase()) {
    case "kanji":
      return WordType.KANGO;
    case "katakana":
      return WordType.GAIRAIGO;
    case "hiragana":
    default:
      return WordType.WAGO;
  }
}

function examLabel(exam: ExamCategory): string {
  // "JLPT_N5" -> "JLPT N5"
  return exam.replace(/_/g, " ");
}

async function getExistingLemmas(
  exam: ExamCategory,
  take = 500
): Promise<string[]> {
  const rows = await prisma.word.findMany({
    where: { examCategory: exam },
    select: { lemma: true },
    take,
  });
  return rows.map((r) => r.lemma);
}

// ---------- Claude call ----------

function buildPrompt(
  count: number,
  exam: ExamCategory,
  category: string | undefined,
  existingLemmas: string[]
): string {
  const categoryLine = category
    ? `Focus on the "${category}" category.`
    : "Vary the category across the batch (greetings, food, transport, time, family, verbs, adjectives).";
  const excludeLine = existingLemmas.length
    ? `Do NOT include any of these lemmas (they already exist): ${existingLemmas.join(", ")}.`
    : "";
  return [
    `Generate ${count} ${examLabel(exam)} words as a JSON array.`,
    `Output ONLY the JSON array, no prose, no markdown, no code fences.`,
    ``,
    `Each element must be a JSON object with this exact shape:`,
    `{`,
    `  "lemma": "漢字 or ひらがな",`,
    `  "reading": "ひらがな",`,
    `  "meaning": "English definition",`,
    `  "partOfSpeech": "noun|verb|i-adjective|na-adjective|adverb",`,
    `  "type": "kanji|hiragana|katakana",`,
    `  "examples": [`,
    `    { "japanese": "example sentence", "english": "English translation" },`,
    `    { "japanese": "another sentence", "english": "English translation" }`,
    `  ],`,
    `  "collocations": ["collocation 1", "collocation 2"],`,
    `  "kanjiParts": [`,
    `    { "char": "学", "reading": "がく", "meaning": "learn" }`,
    `  ],`,
    `  "mnemonic": "English mnemonic hint that breaks the word into memorable syllables",`,
    `  "category": "greetings|food|transport|time|family|verbs|adjectives"`,
    `}`,
    ``,
    `If the word is purely hiragana or katakana with no kanji, return an empty kanjiParts array.`,
    `Provide exactly 2 examples per word. Provide at least 2 collocations.`,
    categoryLine,
    excludeLine,
  ]
    .filter(Boolean)
    .join("\n");
}

async function callClaude(
  count: number,
  exam: ExamCategory,
  category: string | undefined,
  existingLemmas: string[]
): Promise<ClaudeWord[]> {
  const client = getClaudeClient();
  const userPrompt = buildPrompt(count, exam, category, existingLemmas);

  const response = await client.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 8000,
    // Prompt caching on the static system prompt — every call reuses the same
    // prefix, so we pay the 1.25× write cost once and 0.1× read thereafter.
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  const text = joinTextContent(response.content);
  logger.info(
    {
      model: CLAUDE_MODEL,
      count,
      exam,
      cache_creation: response.usage.cache_creation_input_tokens,
      cache_read: response.usage.cache_read_input_tokens,
      input: response.usage.input_tokens,
      output: response.usage.output_tokens,
    },
    "claude word-generation complete"
  );

  return extractJsonArray<ClaudeWord>(text);
}

// ---------- persistence ----------

interface UpsertResult {
  created: number;
  skipped: number;
  errors: string[];
}

async function persistWords(
  words: ClaudeWord[],
  exam: ExamCategory
): Promise<UpsertResult> {
  let created = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const w of words) {
    try {
      if (!w.lemma || !w.reading) {
        errors.push(`missing lemma/reading: ${JSON.stringify(w).slice(0, 120)}`);
        continue;
      }

      const existing = await prisma.word.findUnique({
        where: { lemma_reading: { lemma: w.lemma, reading: w.reading } },
      });
      if (existing) {
        skipped += 1;
        continue;
      }

      // Map Claude's {japanese, english} into the schema's {jp, reading, en}.
      // Sentence-level furigana is not provided; reuse jp so the frontend
      // ruby render stays safe.
      const examples = (w.examples ?? []).slice(0, 2).map((e) => ({
        jp: e.japanese,
        reading: e.japanese,
        en: e.english,
      }));

      await prisma.word.create({
        data: {
          lemma: w.lemma,
          reading: w.reading,
          meaning: w.meaning,
          partOfSpeech: w.partOfSpeech || "noun",
          examCategory: exam,
          type: mapType(w.type),
          category: w.category ?? null,
          tierRequired: UserTier.FREE,
          mnemonic: w.mnemonic ?? null,
          examples: examples as unknown as Prisma.InputJsonValue,
          collocations: (w.collocations ?? []).slice(0, 4),
          kanjiParts: {
            create: (w.kanjiParts ?? []).map((k, i) => ({
              position: i,
              char: k.char,
              reading: k.reading,
              meaning: k.meaning,
              onyomi: [],
              kunyomi: [],
            })),
          },
        },
      });
      created += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${w.lemma ?? "?"}: ${msg}`);
    }
  }

  return { created, skipped, errors };
}

// ---------- controllers ----------

export async function generateWords(req: Request, res: Response) {
  const { exam, count, category } = generateSchema.parse(req.body);
  const existingLemmas = await getExistingLemmas(exam);
  const words = await callClaude(count, exam, category, existingLemmas);
  const result = await persistWords(words, exam);
  res.json({
    ok: true,
    exam,
    category: category ?? null,
    requested: count,
    received: words.length,
    ...result,
  });
}

interface BatchRunResult {
  batches: number;
  totalReceived: number;
  totalCreated: number;
  totalSkipped: number;
  errors: string[];
}

/** Shared batch runner used by both the POST and GET entrypoints. */
async function runBatch(
  exam: ExamCategory,
  totalCount: number,
  batchSize: number,
  category: string | undefined
): Promise<BatchRunResult> {
  const effectiveSize = Math.max(1, Math.min(batchSize, totalCount));
  const batches = Math.ceil(totalCount / effectiveSize);

  let totalCreated = 0;
  let totalSkipped = 0;
  let totalReceived = 0;
  const errors: string[] = [];

  for (let i = 0; i < batches; i++) {
    const remaining = totalCount - i * effectiveSize;
    const size = Math.min(effectiveSize, remaining);
    // Refresh the exclusion list each batch so words produced earlier in the
    // same request don't get generated again.
    const existingLemmas = await getExistingLemmas(exam);
    try {
      const words = await callClaude(size, exam, category, existingLemmas);
      totalReceived += words.length;
      const result = await persistWords(words, exam);
      totalCreated += result.created;
      totalSkipped += result.skipped;
      errors.push(...result.errors);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`batch ${i + 1}: ${msg}`);
    }
  }

  return { batches, totalReceived, totalCreated, totalSkipped, errors };
}

export async function generateWordsBatch(req: Request, res: Response) {
  const { exam, totalCount, category } = batchSchema.parse(req.body);
  const result = await runBatch(exam, totalCount, 10, category);
  res.json({
    ok: true,
    exam,
    category: category ?? null,
    totalCount,
    batchSize: 10,
    ...result,
  });
}

// ---------- GET variants (browser-friendly) ----------

export async function generateWordsGet(req: Request, res: Response) {
  const { exam, count, category } = generateQuerySchema.parse(req.query);
  const existingLemmas = await getExistingLemmas(exam);
  const words = await callClaude(count, exam, category, existingLemmas);
  const result = await persistWords(words, exam);
  res.json({
    ok: true,
    exam,
    category: category ?? null,
    requested: count,
    received: words.length,
    ...result,
  });
}

export async function generateWordsBatchGet(req: Request, res: Response) {
  const { exam, batchSize, totalTarget, category } = batchQuerySchema.parse(
    req.query
  );
  const effectiveBatchSize = batchSize ?? 10;
  const result = await runBatch(exam, totalTarget, effectiveBatchSize, category);
  res.json({
    ok: true,
    exam,
    category: category ?? null,
    totalTarget,
    batchSize: effectiveBatchSize,
    ...result,
  });
}

// ---------- Image generation ----------

const imageQuerySchema = z.object({
  exam: z.nativeEnum(ExamCategory).default(ExamCategory.JLPT_N5),
  count: z.coerce.number().int().min(1).max(25).default(10),
});

/**
 * GET /api/internal/generate-images?key=...&exam=JLPT_N5&count=10
 *
 * For each word that doesn't yet have a MnemonicImage:
 *  1. Build a visual prompt using the word's meaning + kanji decomposition
 *  2. Optionally enhance via Claude (if ANTHROPIC_API_KEY is set)
 *  3. Call Stability AI (or fall back to placeholder)
 *  4. Persist a MnemonicImage row
 */
export async function generateImagesGet(req: Request, res: Response) {
  const { exam, count } = imageQuerySchema.parse(req.query);

  const wordsWithoutImages = await prisma.word.findMany({
    where: {
      examCategory: exam,
      mnemonicImages: { none: {} },
    },
    include: { kanjiParts: { orderBy: { position: "asc" } } },
    take: count,
    orderBy: { createdAt: "asc" },
  });

  if (wordsWithoutImages.length === 0) {
    return res.json({
      ok: true,
      exam,
      message: "all words already have images",
      generated: 0,
    });
  }

  let generated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const word of wordsWithoutImages) {
    try {
      const kanjiParts = word.kanjiParts.map((k) => ({
        char: k.char,
        meaning: k.meaning,
      }));

      let prompt = buildImagePrompt(
        word.lemma,
        word.meaning,
        kanjiParts,
        word.mnemonic
      );

      // Optionally enhance prompt via Claude
      prompt = await enhancePromptWithClaude(
        word.lemma,
        word.meaning,
        kanjiParts,
        prompt
      );

      const result = await generateStabilityImage(prompt);

      await prisma.mnemonicImage.create({
        data: {
          wordId: word.id,
          prompt,
          url: result.url,
          provider: result.provider,
        },
      });

      generated += 1;
      logger.info(
        { lemma: word.lemma, provider: result.provider },
        "image generated"
      );
    } catch (err) {
      failed += 1;
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${word.lemma}: ${msg}`);
      logger.error({ err, lemma: word.lemma }, "image generation failed");
    }
  }

  res.json({
    ok: true,
    exam,
    candidates: wordsWithoutImages.length,
    generated,
    failed,
    errors: errors.length > 0 ? errors : undefined,
  });
}

/**
 * Use Claude to refine the image prompt for better visual output.
 * Falls back to the original prompt if the API key isn't set or the call fails.
 */
async function enhancePromptWithClaude(
  lemma: string,
  meaning: string,
  kanjiParts: Array<{ char: string; meaning: string }>,
  fallbackPrompt: string
): Promise<string> {
  try {
    const client = getClaudeClient();

    const kanjiDesc =
      kanjiParts.length > 0
        ? `Kanji decomposition: ${kanjiParts.map((k) => `${k.char}(${k.meaning})`).join(" + ")}.`
        : "This word is written in hiragana/katakana.";

    const response = await client.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 300,
      system: [
        {
          type: "text",
          text: "You are an expert at writing Stable Diffusion prompts for educational vocabulary illustrations. Output ONLY the prompt, no explanation.",
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [
        {
          role: "user",
          content: `Create a Stable Diffusion prompt for the Japanese word "${lemma}" meaning "${meaning}". ${kanjiDesc} The image should visually encode the meaning in a cute, memorable way that helps learners remember the word. Japanese kawaii style, warm pastel colors, clean vector art, white background, no text or letters.`,
        },
      ],
    });

    const text = joinTextContent(response.content).trim();
    if (text.length > 20) return text;
    return fallbackPrompt;
  } catch {
    return fallbackPrompt;
  }
}
