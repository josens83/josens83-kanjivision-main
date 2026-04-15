// Streak utility — computes a user's consecutive daily-study streak from
// a list of review timestamps. Matches the HangeulVision/VocaVision
// semantics: a UTC calendar day with at least one review counts.

export interface StreakResult {
  streakDays: number;
  longestStreakDays: number;
  lastStudyDate: string | null;   // ISO "YYYY-MM-DD"
}

function toUtcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function dayDiff(a: string, b: string): number {
  return Math.round(
    (Date.parse(a + "T00:00:00Z") - Date.parse(b + "T00:00:00Z")) / (24 * 3600 * 1000)
  );
}

/**
 * Given the user's review timestamps (any order) and today's date,
 * return the current streak, the longest streak, and the last study date.
 * A streak breaks if a full UTC day passes with no review.
 */
export function computeStreak(reviewedAt: Date[], today: Date = new Date()): StreakResult {
  if (reviewedAt.length === 0) {
    return { streakDays: 0, longestStreakDays: 0, lastStudyDate: null };
  }
  const days = Array.from(new Set(reviewedAt.map(toUtcDay))).sort();

  // longest run
  let longest = 1;
  let run = 1;
  for (let i = 1; i < days.length; i++) {
    if (dayDiff(days[i], days[i - 1]) === 1) {
      run += 1;
      longest = Math.max(longest, run);
    } else {
      run = 1;
    }
  }

  const todayStr = toUtcDay(today);
  const last = days[days.length - 1];
  const gap = dayDiff(todayStr, last);

  let current = 0;
  if (gap <= 1) {
    // count back from `last`
    current = 1;
    for (let i = days.length - 2; i >= 0; i--) {
      if (dayDiff(days[i + 1], days[i]) === 1) current += 1;
      else break;
    }
  }

  return { streakDays: current, longestStreakDays: longest, lastStudyDate: last };
}

/** Seeded PRNG — deterministic per (userId, dateStr). Used for "word of the day". */
export function utcDayKey(date: Date = new Date()): string {
  return toUtcDay(date);
}
