"use client";
import { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { apiPost } from "@/lib/api";

export default function ContactPage() {
  const user = useAppStore((s) => s.user);
  const [email, setEmail] = useState(user?.email ?? "");
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Bug");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const res = await apiPost("/api/support/ticket", { email, name: name || undefined, category, subject, message });
    setLoading(false);
    if (res.ok) setSent(true);
    else setErr(res.error ?? "Failed to submit");
  }

  if (sent) return (
    <div className="mx-auto max-w-md py-16 text-center card">
      <h2 className="text-xl font-bold text-emerald-300">Ticket submitted!</h2>
      <p className="mt-2 text-sm text-ink-400">We'll get back to you within 24 hours.</p>
      <Link href="/cs" className="btn-ghost mt-4">FAQ</Link>
    </div>
  );

  return (
    <div className="mx-auto max-w-md py-8">
      <h1 className="text-2xl font-black">Contact us</h1>
      <p className="text-sm text-ink-400">Bug report, feature request, or any question.</p>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
          type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
          placeholder="Name (optional)" value={name} onChange={(e) => setName(e.target.value)} />
        <select className="rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
          value={category} onChange={(e) => setCategory(e.target.value)}>
          {["Bug", "Feature", "Account", "Billing", "Other"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
          placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} required />
        <textarea className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500 min-h-[100px]"
          placeholder="Describe your issue..." value={message} onChange={(e) => setMessage(e.target.value)} required />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
}
