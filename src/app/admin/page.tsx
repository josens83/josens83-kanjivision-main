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

interface AdminPkg {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  exam: string | null;
  isActive: boolean;
  isComingSoon: boolean;
  paddlePriceId: string | null;
  paddleProductId: string | null;
  priceGlobal: string | null;
  price: number;
  durationDays: number;
  wordCount: number;
  badge: string | null;
  displayOrder: number;
}

function AdminInner() {
  const params = useSearchParams();
  const key = params?.get("key") ?? "";
  const [authed, setAuthed] = useState(false);
  const [keyInput, setKeyInput] = useState("");

  const [tab, setTab] = useState<"content" | "packages" | "subs">("content");

  const [stats, setStats] = useState<WordCount | null>(null);
  const [loading, setLoading] = useState(false);
  const [genResult, setGenResult] = useState<GenerateResult | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genExam, setGenExam] = useState("JLPT_N5");
  const [genCount, setGenCount] = useState(10);
  const [genCategory, setGenCategory] = useState("");

  const [pkgs, setPkgs] = useState<AdminPkg[]>([]);
  const [pkgLoading, setPkgLoading] = useState(false);
  const [pkgSaving, setPkgSaving] = useState<string | null>(null);
  const [quickMsg, setQuickMsg] = useState<string | null>(null);
  const [quickRunning, setQuickRunning] = useState(false);
  const [subs, setSubs] = useState<Array<{ id: string; email: string; tier: string; subscriptionPlan: string | null; subscriptionStatus: string | null; subscriptionEnd: string | null; autoRenewal: boolean }>>([]);
  const [subsLoading, setSubsLoading] = useState(false);

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

  useEffect(() => {
    if (!authed || tab !== "packages") return;
    setPkgLoading(true);
    fetch(`${API_URL}/api/internal/packages?key=${ADMIN_KEY}`)
      .then((r) => r.json())
      .then((d) => setPkgs(d.packages ?? []))
      .catch(() => setPkgs([]))
      .finally(() => setPkgLoading(false));
  }, [authed, tab]);

  async function handlePkgUpdate(id: string, data: Partial<AdminPkg>) {
    setPkgSaving(id);
    try {
      const res = await fetch(`${API_URL}/api/internal/packages/${id}?key=${ADMIN_KEY}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const updated = await res.json();
        setPkgs((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated.package } : p)));
      }
    } catch { /* silent */ }
    setPkgSaving(null);
  }

  useEffect(() => {
    if (!authed || tab !== "subs") return;
    setSubsLoading(true);
    fetch(`${API_URL}/api/internal/subscribers?key=${ADMIN_KEY}`)
      .then((r) => r.json())
      .then((d) => setSubs(d.subscribers ?? []))
      .catch(() => setSubs([]))
      .finally(() => setSubsLoading(false));
  }, [authed, tab]);

  async function runQuickAction(label: string, url: string) {
    setQuickRunning(true);
    setQuickMsg(`Running: ${label}...`);
    try {
      const res = await fetch(`${API_URL}${url}`);
      const data = await res.json();
      setQuickMsg(`${label}: ${data.created ?? data.count ?? data.ok ?? "done"}`);
    } catch { setQuickMsg(`${label}: failed`); }
    setQuickRunning(false);
  }

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
      <header className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-sakura-300">Admin</p>
            <h1 className="text-3xl font-black">Dashboard</h1>
          </div>
          <Link href={`/admin/words?key=${ADMIN_KEY}`} className="btn-ghost !text-xs">
            Word list &rarr;
          </Link>
        </div>
        <div className="flex gap-1 rounded-lg border border-ink-400/20 p-1 w-fit">
          <button
            onClick={() => setTab("content")}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${tab === "content" ? "bg-sakura-500 text-white" : "text-ink-400 hover:text-ink-200"}`}
          >
            Content
          </button>
          <button
            onClick={() => setTab("packages")}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${tab === "packages" ? "bg-sakura-500 text-white" : "text-ink-400 hover:text-ink-200"}`}
          >
            Packages
          </button>
          <button
            onClick={() => setTab("subs")}
            className={`rounded-md px-4 py-1.5 text-xs font-semibold transition ${tab === "subs" ? "bg-sakura-500 text-white" : "text-ink-400 hover:text-ink-200"}`}
          >
            Subscribers
          </button>
        </div>
      </header>

      {tab === "content" && (
        <>
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

          {/* Quick Actions */}
          <section className="card">
            <h2 className="font-bold">Quick Actions</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-ghost !text-xs !py-1.5" disabled={quickRunning}
                onClick={() => runQuickAction("Generate 10 N4 words", `/api/internal/generate-words?key=${ADMIN_KEY}&exam=JLPT_N4&count=10`)}>
                N4 +10 words
              </button>
              <button className="btn-ghost !text-xs !py-1.5" disabled={quickRunning}
                onClick={() => runQuickAction("Generate 10 N3 words", `/api/internal/generate-words?key=${ADMIN_KEY}&exam=JLPT_N3&count=10`)}>
                N3 +10 words
              </button>
              <button className="btn-ghost !text-xs !py-1.5" disabled={quickRunning}
                onClick={() => runQuickAction("Generate 5 N5 images", `/api/internal/generate-images?key=${ADMIN_KEY}&exam=JLPT_N5&count=5`)}>
                N5 +5 images
              </button>
              <button className="btn-ghost !text-xs !py-1.5" disabled={quickRunning}
                onClick={() => runQuickAction("Generate 5 N4 images", `/api/internal/generate-images?key=${ADMIN_KEY}&exam=JLPT_N4&count=5`)}>
                N4 +5 images
              </button>
              <Link href={`/admin/analytics?key=${ADMIN_KEY}`} className="btn-ghost !text-xs !py-1.5">
                Analytics &rarr;
              </Link>
              <Link href={`/admin/monitoring?key=${ADMIN_KEY}`} className="btn-ghost !text-xs !py-1.5">
                System Monitor &rarr;
              </Link>
              <Link href={`/admin/cs?key=${ADMIN_KEY}`} className="btn-ghost !text-xs !py-1.5">
                CS Tickets &rarr;
              </Link>
              <Link href={`/admin/images?key=${ADMIN_KEY}`} className="btn-ghost !text-xs !py-1.5">
                Image Manager &rarr;
              </Link>
            </div>
            {quickMsg && <div className="mt-2 text-xs text-sakura-300">{quickMsg}</div>}
          </section>

          {/* Broadcast Notification */}
          <section className="card">
            <h2 className="font-bold">Broadcast Notification</h2>
            <p className="mt-1 text-sm text-ink-400">Send a notification to all users.</p>
            <form className="mt-3 flex flex-col gap-2" onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const title = (form.elements.namedItem("bc-title") as HTMLInputElement).value;
              const message = (form.elements.namedItem("bc-message") as HTMLTextAreaElement).value;
              if (!title || !message) return;
              setQuickRunning(true);
              setQuickMsg("Broadcasting...");
              try {
                const res = await fetch(`${API_URL}/api/internal/broadcast?key=${ADMIN_KEY}`, {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title, message, type: "ANNOUNCEMENT" }),
                });
                const data = await res.json();
                setQuickMsg(`Broadcast: sent to ${data.created ?? 0} users`);
                form.reset();
              } catch { setQuickMsg("Broadcast failed"); }
              setQuickRunning(false);
            }}>
              <input name="bc-title" className="rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-sakura-500" placeholder="Notification title" required />
              <textarea name="bc-message" className="rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm outline-none focus:border-sakura-500 h-20 resize-none" placeholder="Message..." required />
              <button type="submit" className="btn-primary !py-2 w-fit" disabled={quickRunning}>Send to all users</button>
            </form>
          </section>
        </>
      )}

      {tab === "packages" && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Package management</h2>
            <span className="text-xs text-ink-400">{pkgs.length} packages</span>
          </div>
          {pkgLoading ? (
            <div className="text-center text-ink-400 py-8">Loading packages...</div>
          ) : pkgs.length === 0 ? (
            <div className="text-center text-ink-400 py-8">No packages found. Create them via SQL or seed.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {pkgs.map((p) => (
                <div key={p.id} className="card flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{p.nameEn ?? p.name}</h3>
                        {p.badge && <span className="chip text-[0.6rem]">{p.badge}</span>}
                      </div>
                      <div className="mt-0.5 text-xs text-ink-400">
                        {p.slug} &middot; {p.exam ?? "—"} &middot; {p.wordCount} words &middot; {p.durationDays}d &middot; ${p.priceGlobal ?? (p.price / 100).toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition ${p.isActive ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-ink-700 text-ink-400 border border-ink-400/20"}`}
                        disabled={pkgSaving === p.id}
                        onClick={() => handlePkgUpdate(p.id, { isActive: !p.isActive })}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </button>
                      <button
                        className={`rounded-md px-3 py-1 text-xs font-semibold transition ${p.isComingSoon ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-ink-700 text-ink-400 border border-ink-400/20"}`}
                        disabled={pkgSaving === p.id}
                        onClick={() => handlePkgUpdate(p.id, { isComingSoon: !p.isComingSoon })}
                      >
                        {p.isComingSoon ? "Coming Soon" : "Available"}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-end gap-3">
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-ink-400">Paddle Price ID</label>
                      <input
                        className="mt-0.5 block w-64 rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-1.5 text-xs outline-none focus:border-sakura-500"
                        placeholder="pri_..."
                        defaultValue={p.paddlePriceId ?? ""}
                        onBlur={(e) => {
                          const val = e.target.value.trim() || null;
                          if (val !== p.paddlePriceId) handlePkgUpdate(p.id, { paddlePriceId: val });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-ink-400">Paddle Product ID</label>
                      <input
                        className="mt-0.5 block w-64 rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-1.5 text-xs outline-none focus:border-sakura-500"
                        placeholder="pro_..."
                        defaultValue={p.paddleProductId ?? ""}
                        onBlur={(e) => {
                          const val = e.target.value.trim() || null;
                          if (val !== p.paddleProductId) handlePkgUpdate(p.id, { paddleProductId: val });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-[0.6rem] uppercase tracking-widest text-ink-400">Order</label>
                      <input
                        className="mt-0.5 block w-16 rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-1.5 text-xs outline-none focus:border-sakura-500"
                        type="number"
                        defaultValue={p.displayOrder}
                        onBlur={(e) => {
                          const val = Number(e.target.value);
                          if (val !== p.displayOrder) handlePkgUpdate(p.id, { displayOrder: val });
                        }}
                      />
                    </div>
                    {pkgSaving === p.id && <span className="text-xs text-sakura-300">Saving...</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "subs" && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Subscribers</h2>
            <span className="text-xs text-ink-400">{subs.length} users</span>
          </div>
          {subsLoading ? (
            <div className="text-center text-ink-400 py-8">Loading...</div>
          ) : subs.length === 0 ? (
            <div className="text-center text-ink-400 py-8">No subscribers found.</div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-ink-400/20">
              <table className="w-full text-sm">
                <thead className="bg-ink-800/80 text-xs uppercase text-ink-400">
                  <tr>
                    <th className="px-3 py-2 text-left">Email</th>
                    <th className="px-3 py-2 text-left">Tier</th>
                    <th className="px-3 py-2 text-left">Plan</th>
                    <th className="px-3 py-2 text-left">Status</th>
                    <th className="px-3 py-2 text-left">Ends</th>
                    <th className="px-3 py-2 text-left">Renewal</th>
                  </tr>
                </thead>
                <tbody>
                  {subs.map((s) => {
                    const endsAt = s.subscriptionEnd ? new Date(s.subscriptionEnd) : null;
                    const expiringSoon = endsAt && (endsAt.getTime() - Date.now()) < 7 * 86400000;
                    return (
                      <tr key={s.id} className={`border-t border-ink-400/10 ${expiringSoon ? "bg-amber-500/5" : ""}`}>
                        <td className="px-3 py-2 text-xs">{s.email}</td>
                        <td className="px-3 py-2 font-bold text-sakura-300">{s.tier}</td>
                        <td className="px-3 py-2">{s.subscriptionPlan ?? "—"}</td>
                        <td className="px-3 py-2">
                          <span className={`chip text-[0.6rem] ${s.subscriptionStatus === "ACTIVE" ? "text-emerald-300" : s.subscriptionStatus === "CANCELLED" ? "text-orange-300" : "text-ink-400"}`}>
                            {s.subscriptionStatus ?? "—"}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-xs text-ink-400">
                          {endsAt ? endsAt.toLocaleDateString() : "—"}
                          {expiringSoon && <span className="ml-1 text-amber-400">!</span>}
                        </td>
                        <td className="px-3 py-2 text-xs">{s.autoRenewal ? "On" : "Off"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
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
