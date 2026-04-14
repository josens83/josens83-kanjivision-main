"use client";

import { useState } from "react";
import clsx from "clsx";
import type { Word } from "@/data/words";

interface Props {
  word: Word;
  onGrade: (quality: number) => void;
}

export function FlashCard({ word, onGrade }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="mx-auto w-full max-w-xl">
      <button
        type="button"
        onClick={() => setFlipped((v) => !v)}
        className={clsx(
          "card relative block w-full min-h-[22rem] cursor-pointer select-none text-left transition",
          flipped ? "bg-ink-800" : "bg-gradient-to-br from-sakura-600/20 to-ink-800"
        )}
        aria-label="Flip card"
      >
        {!flipped ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 py-8">
            <div className="chip">{word.examCategory.replace("_", " ")} · {word.type}</div>
            <ruby className="text-6xl font-bold sm:text-7xl">
              {word.lemma}
              <rt>{word.reading}</rt>
            </ruby>
            <p className="text-xs text-ink-400">Tap / click to reveal</p>
          </div>
        ) : (
          <div className="flex h-full flex-col gap-5 py-4">
            <div className="flex items-center justify-between">
              <span className="chip">{word.partOfSpeech}</span>
              <span className="chip">{word.examCategory.replace("_", " ")}</span>
            </div>
            <div>
              <div className="text-4xl font-bold">
                {word.lemma}{" "}
                <span className="text-base font-normal text-ink-400">／{word.reading}</span>
              </div>
              <div className="mt-1 text-lg text-sakura-200">{word.meaning}</div>
            </div>

            {word.kanji.length > 0 && (
              <section>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                  漢字分解 · Kanji decomposition
                </h3>
                <div className="grid gap-2 sm:grid-cols-2">
                  {word.kanji.map((k) => (
                    <div
                      key={k.char}
                      className="rounded-xl border border-ink-400/20 bg-ink-900/60 p-3"
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-sakura-200">{k.char}</span>
                        <span className="text-xs text-ink-400">{k.reading}</span>
                      </div>
                      <div className="mt-1 text-sm">{k.meaning}</div>
                      {k.onyomi && (
                        <div className="mt-0.5 text-[0.65rem] text-ink-400">
                          音: {k.onyomi.join("・")}
                          {k.kunyomi ? `  訓: ${k.kunyomi.join("・")}` : ""}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="rounded-xl border border-sakura-500/20 bg-sakura-500/5 p-3 text-sm">
              <span className="font-semibold text-sakura-200">Mnemonic: </span>
              {word.mnemonic}
            </section>

            <section className="text-sm">
              <div className="text-ink-400 text-xs mb-1">Examples</div>
              <ul className="flex flex-col gap-2">
                {word.examples.map((ex, i) => (
                  <li key={i} className="rounded-lg border border-ink-400/15 bg-ink-900/40 p-2">
                    <ruby>
                      {ex.jp}
                      <rt>{ex.reading}</rt>
                    </ruby>
                    <div className="mt-1 italic text-ink-400">{ex.en}</div>
                  </li>
                ))}
              </ul>
            </section>

            {word.collocations.length > 0 && (
              <section className="text-sm">
                <div className="text-ink-400 text-xs mb-1">Collocations</div>
                <div className="flex flex-wrap gap-1.5">
                  {word.collocations.map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </button>

      {flipped && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[
            { q: 1, label: "Again", cls: "bg-red-500/80 hover:bg-red-500" },
            { q: 3, label: "Hard", cls: "bg-orange-500/80 hover:bg-orange-500" },
            { q: 4, label: "Good", cls: "bg-emerald-500/80 hover:bg-emerald-500" },
            { q: 5, label: "Easy", cls: "bg-sky-500/80 hover:bg-sky-500" },
          ].map((b) => (
            <button
              key={b.q}
              onClick={() => {
                onGrade(b.q);
                setFlipped(false);
              }}
              className={clsx(
                "rounded-xl px-3 py-3 text-sm font-semibold text-white transition active:scale-[0.97]",
                b.cls
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
