"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { apiGet } from "@/lib/api";
import { EXAM_LEVELS } from "@/data/words";

interface Stats {
  total: number;
  dueCount: number;
  mastered: number;
  streakDays: number;
  longestStreakDays: number;
  lastStudyDate: string | null;
  sessionsLast30?: number;
  cardsSeenLast30?: number;
  accuracyLast30?: number | null;
}

interface WordCount {
  total: number;
  byExam: Record<string, number>;
}

export default function StatisticsPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [wordCount, setWordCount] = useState<WordCount | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      apiGet<Stats>("/api/learning/stats"),
      apiGet<WordCount>("/api/words/count"),
    ]).then(([s, w]) => {
      if (s.ok && s.data) setStats(s.data);
      if (w.ok && w.data) setWordCount(w.data);
      setLoading(false);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <h1 className="text-xl font-bold">Sign in to see statistics</h1>
        <button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/statistics")}>
          Sign in
        </button>
      </div>
    );
  }

  if (loading) return <div className="mt-10 text-center text-ink-400">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 py-4">
      <header>
        <Link href="/dashboard" className="text-xs text-sakura-300 hover:underline">&larr; Dashboard</Link>
        <h1 className="text-2xl font-black">Statistics</h1>
      </header>

      {/* Overview cards */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total studied" value={String(stats?.total ?? 0)} />
        <Stat label="Due now" value={String(stats?.dueCount ?? 0)} />
        <Stat label="Mastered" value={String(stats?.mastered ?? 0)} />
        <Stat
          label="Streak"
          value={`${stats?.streakDays ?? 0} days`}
          sub={stats?.longestStreakDays ? `Best: ${stats.longestStreakDays}` : undefined}
        />
      </section>

      {/* Last 30 days */}
      {stats?.sessionsLast30 != null && (
        <section className="card">
          <h2 className="font-bold">Last 30 days</h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <div className="text-2xl font-black">{stats.sessionsLast30}</div>
              <div className="text-xs text-ink-400">Sessions</div>
            </div>
            <div>
              <div className="text-2xl font-black">{stats.cardsSeenLast30}</div>
              <div className="text-xs text-ink-400">Cards reviewed</div>
            </div>
            <div>
              <div className="text-2xl font-black">
                {stats.accuracyLast30 != null ? `${Math.round(stats.accuracyLast30 * 100)}%` : "—"}
              </div>
              <div className="text-xs text-ink-400">Accuracy</div>
            </div>
          </div>
        </section>
      )}

      {/* Per-level progress */}
      <section>
        <h2 className="mb-3 text-lg font-bold">Progress by JLPT level</h2>
        <div className="flex flex-col gap-3">
          {EXAM_LEVELS.map((lv) => {
            const available = wordCount?.byExam?.[lv.id] ?? 0;
            const target = lv.words;
            const pct = target > 0 ? Math.min(100, Math.round((available / target) * 100)) : 0;
            return (
              <div key={lv.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black">{lv.label.split(" ")[0]}</span>
                    <span className="chip">{lv.cefr}</span>
                  </div>
                  <span className="text-sm text-ink-400">
                    {available} / {target.toLocaleString()} words
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-ink-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sakura-500 to-sakura-300 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="mt-1 text-right text-xs text-ink-400">{pct}%</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card text-center">
      <div className="text-xs uppercase tracking-widest text-ink-400">{label}</div>
      <div className="mt-1 text-2xl font-black">{value}</div>
      {sub && <div className="text-xs text-ink-400">{sub}</div>}
    </div>
  );
}
