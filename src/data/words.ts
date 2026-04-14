// KanjiVision AI — Seed vocabulary (JLPT N5)
// 10 seed words as per MVP spec. Etymology uses 漢字分解 (kanji decomposition).

export type ExamCategory = "JLPT_N5" | "JLPT_N4" | "JLPT_N3" | "JLPT_N2" | "JLPT_N1";

export type WordType = "漢語" | "和語" | "外来語";

export interface KanjiPart {
  char: string;          // the kanji, e.g. "学"
  reading: string;       // kun/on reading in use, e.g. "まなぶ"
  meaning: string;       // gloss, e.g. "learn"
  onyomi?: string[];     // e.g. ["ガク"]
  kunyomi?: string[];    // e.g. ["まなぶ"]
}

export interface Word {
  id: string;
  lemma: string;          // surface form, e.g. "学校"
  reading: string;        // full furigana, e.g. "がっこう"
  meaning: string;        // English gloss
  partOfSpeech: string;   // noun / verb / i-adj / na-adj ...
  examCategory: ExamCategory;
  type: WordType;
  kanji: KanjiPart[];     // decomposition (may be empty for 和語/外来語 without kanji)
  mnemonic: string;       // EN mnemonic
  example: {
    jp: string;
    reading: string;
    en: string;
  };
  tier: "free" | "basic" | "premium";
}

