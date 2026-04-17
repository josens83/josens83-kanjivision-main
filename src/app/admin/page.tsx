"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { API_URL } from "@/lib/api";
import { EXAM_LEVELS } from "@/data/words";

const ADMIN_KEY = "dohurnk1006";

interface WordCount {
  total: number;
  byExam: Record<string, number>;
}

interface GenerateResult {
  ok: boolean;
  requested?: number;
  received?: number;
  created?: number;
  skipped?: number;
  errors?: string[];
  error?: string;
}

function AdminInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const [stats, setStats] = useState<WordCount | null>(null);
  const [loading, setLoading] = useState(false);
  const [genResult, setGenResult] = useState<GenerateResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genExam, setGenExam] = useState("JLPT_N5");
  const [genCount, setGenCount] = useState(10);
  const [genCategory, setGenCategory] = useState("");

  useEffect(() => {
    if (key === ADMIN_KEY) setAuthed(true);
  }, [key]);

  useEffect(() => {
    if (!authed) return;
    setLoading(true);
    fetch(`${API_URL}/api/words/count`)
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, [authed, genResult]);

  async function handleGenerate() {
    setGenerating(true);
    setGenResult(null);
    const qs = new URLSearchParams({
      key: ADMIN_KEY,
      exam: genExam,
      count: String(genCount),
    });
    if (genCategory) qs.set("category", genCategory);
    try {
      const res = await fetch(
        `${API_URL}/api/internal/generate-words?${qs.toString()}`
      );
      const data = await res.json();
      setGenResult(data);
    } catch (err) {
      setGenResult({
        ok: false,
        error: err instanceof Error ? err.message : "network error",
      });
    } finally {
      setGenerating(false);
    }
  }

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm py-16">
        <h1 className="text-2xl font-black">Admin</h1>
        <p className="mt-1 text-sm text-ink-400">Enter the admin key to continue.</p>
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (keyInput === ADMIN_KEY) setAuthed(true);
          }}
        >
          <input
            className="flex-1 rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
            type="password"
            placeholder="Admin key"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
          />
          <button className="btn-primary !py-2">Enter</button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-4">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-sakura-300">Admin</p>
          <h1 className="text-3xl font-black">Content dashboard</h1>
        </div>
        <Link href={`/admin/words?key=${ADMIN_KEY}`} className="btn-ghost !text-xs">
          Word list &rarr;
        </Link>
      </header>

      {/* Stats */}
      <section className="grid gap-3 sm:grid-cols-6">
        <div className="card text-center sm:col-span-1">
          <div className="text-xs uppercase tracking-widest text-ink-400">Total</div>
          <div className="mt-1 text-2xl font-black text-sakura-300">
            {loading ? "..." : stats?.total ?? "—"}
          </div>
        </div>
        {EXAM_LEVELS.map((lv) => (
          <div key={lv.id} className="card text-center">
            <div className="text-xs uppercase tracking-widest text-ink-400">
              {lv.label.split(" ")[0]}
            </div>
            <div className="mt-1 text-2xl font-black">
              {loading ? "..." : stats?.byExam?.[lv.id] ?? 0}
            </div>
            <div className="text-xs text-ink-400">/ {lv.words.toLocaleString()}</div>
          </div>
        ))}
      </section>

      {/* Generate */}
      <section className="card">
        <h2 className="font-bold">Generate words (Claude AI)</h2>
        <p className="mt-1 text-sm text-ink-400">
          Calls POST /api/internal/generate-words with the Claude API.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">Exam</label>
            <select
              className="mt-1 block w-full rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
              value={genExam}
              onChange={(e) => setGenExam(e.target.value)}
            >
              {EXAM_LEVELS.map((lv) => (
                <option key={lv.id} value={lv.id}>
                  {lv.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">Count</label>
            <input
              className="mt-1 block w-20 rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
              type="number"
              min={1}
              max={25}
              value={genCount}
              onChange={(e) => setGenCount(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">Category (opt)</label>
            <input
              className="mt-1 block w-32 rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
              placeholder="e.g. food"
              value={genCategory}
              onChange={(e) => setGenCategory(e.target.value)}
            />
          </div>
          <button
            className="btn-primary !py-2"
            disabled={generating}
            onClick={handleGenerate}
          >
            {generating ? "Generating..." : `Generate ${genCount} words`}
          </button>
        </div>

        {genResult && (
          <div
            className={`mt-4 rounded-xl border p-4 text-sm ${
              genResult.ok
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                : "border-red-500/30 bg-red-500/10 text-red-200"
            }`}
          >
            {genResult.ok ? (
              <>
                <div className="font-bold">
                  Created {genResult.created} / Received {genResult.received} / Skipped{" "}
                  {genResult.skipped}
                </div>
                {genResult.errors && genResult.errors.length > 0 && (
                  <ul className="mt-2 list-inside list-disc text-xs text-ink-400">
                    {genResult.errors.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div>{genResult.error ?? "Generation failed"}</div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}>
      <AdminInner />
    </Suspense>
  );
}
