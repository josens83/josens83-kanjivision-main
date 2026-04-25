"use client";

import { useEffect, useState } from "react";
import { apiGet, apiPost } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import { AchievementToast } from "@/components/AchievementToast";

interface Achievement {
  id: string;
  key: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
  threshold: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export default function AchievementsPage() {
  const user = useAppStore((s) => s.user);
  const [list, setList] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Array<{ name: string; icon: string }>>([]);

  useEffect(() => {
    apiGet<{ achievements: Achievement[] }>("/api/achievements").then((r) => {
      if (r.ok && r.data) setList(r.data.achievements);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!user) return;
    apiPost<{ newlyUnlocked: Array<{ name: string; icon: string }> }>("/api/achievements/check").then((r) => {
      if (r.ok && r.data && r.data.newlyUnlocked.length > 0) {
        setNewlyUnlocked(r.data.newlyUnlocked);
        apiGet<{ achievements: Achievement[] }>("/api/achievements").then((r2) => {
          if (r2.ok && r2.data) setList(r2.data.achievements);
        });
      }
    });
  }, [user]);

  const unlockedCount = list.filter((a) => a.unlocked).length;

  return (
    <div className="flex flex-col gap-6 py-4">
      <AchievementToast achievements={newlyUnlocked} />

      <header>
        <h1 className="text-2xl font-black">Achievements</h1>
        <p className="text-sm text-ink-400">
          {unlockedCount} / {list.length} unlocked
        </p>
      </header>

      {loading && <div className="text-center text-ink-400">Loading...</div>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((a) => (
          <div
            key={a.id}
            className={`card flex items-start gap-3 transition ${
              a.unlocked ? "" : "opacity-50 grayscale"
            }`}
          >
            <span className="text-3xl">{a.unlocked ? a.icon : "🔒"}</span>
            <div className="flex-1">
              <div className="font-bold">{a.name}</div>
              <div className="text-xs text-ink-400">{a.description}</div>
              {a.unlocked && a.unlockedAt && (
                <div className="mt-1 text-[0.65rem] text-sakura-300">
                  {new Date(a.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
