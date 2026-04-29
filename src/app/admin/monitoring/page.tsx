"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

const ADMIN_KEY = "dohurnk1006";

interface Health { uptime: number; memory: { rss: number; heapUsed: number; heapTotal: number }; db: string; node: string; pid: number }
interface DbStats {
  users: number; words: number; packages: number;
  activePurchases: number; expiredPurchases: number;
  subscriptions: number; wordMappings: number;
  byTier: { tier: string; _count: { _all: number } }[];
  byExam: { examCategory: string; _count: { _all: number } }[];
}

function MonitoringInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [health, setHealth] = useState<Health | null>(null);
  const [db, setDb] = useState<DbStats | null>(null);

  useEffect(() => {
    if (key !== ADMIN_KEY) return;
    const headers = { "x-internal-key": ADMIN_KEY };
    fetch(`${API_URL}/api/admin/monitoring/health`, { headers }).then((r) => r.json()).then(setHealth).catch(() => {});
    fetch(`${API_URL}/api/admin/monitoring/db-stats`, { headers }).then((r) => r.json()).then(setDb).catch(() => {});
  }, [key]);

  async function clearCache() {
    await fetch(`${API_URL}/api/admin/monitoring/cache/clear`, { method: "POST", headers: { "x-internal-key": ADMIN_KEY } });
    alert("Cache cleared");
  }

  if (key !== ADMIN_KEY) return <div className="mt-10 text-center"><Link href="/admin" className="btn-primary">Go to admin</Link></div>;

  return (
    <div className="flex flex-col gap-6 py-4">
      <header>
        <Link href={`/admin?key=${ADMIN_KEY}`} className="text-xs text-sakura-300">&larr; Admin</Link>
        <h1 className="text-2xl font-black">System Monitoring</h1>
      </header>

      {health ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="card text-center"><div className="text-2xl font-black text-emerald-300">{health.db}</div><div className="text-xs text-ink-400">Database</div></div>
          <div className="card text-center"><div className="text-2xl font-black">{Math.round(health.uptime / 60)}m</div><div className="text-xs text-ink-400">Uptime</div></div>
          <div className="card text-center"><div className="text-2xl font-black">{health.memory.heapUsed}MB</div><div className="text-xs text-ink-400">Heap used / {health.memory.heapTotal}MB</div></div>
          <div className="card text-center"><div className="text-2xl font-black">{health.memory.rss}MB</div><div className="text-xs text-ink-400">RSS</div></div>
        </div>
      ) : <div className="text-center text-ink-400">Loading system...</div>}

      {db ? (
        <>
          <section>
            <h2 className="font-bold mb-2">Database Stats</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="card text-center"><div className="text-2xl font-black text-sakura-300">{db.users}</div><div className="text-xs text-ink-400">Users</div></div>
              <div className="card text-center"><div className="text-2xl font-black">{db.words.toLocaleString()}</div><div className="text-xs text-ink-400">Words</div></div>
              <div className="card text-center"><div className="text-2xl font-black">{db.packages}</div><div className="text-xs text-ink-400">Packages</div></div>
              <div className="card text-center"><div className="text-2xl font-black">{db.wordMappings}</div><div className="text-xs text-ink-400">Pack-Word Mappings</div></div>
            </div>
          </section>

          <section>
            <h2 className="font-bold mb-2">Revenue</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="card text-center"><div className="text-2xl font-black text-emerald-300">{db.subscriptions}</div><div className="text-xs text-ink-400">Active Subscriptions</div></div>
              <div className="card text-center"><div className="text-2xl font-black text-sakura-300">{db.activePurchases}</div><div className="text-xs text-ink-400">Active Purchases</div></div>
              <div className="card text-center"><div className="text-2xl font-black text-ink-400">{db.expiredPurchases}</div><div className="text-xs text-ink-400">Expired/Refunded</div></div>
            </div>
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <div className="card">
              <h3 className="font-bold text-sm mb-2">Users by Tier</h3>
              {db.byTier.map((t) => (
                <div key={t.tier} className="flex justify-between text-sm py-0.5">
                  <span className="text-ink-400">{t.tier}</span>
                  <span className="font-bold">{t._count._all}</span>
                </div>
              ))}
            </div>
            <div className="card">
              <h3 className="font-bold text-sm mb-2">Words by Exam</h3>
              {db.byExam.map((e) => (
                <div key={e.examCategory} className="flex justify-between text-sm py-0.5">
                  <span className="text-ink-400">{e.examCategory}</span>
                  <span className="font-bold">{e._count._all}</span>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : <div className="text-center text-ink-400">Loading DB stats...</div>}

      <div className="card flex items-center justify-between">
        <div><h2 className="font-bold">Cache</h2><p className="text-sm text-ink-400">In-memory node-cache</p></div>
        <button className="btn-ghost !text-xs" onClick={clearCache}>Clear cache</button>
      </div>
      <div className="card">
        <h2 className="font-bold">System info</h2>
        <div className="mt-2 text-sm text-ink-400">Node {health?.node ?? "?"} &middot; PID {health?.pid ?? "?"}</div>
      </div>
    </div>
  );
}

export default function AdminMonitoringPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}>
      <MonitoringInner />
    </Suspense>
  );
}
