// Anthropic Claude API client wrapper.
// Used by the /internal/generate-words endpoints to synthesize JLPT
// vocabulary rows via LLM.

import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

export function getClaudeClient(): Anthropic {
  if (_client) return _client;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  _client = new Anthropic({ apiKey });
  return _client;
}

/**
 * Model for word generation.
 *
 * The spec referenced `claude-sonnet-4-20250514`, which is a date-suffixed
 * form that the current API rejects (see Anthropic model docs: use exact
 * model IDs from the catalog, no date suffixes). `claude-sonnet-4-6` is the
 * current Sonnet alias. Overridable via env so you can bump to Opus for
 * higher-quality output without a code change.
 */
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL ?? "claude-sonnet-4-6";

/**
 * Best-effort JSON array extraction from a Claude text response.
 *   1. direct parse
 *   2. ```json ...``` code fence
 *   3. first balanced `[ ... ]` substring
 */
export function extractJsonArray<T = unknown>(text: string): T[] {
  const tryParse = (s: string): T[] | null => {
    try {
      const v = JSON.parse(s);
      return Array.isArray(v) ? (v as T[]) : null;
    } catch {
      return null;
    }
  };

  const direct = tryParse(text.trim());
  if (direct) return direct;

  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) {
    const parsed = tryParse(fence[1].trim());
    if (parsed) return parsed;
  }

  const first = text.indexOf("[");
  const last = text.lastIndexOf("]");
  if (first >= 0 && last > first) {
    const parsed = tryParse(text.slice(first, last + 1));
    if (parsed) return parsed;
  }

  throw new Error("Could not extract JSON array from Claude response");
}

/** Concatenate all text blocks from a Messages API response. */
export function joinTextContent(
  content: ReadonlyArray<{ type: string }>
): string {
  return content
    .map((b) => {
      if (b.type !== "text") return "";
      const text = (b as { text?: unknown }).text;
      return typeof text === "string" ? text : "";
    })
    .join("");
}
