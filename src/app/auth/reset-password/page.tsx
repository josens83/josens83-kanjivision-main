"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiPost, API_URL } from "@/lib/api";

function ResetInner() {
  const params = useSearchParams();
  const token = params?.get("token") ?? "";
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw !== pw2) { setErr("Passwords don't match"); return; }
    setLoading(true);
    const res = await apiPost(`${API_URL}/api/auth/reset-password`, { token, newPassword: pw }, { auth: false });
    setLoading(false);
    if (res.ok) router.push("/signin?reset=true");
    else setErr(res.error ?? "Failed to reset password");
  }

  if (!token) return <div className="mt-16 text-center text-red-400">Invalid reset link.</div>;

  return (
    <div className="mx-auto max-w-sm py-16">
      <h1 className="text-2xl font-black">Reset password</h1>
      <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
        <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          type="password" placeholder="New password (min 8)" value={pw} onChange={(e) => setPw(e.target.value)} minLength={8} required />
        <input className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-3 text-sm outline-none focus:border-sakura-500"
          type="password" placeholder="Confirm password" value={pw2} onChange={(e) => setPw2(e.target.value)} required />
        {err && <p className="text-sm text-red-400">{err}</p>}
        <button className="btn-primary" disabled={loading}>{loading ? "Resetting..." : "Reset password"}</button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return <Suspense fallback={<div className="mt-16 text-center text-ink-400">Loading...</div>}><ResetInner /></Suspense>;
}
