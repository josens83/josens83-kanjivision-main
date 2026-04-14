"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { WORDS, EXAM_LEVELS, type ExamCategory } from "@/data/words";
import { FlashCard } from "@/components/FlashCard";
import { PaywallGate } from "@/components/PaywallGate";
import { useAppStore } from "@/lib/store";
import { levelTier } from "@/lib/tiers";

function LearnInner() {
  const params = useSearchParams();
  const level = (params?.get("level") as ExamCategory) ?? "JLPT_N5";
  const user = useAppStore((s) => s.user);
  const grade = useAppStore((s) => s.grade);
  const bumpStreak = useAppStore((s) => s.bumpStreak);
  const [index, setIndex] = useState(0);

  const deck = useMemo(
    () => WORDS.filter((w) => w.examCategory === level),
    [level]
  );
  const meta = EXAM_LEVELS.find((l) => l.id === level)!;
  const required = levelTier(level);
  const current = user?.tier ?? "free";

  const word = deck[index];

  if (deck.length === 0) {
    return (
      <div className="card mx-auto mt-10 max-w-xl text-center">
        <h2 className="text-xl font-bold">Seed deck coming soon</h2>
        <p className="mt-2 text-sm text-ink-400">
          {meta.label} content is scheduled in the roadmap. For now, start with N5.
        </p>
        <Link href="/learn?level=JLPT_N5" className="btn-primary mt-4">
          Go to N5
        </Link>
      </div>
    );
  }

  return (
    <PaywallGate required={required} currentTier={current} levelLabel={meta.label}>
      <section className="mx-auto max-w-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sakura-300">{meta.label}</p>
            <h1 className="text-xl font-bold">
              Card {index + 1} / {deck.length}
            </h1>
          </div>
          <div className="chip">{meta.cefr}</div>
        </div>

        <FlashCard
          key={word.id}
          word={word}
          onGrade={(q) => {
            grade(word.id, q);
            bumpStreak();
            setIndex((i) => (i + 1) % deck.length);
          }}
        />

        <div className="mt-6 flex items-center justify-between text-sm text-ink-400">
          <button
            className="btn-ghost !py-1.5 !text-xs"
            onClick={() => setIndex((i) => (i - 1 + deck.length) % deck.length)}
          >
            ← Previous
          </button>
          <div className="hidden sm:block">Tip: grade honestly — SM-2 schedules the next review.</div>
          <button
            className="btn-ghost !py-1.5 !text-xs"
            onClick={() => setIndex((i) => (i + 1) % deck.length)}
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
