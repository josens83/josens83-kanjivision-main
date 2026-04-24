"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { apiGet, apiPut } from "@/lib/api";

interface Profile {
  displayName: string | null;
  locale: string;
  dailyGoal: number;
}

export default function SettingsPage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    apiGet<{ user: Profile }>("/api/users/me").then((r) => {
      if (r.ok && r.data) setProfile(r.data.user);
    });
  }, [user]);

  if (!user) {
    return (
      <div className="card mx-auto mt-10 max-w-md text-center">
        <h1 className="text-xl font-bold">Sign in to access settings</h1>
        <button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/settings")}>
          Sign in
        </button>
      </div>
    );
  }

  async function save() {
    if (!profile) return;
    setSaved(false);
    await apiPut("/api/users/profile", {
      displayName: profile.displayName,
      locale: profile.locale,
      dailyGoal: profile.dailyGoal,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mx-auto max-w-lg flex flex-col gap-8 py-6">
      <header>
        <h1 className="text-2xl font-black">Settings</h1>
        <p className="text-sm text-ink-400">Profile and study preferences.</p>
      </header>

      {profile && (
        <section className="card flex flex-col gap-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">Display name</label>
            <input
              className="mt-1 block w-full rounded-xl border border-ink-400/30 bg-ink-800 px-4 py-2 text-sm outline-none focus:border-sakura-500"
              value={profile.displayName ?? ""}
              onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">Daily goal</label>
            <select
              className="mt-1 block w-full rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
              value={profile.dailyGoal}
              onChange={(e) => setProfile({ ...profile, dailyGoal: Number(e.target.value) })}
            >
              {[5, 10, 15, 20, 30, 50].map((n) => (
                <option key={n} value={n}>{n} cards / day</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest text-ink-400">Language</label>
            <select
              className="mt-1 block w-full rounded-lg border border-ink-400/30 bg-ink-800 px-3 py-2 text-sm"
              value={profile.locale}
              onChange={(e) => setProfile({ ...profile, locale: e.target.value })}
            >
              <option value="en">English</option>
              <option value="ja">Japanese</option>
              <option value="ko">Korean</option>
            </select>
          </div>
          <button className="btn-primary" onClick={save}>
            {saved ? "Saved!" : "Save changes"}
          </button>
        </section>
      )}

      <section className="card">
        <h2 className="font-bold">Account</h2>
        <p className="mt-1 text-sm text-ink-400">
          Change password, delete account, or reset study data.
        </p>
        <Link href="/account" className="btn-ghost mt-3 !text-xs">
          Manage account &rarr;
        </Link>
      </section>
    </div>
  );
}
