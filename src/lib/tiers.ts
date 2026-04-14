import type { ExamCategory } from "@/data/words";

export type Tier = "free" | "basic" | "premium";

export interface Plan {
  id: string;
  name: string;
  price: string;
  priceKRW?: string;
  tier: Tier;
  blurb: string;
  includes: ExamCategory[];
  features: string[];
  highlight?: boolean;
  paddleProductEnv?: string;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    priceKRW: "₩0",
    tier: "free",
    blurb: "Start with N5 fundamentals.",
    includes: ["JLPT_N5"],
    features: [
      "N5 — 800 core words",
      "Kanji decomposition",
      "AI mnemonic cards",
      "Spaced repetition (SM-2)",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: "$4.99/mo",
    priceKRW: "₩6,900/월",
    tier: "basic",
    blurb: "Build toward daily conversation.",
    includes: ["JLPT_N5", "JLPT_N4"],
    features: [
      "Everything in Free",
      "N4 — 1,500 words",
      "Daily listening drills",
      "Mobile PWA (offline review)",
    ],
    paddleProductEnv: "PADDLE_PRODUCT_BASIC",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$7.99/mo",
    priceKRW: "₩10,900/월",
    tier: "premium",
    blurb: "Full N5 → N1 pathway. Most popular.",
    includes: ["JLPT_N5", "JLPT_N4", "JLPT_N3", "JLPT_N2", "JLPT_N1"],
    features: [
      "Everything in Basic",
      "N3 / N2 / N1 — 10,000 words total",
      "Anime / Manga vocabulary packs",
      "AI example-sentence generator",
      "Export cards to Anki",
    ],
    highlight: true,
    paddleProductEnv: "PADDLE_PRODUCT_PREMIUM",
  },
];

export const ONE_SHOT_PACKS: Plan[] = [
  {
    id: "pack-n3",
    name: "N3 Pack",
    price: "$6.99",
    priceKRW: "₩9,900",
    tier: "premium",
    blurb: "Intermediate — 3,750 words.",
    includes: ["JLPT_N3"],
    features: ["Lifetime access to N3 deck"],
    paddleProductEnv: "PADDLE_PRODUCT_N3",
  },
  {
    id: "pack-n2",
    name: "N2 Pack",
    price: "$9.99",
    priceKRW: "₩13,900",
    tier: "premium",
    blurb: "Upper-intermediate — 6,000 words.",
    includes: ["JLPT_N2"],
    features: ["Lifetime access to N2 deck"],
    paddleProductEnv: "PADDLE_PRODUCT_N2",
  },
  {
    id: "pack-n1",
    name: "N1 Pack",
    price: "$12.99",
    priceKRW: "₩17,900",
    tier: "premium",
    blurb: "Advanced — 10,000 words.",
    includes: ["JLPT_N1"],
    features: ["Lifetime access to N1 deck"],
    paddleProductEnv: "PADDLE_PRODUCT_N1",
  },
];

export function hasAccess(userTier: Tier, wordTier: Tier): boolean {
  const order: Tier[] = ["free", "basic", "premium"];
  return order.indexOf(userTier) >= order.indexOf(wordTier);
}

export function levelTier(level: ExamCategory): Tier {
  if (level === "JLPT_N5") return "free";
  if (level === "JLPT_N4") return "basic";
  return "premium";
}
