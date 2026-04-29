"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiGet } from "@/lib/api";

interface WordItem { id: string; lemma: string; reading: string; meaning: string; examCategory: string; partOfSpeech?: string; mnemonicImages?: Array<{ url: string }> }
interface ListRes { count: number; total: number; nextCursor: string | null; data: WordItem[] }

export default function LevelBrowsePage() {
  const params = useParams();
  const level = params?.level as string ?? "JLPT_N5";
  const [words, setWords] = useState<WordItem[]>([]);
  const [total, setTotal] = useState(0);
  const [cursor, setCursor] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const load = useCallback(async (c?: string | null) => {
    setLoading(true);
    const qs = new URLSearchParams({ exam: level, take: "20" });
    if (search.trim()) qs.set("search", search.trim());
    if (c) qs.set("cursor", c);
    const res = await apiGet<ListRes>(`/api/words?${qs}`);
    if (res.ok && res.data) {
      setWords(c ? (p) => [...p, ...res.data!.data] : res.data.data);
      setTotal(res.data.total);
      setCursor(res.data.nextCursor);
    }
    setLoading(false);
  }, [level, search]);

  useEffect(() => { load(); }, [load]);

  function onSearchChange(val: string) {
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => load(), 300);
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <header>
        <Link href="/vocabulary" className="text-xs text-sakura-300 hover:underline" aria-label="Back to all levels">&larr; All levels</Link>
        <h1 className="text-2xl font-black">{level.replace("_", " ")}</h1>
        <p className="text-sm text-ink-400">{total} words</p>
      </header>
      <div className="flex gap-2">
        <input className="flex-1 rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
          placeholder="Search word or meaning..." value={search} onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search vocabulary" />
        <button className="btn-ghost !py-2 !text-xs" onClick={() => load()} aria-label="Submit search">Search</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {words.map((w) => (
          <Link key={w.id} href={`/words/${w.id}`} className="card hover:border-sakura-500/50 transition">
            {w.mnemonicImages?.[0] && <img src={w.mnemonicImages[0].url} alt="" className="h-20 w-full rounded-lg object-cover mb-2" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <ruby className="text-xl font-bold">{w.lemma}<rt>{w.reading}</rt></ruby>
            <div className="mt-1 text-sm text-ink-400">{w.meaning}</div>
          </Link>
        ))}
      </div>
      {loading && <div className="text-center text-ink-400">Loading...</div>}
      {cursor && !loading && <button className="btn-ghost mx-auto" onClick={() => load(cursor)}>Load more</button>}
    </div>
  );
}
