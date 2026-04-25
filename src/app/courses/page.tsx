"use client";
import Link from "next/link";
import { EXAM_LEVELS } from "@/data/words";

export default function CoursesPage() {
  return (
    <div className="flex flex-col gap-6 py-4">
      <header><h1 className="text-2xl font-black">Courses</h1><p className="text-sm text-ink-400">Structured JLPT preparation paths.</p></header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EXAM_LEVELS.map((lv) => (
          <Link key={lv.id} href={`/learn?level=${lv.id}`} className="card hover:border-sakura-500/50 transition flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black">{lv.label.split(" ")[0]}</span>
              <span className="chip">{lv.cefr}</span>
            </div>
            <p className="text-sm text-ink-400">{lv.words.toLocaleString()} words &middot; {lv.kanji} kanji</p>
            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-800"><div className="h-full rounded-full bg-sakura-500/50" style={{ width: "0%" }} /></div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-sakura-300">{lv.tier === "free" ? "Free" : lv.tier === "basic" ? "Basic" : "Premium"}</span>
              <span className="text-ink-400">0% complete</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
