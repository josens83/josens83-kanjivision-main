"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

const ADMIN_KEY = "dohurnk1006";

function ImagesInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [totalWords, setTotalWords] = useState(0);
  const [withImages, setWithImages] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{ generated: number; failed: number } | null>(null);
  const [exam, setExam] = useState("JLPT_N5");
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (key !== ADMIN_KEY) return;
    fetch(`${API_URL}/api/words/count`).then((r) => r.json()).then((d) => setTotalWords(d.total ?? 0)).catch(() => {});
  }, [key]);

  async function generate() {
    setGenerating(true); setResult(null);
    const res = await fetch(`${API_URL}/api/internal/generate-images?key=${ADMIN_KEY}&exam=${exam}&count=${count}`);
    const data = await res.json();
    setResult({ generated: data.generated ?? 0, failed: data.failed ?? 0 });
    setGenerating(false);
  }

  if (key !== ADMIN_KEY) return <div className="mt-10 text-center"><Link href="/admin" className="btn-primary">Go to admin</Link></div>;

  return (
    <div className="flex flex-col gap-6 py-4">
      <header><Link href={`/admin?key=${ADMIN_KEY}`} className="text-xs text-sakura-300">&larr; Admin</Link><h1 className="text-2xl font-black">Image Management</h1></header>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="card text-center"><div className="text-2xl font-black">{totalWords}</div><div className="text-xs text-ink-400">Total words</div></div>
        <div className="card text-center"><div className="text-2xl font-black text-sakura-300">{withImages}</div><div className="text-xs text-ink-400">With images</div></div>
        <div className="card text-center"><div className="text-2xl font-black text-orange-300">{totalWords - withImages}</div><div className="text-xs text-ink-400">Missing images</div></div>
      </div>
      <div className="card">
        <h2 className="font-bold">Batch Generate</h2>
        <div className="mt-3 flex flex-wrap items-end gap-3">
          <div><label className="text-xs text-ink-400">Exam</label>
            <select className="mt-1 block rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm" value={exam} onChange={(e) => setExam(e.target.value)}>
              {["JLPT_N5", "JLPT_N4", "JLPT_N3", "JLPT_N2", "JLPT_N1"].map((e) => <option key={e} value={e}>{e.replace("_", " ")}</option>)}
            </select></div>
          <div><label className="text-xs text-ink-400">Count</label>
            <input className="mt-1 block w-20 rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm" type="number" min={1} max={25} value={count} onChange={(e) => setCount(Number(e.target.value))} /></div>
          <button className="btn-primary !py-2" disabled={generating} onClick={generate}>{generating ? "Generating..." : "Generate"}</button>
        </div>
        {result && <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">Generated {result.generated}, Failed {result.failed}</div>}
      </div>
    </div>
  );
}

export default function AdminImagesPage() { return <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading...</div>}><ImagesInner /></Suspense>; }
