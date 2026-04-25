"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { GoogleButton } from "@/components/GoogleButton";

function SignInInner() {
  const signIn = useAppStore((s) => s.signIn);
  const router = useRouter();
  const params = useSearchParams();
  const expired = params?.get("expired") === "true";
  const next = params?.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSubmitting(true);
    const res = await signIn(email.trim().toLowerCase(), password);
    setSubmitting(false);
    if (!res.ok) {
      setErr(res.error ?? "Could not sign in");
      return;
    }
    router.push(next);
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-3xl font-black">Sign in</h1>
      <p className="mt-1 text-sm text-ink-400">
        Welcome back. Sync your JLPT progress across web and mobile.
      </p>

      {expired && (
        <div className="mt-4 rounded-xl border border-sakura-500/40 bg-sakura-500/10 p-3 text-sm text-sakura-200">
          Your session expired. Please sign in again.
        </div>
      )}

      <div className="mt-6">
        <GoogleButton label="Google로 로그인" />
      </div>

      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-400/20" />
        <span className="text-xs text-ink-400">또는</span>
        <div className="h-px flex-1 bg-ink-400/20" />
      </div>

      <form onSubmit={submit} className="flex flex-col gap-3">
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
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
        />

        {err && <p className="text-sm text-red-400">{err}</p>}

        <button className="btn-primary" disabled={submitting}>
          {submitting ? "Signing in…" : "Continue"}
        </button>
      </form>

      <p className="mt-3 text-center text-xs">
        <Link href="/auth/forgot-password" className="text-ink-400 hover:text-sakura-300">
          Forgot password?
        </Link>
      </p>

      <p className="mt-3 text-center text-xs text-ink-400">
        No account yet?{" "}
        <Link href="/signup" className="text-sakura-300 underline">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center text-ink-400">Loading…</div>}>
      <SignInInner />
    </Suspense>
  );
}
