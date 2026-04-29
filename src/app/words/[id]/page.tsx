"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { apiGet, apiPost } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface KanjiPart { char: string; reading: string; meaning: string; onyomi: string[]; kunyomi: string[] }
interface Example { jp: string; reading: string; en: string }
interface WordDetail {
  id: string; lemma: string; reading: string; meaning: string; partOfSpeech: string;
  examCategory: string; mnemonic: string | null; examples: Example[] | null;
  collocations: string[] | null; kanjiParts: KanjiPart[];
  mnemonicImages?: Array<{ url: string }>;
}
interface RelatedWord {
  id: string; lemma: string; reading: string; meaning: string;
  kanjiParts: { char: string }[];
}

export default function WordDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const user = useAppStore((s) => s.user);
  const [word, setWord] = useState<WordDetail | null>(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [related, setRelated] = useState<RelatedWord[]>([]);

  useEffect(() => {
    apiGet<{ word: WordDetail }>(`/api/words/${id}`).then((r) => { if (r.ok && r.data) setWord(r.data.word); });
    apiGet<{ data: RelatedWord[] }>(`/api/words/${id}/related`).then((r) => { if (r.ok && r.data) setRelated(r.data.data); });
    if (user) apiGet<{ bookmarked: boolean }>(`/api/bookmarks/${id}`).then((r) => { if (r.ok && r.data) setBookmarked(r.data.bookmarked); });
  }, [id, user]);

  if (!word) return <div className="mt-10 text-center text-ink-400">Loading...</div>;

  const img = word.mnemonicImages?.[0]?.url;

  return (
    <div className="mx-auto max-w-2xl py-6 flex flex-col gap-6">
      <Link href={`/vocabulary/${word.examCategory}`} className="text-xs text-sakura-300 hover:underline">&larr; {word.examCategory.replace("_", " ")}</Link>

      <div className="card text-center">
        {img && <img src={img} alt={word.lemma} className="mx-auto h-48 w-48 rounded-xl object-cover mb-4" onError={(e) => (e.currentTarget.style.display = "none")} />}
        <ruby className="text-5xl font-bold">{word.lemma}<rt className="text-lg">{word.reading}</rt></ruby>
        <div className="mt-2 text-xl text-sakura-200">{word.meaning}</div>
        <div className="mt-2 flex justify-center gap-2">
          <span className="chip">{word.partOfSpeech}</span>
          <span className="chip">{word.examCategory.replace("_", " ")}</span>
        </div>
        {user && (
          <button onClick={async () => { setBookmarked((v) => !v); await apiPost("/api/bookmarks/toggle", { wordId: word.id }); }}
            className={`mt-3 text-2xl transition ${bookmarked ? "text-red-400" : "text-ink-400/40 hover:text-red-300"}`}>
            {bookmarked ? "♥" : "♡"}
          </button>
        )}
      </div>

      {word.kanjiParts.length > 0 && (
        <section className="card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">漢字分解 &middot; Kanji decomposition</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {word.kanjiParts.map((k) => (
              <div key={k.char} className="rounded-xl border border-sakura-500/20 bg-ink-900/60 p-4">
                <div className="flex items-end gap-3">
                  <span className="text-4xl font-black text-sakura-200">{k.char}</span>
                  <div><div className="text-sm font-semibold">{k.meaning}</div><div className="text-xs text-ink-400">{k.reading}</div></div>
                </div>
                <div className="mt-2 flex gap-4 text-[0.7rem] text-ink-400">
                  {k.onyomi.length > 0 && <span><span className="font-semibold text-sakura-300">音</span> {k.onyomi.join(" / ")}</span>}
                  {k.kunyomi.length > 0 && <span><span className="font-semibold text-sky-300">訓</span> {k.kunyomi.join(" / ")}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {word.mnemonic && (
        <section className="card"><h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">Mnemonic</h3><p className="text-sm">{word.mnemonic}</p></section>
      )}

      {word.examples && word.examples.length > 0 && (
        <section className="card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">Examples</h3>
          <ul className="flex flex-col gap-2">
            {word.examples.map((ex, i) => (
              <li key={i} className="rounded-lg border border-ink-400/15 bg-ink-900/40 p-3">
                <ruby>{ex.jp}<rt>{ex.reading}</rt></ruby>
                <div className="mt-1 text-sm italic text-ink-400">{ex.en}</div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {word.collocations && word.collocations.length > 0 && (
        <section className="card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">Collocations</h3>
          <div className="flex flex-wrap gap-2">
            {word.collocations.map((c, i) => <span key={i} className="chip text-xs">{c}</span>)}
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="card">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-3">Related words (shared kanji)</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <Link key={r.id} href={`/words/${r.id}`} className="rounded-xl border border-ink-400/15 bg-ink-900/40 p-3 hover:border-sakura-500/40 transition">
                <ruby className="text-lg font-bold">{r.lemma}<rt>{r.reading}</rt></ruby>
                <div className="mt-0.5 text-sm text-ink-400">{r.meaning}</div>
                <div className="mt-1 flex gap-1">{r.kanjiParts.map((k) => <span key={k.char} className="text-[0.65rem] text-sakura-300">{k.char}</span>)}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="flex gap-3">
        <Link href={`/chat?wordId=${word.id}`} className="btn-ghost flex-1 text-center">Ask AI about this word</Link>
        <Link href={`/learn?level=${word.examCategory}`} className="btn-primary flex-1 text-center">Practice</Link>
      </div>
    </div>
  );
}
