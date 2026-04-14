"use client";

import Link from "next/link";
import type { Tier } from "@/lib/tiers";

interface Props {
  required: Tier;
  currentTier: Tier;
  levelLabel: string;
  children: React.ReactNode;
}

const RANK: Record<Tier, number> = { free: 0, basic: 1, premium: 2 };

export function PaywallGate({ required, currentTier, levelLabel, children }: Props) {
  if (RANK[currentTier] >= RANK[required]) return <>{children}</>;

  return (
    <div className="card flex flex-col items-center gap-4 py-10 text-center">
      <span className="chip bg-sakura-500/10 border-sakura-500/40 text-sakura-200">
        🔒 {required === "basic" ? "Basic" : "Premium"} required
      </span>
      <h2 className="text-2xl font-bold">{levelLabel} is locked</h2>
      <p className="max-w-md text-sm text-ink-400">
        Upgrade your plan to unlock full vocabulary lists, AI example sentences,
        and offline PWA review.
      </p>
      <Link href="/pricing" className="btn-primary">
        See plans
      </Link>
    </div>
  );
}
