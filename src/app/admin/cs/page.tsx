"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

const ADMIN_KEY = "dohurnk1006";

interface Ticket { id: string; email: string; subject: string; category: string; status: string; priority: string; createdAt: string }
interface Stats { total: number; open: number; inProgress: number; resolved: number }

function CSInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (key !== ADMIN_KEY) return;
    fetch(`${API_URL}/api/support/tickets`, { headers: { "x-internal-key": ADMIN_KEY } })
      .then((r) => r.json()).then((d) => {
        const t = d.tickets ?? [];
        setTickets(t);
        setStats({ total: t.length, open: t.filter((x: Ticket) => x.status === "OPEN").length, inProgress: t.filter((x: Ticket) => x.status === "IN_PROGRESS").length, resolved: t.filter((x: Ticket) => x.status === "RESOLVED").length });
      }).catch(() => {});
  }, [key]);

  if (key !== ADMIN_KEY) return <div className="mt-10 text-center"><Link href="/admin" className="btn-primary">Go to admin</Link></div>;

  const filtered = filter ? tickets.filter((t) => t.status === filter) : tickets;

  return (
    <div className="flex flex-col gap-6 py-4">
      <header className="flex items-center justify-between">
        <div><Link href={`/admin?key=${ADMIN_KEY}`} className="text-xs text-sakura-300">&larr; Admin</Link><h1 className="text-2xl font-black">CS Dashboard</h1></div>
      </header>
      <div className="grid gap-3 sm:grid-cols-4">
        {[{ l: "Open", v: stats.open, c: "text-red-300" }, { l: "In Progress", v: stats.inProgress, c: "text-orange-300" }, { l: "Resolved", v: stats.resolved, c: "text-emerald-300" }, { l: "Total", v: stats.total, c: "text-ink-100" }].map((s) => (
          <button key={s.l} onClick={() => setFilter(s.l === "Total" ? "" : s.l.toUpperCase().replace(" ", "_"))} className="card text-center hover:border-sakura-500/50">
            <div className={`text-2xl font-black ${s.c}`}>{s.v}</div><div className="text-xs text-ink-400">{s.l}</div>
          </button>
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-ink-400/20">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/80 text-xs uppercase text-ink-400"><tr><th className="px-3 py-2 text-left">Subject</th><th className="px-3 py-2">Category</th><th className="px-3 py-2">Status</th><th className="px-3 py-2">Email</th><th className="px-3 py-2">Date</th></tr></thead>
          <tbody>{filtered.map((t) => (
            <tr key={t.id} className="border-t border-ink-400/10">
              <td className="px-3 py-2 font-semibold">{t.subject}</td>
              <td className="px-3 py-2 text-center"><span className="chip">{t.category}</span></td>
              <td className="px-3 py-2 text-center"><span className={`chip ${t.status === "OPEN" ? "text-red-300 border-red-500/30" : t.status === "IN_PROGRESS" ? "text-orange-300 border-orange-500/30" : "text-emerald-300 border-emerald-500/30"}`}>{t.status}</span></td>
              <td className="px-3 py-2 text-xs text-ink-400">{t.email}</td>
              <td className="px-3 py-2 text-xs text-ink-400">{new Date(t.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

export default function AdminCSPage() { return <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}><CSInner /></Suspense>; }
