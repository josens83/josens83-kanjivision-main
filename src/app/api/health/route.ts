import { NextResponse } from "next/server";

export const runtime = "edge";

export function GET() {
  return NextResponse.json({
    service: "kanjivision-api",
    status: "ok",
    time: new Date().toISOString(),
  });
}