export const WORDS: Word[] = [
  {
    id: "n5-001",
    lemma: "食べる",
    reading: "たべる",
    meaning: "to eat",
    partOfSpeech: "verb (ichidan)",
    examCategory: "JLPT_N5",
    type: "和語",
    kanji: [
      { char: "食", reading: "た(べる)", meaning: "eat / food", onyomi: ["ショク"], kunyomi: ["た(べる)", "く(う)"] },
    ],
    mnemonic: "食 shows a lid over a table of food — imagine lifting the lid to eat.",
    example: { jp: "ご飯を食べる。", reading: "ごはんをたべる。", en: "I eat rice." },
    tier: "free",
  },
  {
    id: "n5-002",
    lemma: "飲む",
    reading: "のむ",
    meaning: "to drink",
    partOfSpeech: "verb (godan)",
    examCategory: "JLPT_N5",
    type: "和語",
    kanji: [
      { char: "飲", reading: "の(む)", meaning: "drink", onyomi: ["イン"], kunyomi: ["の(む)"] },
    ],
    mnemonic: "飲 = 食 (food radical) + 欠 (yawn) — opening the mouth to drink.",
    example: { jp: "水を飲む。", reading: "みずをのむ。", en: "I drink water." },
    tier: "free",
  },
  {
    id: "n5-003",
    lemma: "書く",
    reading: "かく",
    meaning: "to write",
    partOfSpeech: "verb (godan)",
    examCategory: "JLPT_N5",
    type: "和語",
    kanji: [
      { char: "書", reading: "か(く)", meaning: "write / book", onyomi: ["ショ"], kunyomi: ["か(く)"] },
    ],
    mnemonic: "書 shows a brush (聿) above 日 (the sun/day) — writing a diary each day.",
    example: { jp: "手紙を書く。", reading: "てがみをかく。", en: "I write a letter." },
    tier: "free",
  },
  {
    id: "n5-004",
    lemma: "読む",
    reading: "よむ",
    meaning: "to read",
    partOfSpeech: "verb (godan)",
    examCategory: "JLPT_N5",
    type: "和語",
    kanji: [
      { char: "読", reading: "よ(む)", meaning: "read", onyomi: ["ドク", "トク"], kunyomi: ["よ(む)"] },
    ],
    mnemonic: "読 = 言 (speech) + 売 (sell) — reading aloud as if selling the words.",
    example: { jp: "本を読む。", reading: "ほんをよむ。", en: "I read a book." },
    tier: "free",
  },
  {
    id: "n5-005",
    lemma: "大きい",
    reading: "おおきい",
    meaning: "big, large",
    partOfSpeech: "i-adjective",
    examCategory: "JLPT_N5",
    type: "和語",
    kanji: [
      { char: "大", reading: "おお(きい)", meaning: "big", onyomi: ["ダイ", "タイ"], kunyomi: ["おお(きい)"] },
    ],
    mnemonic: "大 is a person stretching arms wide — 'this big!'",
    example: { jp: "大きい犬。", reading: "おおきいいぬ。", en: "A big dog." },
    tier: "free",
  },
  {
    id: "n5-006",
    lemma: "小さい",
    reading: "ちいさい",
    meaning: "small, little",
    partOfSpeech: "i-adjective",
    examCategory: "JLPT_N5",
    type: "和語",
    kanji: [
      { char: "小", reading: "ちい(さい)", meaning: "small", onyomi: ["ショウ"], kunyomi: ["ちい(さい)", "こ"] },
    ],
    mnemonic: "小 shows a tiny figure with two little specks at its side — small things.",
    example: { jp: "小さい猫。", reading: "ちいさいねこ。", en: "A small cat." },
    tier: "free",
  },
  {
    id: "n5-007",
    lemma: "学校",
    reading: "がっこう",
    meaning: "school",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "漢語",
    kanji: [
      { char: "学", reading: "ガク", meaning: "learn, study", onyomi: ["ガク"], kunyomi: ["まな(ぶ)"] },
      { char: "校", reading: "コウ", meaning: "school building", onyomi: ["コウ"] },
    ],
    mnemonic: "学 (learn) + 校 (building) = 'a building for learning' → school.",
    example: { jp: "学校へ行く。", reading: "がっこうへいく。", en: "I go to school." },
    tier: "free",
  },
  {
    id: "n5-008",
    lemma: "先生",
    reading: "せんせい",
    meaning: "teacher, doctor",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "漢語",
    kanji: [
      { char: "先", reading: "セン", meaning: "ahead, previous", onyomi: ["セン"], kunyomi: ["さき"] },
      { char: "生", reading: "セイ", meaning: "born, life", onyomi: ["セイ", "ショウ"], kunyomi: ["う(まれる)", "い(きる)"] },
    ],
    mnemonic: "先 (ahead) + 生 (born) = 'born ahead of you' → teacher / master.",
    example: { jp: "田中先生は優しい。", reading: "たなかせんせいはやさしい。", en: "Tanaka-sensei is kind." },
    tier: "free",
  },
  {
    id: "n5-009",
    lemma: "友達",
    reading: "ともだち",
    meaning: "friend",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "漢語",
    kanji: [
      { char: "友", reading: "とも", meaning: "friend", onyomi: ["ユウ"], kunyomi: ["とも"] },
      { char: "達", reading: "たち / ダツ", meaning: "reach, plural marker", onyomi: ["タツ"] },
    ],
    mnemonic: "友 (friend) + 達 (pluralizer) — 'friend and those who reach alongside' = friends.",
    example: { jp: "友達と遊ぶ。", reading: "ともだちとあそぶ。", en: "I play with a friend." },
    tier: "free",
  },
  {
    id: "n5-010",
    lemma: "天気",
    reading: "てんき",
    meaning: "weather",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "漢語",
    kanji: [
      { char: "天", reading: "テン", meaning: "heaven, sky", onyomi: ["テン"], kunyomi: ["あま", "あめ"] },
      { char: "気", reading: "キ", meaning: "spirit, air, mood", onyomi: ["キ", "ケ"] },
    ],
    mnemonic: "天 (sky) + 気 (air / spirit) = 'the mood of the sky' → weather.",
    example: { jp: "今日は天気がいい。", reading: "きょうはてんきがいい。", en: "The weather is nice today." },
    tier: "free",
  },
];

export const EXAM_LEVELS: { id: ExamCategory; label: string; cefr: string; words: number; kanji: number; tier: "free" | "basic" | "premium" }[] = [
  { id: "JLPT_N5", label: "N5 (Beginner)", cefr: "A1", words: 800, kanji: 100, tier: "free" },
  { id: "JLPT_N4", label: "N4 (Upper-Beginner)", cefr: "A2", words: 1500, kanji: 300, tier: "basic" },
  { id: "JLPT_N3", label: "N3 (Intermediate)", cefr: "B1", words: 3750, kanji: 650, tier: "premium" },
  { id: "JLPT_N2", label: "N2 (Upper-Intermediate)", cefr: "B2", words: 6000, kanji: 1000, tier: "premium" },
  { id: "JLPT_N1", label: "N1 (Advanced)", cefr: "C1", words: 10000, kanji: 2000, tier: "premium" },
];

export function wordsByLevel(level: ExamCategory): Word[] {
  return WORDS.filter((w) => w.examCategory === level);
}
