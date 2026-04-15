// KanjiVision AI — Prisma seed (JLPT N5, 10 inlined words).
// Matches the current schema (commit 605f496):
//   Word: lemma / reading / meaning / examCategory / type / category /
//         tierRequired / mnemonic / examples (Json) / collocations
//   KanjiPart: wordId / position / char / reading / meaning / onyomi / kunyomi
// Unique key: @@unique([lemma, reading]) -> composite `lemma_reading`.
//
// Keeping the seed inlined (not imported from ../../src/data/words) so it
// works inside the Docker runtime image where only `backend/` is copied.
// 10 greetings now; later batches will extend back to 50.

import {
  PrismaClient,
  ExamCategory,
  Prisma,
  UserTier,
  WordType,
} from "@prisma/client";

const prisma = new PrismaClient();

interface SeedKanji {
  char: string;
  reading: string;
  meaning: string;
  onyomi?: string[];
  kunyomi?: string[];
}

interface SeedExample {
  jp: string;
  reading: string;
  en: string;
}

interface SeedWord {
  lemma: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  type: WordType;
  category: string;
  mnemonic: string;
  examples: SeedExample[];
  collocations: string[];
  kanji: SeedKanji[];
}

const SEED: SeedWord[] = [
  {
    lemma: "おはよう", reading: "おはよう", meaning: "good morning",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "O-HA-YOU → \"Oh! Ha, you!\" — bright surprise on first seeing someone.",
    examples: [
      { jp: "おはようございます。", reading: "おはようございます。", en: "Good morning (polite)." },
      { jp: "先生、おはよう。", reading: "せんせい、おはよう。", en: "Good morning, teacher." },
    ],
    collocations: ["おはようございます", "毎朝おはよう"],
    kanji: [],
  },
  {
    lemma: "すみません", reading: "すみません", meaning: "excuse me; sorry",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "SU-MI-MA-SEN → slipping apologetically through a crowd.",
    examples: [
      { jp: "すみません、トイレはどこですか。", reading: "すみません、トイレはどこですか。", en: "Excuse me, where is the restroom?" },
      { jp: "遅れてすみません。", reading: "おくれてすみません。", en: "Sorry for being late." },
    ],
    collocations: ["すみません、ちょっと", "本当にすみません"],
    kanji: [],
  },
  {
    lemma: "ありがとう", reading: "ありがとう", meaning: "thank you",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "A-RI-GA-TOU → \"Alligator\" — thank the alligator for not biting you.",
    examples: [
      { jp: "ありがとうございます。", reading: "ありがとうございます。", en: "Thank you (polite)." },
      { jp: "プレゼント、ありがとう！", reading: "プレゼント、ありがとう！", en: "Thanks for the present!" },
    ],
    collocations: ["ありがとうございます", "どうもありがとう"],
    kanji: [],
  },
  {
    lemma: "いい", reading: "いい", meaning: "good; fine",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "greeting",
    mnemonic: "I-I → \"ee-ee!\" — two quick sounds of approval.",
    examples: [
      { jp: "今日はいい天気ですね。", reading: "きょうはいいてんきですね。", en: "The weather is nice today." },
      { jp: "この本はいいですよ。", reading: "このほんはいいですよ。", en: "This book is good." },
    ],
    collocations: ["いい天気", "いい人"],
    kanji: [],
  },
  {
    lemma: "元気", reading: "げんき", meaning: "healthy; energetic",
    partOfSpeech: "na-adjective", type: WordType.KANGO, category: "greeting",
    mnemonic: "GEN-KI → origin (元) + energy (気) = the key that starts your energy engine.",
    examples: [
      { jp: "お元気ですか。", reading: "おげんきですか。", en: "How are you?" },
      { jp: "子供たちはとても元気です。", reading: "こどもたちはとてもげんきです。", en: "The children are very lively." },
    ],
    collocations: ["お元気ですか", "元気な子供"],
    kanji: [
      { char: "元", reading: "ゲン", meaning: "origin", onyomi: ["ゲン", "ガン"], kunyomi: ["もと"] },
      { char: "気", reading: "キ", meaning: "spirit, energy", onyomi: ["キ", "ケ"] },
    ],
  },
  {
    lemma: "こんにちは", reading: "こんにちは", meaning: "hello; good afternoon",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "KON-NI-CHI-WA → tip a cone to greet a friend at noon.",
    examples: [
      { jp: "こんにちは、田中さん。", reading: "こんにちは、たなかさん。", en: "Hello, Tanaka-san." },
      { jp: "こんにちは、元気ですか。", reading: "こんにちは、げんきですか。", en: "Hi, how are you?" },
    ],
    collocations: ["みなさん、こんにちは", "こんにちは、先生"],
    kanji: [],
  },
  {
    lemma: "さようなら", reading: "さようなら", meaning: "goodbye",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "SA-YOU-NA-RA → \"say so-long\" with a long wave.",
    examples: [
      { jp: "さようなら、また明日。", reading: "さようなら、またあした。", en: "Goodbye, see you tomorrow." },
      { jp: "先生にさようならを言う。", reading: "せんせいにさようならをいう。", en: "I say goodbye to the teacher." },
    ],
    collocations: ["さようなら、みんな", "また明日、さようなら"],
    kanji: [],
  },
  {
    lemma: "お願い", reading: "おねがい", meaning: "please; a request",
    partOfSpeech: "noun / interjection", type: WordType.KANGO, category: "greeting",
    mnemonic: "O-NE-GA-I → the O-neh-guy bows to ask a favor.",
    examples: [
      { jp: "お願いします。", reading: "おねがいします。", en: "Please (I request it)." },
      { jp: "一つお願いがあります。", reading: "ひとつおねがいがあります。", en: "I have one request." },
    ],
    collocations: ["お願いします", "一つのお願い"],
    kanji: [
      { char: "願", reading: "ねが(い)", meaning: "wish, request", onyomi: ["ガン"], kunyomi: ["ねが(う)"] },
    ],
  },
  {
    lemma: "はい", reading: "はい", meaning: "yes",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "HAI → \"High\" — raise your hand up high to affirm.",
    examples: [
      { jp: "はい、わかりました。", reading: "はい、わかりました。", en: "Yes, I understand." },
      { jp: "はい、そうです。", reading: "はい、そうです。", en: "Yes, that's right." },
    ],
    collocations: ["はい、どうぞ", "はい、そうです"],
    kanji: [],
  },
  {
    lemma: "いいえ", reading: "いいえ", meaning: "no",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting",
    mnemonic: "I-I-E → a hesitant head-shake that trails to \"no\".",
    examples: [
      { jp: "いいえ、違います。", reading: "いいえ、ちがいます。", en: "No, that's wrong." },
      { jp: "いいえ、結構です。", reading: "いいえ、けっこうです。", en: "No, I'm fine (polite refusal)." },
    ],
    collocations: ["いいえ、違います", "いいえ、結構です"],
    kanji: [],
  },
];

async function main() {
  for (const s of SEED) {
    await prisma.word.upsert({
      where: { lemma_reading: { lemma: s.lemma, reading: s.reading } },
      update: {
        meaning: s.meaning,
        partOfSpeech: s.partOfSpeech,
        examCategory: ExamCategory.JLPT_N5,
        type: s.type,
        category: s.category,
        tierRequired: UserTier.FREE,
        mnemonic: s.mnemonic,
        examples: s.examples as unknown as Prisma.InputJsonValue,
        collocations: s.collocations,
      },
      create: {
        lemma: s.lemma,
        reading: s.reading,
        meaning: s.meaning,
        partOfSpeech: s.partOfSpeech,
        examCategory: ExamCategory.JLPT_N5,
        type: s.type,
        category: s.category,
        tierRequired: UserTier.FREE,
        mnemonic: s.mnemonic,
        examples: s.examples as unknown as Prisma.InputJsonValue,
        collocations: s.collocations,
        kanjiParts: {
          create: s.kanji.map((k, i) => ({
            position: i,
            char: k.char,
            reading: k.reading,
            meaning: k.meaning,
            onyomi: k.onyomi ?? [],
            kunyomi: k.kunyomi ?? [],
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
