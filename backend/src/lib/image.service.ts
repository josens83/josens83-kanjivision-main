// Stability AI image generation service.
// Generates mnemonic images for vocabulary words and uploads to
// Supabase Storage (or falls back to a placeholder URL).

import { logger } from "./logger";

const STABILITY_URL =
  "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image";

export interface ImageResult {
  url: string;
  provider: "stability" | "stub";
}

/**
 * Build a visual mnemonic prompt for a JLPT word.
 * For kanji words, includes the English meaning of each part so the
 * generated image encodes the decomposition visually.
 */
export function buildImagePrompt(
  lemma: string,
  meaning: string,
  kanjiParts: Array<{ char: string; meaning: string }>,
  mnemonic?: string | null
): string {
  const base = `A cute, colorful cartoon illustration for the Japanese word "${lemma}" meaning "${meaning}".`;

  let kanjiHint = "";
  if (kanjiParts.length > 0) {
    const parts = kanjiParts.map((k) => `${k.char} (${k.meaning})`).join(" + ");
    kanjiHint = ` The word is composed of ${parts}. Show visual elements representing each part.`;
  }

  const mnemonicHint = mnemonic
    ? ` Mnemonic hint: "${mnemonic}".`
    : "";

  return (
    base +
    kanjiHint +
    mnemonicHint +
    " Japanese kawaii style, warm pastel colors, clean vector art, white background, no text."
  );
}

/**
 * Call Stability AI to generate a 512x512 image.
 * Returns the image as a base64 data URL or uploads to storage.
 */
export async function generateStabilityImage(
  prompt: string
): Promise<ImageResult> {
  const apiKey = process.env.STABILITY_API_KEY;
  if (!apiKey) {
    return { url: placeholderUrl(prompt), provider: "stub" };
  }

  try {
    const res = await fetch(STABILITY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          { text: prompt, weight: 1 },
          {
            text: "text, watermark, logo, signature, blurry, low quality, nsfw",
            weight: -1,
          },
        ],
        cfg_scale: 7,
        width: 512,
        height: 512,
        steps: 30,
        samples: 1,
      }),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => "unknown");
      logger.error({ status: res.status, err }, "stability API error");
      return { url: placeholderUrl(prompt), provider: "stub" };
    }

    const data = (await res.json()) as {
      artifacts: Array<{ base64: string; finishReason: string }>;
    };

    if (!data.artifacts?.[0]?.base64) {
      logger.warn("stability returned no artifacts");
      return { url: placeholderUrl(prompt), provider: "stub" };
    }

    const supabaseUrl = await uploadToSupabase(data.artifacts[0].base64);
    if (supabaseUrl) {
      return { url: supabaseUrl, provider: "stability" };
    }

    return {
      url: `data:image/png;base64,${data.artifacts[0].base64}`,
      provider: "stability",
    };
  } catch (err) {
    logger.error({ err }, "stability generation failed");
    return { url: placeholderUrl(prompt), provider: "stub" };
  }
}

async function uploadToSupabase(base64: string): Promise<string | null> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return null;

  const bucket = "kanji-mnemonics";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;
  const buffer = Buffer.from(base64, "base64");

  try {
    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/${bucket}/${filename}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${serviceKey}`,
          "Content-Type": "image/png",
          "x-upsert": "true",
        },
        body: buffer,
      }
    );

    if (!uploadRes.ok) {
      logger.warn({ status: uploadRes.status }, "supabase upload failed");
      return null;
    }

    return `${supabaseUrl}/storage/v1/object/public/${bucket}/${filename}`;
  } catch (err) {
    logger.warn({ err }, "supabase upload error");
    return null;
  }
}

function placeholderUrl(prompt: string): string {
  const text = encodeURIComponent(prompt.slice(0, 40));
  return `https://placehold.co/512x512/ef4361/ffffff?text=${text}`;
}
