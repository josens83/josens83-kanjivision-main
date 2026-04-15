"use client";

import { Suspense, useState } from "react";
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

  const { words, loading, source, error } = useStudyQueue(level, 4);
  const meta = EXAM_LEVELS.find((l) => l.id === level)!;
  const required = levelTier(level);
  const current = user?.tier ?? "free";

  if (loading && words.length === 0) {
    return <div className="mt-10 text-center text-ink-400">Loading your queue…</div>;
  }

  if (words.length === 0) {
    return (
      <div className="card mx-auto mt-10 max-w-xl text-center">
        <h2 className="text-xl font-bold">Deck coming soon</h2>
        <p className="mt-2 text-sm text-ink-400">
          {meta.label} content is scheduled in the roadmap. For now, start with N5.
        </p>
        <Link href="/learn?level=JLPT_N5" className="btn-primary mt-4">
          Go to N5
        </Link>
      </div>
    );
  }

  const word = words[index % words.length];

  return (
    <PaywallGate required={required} currentTier={current} levelLabel={meta.label}>
      <section className="mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sakura-300">{meta.label}</p>
            <h1 className="text-xl font-bold">
              Card {index + 1} / {words.length}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="chip">{meta.cefr}</span>
            <span className="chip">
              {source === "api" ? "Live queue" : "Sample deck"}
            </span>
          </div>
        </div>

        {error && source === "seed" && (
          <div className="mb-3 rounded-xl border border-sakura-500/30 bg-sakura-500/10 p-3 text-xs text-sakura-200">
            Showing sample words — couldn&apos;t reach the server ({error}). Your progress will
            sync next time you&apos;re online.
          </div>
        )}

        <FlashCard
          key={word.id}
          word={word}
          onGrade={(q) => {
            void gradeWord(word.id, q);
            bumpStreak();
            setIndex((i) => (i + 1) % words.length);
          }}
        />

        <div className="mt-6 flex items-center justify-between text-sm text-ink-400">
          <button
            className="btn-ghost !py-1.5 !text-xs"
            onClick={() => setIndex((i) => (i - 1 + words.length) % words.length)}
          >
            ← Previous
          </button>
          <div className="hidden sm:block">Tip: grade honestly — SM-2 schedules the next review.</div>
          <button
            className="btn-ghost !py-1.5 !text-xs"
            onClick={() => setIndex((i) => (i + 1) % words.length)}
          >
            Skip →
          </button>
        </div>
      </section>
    </PaywallGate>
  );
}

export default function LearnPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading…</div>}>
      <LearnInner />
    </Suspense>
  );
}
