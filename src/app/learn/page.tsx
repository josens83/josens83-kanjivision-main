"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { EXAM_LEVELS, type ExamCategory } from "@/data/words";
import { FlashCard } from "@/components/FlashCard";
import { PaywallGate } from "@/components/PaywallGate";
import { useAppStore } from "@/lib/store";
import { levelTier } from "@/lib/tiers";
import { useStudyQueue } from "@/hooks/useStudyQueue";

function LearnInner() {
  const params = useSearchParams();
  const level = (params?.get("level") as ExamCategory) ?? "JLPT_N5";
  const user = useAppStore((s) => s.user);
  const gradeWord = useAppStore((s) => s.gradeWord);
  const bumpStreak = useAppStore((s) => s.bumpStreak);

  const [index, setIndex] = useState(0);
  const [grades, setGrades] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const { words, loading, source, error, reload } = useStudyQueue(level, 10);
  const meta = EXAM_LEVELS.find((l) => l.id === level)!;
  const required = levelTier(level);
  const current = user?.tier ?? "free";

  const total = words.length;
  const studied = grades.length;
  const correct = grades.filter((g) => g >= 4).length;
  const accuracy = studied > 0 ? Math.round((correct / studied) * 100) : 0;
  const progressPct = total > 0 ? Math.round((studied / total) * 100) : 0;

  const handleGrade = useCallback(
    (q: number) => {
      void gradeWord(words[index].id, q);
      bumpStreak();
      setGrades((prev) => [...prev, q]);
      if (index + 1 >= total) {
        setDone(true);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [gradeWord, bumpStreak, words, index, total]
  );

  const handleRestart = useCallback(() => {
    setIndex(0);
    setGrades([]);
    setDone(false);
    reload();
  }, [reload]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((i) => Math.max(0, i - 1));
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (index < studied) setIndex((i) => Math.min(total - 1, i + 1));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, studied, total]);

  if (loading && words.length === 0) {
    return <div className="mt-10 text-center text-ink-400">Loading your queue...</div>;
  }

  if (words.length === 0) {
    return (
      <div className="card mx-auto mt-10 max-w-xl text-center">
        <h2 className="text-xl font-bold">Deck coming soon</h2>
        <p className="mt-2 text-sm text-ink-400">
          {meta.label} content is scheduled in the roadmap.
        </p>
        <Link href="/learn?level=JLPT_N5" className="btn-primary mt-4">
          Go to N5
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="mx-auto max-w-xl py-10">
        <div className="card text-center">
          <div className="text-5xl">
            {accuracy >= 80 ? "!!" : accuracy >= 50 ? "OK" : "..."}
          </div>
          <h2 className="mt-3 text-2xl font-black">Session complete</h2>
          <p className="mt-2 text-ink-400">
            {studied} words studied &middot; {correct} correct &middot;{" "}
            <span className={accuracy >= 80 ? "text-emerald-300" : accuracy >= 50 ? "text-orange-300" : "text-red-300"}>
              {accuracy}% accuracy
            </span>
          </p>
          <div className="mx-auto mt-4 h-3 w-48 overflow-hidden rounded-full bg-ink-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sakura-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${accuracy}%` }}
            />
          </div>
          <div className="mt-6 flex justify-center gap-3">
            <button className="btn-primary" onClick={handleRestart}>
              Study again
            </button>
            <Link href="/dashboard" className="btn-ghost">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const word = words[index];

  return (
    <PaywallGate required={required} currentTier={current} levelLabel={meta.label}>
      <section className="mx-auto max-w-xl">
        {/* Header */}
        <div className="mb-2 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sakura-300">{meta.label}</p>
            <h1 className="text-lg font-bold">
              {studied}/{total} words studied
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">{meta.cefr}</span>
            <span className="chip text-[0.6rem]">
              {source === "api" ? "Live" : "Sample"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-ink-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sakura-500 to-sakura-300 transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {error && source === "seed" && (
          <div className="mb-3 rounded-xl border border-sakura-500/30 bg-sakura-500/10 p-3 text-xs text-sakura-200">
            Showing sample words — couldn&apos;t reach the server. Progress syncs next time.
          </div>
        )}

        <FlashCard key={word.id} word={word} onGrade={handleGrade} />

        {/* Navigation */}
        <div className="mt-4 flex items-center justify-between text-sm text-ink-400">
          <button
            className="btn-ghost !py-1.5 !text-xs"
            disabled={index === 0}
            onClick={() => setIndex((i) => i - 1)}
          >
            &larr; Prev
          </button>
          <div className="hidden text-xs sm:block">
            Space flip &middot; 1 Again &middot; 2 Hard &middot; 3 Good &middot; 4 Easy
          </div>
          <button
            className="btn-ghost !py-1.5 !text-xs"
            disabled={index >= studied}
            onClick={() => setIndex((i) => i + 1)}
          >
            Skip &rarr;
          </button>
        </div>
      </section>
    </PaywallGate>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}>
      <LearnInner />
    </Suspense>
  );
}
