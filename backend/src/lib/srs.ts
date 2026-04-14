// SM-2 algorithm — mirrors src/lib/srs.ts on the frontend.
// Shared across Vision Platform services.

export interface SrsInput {
  repetition: number;
  interval: number;
  easiness: number;
}

export interface SrsOutput extends SrsInput {
  dueAt: Date;
  lastReviewedAt: Date;
}

const DAY_MS = 24 * 60 * 60 * 1000;

export function review(state: SrsInput, quality: number, now: Date = new Date()): SrsOutput {
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
    repetition,
    interval,
    easiness: Number(easiness.toFixed(3)),
    dueAt: new Date(now.getTime() + interval * DAY_MS),
    lastReviewedAt: now,
  };
}
