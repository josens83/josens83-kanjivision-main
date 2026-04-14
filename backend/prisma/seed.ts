import { PrismaClient, ExamCategory, WordType, UserTier } from "@prisma/client";

const prisma = new PrismaClient();

// 10 JLPT N5 seed words (mirrors frontend src/data/words.ts).
const SEED = [
  {
    lemma: "食べる", reading: "たべる", meaning: "to eat",
    partOfSpeech: "verb (ichidan)", type: WordType.WAGO,
    kanji: [{ char: "食", reading: "た(べる)", meaning: "eat / food", onyomi: ["ショク"], kunyomi: ["た(べる)", "く(う)"] }],
    mnemonic: "食 shows a lid over a table of food — imagine lifting the lid to eat.",
    ex: { jp: "ご飯を食べる。", reading: "ごはんをたべる。", en: "I eat rice." },
  },
  {
    lemma: "飲む", reading: "のむ", meaning: "to drink",
    partOfSpeech: "verb (godan)", type: WordType.WAGO,
    kanji: [{ char: "飲", reading: "の(む)", meaning: "drink", onyomi: ["イン"], kunyomi: ["の(む)"] }],
    mnemonic: "飲 = 食 (food radical) + 欠 (yawn) — opening the mouth to drink.",
    ex: { jp: "水を飲む。", reading: "みずをのむ。", en: "I drink water." },
  },
  {
    lemma: "書く", reading: "かく", meaning: "to write",
    partOfSpeech: "verb (godan)", type: WordType.WAGO,
    kanji: [{ char: "書", reading: "か(く)", meaning: "write / book", onyomi: ["ショ"], kunyomi: ["か(く)"] }],
    mnemonic: "書 shows a brush above 日 — writing a diary each day.",
    ex: { jp: "手紙を書く。", reading: "てがみをかく。", en: "I write a letter." },
  },
  {
    lemma: "読む", reading: "よむ", meaning: "to read",
    partOfSpeech: "verb (godan)", type: WordType.WAGO,
    kanji: [{ char: "読", reading: "よ(む)", meaning: "read", onyomi: ["ドク", "トク"], kunyomi: ["よ(む)"] }],
    mnemonic: "読 = 言 (speech) + 売 (sell) — reading aloud as if selling the words.",
    ex: { jp: "本を読む。", reading: "ほんをよむ。", en: "I read a book." },
  },
  {
    lemma: "大きい", reading: "おおきい", meaning: "big, large",
    partOfSpeech: "i-adjective", type: WordType.WAGO,
    kanji: [{ char: "大", reading: "おお(きい)", meaning: "big", onyomi: ["ダイ", "タイ"], kunyomi: ["おお(きい)"] }],
    mnemonic: "大 is a person stretching arms wide — 'this big!'",
    ex: { jp: "大きい犬。", reading: "おおきいいぬ。", en: "A big dog." },
  },
  {
    lemma: "小さい", reading: "ちいさい", meaning: "small, little",
    partOfSpeech: "i-adjective", type: WordType.WAGO,
    kanji: [{ char: "小", reading: "ちい(さい)", meaning: "small", onyomi: ["ショウ"], kunyomi: ["ちい(さい)", "こ"] }],
    mnemonic: "小 shows a tiny figure with two little specks — small things.",
    ex: { jp: "小さい猫。", reading: "ちいさいねこ。", en: "A small cat." },
  },
  {
    lemma: "学校", reading: "がっこう", meaning: "school",
    partOfSpeech: "noun", type: WordType.KANGO,
    kanji: [
      { char: "学", reading: "ガク", meaning: "learn, study", onyomi: ["ガク"], kunyomi: ["まな(ぶ)"] },
      { char: "校", reading: "コウ", meaning: "school building", onyomi: ["コウ"], kunyomi: [] },
    ],
    mnemonic: "学 (learn) + 校 (building) = a 'building for learning' → school.",
    ex: { jp: "学校へ行く。", reading: "がっこうへいく。", en: "I go to school." },
  },
  {
    lemma: "先生", reading: "せんせい", meaning: "teacher, doctor",
    partOfSpeech: "noun", type: WordType.KANGO,
    kanji: [
      { char: "先", reading: "セン", meaning: "ahead, previous", onyomi: ["セン"], kunyomi: ["さき"] },
      { char: "生", reading: "セイ", meaning: "born, life", onyomi: ["セイ", "ショウ"], kunyomi: ["う(まれる)", "い(きる)"] },
    ],
    mnemonic: "先 (ahead) + 生 (born) = 'born ahead of you' → teacher / master.",
    ex: { jp: "田中先生は優しい。", reading: "たなかせんせいはやさしい。", en: "Tanaka-sensei is kind." },
  },
  {
    lemma: "友達", reading: "ともだち", meaning: "friend",
    partOfSpeech: "noun", type: WordType.KANGO,
    kanji: [
      { char: "友", reading: "とも", meaning: "friend", onyomi: ["ユウ"], kunyomi: ["とも"] },
      { char: "達", reading: "たち / ダツ", meaning: "reach / plural marker", onyomi: ["タツ"], kunyomi: [] },
    ],
    mnemonic: "友 (friend) + 達 (pluralizer) — 'friends who reach alongside'.",
    ex: { jp: "友達と遊ぶ。", reading: "ともだちとあそぶ。", en: "I play with a friend." },
  },
  {
    lemma: "天気", reading: "てんき", meaning: "weather",
    partOfSpeech: "noun", type: WordType.KANGO,
    kanji: [
      { char: "天", reading: "テン", meaning: "heaven, sky", onyomi: ["テン"], kunyomi: ["あま", "あめ"] },
      { char: "気", reading: "キ", meaning: "spirit, air, mood", onyomi: ["キ", "ケ"], kunyomi: [] },
    ],
    mnemonic: "天 (sky) + 気 (air / spirit) = 'the mood of the sky' → weather.",
    ex: { jp: "今日は天気がいい。", reading: "きょうはてんきがいい。", en: "The weather is nice today." },
  },
];

async function main() {
  for (const s of SEED) {
    await prisma.word.upsert({
      where: { lemma_reading: { lemma: s.lemma, reading: s.reading } },
      update: {},
      create: {
        lemma: s.lemma,
        reading: s.reading,
        meaning: s.meaning,
        partOfSpeech: s.partOfSpeech,
        examCategory: ExamCategory.JLPT_N5,
        type: s.type,
        tierRequired: UserTier.FREE,
        mnemonic: s.mnemonic,
        exampleJp: s.ex.jp,
        exampleReading: s.ex.reading,
        exampleEn: s.ex.en,
        kanjiParts: {
          create: s.kanji.map((k, i) => ({
            position: i,
            char: k.char,
            reading: k.reading,
            meaning: k.meaning,
            onyomi: k.onyomi,
            kunyomi: k.kunyomi,
          })),
        },
      },
    });
  }
  console.log(`Seeded ${SEED.length} JLPT N5 words.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
