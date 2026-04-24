import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

const KEYS = {
  wordCount: "word:count",
  word: (id: string) => `word:${id}`,
};

export function getWordCount<T>(): T | undefined {
  return cache.get<T>(KEYS.wordCount);
}

export function setWordCount<T>(data: T, ttl = 3600): void {
  cache.set(KEYS.wordCount, data, ttl);
}

export function getWord<T>(id: string): T | undefined {
  return cache.get<T>(KEYS.word(id));
}

export function setWord<T>(id: string, data: T, ttl = 600): void {
  cache.set(KEYS.word(id), data, ttl);
}

export function invalidateWordCounts(): void {
  cache.del(KEYS.wordCount);
}

export function invalidateWord(id: string): void {
  cache.del(KEYS.word(id));
}

export function invalidateAll(): void {
  cache.flushAll();
}
