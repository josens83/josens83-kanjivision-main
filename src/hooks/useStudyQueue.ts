"use client";

import { useCallback, useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { WORDS, type ExamCategory, type Word } from "@/data/words";
import { useAppStore } from "@/lib/store";

interface ServerKanji {
  char: string;
  reading: string;
  meaning: string;
  onyomi: string[] | null;
  kunyomi: string[] | null;
}

interface ServerExample {
  jp: string;
  reading: string;
  en: string;
}

interface ServerMnemonicImage {
  url: string;
  provider: string;
}

interface ServerWord {
  id: string;
  lemma: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  examCategory: ExamCategory;
  type: string;
  category: string | null;
  tierRequired: string;
  mnemonic: string | null;
  examples: ServerExample[] | null;
  collocations: string[] | null;
  kanjiParts: ServerKanji[];
  mnemonicImages?: ServerMnemonicImage[] | null;
}

interface QueueResponse {
  count: number;
  dueCount: number;
  freshCount: number;
  cards: Array<
    | { kind: "review"; word: ServerWord }
    | { kind: "fresh"; word: ServerWord }
  >;
}

/** Normalise a server word into the frontend Word shape. */
export function toFrontendWord(s: ServerWord): Word {
  const type = ((): Word["type"] => {
    switch (s.type) {
      case "KANGO":
        return "漢語";
      case "GAIRAIGO":
        return "外来語";
      default:
        return "和語";
    }
  })();
  const tier = ((): Word["tier"] => {
    const v = (s.tierRequired ?? "FREE").toLowerCase();
    if (v === "basic" || v === "premium") return v;
    return "free";
  })();
  const category = (s.category ?? "greeting") as Word["category"];
  return {
    id: s.id,
    lemma: s.lemma,
    reading: s.reading,
    meaning: s.meaning,
    partOfSpeech: s.partOfSpeech,
    examCategory: s.examCategory,
    type,
    category,
    kanji: (s.kanjiParts ?? []).map((k) => ({
      char: k.char,
      reading: k.reading,
      meaning: k.meaning,
      onyomi: k.onyomi ?? [],
      kunyomi: k.kunyomi ?? [],
    })),
    mnemonic: s.mnemonic ?? "",
    examples: s.examples ?? [],
    collocations: s.collocations ?? [],
    tier,
    imageUrl: s.mnemonicImages?.[0]?.url ?? null,
  };
}

export interface UseStudyQueueState {
  words: Word[];
  loading: boolean;
  error: string | null;
  source: "api" | "seed";
  reload: () => Promise<void>;
}

/**
 * Load a learning queue from the backend. Falls back to local seed words
 * if the user isn't signed in or the API is unreachable.
 */
export function useStudyQueue(
  exam: ExamCategory | undefined,
  limit: number = 4
): UseStudyQueueState {
  const user = useAppStore((s) => s.user);
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<"api" | "seed">("seed");

  const seedFallback = useCallback(() => {
    const seed = WORDS.filter((w) => (exam ? w.examCategory === exam : true)).slice(0, limit);
    setWords(seed);
    setSource("seed");
  }, [exam, limit]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (!user) {
      seedFallback();
      setLoading(false);
      return;
    }
    const qs = new URLSearchParams();
    if (exam) qs.set("exam", exam);
    qs.set("size", String(limit));
    const res = await apiGet<QueueResponse>(`/api/learning/queue?${qs.toString()}`);
    if (res.ok && res.data && res.data.cards.length > 0) {
      setWords(res.data.cards.map((c) => toFrontendWord(c.word)));
      setSource("api");
    } else {
      if (!res.ok) setError(res.error);
      seedFallback();
    }
    setLoading(false);
  }, [exam, limit, seedFallback, user]);

  useEffect(() => {
    load();
  }, [load]);

  return { words, loading, error, source, reload: load };
}
