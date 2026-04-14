"use client";

import { WORDS, EXAM_LEVELS } from "@/data/words";

export default function AdminPage() {
  const byLevel = EXAM_LEVELS.map((lv) => ({
    level: lv,
    count: WORDS.filter((w) => w.examCategory === lv.id).length,
  }));

  return (
    <div className="flex flex-col gap-8 py-4">
      <header>
        <p className="text-xs uppercase tracking-widest text-sakura-300">Admin (MVP)</p>
        <h1 className="text-3xl font-black">Content dashboard</h1>
        <p className="text-sm text-ink-400">
          Seeded decks · kanji decomposition editor comes next.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-5">
        {byLevel.map(({ level, count }) => (
          <div key={level.id} className="card text-center">
            <div className="text-xs uppercase tracking-widest text-ink-400">{level.label.split(" ")[0]}</div>
            <div className="mt-1 text-2xl font-black">{count}</div>
            <div className="text-xs text-ink-400">/ {level.words.toLocaleString()} target</div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Words</h2>
        <div className="overflow-x-auto rounded-2xl border border-ink-400/20">
          <table className="w-full text-sm">
            <thead className="bg-ink-800/80 text-xs uppercase text-ink-400">
              <tr>
                <th className="px-3 py-2 text-left">Lemma</th>
                <th className="px-3 py-2 text-left">Reading</th>
                <th className="px-3 py-2 text-left">Meaning</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Level</th>
                <th className="px-3 py-2 text-left">Kanji parts</th>
              </tr>
            </thead>
            <tbody>
              {WORDS.map((w) => (
                <tr key={w.id} className="border-t border-ink-400/10">
                  <td className="px-3 py-2 font-bold">{w.lemma}</td>
                  <td className="px-3 py-2 text-ink-400">{w.reading}</td>
                  <td className="px-3 py-2">{w.meaning}</td>
                  <td className="px-3 py-2">{w.type}</td>
                  <td className="px-3 py-2">{w.examCategory.replace("_", " ")}</td>
                  <td className="px-3 py-2 text-sakura-200">
                    {w.kanji.map((k) => k.char).join(" / ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
