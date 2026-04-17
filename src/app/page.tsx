import Link from "next/link";
import { EXAM_LEVELS, WORDS } from "@/data/words";

export default function HomePage() {
  const wordCount = WORDS.length;

  return (
    <div className="flex flex-col gap-20">
      {/* ── Hero ── */}
      <section className="grid gap-8 py-14 md:grid-cols-2 md:items-center md:py-24">
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
            KanjiVision AI breaks every 漢字 into its radicals, pairs it with
            an AI-generated mnemonic, and schedules reviews with SM-2 spaced
            repetition — from N5 to N1. Web, mobile PWA, native apps.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn?level=JLPT_N5" className="btn-primary">
              Start free &rarr; N5
            </Link>
            <Link href="/pricing" className="btn-ghost">
              See pricing
            </Link>
          </div>
          <p className="mt-3 text-xs text-ink-400">
            No credit card required &middot; {wordCount} words seeded &middot; Offline-capable PWA
          </p>
        </div>

        {/* Hero card */}
        <div className="card relative overflow-hidden">
          <div className="absolute -right-8 -top-8 select-none text-[12rem] font-black text-sakura-500/10">
            漢
          </div>
          <div className="relative">
            <div className="chip mb-3">Today&apos;s card &middot; N5</div>
            <ruby className="text-6xl font-bold">
              学校<rt>がっこう</rt>
            </ruby>
            <div className="mt-2 text-lg text-sakura-200">school</div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg border border-ink-400/20 bg-ink-900/50 p-3">
                <div className="text-3xl font-bold text-sakura-200">学</div>
                <div className="text-xs text-ink-400">learn &middot; ガク</div>
              </div>
              <div className="rounded-lg border border-ink-400/20 bg-ink-900/50 p-3">
                <div className="text-3xl font-bold text-sakura-200">校</div>
                <div className="text-xs text-ink-400">building &middot; コウ</div>
              </div>
            </div>
            <p className="mt-3 text-xs text-ink-400">
              学&nbsp;(learn) + 校&nbsp;(building) = a <em>building for learning</em> &rarr; school.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { value: "1.72M+", label: "JLPT test takers / year" },
          { value: `${wordCount}+`, label: "Words ready" },
          { value: "5", label: "JLPT levels: N5 \u2192 N1" },
          { value: "95%", label: "VocaVision tech reused" },
        ].map((s) => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl font-black bg-gradient-to-r from-sakura-300 to-sakura-500 bg-clip-text text-transparent">
              {s.value}
            </div>
            <div className="mt-1 text-xs text-ink-400">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section>
        <h2 className="text-center text-2xl font-bold">How it works</h2>
        <p className="mt-1 text-center text-sm text-ink-400">
          Three pillars shared across the Vision Platform.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: "\u5B57",
              h: "Kanji decomposition",
              p: "Every 漢字 broken into radicals with on/kun-yomi readings so you understand the building blocks, not just memorize shapes.",
            },
            {
              icon: "\uD83E\uDDE0",
              h: "AI mnemonics",
              p: "Claude generates an English syllable-breakdown mnemonic for each word. One read and it sticks.",
            },
            {
              icon: "\uD83D\uDD01",
              h: "SM-2 spaced repetition",
              p: "The same SuperMemo 2 engine powering VocaVision and HangeulVision schedules your next review at the optimal interval.",
            },
          ].map((f) => (
            <div key={f.h} className="card flex flex-col items-center text-center">
              <span className="text-4xl">{f.icon}</span>
              <h3 className="mt-3 font-bold">{f.h}</h3>
              <p className="mt-2 text-sm text-ink-400">{f.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Exam Catalog ── */}
      <section>
        <h2 className="text-2xl font-bold">Your JLPT pathway</h2>
        <p className="text-sm text-ink-400">N5 &rarr; N1 &middot; 10,000 words &middot; 2,000 kanji</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {EXAM_LEVELS.map((lv) => (
            <Link
              key={lv.id}
              href={`/learn?level=${lv.id}`}
              className="card transition hover:border-sakura-500/50 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <span className="text-xl font-black">{lv.label.split(" ")[0]}</span>
                <span className="chip">{lv.cefr}</span>
              </div>
              <div className="mt-2 text-xs text-ink-400">
                {lv.words.toLocaleString()} words &middot; {lv.kanji} kanji
              </div>
              <div className="mt-2 text-[0.7rem] uppercase tracking-wider text-sakura-300">
                {lv.tier === "free" ? "Free" : lv.tier === "basic" ? "Basic" : "Premium"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Cross-promo ── */}
      <section className="card">
        <h3 className="font-bold">Part of the Vision Platform</h3>
        <p className="mt-2 text-sm text-ink-400">
          Learn across languages with one account. Bundle 2 services for 19% off, 3 for 25% off.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href="https://vocavision.app"
            className="rounded-xl border border-ink-400/20 bg-ink-900/50 p-4 transition hover:border-sakura-500/40"
          >
            <div className="text-lg font-bold">VocaVision AI</div>
            <div className="text-xs text-ink-400">
              English &middot; SAT / GRE / TOEFL / IELTS
            </div>
          </a>
          <a
            href="https://hangeulvision.app"
            className="rounded-xl border border-ink-400/20 bg-ink-900/50 p-4 transition hover:border-sakura-500/40"
          >
            <div className="text-lg font-bold">HangeulVision AI</div>
            <div className="text-xs text-ink-400">
              Korean &middot; TOPIK I / II
            </div>
          </a>
        </div>
      </section>
    </div>
  );
}
