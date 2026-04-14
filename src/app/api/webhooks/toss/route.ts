import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/** TossPayments webhook — Phase 2 will verify the signature and update users. */
export async function POST(req: NextRequest) {
  const event = await req.json().catch(() => ({}));
  // eslint-disable-next-line no-console
  console.log("[toss] event", event?.eventType ?? "unknown");
  return NextResponse.json({ received: true });
}
