"use client";
import Link from "next/link";
import { EXAM_LEVELS } from "@/data/words";

export default function VocabularyPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <header>
        <h1 className="text-2xl font-black">Vocabulary</h1>
        <p className="text-sm text-ink-400">Browse all JLPT vocabulary by level.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAM_LEVELS.map((lv) => (
          <Link key={lv.id} href={`/vocabulary/${lv.id}`} className="card hover:border-sakura-500/50 transition">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black">{lv.label.split(" ")[0]}</span>
              <span className="chip">{lv.cefr}</span>
            </div>
            <div className="mt-2 text-sm text-ink-400">{lv.words.toLocaleString()} words &middot; {lv.kanji} kanji</div>
            <div className="mt-3 text-xs text-sakura-300">{lv.tier === "free" ? "Free" : lv.tier === "basic" ? "Basic" : "Premium"}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
