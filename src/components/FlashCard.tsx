"use client";

import { useCallback, useEffect, useState } from "react";
import clsx from "clsx";
import type { Word } from "@/data/words";

interface Props {
  word: Word;
  onGrade: (quality: number) => void;
}

const GRADES = [
  { q: 1, label: "Again", key: "1", cls: "bg-red-500/80 hover:bg-red-500" },
  { q: 3, label: "Hard", key: "2", cls: "bg-orange-500/80 hover:bg-orange-500" },
  { q: 4, label: "Good", key: "3", cls: "bg-emerald-500/80 hover:bg-emerald-500" },
  { q: 5, label: "Easy", key: "4", cls: "bg-sky-500/80 hover:bg-sky-500" },
];

export function FlashCard({ word, onGrade }: Props) {
  const [flipped, setFlipped] = useState(false);
  const [animDir, setAnimDir] = useState<"left" | "right" | null>(null);
  const [gradeIcon, setGradeIcon] = useState<string | null>(null);

  const doGrade = useCallback(
    (q: number) => {
      const icons: Record<number, string> = { 1: "X", 3: "...", 4: "OK", 5: "!!" };
      setGradeIcon(icons[q] ?? "OK");
      setAnimDir(q >= 4 ? "right" : "left");
      setTimeout(() => {
        onGrade(q);
        setFlipped(false);
        setAnimDir(null);
        setGradeIcon(null);
      }, 300);
    },
    [onGrade]
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!flipped) setFlipped(true);
      }
      if (flipped) {
        const match = GRADES.find((g) => g.key === e.key);
        if (match) {
          e.preventDefault();
          doGrade(match.q);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flipped, doGrade]);

  return (
    <div className="mx-auto w-full max-w-xl">
      <div
        className={clsx(
          "transition-all duration-300 ease-out",
          animDir === "right" && "translate-x-16 opacity-0",
          animDir === "left" && "-translate-x-16 opacity-0"
        )}
      >
        {gradeIcon && (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
            <span className="rounded-full bg-ink-900/90 px-6 py-3 text-3xl font-black text-sakura-300 shadow-card">
              {gradeIcon}
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={() => setFlipped((v) => !v)}
          className={clsx(
            "card relative block w-full min-h-[24rem] cursor-pointer select-none text-left transition",
            flipped ? "bg-ink-800" : "bg-gradient-to-br from-sakura-600/20 to-ink-800"
          )}
          aria-label="Flip card"
        >
          {!flipped ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-8">
              <div className="chip">
                {word.examCategory.replace("_", " ")} &middot; {word.type}
              </div>
              <ruby className="text-6xl font-bold sm:text-7xl">
                {word.lemma}
                <rt>{word.reading}</rt>
              </ruby>
              <p className="text-xs text-ink-400">
                Space / Enter to reveal &middot; 1-4 to grade
              </p>
            </div>
          ) : (
            <div className="flex h-full flex-col gap-4 py-4">
              <div className="flex items-center justify-between">
                <span className="chip">{word.partOfSpeech}</span>
                <span className="chip">{word.examCategory.replace("_", " ")}</span>
              </div>

              {/* Word + meaning */}
              <div>
                <div className="text-4xl font-bold">
                  {word.lemma}{" "}
                  <span className="text-base font-normal text-ink-400">
                    /{word.reading}
                  </span>
                </div>
                <div className="mt-1 text-xl text-sakura-200">{word.meaning}</div>
              </div>

              {/* Kanji decomposition — enlarged for KanjiVision */}
              {word.kanji.length > 0 && (
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-400">
                    漢字分解 &middot; Kanji decomposition
                  </h3>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {word.kanji.map((k) => (
                      <div
                        key={k.char}
                        className="rounded-xl border border-sakura-500/20 bg-ink-900/60 p-4"
                      >
                        <div className="flex items-end gap-3">
                          <span className="text-5xl font-black text-sakura-200">
                            {k.char}
                          </span>
                          <div className="pb-1">
                            <div className="text-sm font-semibold">{k.meaning}</div>
                            <div className="text-xs text-ink-400">{k.reading}</div>
                          </div>
                        </div>
                        <div className="mt-2 flex gap-4 text-[0.7rem] text-ink-400">
                          {k.onyomi && k.onyomi.length > 0 && (
                            <span>
                              <span className="font-semibold text-sakura-300">音</span>{" "}
                              {k.onyomi.join(" / ")}
                            </span>
                          )}
                          {k.kunyomi && k.kunyomi.length > 0 && (
                            <span>
                              <span className="font-semibold text-sky-300">訓</span>{" "}
                              {k.kunyomi.join(" / ")}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Mnemonic */}
              <section className="rounded-xl border border-sakura-500/20 bg-sakura-500/5 p-3 text-sm">
                <span className="font-semibold text-sakura-200">Mnemonic: </span>
                {word.mnemonic}
              </section>

              {/* Examples */}
              {word.examples.length > 0 && (
                <section className="text-sm">
                  <div className="text-ink-400 text-xs mb-1">Examples</div>
                  <ul className="flex flex-col gap-2">
                    {word.examples.map((ex, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-ink-400/15 bg-ink-900/40 p-2"
                      >
                        <ruby>
                          {ex.jp}
                          <rt>{ex.reading}</rt>
                        </ruby>
                        <div className="mt-1 italic text-ink-400">{ex.en}</div>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Collocations */}
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
      </div>

      {/* Grade buttons */}
      {flipped && !animDir && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          {GRADES.map((b) => (
            <button
              key={b.q}
              onClick={() => doGrade(b.q)}
              className={clsx(
                "rounded-xl px-3 py-3 text-sm font-semibold text-white transition active:scale-[0.97]",
                b.cls
              )}
            >
              {b.label}
              <span className="ml-1 text-[0.6rem] opacity-60">{b.key}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
