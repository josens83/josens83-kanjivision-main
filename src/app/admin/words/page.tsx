"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";
import { EXAM_LEVELS, type ExamCategory } from "@/data/words";

const ADMIN_KEY = "dohurnk1006";
const PAGE_SIZE = 20;

interface ServerWord {
  id: string;
  lemma: string;
  reading: string;
  meaning: string;
  examCategory: string;
  type: string;
  category: string | null;
  createdAt: string;
  kanjiParts: Array<{ char: string }>;
}

interface ListResponse {
  count: number;
  total: number;
  nextCursor: string | null;
  data: ServerWord[];
}

function WordsInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const authed = key === ADMIN_KEY;

  const [words, setWords] = useState<ServerWord[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [examFilter, setExamFilter] = useState<string>("");

  const loadWords = useCallback(
    async (nextCursor?: string | null) => {
      setLoading(true);
      const qs = new URLSearchParams({ take: String(PAGE_SIZE) });
      if (examFilter) qs.set("exam", examFilter);
      if (search.trim()) qs.set("search", search.trim());
      if (nextCursor) qs.set("cursor", nextCursor);
      try {
        const res = await fetch(`${API_URL}/api/words?${qs.toString()}`);
        const data: ListResponse = await res.json();
        if (nextCursor) {
          setWords((prev) => [...prev, ...data.data]);
        } else {
          setWords(data.data);
        }
        setTotal(data.total);
        setCursor(data.nextCursor);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    },
    [examFilter, search]
  );

  useEffect(() => {
    if (authed) loadWords();
  }, [authed, loadWords]);

  if (!authed) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <h1 className="text-xl font-black">Unauthorized</h1>
        <Link href="/admin" className="btn-primary mt-4">
          Go to admin login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 py-4">
      <header className="flex items-center justify-between">
        <div>
          <Link
            href={`/admin?key=${ADMIN_KEY}`}
            className="text-xs text-sakura-300 hover:underline"
          >
            &larr; Dashboard
          </Link>
          <h1 className="text-2xl font-black">Word list</h1>
          <p className="text-sm text-ink-400">{total} total</p>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
          placeholder="Search lemma / reading / meaning..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") loadWords();
          }}
        />
        <select
          className="rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
          value={examFilter}
          onChange={(e) => setExamFilter(e.target.value)}
        >
          <option value="">All levels</option>
          {EXAM_LEVELS.map((lv) => (
            <option key={lv.id} value={lv.id}>
              {lv.label}
            </option>
          ))}
        </select>
        <button className="btn-ghost !py-2 !text-xs" onClick={() => loadWords()}>
          Search
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-ink-400/20">
        <table className="w-full text-sm">
          <thead className="bg-ink-800/80 text-xs uppercase text-ink-400">
            <tr>
              <th className="px-3 py-2 text-left">Lemma</th>
              <th className="px-3 py-2 text-left">Reading</th>
              <th className="px-3 py-2 text-left">Meaning</th>
              <th className="px-3 py-2 text-left">Exam</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Kanji</th>
              <th className="px-3 py-2 text-left">Created</th>
              <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {words.map((w) => (
              <tr key={w.id} className="border-t border-ink-400/10">
                <td className="px-3 py-2 font-bold">{w.lemma}</td>
                <td className="px-3 py-2 text-ink-400">{w.reading}</td>
                <td className="px-3 py-2">{w.meaning}</td>
                <td className="px-3 py-2">{w.examCategory.replace("_", " ")}</td>
                <td className="px-3 py-2">{w.type}</td>
                <td className="px-3 py-2 text-sakura-200">
                  {w.kanjiParts?.map((k) => k.char).join(" ") || "—"}
                </td>
                <td className="px-3 py-2 text-xs text-ink-400">
                  {new Date(w.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3 py-2">
                  <div className="flex gap-2">
                    <Link href={`/words/${w.id}`} className="text-xs text-sakura-300 hover:underline">View</Link>
                    <button
                      className="text-xs text-red-400 hover:underline"
                      onClick={async () => {
                        if (!confirm(`Delete "${w.lemma}"?`)) return;
                        await fetch(`${API_URL}/api/admin/words/${w.id}`, {
                          method: "DELETE",
                          headers: { Authorization: `Bearer placeholder` },
                        });
                        setWords((prev) => prev.filter((x) => x.id !== w.id));
                        setTotal((t) => t - 1);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {words.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="px-3 py-6 text-center text-ink-400">
                  No words found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Load more */}
      {cursor && (
        <button
          className="btn-ghost mx-auto"
          disabled={loading}
          onClick={() => loadWords(cursor)}
        >
          {loading ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
}

export default function AdminWordsPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}>
      <WordsInner />
    </Suspense>
  );
}
