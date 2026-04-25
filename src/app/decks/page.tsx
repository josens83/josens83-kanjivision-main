"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface Deck { id: string; name: string; description: string | null; wordIds: string[]; isPublic: boolean; createdAt: string }

export default function DecksPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    if (!user) return;
    apiGet<{ decks: Deck[] }>("/api/decks").then((r) => { if (r.ok && r.data) setDecks(r.data.decks); });
  }, [user]);

  async function create() {
    if (!name.trim()) return;
    const res = await apiPost<{ deck: Deck }>("/api/decks", { name: name.trim(), description: desc.trim() || undefined });
    if (res.ok && res.data) { setDecks((p) => [res.data!.deck, ...p]); setShowCreate(false); setName(""); setDesc(""); }
  }

  async function remove(id: string) {
    await apiDelete(`/api/decks/${id}`);
    setDecks((p) => p.filter((d) => d.id !== id));
  }

  if (!user) return <div className="card mx-auto mt-10 max-w-md text-center"><h1 className="text-xl font-bold">Sign in to manage decks</h1><button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/decks")}>Sign in</button></div>;

  return (
    <div className="flex flex-col gap-6 py-4">
      <header className="flex items-center justify-between">
        <div><h1 className="text-2xl font-black">My Decks</h1><p className="text-sm text-ink-400">{decks.length} decks</p></div>
        <button className="btn-primary !text-xs" onClick={() => setShowCreate(true)}>Create Deck</button>
      </header>
      {showCreate && (
        <div className="card flex flex-col gap-3">
          <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500" placeholder="Deck name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500" placeholder="Description (optional)" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <div className="flex gap-2"><button className="btn-primary !py-2" onClick={create}>Create</button><button className="btn-ghost !py-2" onClick={() => setShowCreate(false)}>Cancel</button></div>
        </div>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {decks.map((d) => (
          <div key={d.id} className="card flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div><div className="font-bold">{d.name}</div>{d.description && <div className="text-xs text-ink-400">{d.description}</div>}</div>
              <button onClick={() => remove(d.id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
            </div>
            <div className="text-xs text-ink-400">{d.wordIds.length} words &middot; {d.isPublic ? "Public" : "Private"}</div>
            <Link href={`/learn?level=JLPT_N5`} className="btn-ghost !py-1 !text-xs mt-auto">Study this deck</Link>
          </div>
        ))}
        {decks.length === 0 && !showCreate && <p className="text-ink-400 text-sm">No decks yet. Create one to organize your vocabulary!</p>}
      </div>
    </div>
  );
}
