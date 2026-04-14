"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Tier } from "@/lib/tiers";
import { initState, review as srsReview, type SrsState } from "@/lib/srs";

interface User {
  email: string;
  tier: Tier;
  subscribedAt?: number;
}

interface AppState {
  user: User | null;
  progress: Record<string, SrsState>;
  streakDays: number;
  lastStudyDate?: string;
  signIn: (email: string) => void;
  signOut: () => void;
  upgrade: (tier: Tier) => void;
  grade: (wordId: string, quality: number) => void;
  bumpStreak: () => void;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      progress: {},
      streakDays: 0,
      signIn: (email) =>
        set({
          user: { email, tier: "free", subscribedAt: Date.now() },
        }),
      signOut: () => set({ user: null }),
      upgrade: (tier) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, tier, subscribedAt: Date.now() } });
      },
      grade: (wordId, quality) => {
        const prev = get().progress[wordId] ?? initState(wordId);
        const next = srsReview(prev, quality);
        set((s) => ({ progress: { ...s.progress, [wordId]: next } }));
      },
      bumpStreak: () => {
        const last = get().lastStudyDate;
        const t = today();
        if (last === t) return;
        const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
        const streak = last === yesterday ? get().streakDays + 1 : 1;
        set({ streakDays: streak, lastStudyDate: t });
      },
    }),
    {
      name: "kanjivision-store-v1",
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          // SSR-safe no-op storage
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return window.localStorage;
      }),
      skipHydration: false,
    }
  )
);
