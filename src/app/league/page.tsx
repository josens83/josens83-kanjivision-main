"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiGet } from "@/lib/api";
import { useAppStore } from "@/lib/store";

interface LeaderboardEntry { rank: number; userId: string; name: string; xp: number }
interface LeagueData { tier: string; myXp: number; rank: number; weekEnd: string; leaderboard: LeaderboardEntry[] }

export default function LeaguePage() {
  const user = useAppStore((s) => s.user);
  const router = useRouter();
  const [data, setData] = useState<LeagueData | null>(null);

  useEffect(() => {
    if (!user) return;
    apiGet<LeagueData>("/api/league").then((r) => { if (r.ok && r.data) setData(r.data); });
  }, [user]);

  if (!user) return <div className="card mx-auto mt-10 max-w-md text-center"><h1 className="text-xl font-bold">Sign in to join the league</h1><button className="btn-primary mt-4" onClick={() => router.push("/signin?next=/league")}>Sign in</button></div>;
  if (!data) return <div className="mt-10 text-center text-ink-400">Loading...</div>;

  const daysLeft = Math.max(0, Math.ceil((new Date(data.weekEnd).getTime() - Date.now()) / 86400000));

  return (
    <div className="mx-auto max-w-lg py-4 flex flex-col gap-6">
      <header className="text-center">
        <div className="text-4xl font-black text-sakura-300">{data.tier}</div>
        <p className="text-sm text-ink-400">Rank #{data.rank} &middot; {data.myXp} XP &middot; {daysLeft}d left</p>
      </header>
      <div className="card">
        <table className="w-full text-sm">
          <thead><tr className="text-xs text-ink-400"><th className="text-left py-1">#</th><th className="text-left">Name</th><th className="text-right">XP</th></tr></thead>
          <tbody>
            {data.leaderboard.map((e) => (
              <tr key={e.userId} className={e.userId === user.id ? "text-sakura-300 font-bold" : ""}>
                <td className="py-1.5">{e.rank <= 3 ? ["🥇","🥈","🥉"][e.rank-1] : e.rank}</td>
                <td>{e.name}</td>
                <td className="text-right">{e.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-center text-xs text-ink-400">Earn XP: +10 per card, +15 per quiz answer, +50 for daily goal</p>
    </div>
  );
}
