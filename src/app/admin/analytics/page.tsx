"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

const ADMIN_KEY = "dohurnk1006";

interface Analytics {
  totalUsers: number;
  newUsers7d: number;
  newUsers30d: number;
  totalWords: number;
  activeSubscriptions: number;
  activePurchases: number;
  dailySignups: Array<{ day: string; count: number }>;
  dailyActive: Array<{ day: string; count: number }>;
  examDist: Array<{ level: string; count: number }>;
  tierDist: Array<{ tier: string; count: number }>;
}

const TIER_COLORS: Record<string, string> = {
  FREE: "bg-ink-600",
  BASIC: "bg-sky-500",
  PREMIUM: "bg-sakura-500",
};

function AnalyticsInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    if (key !== ADMIN_KEY) return;
    fetch(`${API_URL}/api/internal/analytics?key=${ADMIN_KEY}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [key]);

  if (key !== ADMIN_KEY) return <div className="mt-10 text-center"><Link href="/admin" className="btn-primary">Go to admin</Link></div>;
  if (!data) return <div className="mt-10 text-center text-ink-400">Loading analytics...</div>;

  const maxSignup = Math.max(...data.dailySignups.map((d) => d.count), 1);
  const maxActive = Math.max(...data.dailyActive.map((d) => d.count), 1);
  const totalExam = data.examDist.reduce((a, e) => a + e.count, 0) || 1;
  const totalTier = data.tierDist.reduce((a, t) => a + t.count, 0) || 1;

  return (
    <div className="flex flex-col gap-6 py-4">
      <header>
        <Link href={`/admin?key=${ADMIN_KEY}`} className="text-xs text-sakura-300 hover:underline">&larr; Admin</Link>
        <h1 className="text-2xl font-black">Analytics</h1>
      </header>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <KPI label="Total Users" value={data.totalUsers} />
        <KPI label="New (7d)" value={data.newUsers7d} color="text-emerald-300" />
        <KPI label="New (30d)" value={data.newUsers30d} />
        <KPI label="Words" value={data.totalWords} />
        <KPI label="Subscriptions" value={data.activeSubscriptions} color="text-sakura-300" />
        <KPI label="Pack Purchases" value={data.activePurchases} color="text-sky-300" />
      </div>

      {/* Daily Signups Bar Chart */}
      <section className="card">
        <h2 className="font-bold mb-3">Daily Signups (7 days)</h2>
        <div className="flex items-end gap-1 h-32">
          {data.dailySignups.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[0.55rem] text-ink-400">{d.count}</span>
              <div className="w-full rounded-t bg-sakura-500/60" style={{ height: `${(d.count / maxSignup) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }} />
              <span className="text-[0.5rem] text-ink-400">{d.day.slice(5)}</span>
            </div>
          ))}
          {data.dailySignups.length === 0 && <span className="text-ink-400 text-sm">No data</span>}
        </div>
      </section>

      {/* Daily Active Learners */}
      <section className="card">
        <h2 className="font-bold mb-3">Daily Active Learners (7 days)</h2>
        <div className="flex items-end gap-1 h-32">
          {data.dailyActive.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-[0.55rem] text-ink-400">{d.count}</span>
              <div className="w-full rounded-t bg-emerald-500/60" style={{ height: `${(d.count / maxActive) * 100}%`, minHeight: d.count > 0 ? 4 : 0 }} />
              <span className="text-[0.5rem] text-ink-400">{d.day.slice(5)}</span>
            </div>
          ))}
          {data.dailyActive.length === 0 && <span className="text-ink-400 text-sm">No data</span>}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Exam Distribution */}
        <section className="card">
          <h2 className="font-bold mb-3">Words by JLPT Level</h2>
          <div className="flex flex-col gap-2">
            {data.examDist.map((e) => (
              <div key={e.level}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{e.level.replace("_", " ")}</span>
                  <span className="text-ink-400">{e.count}</span>
                </div>
                <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                  <div className="h-full rounded-full bg-sakura-400" style={{ width: `${(e.count / totalExam) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tier Distribution */}
        <section className="card">
          <h2 className="font-bold mb-3">Users by Tier</h2>
          <div className="flex flex-col gap-2">
            {data.tierDist.map((t) => (
              <div key={t.tier}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{t.tier}</span>
                  <span className="text-ink-400">{t.count} ({Math.round((t.count / totalTier) * 100)}%)</span>
                </div>
                <div className="h-2 rounded-full bg-ink-800 overflow-hidden">
                  <div className={`h-full rounded-full ${TIER_COLORS[t.tier] ?? "bg-ink-500"}`} style={{ width: `${(t.count / totalTier) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function KPI({ label, value, color }: { label: string; value: number; color?: string }) {
  return (
    <div className="card text-center">
      <div className="text-xs uppercase tracking-widest text-ink-400">{label}</div>
      <div className={`mt-1 text-2xl font-black ${color ?? ""}`}>{value.toLocaleString()}</div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}>
      <AnalyticsInner />
    </Suspense>
  );
}
