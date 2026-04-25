"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface Col { id: string; name: string; description: string | null; icon: string | null; wordCount: number }

export default function CollectionsPage() {
  const [cols, setCols] = useState<Col[]>([]);
  useEffect(() => { apiGet<{ collections: Col[] }>("/api/collections").then((r) => { if (r.ok && r.data) setCols(r.data.collections); }); }, []);

  return (
    <div className="flex flex-col gap-6 py-4">
      <header><h1 className="text-2xl font-black">Collections</h1><p className="text-sm text-ink-400">Curated themed vocabulary sets.</p></header>
      {cols.length === 0 && <p className="text-ink-400 text-sm">No collections yet. Check back soon!</p>}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cols.map((c) => (
          <Link key={c.id} href={`/collections/${c.id}`} className="card hover:border-sakura-500/50 transition">
            <div className="text-3xl">{c.icon ?? "📦"}</div>
            <h3 className="mt-2 font-bold">{c.name}</h3>
            {c.description && <p className="text-xs text-ink-400 mt-1">{c.description}</p>}
            <div className="mt-2 text-xs text-sakura-300">{c.wordCount} words</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
