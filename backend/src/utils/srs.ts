// SM-2 spaced-repetition algorithm.
// Shared with the frontend (src/lib/srs.ts); kept in utils/ per
// Vision Platform backend convention (also re-exported from lib/srs.ts
// for backwards compatibility with legacy imports).

export interface SrsInput {
  repetition: number;
  interval: number;   // days
  easiness: number;   // >= 1.3
}

export interface SrsOutput extends SrsInput {
  dueAt: Date;
  lastReviewedAt: Date;
}

export const DEFAULT_EF = 2.5;
const DAY_MS = 24 * 60 * 60 * 1000;

export function initState() {
  return { repetition: 0, interval: 0, easiness: DEFAULT_EF };
}

/**
 * Apply a review with quality 0-5 (0 blackout, 3 correct but hard,
 * 5 perfect) and return updated SM-2 state plus the next review time.
 */
export function review(state: SrsInput, quality: number, now: Date = new Date()): SrsOutput {
  const q = Math.max(0, Math.min(5, Math.round(quality)));
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
    repetition,
    interval,
    easiness: Number(easiness.toFixed(3)),
    dueAt: new Date(now.getTime() + interval * DAY_MS),
    lastReviewedAt: now,
  };
}

export function isDue(dueAt: Date, now: Date = new Date()): boolean {
  return dueAt.getTime() <= now.getTime();
}
