"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { apiGet, apiPost } from "@/lib/api";
import { EXAM_LEVELS, type ExamCategory } from "@/data/words";
import { useAppStore } from "@/lib/store";

interface Question {
  wordId: string;
  word: string;
  reading: string;
  options: string[];
  correctIndex: number;
}

interface QuizResult {
  wordId: string;
  word?: string;
  correct: boolean;
  correctAnswer: string;
}

interface SubmitResponse {
  score: number;
  total: number;
  percentage: number;
  results: QuizResult[];
}

type Phase = "setup" | "playing" | "feedback" | "done";

export default function QuizPage() {
  const user = useAppStore((s) => s.user);
  const [phase, setPhase] = useState<Phase>("setup");
  const [exam, setExam] = useState<ExamCategory>("JLPT_N5");
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Array<{ wordId: string; selectedIndex: number }>>([]);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function startQuiz() {
    setLoading(true);
    const res = await apiGet<{ questions: Question[] }>(
      `/api/quiz/questions?exam=${exam}&count=${count}`
    );
    setLoading(false);
    if (!res.ok || !res.data || res.data.questions.length === 0) return;
    setQuestions(res.data.questions);
    setQi(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
    setPhase("playing");
  }

  function selectOption(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const q = questions[qi];
    setAnswers((prev) => [...prev, { wordId: q.wordId, selectedIndex: idx }]);
    setPhase("feedback");

    setTimeout(() => {
      if (qi + 1 >= questions.length) {
        submitAnswers([...answers, { wordId: q.wordId, selectedIndex: idx }]);
      } else {
        setQi((i) => i + 1);
        setSelected(null);
        setPhase("playing");
      }
    }, 1500);
  }

  async function submitAnswers(finalAnswers: typeof answers) {
    setLoading(true);
    const res = await apiPost<SubmitResponse>("/api/quiz/submit", {
      answers: finalAnswers,
      exam,
    });
    setLoading(false);
    if (res.ok && res.data) {
      setResult(res.data);
    }
    setPhase("done");
  }

  // --- 시작 화면 ---
  if (phase === "setup") {
    return (
      <div className="mx-auto max-w-md py-10">
        <h1 className="text-2xl font-black text-center">Quiz</h1>
        <p className="mt-1 text-center text-sm text-ink-400">
          일본어 단어의 영어 뜻을 4지선다로 맞춰보세요.
        </p>
        <div className="card mt-6 flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">JLPT 레벨</label>
            <select
              className="mt-1 block w-full rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
              value={exam}
              onChange={(e) => setExam(e.target.value as ExamCategory)}
            >
              {EXAM_LEVELS.map((lv) => (
                <option key={lv.id} value={lv.id}>{lv.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">문제 수</label>
            <div className="mt-1 flex gap-2">
              {[5, 10, 15].map((n) => (
                <button
                  key={n}
                  onClick={() => setCount(n)}
                  className={clsx(
                    "flex-1 rounded-lg py-2 text-sm font-semibold transition",
                    count === n
                      ? "bg-sakura-500 text-white"
                      : "border border-ink-400/30 text-ink-100 hover:bg-ink-800"
                  )}
                >
                  {n}문제
                </button>
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={startQuiz} disabled={loading}>
            {loading ? "로딩 중..." : "시작"}
          </button>
        </div>
      </div>
    );
  }

  // --- 결과 화면 ---
  if (phase === "done") {
    const pct = result?.percentage ?? 0;
    return (
      <div className="mx-auto max-w-md py-10">
        <div className="card text-center">
          <div className="text-5xl">
            {pct >= 80 ? "!!" : pct >= 50 ? "OK" : "..."}
          </div>
          <h2 className="mt-3 text-2xl font-black">퀴즈 완료</h2>
          <p className="mt-2 text-ink-400">
            {result?.score ?? 0} / {result?.total ?? 0} 정답 &middot;{" "}
            <span className={pct >= 80 ? "text-emerald-300" : pct >= 50 ? "text-orange-300" : "text-red-300"}>
              {pct}%
            </span>
          </p>
          <div className="mx-auto mt-4 h-3 w-48 overflow-hidden rounded-full bg-ink-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sakura-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>

          {/* 오답 리뷰 */}
          {result && result.results.filter((r) => !r.correct).length > 0 && (
            <div className="mt-6 text-left">
              <h3 className="text-sm font-bold text-ink-400">오답 리뷰</h3>
              <ul className="mt-2 flex flex-col gap-2">
                {result.results.filter((r) => !r.correct).map((r) => (
                  <li key={r.wordId} className="rounded-lg border border-red-500/20 bg-red-500/5 p-2 text-sm">
                    <span className="font-bold">{r.word ?? r.wordId}</span>
                    <span className="text-ink-400"> &rarr; </span>
                    <span className="text-emerald-300">{r.correctAnswer}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button className="btn-primary" onClick={() => { setPhase("setup"); setResult(null); }}>
              다시 도전
            </button>
            <Link href="/dashboard" className="btn-ghost">대시보드</Link>
          </div>
        </div>
      </div>
    );
  }

  // --- 문제 화면 ---
  const q = questions[qi];
  const isCorrect = selected !== null && selected === q.correctIndex;

  return (
    <div className="mx-auto max-w-md py-6">
      {/* 진행 바 */}
      <div className="mb-2 flex items-center justify-between text-sm text-ink-400">
        <span>{qi + 1} / {questions.length}</span>
        <span>{exam.replace("_", " ")}</span>
      </div>
      <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-ink-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-sakura-500 to-sakura-300 transition-all duration-300"
          style={{ width: `${((qi + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* 단어 */}
      <div className="card mb-4 text-center">
        <ruby className="text-4xl font-bold">
          {q.word}<rt className="text-base">{q.reading}</rt>
        </ruby>
        <p className="mt-2 text-xs text-ink-400">이 단어의 뜻은?</p>
      </div>

      {/* 선택지 */}
      <div className="flex flex-col gap-2">
        {q.options.map((opt, idx) => {
          let cls = "border border-ink-400/30 text-ink-100 hover:bg-ink-800";
          if (selected !== null) {
            if (idx === q.correctIndex) {
              cls = "border-emerald-500 bg-emerald-500/20 text-emerald-200";
            } else if (idx === selected && !isCorrect) {
              cls = "border-red-500 bg-red-500/20 text-red-200";
            } else {
              cls = "border-ink-400/10 text-ink-400/50";
            }
          }
          return (
            <button
              key={idx}
              onClick={() => selectOption(idx)}
              disabled={selected !== null}
              className={clsx(
                "rounded-xl px-4 py-3 text-left text-sm font-medium transition",
                cls
              )}
            >
              <span className="mr-2 text-xs text-ink-400">{idx + 1}</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* 피드백 */}
      {selected !== null && (
        <div className={clsx(
          "mt-4 rounded-xl p-3 text-center text-sm font-semibold",
          isCorrect ? "bg-emerald-500/10 text-emerald-300" : "bg-red-500/10 text-red-300"
        )}>
          {isCorrect ? "정답!" : `오답 — 정답: ${q.options[q.correctIndex]}`}
        </div>
      )}
    </div>
  );
}
