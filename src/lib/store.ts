"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Tier } from "@/lib/tiers";
import { initState, review as srsReview, type SrsState } from "@/lib/srs";
import { apiGet, apiPost, authToken } from "@/lib/api";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ServerTier = "FREE" | "BASIC" | "PREMIUM";

export interface User {
  id?: string;
  email: string;
  tier: Tier;
  subscribedAt?: number;
}

interface AppState {
  user: User | null;
  hydrating: boolean;
  progress: Record<string, SrsState>;
  streakDays: number;
  lastStudyDate?: string;

  signUp: (email: string, password: string, displayName?: string) => Promise<{ ok: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  hydrate: () => Promise<void>;
  upgrade: (tier: Tier) => void;
  gradeWord: (wordId: string, quality: number) => Promise<void>;
  bumpStreak: () => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function serverTierToLocal(t: ServerTier | string | undefined): Tier {
  const v = (t ?? "FREE").toLowerCase();
  if (v === "basic" || v === "premium" || v === "free") return v;
  return "free";
}

interface ServerUser {
  id: string;
  email: string;
  tier: ServerTier;
  displayName?: string | null;
}

interface AuthResponse {
  user: ServerUser;
  accessToken: string;
  refreshToken?: string;
}

function adoptUser(u: ServerUser): User {
  return {
    id: u.id,
    email: u.email,
    tier: serverTierToLocal(u.tier),
    subscribedAt: Date.now(),
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrating: false,
      progress: {},
      streakDays: 0,

      signUp: async (email, password, displayName) => {
        const res = await apiPost<AuthResponse>("/api/auth/signup", {
          email,
          password,
          displayName,
        }, { auth: false, skipAuthRedirect: true });
        if (!res.ok || !res.data) return { ok: false, error: res.error ?? "signup failed" };
        authToken.set(res.data.accessToken);
        set({ user: adoptUser(res.data.user) });
        return { ok: true };
      },

      signIn: async (email, password) => {
        const res = await apiPost<AuthResponse>("/api/auth/login", {
          email,
          password,
        }, { auth: false, skipAuthRedirect: true });
        if (!res.ok || !res.data) return { ok: false, error: res.error ?? "login failed" };
        authToken.set(res.data.accessToken);
        set({ user: adoptUser(res.data.user) });
        return { ok: true };
      },

      signOut: () => {
        authToken.clear();
        set({ user: null, progress: {}, streakDays: 0, lastStudyDate: undefined });
      },

      hydrate: async () => {
        const token = authToken.get();
        if (!token) {
          set({ user: null, hydrating: false });
          return;
        }
        set({ hydrating: true });
        const res = await apiGet<{ user: ServerUser }>("/api/auth/me", {
          skipAuthRedirect: true,
        });
        if (res.ok && res.data?.user) {
          set({ user: adoptUser(res.data.user), hydrating: false });
        } else {
          authToken.clear();
          set({ user: null, hydrating: false });
        }
      },

      upgrade: (tier) => {
        const u = get().user;
        if (!u) return;
        set({ user: { ...u, tier, subscribedAt: Date.now() } });
      },

      // SM-2 locally for instant UI feedback (optimistic), then sync to server.
      // If the server call fails we keep the local state — next session can re-sync.
      gradeWord: async (wordId, quality) => {
        const prev = get().progress[wordId] ?? initState(wordId);
        const next = srsReview(prev, quality);
        set((s) => ({ progress: { ...s.progress, [wordId]: next } }));

        if (!get().user) return; // unauthenticated: local-only
        await apiPost(`/api/progress/${encodeURIComponent(wordId)}/grade`, {
          quality,
        });
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
      // Don't persist `hydrating` — it's per-session transient state.
      partialize: (s) => ({
        user: s.user,
        progress: s.progress,
        streakDays: s.streakDays,
        lastStudyDate: s.lastStudyDate,
      }),
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
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
