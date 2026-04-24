"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { apiPut, apiDelete } from "@/lib/api";

export default function AccountPage() {
  const user = useAppStore((s) => s.user);
  const signOut = useAppStore((s) => s.signOut);
  const router = useRouter();

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pwLoading, setPwLoading] = useState(false);

  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  if (!user) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <h1 className="text-xl font-bold">Sign in to manage your account</h1>
        <button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/account")}>
          Sign in
        </button>
      </div>
    );
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    setPwLoading(true);
    const res = await apiPut("/api/users/password", {
      currentPassword: currentPw,
      newPassword: newPw,
    });
    setPwLoading(false);
    if (res.ok) {
      setPwMsg({ ok: true, text: "Password changed successfully." });
      setCurrentPw("");
      setNewPw("");
    } else {
      setPwMsg({ ok: false, text: res.error ?? "Failed to change password." });
    }
  }

  async function handleDeleteAccount() {
    const res = await apiDelete("/api/users/account");
    if (res.ok || res.status === 204) {
      signOut();
      router.push("/");
    }
  }

  return (
    <div className="mx-auto max-w-lg flex flex-col gap-8 py-6">
      <header>
        <Link href="/settings" className="text-xs text-sakura-300 hover:underline">&larr; Settings</Link>
        <h1 className="text-2xl font-black">Account</h1>
        <p className="text-sm text-ink-400">{user.email}</p>
      </header>

      {/* Password change */}
      <section className="card">
        <h2 className="font-bold">Change password</h2>
        <form onSubmit={handlePasswordChange} className="mt-3 flex flex-col gap-3">
          <input
            className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
            type="password"
            placeholder="Current password"
            value={currentPw}
            onChange={(e) => setCurrentPw(e.target.value)}
            autoComplete="current-password"
            required
          />
          <input
            className="rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
            type="password"
            placeholder="New password (min 8 chars)"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          {pwMsg && (
            <p className={`text-sm ${pwMsg.ok ? "text-emerald-300" : "text-red-400"}`}>
              {pwMsg.text}
            </p>
          )}
          <button className="btn-primary !py-2" disabled={pwLoading}>
            {pwLoading ? "Changing..." : "Change password"}
          </button>
        </form>
      </section>

      {/* Danger zone */}
      <section className="card border-red-500/20">
        <h2 className="font-bold text-red-400">Danger zone</h2>
        <p className="mt-1 text-sm text-ink-400">
          Deleting your account permanently removes all your data including progress, bookmarks, and study sessions.
        </p>
        {!showDelete ? (
          <button
            className="mt-3 rounded-xl border border-red-500/40 px-4 py-2 text-sm text-red-400 transition hover:bg-red-500/10"
            onClick={() => setShowDelete(true)}
          >
            Delete my account
          </button>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-sm text-red-300">
              Type <b>DELETE</b> to confirm:
            </p>
            <input
              className="rounded-xl border border-red-500/30 bg-ink-800 px-4 py-2 text-sm outline-none"
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
            />
            <div className="flex gap-2">
              <button
                className="rounded-xl bg-red-500/80 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-50"
                disabled={deleteConfirm !== "DELETE"}
                onClick={handleDeleteAccount}
              >
                Permanently delete
              </button>
              <button
                className="btn-ghost !py-2 !text-xs"
                onClick={() => { setShowDelete(false); setDeleteConfirm(""); }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
