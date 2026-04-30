import en from "./messages/en.json";
import ko from "./messages/ko.json";
import ja from "./messages/ja.json";

export type Locale = "en" | "ko" | "ja";
export const LOCALES: Locale[] = ["en", "ko", "ja"];
export const LOCALE_LABELS: Record<Locale, string> = { en: "English", ko: "한국어", ja: "日本語" };

const messages: Record<Locale, Record<string, Record<string, string>>> = { en, ko, ja };

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  const stored = localStorage.getItem("kv-locale");
  if (stored && LOCALES.includes(stored as Locale)) return stored as Locale;
  const nav = navigator.language.slice(0, 2);
  if (LOCALES.includes(nav as Locale)) return nav as Locale;
  return "en";
}

export function setLocale(locale: Locale) {
  if (typeof window !== "undefined") localStorage.setItem("kv-locale", locale);
}

export function getLocale(): Locale {
  return getStoredLocale();
}

export function t(namespace: string, key: string, params?: Record<string, string | number>): string {
  const locale = getStoredLocale();
  const ns = messages[locale]?.[namespace] ?? messages.en[namespace];
  let text = ns?.[key] ?? messages.en[namespace]?.[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, String(v));
    }
  }
  return text;
}
