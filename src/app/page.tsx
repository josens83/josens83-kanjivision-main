import Link from "next/link";
import { EXAM_LEVELS } from "@/data/words";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero */}
      <section className="grid gap-8 py-12 md:grid-cols-2 md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-sakura-400">
            Japanese, Visualized.
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
            Learn JLPT vocabulary
            <br />
            <span className="bg-gradient-to-r from-sakura-300 to-sakura-500 bg-clip-text text-transparent">
              one kanji at a time.
            </span>
          </h1>
          <p className="mt-4 max-w-lg text-ink-100/80">
            KanjiVision AI turns every 漢字 into a memorable picture — with
            decomposition, AI-generated mnemonics, and spaced repetition tuned
            for N5 → N1. Works on web, mobile PWA, and native apps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn?level=JLPT_N5" className="btn-primary">
              Start free · N5
            </Link>
            <Link href="/pricing" className="btn-ghost">
              See pricing
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink-400">
            No credit card required · 10 seeded words ready · Offline-capable PWA
          </p>
        </div>

        <div className="card relative overflow-hidden">
          <div className="absolute -right-8 -top-8 text-[12rem] font-black text-sakura-500/10">
            漢
          </div>
          <div className="relative">
            <div className="chip mb-3">Today&apos;s card · N5</div>
            <ruby className="text-6xl font-bold">
              学校<rt>がっこう</rt>
            </ruby>
            <div className="mt-2 text-sakura-200">school</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-ink-400/20 bg-ink-900/50 p-2">
                <div className="text-2xl font-bold text-sakura-200">学</div>
                <div className="text-xs text-ink-400">learn · ガク</div>
              </div>
              <div className="rounded-lg border border-ink-400/20 bg-ink-900/50 p-2">
                <div className="text-2xl font-bold text-sakura-200">校</div>
                <div className="text-xs text-ink-400">building · コウ</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              学 (learn) + 校 (building) = a <em>building for learning</em> → school.
            </p>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { h: "漢字 decomposition", p: "Every kanji broken into meaning + on/kun-yomi." },
          { h: "AI mnemonics", p: "Claude-generated hooks that stick after one read." },
          { h: "SM-2 spaced repetition", p: "Shared engine powering the Vision Platform." },
        ].map((f) => (
          <div key={f.h} className="card">
            <h3 className="font-bold">{f.h}</h3>
            <p className="mt-1 text-sm text-ink-400">{f.p}</p>
          </div>
        ))}
      </section>

      {/* Levels */}
      <section>
        <h2 className="text-2xl font-bold">Your JLPT pathway</h2>
        <p className="text-sm text-ink-400">N5 → N1 · 10,000 words · 2,000 kanji</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {EXAM_LEVELS.map((lv) => (
            <Link
              key={lv.id}
              href={`/learn?level=${lv.id}`}
              className="card hover:border-sakura-500/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{lv.label.split(" ")[0]}</span>
                <span className="chip">{lv.cefr}</span>
              </div>
              <div className="mt-2 text-xs text-ink-400">
                {lv.words.toLocaleString()} words · {lv.kanji} kanji
              </div>
              <div className="mt-2 text-[0.7rem] uppercase tracking-wider text-sakura-300">
                {lv.tier === "free" ? "Free" : lv.tier === "basic" ? "Basic" : "Premium"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Cross-promo */}
      <section className="card">
        <h3 className="font-bold">Part of the Vision Platform</h3>
        <p className="mt-1 text-sm text-ink-400">
          English <a className="underline" href="https://vocavision.app">VocaVision</a> ·
          Korean <a className="underline" href="https://hangeulvision.app">HangeulVision</a> ·
          Japanese KanjiVision — bundle 2 services for 19% off, 3 for 25% off.
        </p>
      </section>
    </div>
  );
}
