"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { apiGet } from "@/lib/api";

interface Pkg { id: string; name: string; nameEn: string | null; slug: string; shortDesc: string | null; price: number; priceGlobal: string | null; originalPrice: number | null; durationDays: number; badge: string | null; badgeColor: string | null; imageUrl: string | null; isComingSoon: boolean; wordCount: number }

export default function PackagesPage() {
  const [pkgs, setPkgs] = useState<Pkg[]>([]);
  useEffect(() => { apiGet<{ packages: Pkg[] }>("/api/packages").then((r) => { if (r.ok && r.data) setPkgs(r.data.packages); }); }, []);

  return (
    <div className="flex flex-col gap-6 py-4">
      <header>
        <h1 className="text-2xl font-black">Level Packs</h1>
        <p className="text-sm text-ink-400">One-time purchase. 6 months access. No subscription required.</p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pkgs.map((p) => (
          <Link key={p.id} href={`/packages/${p.slug}`} className="card hover:border-sakura-500/50 transition flex flex-col gap-3">
            {p.badge && <span className="chip w-fit" style={{ borderColor: p.badgeColor ?? undefined, color: p.badgeColor ?? undefined }}>{p.badge}</span>}
            <h3 className="text-xl font-bold">{p.nameEn ?? p.name}</h3>
            {p.shortDesc && <p className="text-xs text-ink-400">{p.shortDesc}</p>}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-sakura-300">${p.priceGlobal ?? (p.price / 100).toFixed(2)}</span>
              {p.originalPrice && <span className="text-sm text-ink-400 line-through">${(p.originalPrice / 100).toFixed(2)}</span>}
            </div>
            <div className="text-xs text-ink-400">{p.wordCount} words &middot; {p.durationDays} days access</div>
            {p.isComingSoon ? (
              <span className="btn-ghost mt-auto text-center opacity-60">Coming Soon</span>
            ) : (
              <span className="btn-primary mt-auto text-center">View Pack</span>
            )}
          </Link>
        ))}
        {pkgs.length === 0 && <p className="text-ink-400">No packs available yet.</p>}
      </div>
    </div>
  );
}
