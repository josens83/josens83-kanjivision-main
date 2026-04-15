"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { WORDS, EXAM_LEVELS } from "@/data/words";
import { isDue } from "@/lib/srs";
import { apiGet } from "@/lib/api";

interface ProgressStats {
  total: number;
  dueCount: number;
  mastered: number;
  streakDays: number;
  longestStreakDays: number;
  lastStudyDate: string | null;
}

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const hydrating = useAppStore((s) => s.hydrating);
  const progress = useAppStore((s) => s.progress);
  const streakLocal = useAppStore((s) => s.streakDays);
  const router = useRouter();
  const [stats, setStats] = useState<ProgressStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    setLoading(true);
    apiGet<ProgressStats>("/api/progress/stats").then((res) => {
      if (!alive) return;
      if (res.ok && res.data) {
        setStats(res.data);
        setFallback(false);
      } else {
        setFallback(true);
      }
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [user]);

  if (!user && !hydrating) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <h1 className="text-xl font-bold">Sign in to see your dashboard</h1>
        <p className="mt-2 text-sm text-ink-400">
          Your progress and streak sync across devices once you sign in.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button className="btn-primary" onClick={() => router.push("/signin?next=/dashboard")}>
            Sign in
          </button>
          <Link className="btn-ghost" href="/signup">
            Create account
          </Link>
        </div>
      </div>
    );
  }

  // Local fallback stats (computed from the persisted progress store)
  const localLearned = Object.keys(progress).length;
  const localDue = Object.values(progress).filter((p) => isDue(p)).length;
  const localMastered = Object.values(progress).filter((p) => p.repetition >= 4).length;

  const shown = stats ?? {
    total: localLearned,
    dueCount: localDue,
    mastered: localMastered,
    streakDays: streakLocal,
    longestStreakDays: streakLocal,
    lastStudyDate: null,
  };

  return (
    <div className="flex flex-col gap-8 py-4">
      <header>
        <p className="text-xs uppercase tracking-widest text-sakura-300">Your dashboard</p>
        <h1 className="text-3xl font-black">
          おかえりなさい, {user ? user.email.split("@")[0] : "there"}.
        </h1>
        <p className="text-sm text-ink-400">
          Tier: <b className="text-sakura-300">{user?.tier ?? "free"}</b> · {WORDS.length} seeded cards · {loading ? "syncing…" : "synced"}.
        </p>
        {fallback && (
          <p className="mt-2 text-xs text-sakura-300">
            Showing locally-tracked stats — couldn&apos;t reach the server.
          </p>
        )}
      </header>

      <section className="grid gap-3 sm:grid-cols-4">
        <Stat label="Streak" value={`${shown.streakDays} 🔥`} />
        <Stat label="Studied" value={shown.total.toString()} />
        <Stat label="Due now" value={shown.dueCount.toString()} />
        <Stat label="Mastered" value={shown.mastered.toString()} />
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
