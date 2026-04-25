"use client";
import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { apiGet, apiPost } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface Q { wordId: string; word: string; reading: string; options: string[]; correctIndex: number; level: string }
interface Result { score: number; total: number; percentage: number; recommendedLevel: string }
type Phase = "intro" | "test" | "result";

export default function StudyPage() {
  const user = useAppStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Q[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ wordId: string; selectedIndex: number }>>([]);
  const [result, setResult] = useState<Result | null>(null);

  async function start() {
    const res = await apiGet<{ questions: Q[] }>("/api/quiz/level-test");
    if (res.ok && res.data) { setQuestions(res.data.questions); setQi(0); setAnswers([]); setPhase("test"); }
  }

  function pick(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const a = [...answers, { wordId: questions[qi].wordId, selectedIndex: idx }];
    setAnswers(a);
    setTimeout(() => {
      if (qi + 1 >= questions.length) submit(a);
      else { setQi((i) => i + 1); setSelected(null); }
    }, 800);
  }

  async function submit(a: typeof answers) {
    const res = await apiPost<Result>("/api/quiz/level-test/submit", { answers: a });
    if (res.ok && res.data) setResult(res.data);
    setPhase("result");
  }

  if (phase === "intro") return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card"><div className="text-5xl mb-4">📝</div><h1 className="text-2xl font-black">Find your JLPT level</h1>
        <p className="mt-2 text-sm text-ink-400">20 questions across N5→N1. Takes about 3-5 minutes.</p>
        <button className="btn-primary mt-6" onClick={start}>Start Test</button>
        {!user && <p className="mt-3 text-xs text-ink-400"><Link href="/signin?next=/study" className="text-sakura-300 underline">Sign in</Link> to save your result.</p>}
      </div>
    </div>
  );

  if (phase === "result") return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="card"><h1 className="text-2xl font-black">Your level: {result?.recommendedLevel ?? "N5"}</h1>
        <p className="mt-2 text-ink-400">{result?.score}/{result?.total} correct ({result?.percentage}%)</p>
        <div className="mt-4 mx-auto h-3 w-48 overflow-hidden rounded-full bg-ink-800">
          <div className="h-full rounded-full bg-gradient-to-r from-sakura-500 to-emerald-400" style={{ width: `${result?.percentage ?? 0}%` }} />
        </div>
        <Link href={`/learn?level=JLPT_${result?.recommendedLevel ?? "N5"}`} className="btn-primary mt-6">Start learning at {result?.recommendedLevel ?? "N5"}</Link>
      </div>
    </div>
  );

  const q = questions[qi];
  return (
    <div className="mx-auto max-w-md py-6">
      <div className="mb-4 flex justify-between text-sm text-ink-400"><span>{qi + 1}/{questions.length}</span><span>Level Test</span></div>
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-ink-800"><div className="h-full rounded-full bg-sakura-500 transition-all" style={{ width: `${((qi + 1) / questions.length) * 100}%` }} /></div>
      <div className="card mb-4 text-center"><ruby className="text-4xl font-bold">{q.word}<rt>{q.reading}</rt></ruby></div>
      <div className="flex flex-col gap-2">
        {q.options.map((o, i) => (
          <button key={i} onClick={() => pick(i)} disabled={selected !== null}
            className={clsx("rounded-xl px-4 py-3 text-left text-sm transition border",
              selected === null ? "border-ink-400/30 hover:bg-ink-800" : i === q.correctIndex ? "border-emerald-500 bg-emerald-500/20" : i === selected ? "border-red-500 bg-red-500/20" : "border-ink-400/10 opacity-50"
            )}>{o}</button>
        ))}
      </div>
    </div>
  );
}
