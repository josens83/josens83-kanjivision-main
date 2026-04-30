"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, API_URL } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface SubInfo { tier: string; subscriptionPlan: string | null; subscriptionStatus: string | null; subscriptionEnd: string | null; autoRenewal: boolean }
interface Purchase { id: string; packageName: string; slug: string; amount: number; status: string; expiresAt: string; createdAt: string }

export default function MySubscriptionPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [sub, setSub] = useState<SubInfo | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiGet<SubInfo>("/api/paddle/subscription").then((r) => { if (r.ok && r.data) setSub(r.data); });
    apiGet<{ purchases: Purchase[] }>("/api/paddle/billing-history").then((r) => { if (r.ok && r.data) setPurchases(r.data.purchases); });
  }, [user]);

  async function handleCancel() {
    if (!confirm("Cancel your subscription? You'll keep access until the current billing period ends.")) return;
    setCancelling(true);
    const res = await apiPost("/api/paddle/cancel");
    setCancelling(false);
    if (res.ok) {
      setSub((s) => s ? { ...s, autoRenewal: false } : s);
      alert("Subscription cancelled. Access continues until your current period ends.");
    } else {
      alert("Failed to cancel. Please try again or contact support.");
    }
  }

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
        {sub?.subscriptionStatus === "ACTIVE" && sub?.autoRenewal && (
          <button onClick={handleCancel} disabled={cancelling} className="text-xs text-red-400 hover:underline self-start">
            {cancelling ? "Cancelling..." : "Cancel subscription"}
          </button>
        )}
      </div>

      <div className="card">
        <h2 className="font-bold">Level Packs</h2>
        <p className="text-sm text-ink-400 mt-1">One-time level packs you&apos;ve purchased.</p>
        <Link href="/packages" className="btn-ghost mt-3 !text-xs">Browse packs &rarr;</Link>
      </div>

      <div className="card flex flex-col gap-3">
        <h2 className="font-bold">Billing history</h2>
        {purchases.length === 0 ? (
          <p className="text-sm text-ink-400">No purchases yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {purchases.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg border border-ink-400/15 bg-ink-900/40 p-3">
                <div>
                  <div className="text-sm font-semibold">{p.packageName}</div>
                  <div className="text-xs text-ink-400">
                    {new Date(p.createdAt).toLocaleDateString()} &middot; Expires {new Date(p.expiresAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="text-sm font-bold">${(p.amount / 100).toFixed(2)}</div>
                  <span className={`text-[0.6rem] ${p.status === "ACTIVE" ? "text-emerald-300" : p.status === "REFUNDED" ? "text-red-300" : "text-ink-400"}`}>
                    {p.status}
                  </span>
                  <a
                    href={`${API_URL}/api/payments/receipt/${p.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[0.6rem] text-sakura-300 hover:underline"
                  >
                    Receipt
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
