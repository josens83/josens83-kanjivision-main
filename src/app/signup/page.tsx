"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";

export default function SignUpPage() {
  const signUp = useAppStore((s) => s.signUp);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (password.length < 8) {
      setErr("Password must be at least 8 characters.");
      return;
    }
    setSubmitting(true);
    const res = await signUp(email.trim().toLowerCase(), password, displayName.trim() || undefined);
    setSubmitting(false);
    if (!res.ok) {
      setErr(res.error ?? "Could not create account");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-3xl font-black">Create account</h1>
      <p className="mt-1 text-sm text-ink-400">
        Free tier unlocks all 50 seeded N5 words. Upgrade later for N4–N1.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3">
        <label className="text-xs uppercase tracking-widest text-ink-400">Name (optional)</label>
        <input
          className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          placeholder="How should we greet you?"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          maxLength={80}
          autoComplete="name"
        />
        <label className="text-xs uppercase tracking-widest text-ink-400">Email</label>
        <input
          className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          autoComplete="email"
          required
        />
        <label className="text-xs uppercase tracking-widest text-ink-400">Password</label>
        <input
          className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          placeholder="Min 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />

        {err && <p className="text-sm text-red-400">{err}</p>}

        <button className="btn-primary" disabled={submitting}>
          {submitting ? "Creating…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-ink-400">
        Already have an account?{" "}
        <Link href="/signin" className="text-sakura-300 underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
