import { NextRequest, NextResponse } from "next/server";
import { WORDS, type ExamCategory } from "@/data/words";

export const runtime = "edge";

export function GET(req: NextRequest) {
  const level = req.nextUrl.searchParams.get("level") as ExamCategory | null;
  const data = level ? WORDS.filter((w) => w.examCategory === level) : WORDS;
  return NextResponse.json({ count: data.length, data });
}
