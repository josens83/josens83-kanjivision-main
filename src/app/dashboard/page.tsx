"use client";

import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { WORDS, EXAM_LEVELS } from "@/data/words";
import { isDue } from "@/lib/srs";

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const progress = useAppStore((s) => s.progress);
  const streak = useAppStore((s) => s.streakDays);
  const signIn = useAppStore((s) => s.signIn);

  if (!user) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <h1 className="text-xl font-bold">Sign in to see your dashboard</h1>
        <p className="mt-2 text-sm text-ink-400">
          Your progress and streak are stored locally until you sync to the cloud.
        </p>
        <button
          className="btn-primary mt-4"
          onClick={() => {
            const email = prompt("Email");
            if (email) signIn(email);
          }}
        >
          Sign in
        </button>
      </div>
    );
  }

  const learned = Object.keys(progress).length;
  const dueNow = Object.values(progress).filter((p) => isDue(p)).length;
  const mastered = Object.values(progress).filter((p) => p.repetition >= 4).length;

  return (
    <div className="flex flex-col gap-8 py-4">
      <header>
        <p className="text-xs uppercase tracking-widest text-sakura-300">Your dashboard</p>
        <h1 className="text-3xl font-black">おかえりなさい, {user.email.split("@")[0]}.</h1>
        <p className="text-sm text-ink-400">
          Tier: <b className="text-sakura-300">{user.tier}</b> · {WORDS.length} cards seeded.
        </p>
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        <Stat label="Streak" value={`${streak} 🔥`} />
        <Stat label="Studied" value={learned.toString()} />
        <Stat label="Due now" value={dueNow.toString()} />
        <Stat label="Mastered" value={mastered.toString()} />
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Continue learning</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {EXAM_LEVELS.map((lv) => (
            <Link
              key={lv.id}
              href={`/learn?level=${lv.id}`}
              className="card hover:border-sakura-500/50"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-black">{lv.label.split(" ")[0]}</span>
                <span className="chip">{lv.cefr}</span>
              </div>
              <div className="mt-2 text-xs text-ink-400">
                {lv.words.toLocaleString()} words · {lv.kanji} kanji
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="font-bold">Install as an app</h2>
        <p className="mt-1 text-sm text-ink-400">
          This site is a PWA. On iOS: Share → <i>Add to Home Screen</i>. On
          Android Chrome: menu → <i>Install app</i>. Native iOS/Android shells
          (via Codemagic) ship in Phase 2.
        </p>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card text-center">
      <div className="text-xs uppercase tracking-widest text-ink-400">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
    </div>
  );
}
