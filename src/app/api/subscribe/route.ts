import { NextRequest, NextResponse } from "next/server";
import { PLANS, ONE_SHOT_PACKS } from "@/lib/tiers";

export const runtime = "edge";

/**
 * Creates a checkout session.
 *
 * Phase 1 (now): returns a stub response the client uses to simulate success.
 * Phase 2: routes to Paddle (global) or TossPayments (KR) based on `region`.
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { planId, region } = body as { planId?: string; region?: "global" | "kr" };
  if (!planId) {
    return NextResponse.json({ ok: false, error: "planId required" }, { status: 400 });
  }

  const plan = [...PLANS, ...ONE_SHOT_PACKS].find((p) => p.id === planId);
  if (!plan) {
    return NextResponse.json({ ok: false, error: "unknown plan" }, { status: 404 });
  }

  const processor = region === "kr" ? "toss" : "paddle";
  const productEnv = plan.paddleProductEnv;
  const productId = productEnv ? process.env[productEnv] : undefined;

  // In production: call Paddle /v2/transactions or Toss /v1/payments to get a URL.
  // For Phase 1 we return a demo payload so the UI can finish the flow.
  return NextResponse.json({
    ok: true,
    processor,
    plan: { id: plan.id, name: plan.name, price: plan.price, tier: plan.tier },
    productId: productId ?? null,
    checkoutUrl: null,
    demo: true,
  });
}
