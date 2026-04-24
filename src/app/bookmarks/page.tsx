"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { apiGet, apiDelete } from "@/lib/api";
import type { Word } from "@/data/words";
import { toFrontendWord } from "@/hooks/useStudyQueue";

interface BookmarkRow {
  id: string;
  wordId: string;
  notes: string | null;
  createdAt: string;
  word: Parameters<typeof toFrontendWord>[0];
}

export default function BookmarksPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [bookmarks, setBookmarks] = useState<Array<{ bk: BookmarkRow; word: Word }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    apiGet<{ data: BookmarkRow[] }>("/api/bookmarks").then((res) => {
      if (res.ok && res.data) {
        setBookmarks(
          res.data.data.map((bk) => ({ bk, word: toFrontendWord(bk.word) }))
        );
      }
      setLoading(false);
    });
  }, [user]);

  async function handleRemove(wordId: string) {
    await apiDelete(`/api/bookmarks/${wordId}`);
    setBookmarks((prev) => prev.filter((b) => b.bk.wordId !== wordId));
  }

  if (!user) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <h1 className="text-xl font-bold">Sign in to see bookmarks</h1>
        <button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/bookmarks")}>
          Sign in
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <header>
        <p className="text-xs uppercase tracking-widest text-sakura-300">Bookmarks</p>
        <h1 className="text-2xl font-black">Saved words</h1>
        <p className="text-sm text-ink-400">{bookmarks.length} bookmarked</p>
      </header>

      {loading && <div className="text-center text-ink-400">Loading...</div>}

      {!loading && bookmarks.length === 0 && (
        <div className="card text-center">
          <p className="text-ink-400">No bookmarks yet. Tap the heart on any flashcard to save it.</p>
          <Link href="/learn?level=JLPT_N5" className="btn-primary mt-4">
            Start learning
          </Link>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {bookmarks.map(({ bk, word }) => (
          <div key={bk.id} className="card flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <ruby className="text-2xl font-bold">
                  {word.lemma}<rt>{word.reading}</rt>
                </ruby>
                <div className="text-sm text-sakura-200">{word.meaning}</div>
              </div>
              <button
                onClick={() => handleRemove(bk.wordId)}
                className="text-red-400 hover:text-red-300 text-lg"
                title="Remove bookmark"
              >
                &hearts;
              </button>
            </div>
            <div className="text-xs text-ink-400">
              {word.examCategory.replace("_", " ")} &middot; {word.partOfSpeech}
            </div>
            {word.kanji.length > 0 && (
              <div className="flex gap-1 text-xs text-sakura-200">
                {word.kanji.map((k) => (
                  <span key={k.char} className="chip">{k.char} {k.meaning}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
