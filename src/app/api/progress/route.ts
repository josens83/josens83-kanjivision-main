import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * Progress sync — Phase 1 no-op; Phase 2 persists to Supabase per user.
 * Body: { userId, progress: Record<wordId, SrsState> }
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const count = body?.progress ? Object.keys(body.progress).length : 0;
  return NextResponse.json({ ok: true, synced: count, mode: "stub" });
}

export function GET() {
  return NextResponse.json({ ok: true, progress: {}, mode: "stub" });
}
