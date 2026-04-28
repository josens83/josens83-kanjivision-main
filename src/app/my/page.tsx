"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface SubInfo { tier: string; subscriptionPlan: string | null; subscriptionStatus: string | null; subscriptionEnd: string | null; autoRenewal: boolean }

export default function MySubscriptionPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [sub, setSub] = useState<SubInfo | null>(null);

  useEffect(() => {
    if (!user) return;
    apiGet<SubInfo>("/api/paddle/subscription").then((r) => { if (r.ok && r.data) setSub(r.data); });
  }, [user]);

  if (!user) return <div className="card mx-auto mt-10 max-w-md text-center"><h1 className="text-xl font-bold">Sign in</h1><button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/my")}>Sign in</button></div>;

  const tierLabel = sub?.tier === "PREMIUM" ? "Premium" : sub?.tier === "BASIC" ? "Basic" : "Free";
  const statusColor = sub?.subscriptionStatus === "ACTIVE" ? "text-emerald-300" : sub?.subscriptionStatus === "CANCELLED" ? "text-orange-300" : "text-ink-400";

  return (
    <div className="mx-auto max-w-lg py-6 flex flex-col gap-6">
      <header><h1 className="text-2xl font-black">My Subscription</h1></header>
      <div className="card flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div><div className="text-xs uppercase tracking-widest text-ink-400">Current plan</div><div className="text-2xl font-black text-sakura-300">{tierLabel}</div></div>
          {sub?.subscriptionStatus && <span className={`chip ${statusColor}`}>{sub.subscriptionStatus}</span>}
        </div>
        {sub?.subscriptionEnd && <div className="text-sm text-ink-400">Next billing: {new Date(sub.subscriptionEnd).toLocaleDateString()}</div>}
        {sub?.autoRenewal !== undefined && <div className="text-sm text-ink-400">Auto-renewal: {sub.autoRenewal ? "On" : "Off"}</div>}
        <div className="flex gap-3">
          {tierLabel !== "Premium" && <Link href="/pricing" className="btn-primary flex-1 text-center">Upgrade plan</Link>}
          <Link href="/settings" className="btn-ghost flex-1 text-center">Settings</Link>
        </div>
      </div>
      <div className="card">
        <h2 className="font-bold">Level Packs</h2>
        <p className="text-sm text-ink-400 mt-1">One-time level packs you&apos;ve purchased.</p>
        <Link href="/packages" className="btn-ghost mt-3 !text-xs">Browse packs &rarr;</Link>
      </div>
      <div className="card"><h2 className="font-bold">Billing history</h2><p className="text-sm text-ink-400 mt-1">Payment history will appear here once you subscribe.</p></div>
    </div>
  );
}
