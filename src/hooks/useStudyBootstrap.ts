"use client";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import { WORDS, type Word } from "@/data/words";
import { useAppStore } from "@/lib/store";
import { toFrontendWord } from "./useStudyQueue";

/**
 * Returns a single featured word for the landing / dashboard hero:
 *  - signed-in: GET /api/learning/queue?size=1
 *  - otherwise: the first seed word (local fallback)
 */
export function useStudyBootstrap(): { word: Word | null; source: "api" | "seed"; loading: boolean } {
  const user = useAppStore((s) => s.user);
  const [word, setWord] = useState<Word | null>(null);
  const [source, setSource] = useState<"api" | "seed">("seed");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    async function run() {
      if (!user) {
        if (!alive) return;
        setWord(WORDS[0] ?? null);
        setSource("seed");
        setLoading(false);
        return;
      }
      const res = await apiGet<{
        cards: Array<{ word: Parameters<typeof toFrontendWord>[0] }>;
      }>("/api/learning/queue?limit=1&size=1");
      if (!alive) return;
      if (res.ok && res.data && res.data.cards.length > 0) {
        setWord(toFrontendWord(res.data.cards[0].word));
        setSource("api");
      } else {
        setWord(WORDS[0] ?? null);
        setSource("seed");
      }
      setLoading(false);
    }
    run();
    return () => {
      alive = false;
    };
  }, [user]);

  return { word, source, loading };
}
