"use client";
import { useState } from "react";
import Link from "next/link";
import { apiPost, API_URL } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await apiPost(`${API_URL}/api/auth/forgot-password`, { email }, { auth: false });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-black">Forgot password</h1>
      {sent ? (
        <div className="mt-4 card">
          <p className="text-sm text-emerald-300">Check your email for a reset link.</p>
          <Link href="/signin" className="btn-ghost mt-4 !text-xs">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
            type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <button className="btn-primary" disabled={loading}>{loading ? "Sending..." : "Send reset link"}</button>
          <Link href="/signin" className="text-center text-xs text-ink-400 hover:text-sakura-300">Back to sign in</Link>
        </form>
      )}
    </div>
  );
}
