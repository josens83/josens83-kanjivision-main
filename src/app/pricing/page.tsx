"use client";

import { PLANS, ONE_SHOT_PACKS, type Plan } from "@/lib/tiers";
import { useAppStore } from "@/lib/store";
import clsx from "clsx";
import Link from "next/link";

function Card({ plan, onSelect, current }: { plan: Plan; onSelect: (p: Plan) => void; current: string }) {
  const isCurrent = current === plan.tier;
  return (
    <div
      className={clsx(
        "card flex flex-col gap-4",
        plan.highlight && "border-sakura-500/60 bg-gradient-to-br from-sakura-500/10 to-ink-800"
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        {plan.highlight && <span className="chip bg-sakura-500/10 text-sakura-200 border-sakura-500/40">Popular</span>}
      </div>
      <div>
        <div className="text-3xl font-black">{plan.price}</div>
        {plan.priceKRW && <div className="text-xs text-ink-400">{plan.priceKRW}</div>}
      </div>
      <p className="text-sm text-ink-400">{plan.blurb}</p>
      <ul className="flex flex-col gap-1.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span className="text-sakura-400">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        className={clsx(plan.highlight ? "btn-primary" : "btn-ghost", "mt-auto")}
        onClick={() => onSelect(plan)}
        disabled={isCurrent}
      >
        {isCurrent ? "Current plan" : plan.tier === "free" ? "Continue free" : "Choose"}
      </button>
    </div>
  );
}

export default function PricingPage() {
  const user = useAppStore((s) => s.user);
  const upgrade = useAppStore((s) => s.upgrade);
  const signIn = useAppStore((s) => s.signIn);

  async function handleSelect(plan: Plan) {
    if (!user) {
      const email = prompt("Enter your email to continue");
      if (!email) return;
      signIn(email);
    }
    // In production this hits POST /api/subscribe which opens Paddle/Toss checkout.
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ planId: plan.id }),
    }).then((r) => r.json());

    if (res.ok) {
      upgrade(plan.tier);
      alert(`✅ ${plan.name} activated (demo mode). Production would redirect to ${res.processor} checkout.`);
    }
  }

  return (
    <div className="flex flex-col gap-12 py-6">
      <header className="text-center">
        <h1 className="text-3xl font-black sm:text-4xl">Simple plans, honest pricing</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm text-ink-400">
          Service-level fixed cost is $2.67/mo (shared infra with VocaVision &
          HangeulVision). Any paid user puts us in the black — so prices stay low.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {PLANS.map((p) => (
          <Card key={p.id} plan={p} onSelect={handleSelect} current={user?.tier ?? "free"} />
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-xl font-bold">One-shot level packs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {ONE_SHOT_PACKS.map((p) => (
            <Card key={p.id} plan={p} onSelect={handleSelect} current={user?.tier ?? "free"} />
          ))}
        </div>
      </section>

      <section className="card">
        <h3 className="font-bold">Vision Platform bundles</h3>
        <p className="mt-1 text-sm text-ink-400">
          Combine with sister services for a discount.
        </p>
        <ul className="mt-3 text-sm">
          <li>2× Premium: <b>$12.99/mo</b> (save 19%)</li>
          <li>3× Premium (VocaVision + HangeulVision + KanjiVision): <b>$17.99/mo</b> (save 25%)</li>
        </ul>
        <Link className="btn-ghost mt-3" href="https://vocavision.app/bundles">
          Set up bundle →
        </Link>
      </section>

      <section className="text-center text-xs text-ink-400">
        All subscriptions are processed through <b>Paddle</b> (global) or{" "}
        <b>TossPayments</b> (Korea). Cancel anytime. 7-day refund on first
        subscription.
      </section>
    </div>
  );
}
