import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Paddle webhook endpoint.
 * Phase 1: logs the event and returns 200.
 * Phase 2: verify signature (Paddle-Signature header), update user tier in DB.
 */
export async function POST(req: NextRequest) {
  const event = await req.json().catch(() => ({}));
  // eslint-disable-next-line no-console
  console.log("[paddle] event", event?.event_type ?? "unknown");
  return NextResponse.json({ received: true });
}
