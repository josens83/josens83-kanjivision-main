// SM-2 Spaced Repetition algorithm (SuperMemo 2).
// Shared across Vision Platform services (VocaVision / HangeulVision / KanjiVision).
// Quality: 0-5 (0 = blackout, 3 = correct with difficulty, 5 = perfect).

export interface SrsState {
  wordId: string;
  repetition: number;   // n
  interval: number;     // days until next review
  easiness: number;     // EF (minimum 1.3)
  dueAt: number;        // epoch ms
  lastReviewedAt?: number;
}

export const DEFAULT_EF = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

export function initState(wordId: string, now: number = Date.now()): SrsState {
  return {
    wordId,
    repetition: 0,
    interval: 0,
    easiness: DEFAULT_EF,
    dueAt: now,
  };
}

export function review(state: SrsState, quality: number, now: number = Date.now()): SrsState {
  const q = Math.max(0, Math.min(5, quality));
  let { repetition, interval, easiness } = state;

  if (q < 3) {
    repetition = 0;
    interval = 1;
  } else {
    if (repetition === 0) interval = 1;
    else if (repetition === 1) interval = 6;
    else interval = Math.round(interval * easiness);
    repetition += 1;
  }

  easiness = easiness + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easiness < 1.3) easiness = 1.3;

  return {
    ...state,
    repetition,
    interval,
    easiness: Number(easiness.toFixed(3)),
    dueAt: now + interval * DAY_MS,
    lastReviewedAt: now,
  };
}

export function isDue(state: SrsState, now: number = Date.now()): boolean {
  return state.dueAt <= now;
}
