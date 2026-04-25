"use client";

import { useEffect, useState } from "react";

interface Props {
  achievements: Array<{ name: string; icon: string }>;
}

export function AchievementToast({ achievements }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (achievements.length === 0) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(t);
  }, [achievements]);

  if (!visible || achievements.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      {achievements.map((a, i) => (
        <div
          key={i}
          className="mb-2 flex items-center gap-3 rounded-xl border border-sakura-500/40 bg-ink-800 px-5 py-3 shadow-card animate-[slideUp_0.3s_ease-out]"
        >
          <span className="text-2xl">{a.icon}</span>
          <div>
            <div className="text-xs text-sakura-300">Achievement unlocked!</div>
            <div className="text-sm font-bold">{a.name}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
