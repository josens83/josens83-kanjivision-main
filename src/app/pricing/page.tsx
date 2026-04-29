"use client";

import { useState } from "react";
import Script from "next/script";
import Link from "next/link";
import clsx from "clsx";
import { useAppStore } from "@/lib/store";
import { apiPost, API_URL } from "@/lib/api";
import { useRouter } from "next/navigation";

const PLANS = [
  {
    id: "free",
    name: "Free",
    monthly: "$0",
    yearly: "$0",
    levels: "N5",
    features: ["800 N5 words", "Kanji decomposition", "SM-2 spaced repetition", "AI mnemonics"],
  },
  {
    id: "basic",
    name: "Basic",
    monthly: "$4.99",
    yearly: "$49.99",
    levels: "N5 + N4 + N3",
    features: ["Everything in Free", "N4 — 1,500 words", "N3 — 3,750 words", "Quiz mode"],
    highlight: false,
  },
  {
    id: "premium",
    name: "Premium",
    monthly: "$7.99",
    yearly: "$79.99",
    levels: "N5 → N1",
    features: ["Everything in Basic", "10,000 words total", "N3 / N2 / N1 decks", "AI example sentences", "Priority support"],
    highlight: true,
  },
];

export default function PricingPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [yearly, setYearly] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleSubscribe(plan: string) {
    if (!user) {
      router.push(`/signup?next=/pricing`);
      return;
    }
    if (plan === "free") return;

    setLoading(plan);
    const res = await apiPost<{ transactionId: string }>("/api/paddle/create-checkout", {
      plan,
      billingCycle: yearly ? "yearly" : "monthly",
    });
    setLoading(null);

    if (!res.ok || !res.data?.transactionId) {
      alert(res.error ?? "Could not create checkout. Paddle may not be configured yet.");
      return;
    }

    const Paddle = (window as any).Paddle;
    if (Paddle?.Checkout) {
      Paddle.Checkout.open({
        transactionId: res.data.transactionId,
        successCallback: () => router.push("/dashboard?subscribed=true"),
      });
    } else {
      alert("Paddle.js not loaded. Please refresh and try again.");
    }
  }

  return (
    <div className="flex flex-col gap-10 py-6">
      <Script
        src="https://cdn.paddle.com/paddle/v2/paddle.js"
        strategy="lazyOnload"
      />

      <header className="text-center">
        <h1 className="text-3xl font-black sm:text-4xl">Simple plans, honest pricing</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-400">
          Start free with N5. Upgrade when you&apos;re ready for N4 → N1.
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-ink-400/30 p-1">
          <button
            onClick={() => setYearly(false)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              !yearly ? "bg-sakura-500 text-white" : "text-ink-400"
            )}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-xs font-semibold transition",
              yearly ? "bg-sakura-500 text-white" : "text-ink-400"
            )}
          >
            Yearly <span className="text-emerald-300">-17%</span>
          </button>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <div
            key={p.id}
            className={clsx(
              "card flex flex-col gap-4",
              p.highlight && "border-sakura-500/60 bg-gradient-to-br from-sakura-500/10 to-ink-800"
            )}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold">{p.name}</h3>
              {p.highlight && <span className="chip bg-sakura-500/10 text-sakura-200 border-sakura-500/40">Popular</span>}
            </div>
            <div>
              <div className="text-3xl font-black">
                {yearly ? p.yearly : p.monthly}
                {p.id !== "free" && <span className="text-sm font-normal text-ink-400">/{yearly ? "yr" : "mo"}</span>}
              </div>
              <div className="text-xs text-ink-400">{p.levels}</div>
            </div>
            <ul className="flex flex-col gap-1.5 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span className="text-sakura-400">✓</span>{f}
                </li>
              ))}
            </ul>
            <button
              className={clsx(p.highlight ? "btn-primary" : "btn-ghost", "mt-auto")}
              onClick={() => handleSubscribe(p.id)}
              disabled={loading === p.id || (user?.tier === "premium" && p.id === "premium") || (user?.tier === "basic" && p.id === "basic")}
            >
              {loading === p.id ? "Loading..." : p.id === "free" ? "Current plan" : user?.tier === p.id ? "Current plan" : "Subscribe"}
            </button>
          </div>
        ))}
      </section>

      <section className="card">
        <h3 className="font-bold">Vision Platform bundles</h3>
        <p className="mt-1 text-sm text-ink-400">
          Combine with VocaVision (English) or HangeulVision (Korean) for a discount.
        </p>
        <ul className="mt-3 text-sm">
          <li>2× Premium: <b>$12.99/mo</b> (save 19%)</li>
          <li>3× Premium: <b>$17.99/mo</b> (save 25%)</li>
        </ul>
      </section>

      <section className="text-center text-xs text-ink-400">
        Subscriptions processed through <b>Paddle</b>. Cancel anytime. 7-day refund on first subscription.
      </section>
    </div>
  );
}
