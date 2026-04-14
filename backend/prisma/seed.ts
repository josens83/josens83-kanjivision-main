import { PrismaClient, ExamCategory, WordType, UserTier } from "@prisma/client";

const prisma = new PrismaClient();

// JLPT N5 seed — categories 1-2 (greetings + food) · 18 words.
// Categories 3-6 follow in a subsequent commit.

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
  kanji: SeedKanji[];
  mnemonic: string;
  examples: SeedExample[];
  collocations: string[];
}

// ---------- Category 1: 挨拶/日常 (10) ----------
const GREETINGS: SeedWord[] = [
  {
    lemma: "おはよう", reading: "おはよう", meaning: "good morning",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "O-HA-YOU → \"Oh! Ha, you!\" — bright surprise at seeing someone first thing.",
    examples: [
      { jp: "おはようございます。", reading: "おはようございます。", en: "Good morning (polite)." },
      { jp: "先生、おはよう。", reading: "せんせい、おはよう。", en: "Good morning, teacher." },
    ],
    collocations: ["おはようございます", "毎朝おはよう"],
  },
  {
    lemma: "すみません", reading: "すみません", meaning: "excuse me; sorry",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "SU-MI-MA-SEN → \"Soo-me-ma-sen\" — slipping apologetically through a crowd.",
    examples: [
      { jp: "すみません、トイレはどこですか。", reading: "すみません、トイレはどこですか。", en: "Excuse me, where is the restroom?" },
      { jp: "遅れてすみません。", reading: "おくれてすみません。", en: "Sorry for being late." },
    ],
    collocations: ["すみません、ちょっと", "本当にすみません"],
  },
  {
    lemma: "ありがとう", reading: "ありがとう", meaning: "thank you",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "A-RI-GA-TOU → \"Alligator\" — thank the alligator for not biting you.",
    examples: [
      { jp: "ありがとうございます。", reading: "ありがとうございます。", en: "Thank you (polite)." },
      { jp: "プレゼント、ありがとう！", reading: "プレゼント、ありがとう！", en: "Thanks for the present!" },
    ],
    collocations: ["ありがとうございます", "どうもありがとう"],
  },
  {
    lemma: "いい", reading: "いい", meaning: "good; fine",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "I-I → \"ee-ee!\" — two quick sounds of approval.",
    examples: [
      { jp: "今日はいい天気ですね。", reading: "きょうはいいてんきですね。", en: "The weather is nice today." },
      { jp: "この本はいいですよ。", reading: "このほんはいいですよ。", en: "This book is good." },
    ],
    collocations: ["いい天気", "いい人"],
  },
  {
    lemma: "元気", reading: "げんき", meaning: "healthy; energetic",
    partOfSpeech: "na-adjective", type: WordType.KANGO, category: "greeting",
    kanji: [
      { char: "元", reading: "ゲン", meaning: "origin", onyomi: ["ゲン", "ガン"], kunyomi: ["もと"] },
      { char: "気", reading: "キ", meaning: "spirit, energy", onyomi: ["キ", "ケ"] },
    ],
    mnemonic: "GEN-KI → \"Gen-key\" — the key that starts your origin-energy engine.",
    examples: [
      { jp: "お元気ですか。", reading: "おげんきですか。", en: "How are you?" },
      { jp: "子供たちはとても元気です。", reading: "こどもたちはとてもげんきです。", en: "The children are very lively." },
    ],
    collocations: ["お元気ですか", "元気な子供"],
  },
  {
    lemma: "こんにちは", reading: "こんにちは", meaning: "hello; good afternoon",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "KON-NI-CHI-WA → \"Cone-nee-chee-wa\" — tip an ice-cream cone to greet a friend.",
    examples: [
      { jp: "こんにちは、田中さん。", reading: "こんにちは、たなかさん。", en: "Hello, Tanaka-san." },
      { jp: "こんにちは、元気ですか。", reading: "こんにちは、げんきですか。", en: "Hi, how are you?" },
    ],
    collocations: ["みなさん、こんにちは", "こんにちは、先生"],
  },
  {
    lemma: "さようなら", reading: "さようなら", meaning: "goodbye",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "SA-YOU-NA-RA → \"Say-oh-na-ra\" — \"say so-long\" with a long wave.",
    examples: [
      { jp: "さようなら、また明日。", reading: "さようなら、またあした。", en: "Goodbye, see you tomorrow." },
      { jp: "先生にさようならを言う。", reading: "せんせいにさようならをいう。", en: "I say goodbye to the teacher." },
    ],
    collocations: ["さようなら、みんな", "また明日、さようなら"],
  },
  {
    lemma: "お願い", reading: "おねがい", meaning: "please; a request",
    partOfSpeech: "noun / interjection", type: WordType.KANGO, category: "greeting",
    kanji: [{ char: "願", reading: "ねが(い)", meaning: "wish, request", onyomi: ["ガン"], kunyomi: ["ねが(う)"] }],
    mnemonic: "O-NE-GA-I → \"Oh-neh-guy\" — the O-neh-guy bows to ask a favor.",
    examples: [
      { jp: "お願いします。", reading: "おねがいします。", en: "Please (I request it)." },
      { jp: "一つお願いがあります。", reading: "ひとつおねがいがあります。", en: "I have one request." },
    ],
    collocations: ["お願いします", "一つのお願い"],
  },
  {
    lemma: "はい", reading: "はい", meaning: "yes",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "HAI → \"High\" — raise your hand up high to affirm.",
    examples: [
      { jp: "はい、わかりました。", reading: "はい、わかりました。", en: "Yes, I understand." },
      { jp: "はい、そうです。", reading: "はい、そうです。", en: "Yes, that's right." },
    ],
    collocations: ["はい、どうぞ", "はい、そうです"],
  },
  {
    lemma: "いいえ", reading: "いいえ", meaning: "no",
    partOfSpeech: "interjection", type: WordType.WAGO, category: "greeting", kanji: [],
    mnemonic: "I-I-E → \"Ee-eh\" — a hesitant head-shake that trails to \"no\".",
    examples: [
      { jp: "いいえ、違います。", reading: "いいえ、ちがいます。", en: "No, that's wrong." },
      { jp: "いいえ、結構です。", reading: "いいえ、けっこうです。", en: "No, I'm fine (polite refusal)." },
    ],
    collocations: ["いいえ、違います", "いいえ、結構です"],
  },
];

// ---------- Category 2: 食べ物 (8) ----------
const FOOD: SeedWord[] = [
  {
    lemma: "ごはん", reading: "ごはん", meaning: "cooked rice; a meal",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food", kanji: [],
    mnemonic: "GO-HAN → \"Go, Han!\" — Han Solo dashing to a hot rice bowl.",
    examples: [
      { jp: "ごはんを食べましょう。", reading: "ごはんをたべましょう。", en: "Let's eat." },
      { jp: "朝ごはんはパンです。", reading: "あさごはんはパンです。", en: "Breakfast is bread." },
    ],
    collocations: ["朝ごはん", "ごはんを食べる"],
  },
  {
    lemma: "水", reading: "みず", meaning: "water",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    kanji: [{ char: "水", reading: "みず", meaning: "water", onyomi: ["スイ"], kunyomi: ["みず"] }],
    mnemonic: "MI-ZU → \"Me-zoo\" — every zoo animal needs water.",
    examples: [
      { jp: "水を一杯ください。", reading: "みずをいっぱいください。", en: "One glass of water, please." },
      { jp: "冷たい水が好きです。", reading: "つめたいみずがすきです。", en: "I like cold water." },
    ],
    collocations: ["水を飲む", "冷たい水"],
  },
  {
    lemma: "肉", reading: "にく", meaning: "meat",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    kanji: [{ char: "肉", reading: "にく", meaning: "meat, flesh", onyomi: ["ニク"], kunyomi: [] }],
    mnemonic: "NI-KU → \"Knee-ku\" — 肉 looks like ribs hanging from a hook.",
    examples: [
      { jp: "肉が大好きです。", reading: "にくがだいすきです。", en: "I love meat." },
      { jp: "今夜は肉を食べます。", reading: "こんやはにくをたべます。", en: "I'll eat meat tonight." },
    ],
    collocations: ["肉を食べる", "お肉屋さん"],
  },
  {
    lemma: "魚", reading: "さかな", meaning: "fish",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    kanji: [{ char: "魚", reading: "さかな", meaning: "fish", onyomi: ["ギョ"], kunyomi: ["さかな", "うお"] }],
    mnemonic: "SA-KA-NA → the kanji 魚 is literally a fish — head, scaled body, tail fins.",
    examples: [
      { jp: "魚が好きです。", reading: "さかながすきです。", en: "I like fish." },
      { jp: "魚を焼きます。", reading: "さかなをやきます。", en: "I'll grill fish." },
    ],
    collocations: ["魚を食べる", "新しい魚"],
  },
  {
    lemma: "おいしい", reading: "おいしい", meaning: "delicious; tasty",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "food", kanji: [],
    mnemonic: "O-I-SHI-I → \"Oh-ee-she-ee!\" — a gasp of joy after the first bite.",
    examples: [
      { jp: "このケーキはおいしい。", reading: "このケーキはおいしい。", en: "This cake is delicious." },
      { jp: "とてもおいしかったです。", reading: "とてもおいしかったです。", en: "It was very tasty." },
    ],
    collocations: ["おいしい料理", "とてもおいしい"],
  },
  {
    lemma: "食堂", reading: "しょくどう", meaning: "cafeteria; dining hall",
    partOfSpeech: "noun", type: WordType.KANGO, category: "food",
    kanji: [
      { char: "食", reading: "ショク", meaning: "eat, food", onyomi: ["ショク"], kunyomi: ["た(べる)", "く(う)"] },
      { char: "堂", reading: "ドウ", meaning: "hall, chamber", onyomi: ["ドウ"] },
    ],
    mnemonic: "SHOKU-DOU → 食 (eat) + 堂 (hall) = \"eating hall\" → cafeteria.",
    examples: [
      { jp: "学校の食堂で食べます。", reading: "がっこうのしょくどうでたべます。", en: "I eat in the school cafeteria." },
      { jp: "食堂は一階にあります。", reading: "しょくどうはいっかいにあります。", en: "The cafeteria is on the first floor." },
    ],
    collocations: ["社員食堂", "学生食堂"],
  },
  {
    lemma: "パン", reading: "パン", meaning: "bread",
    partOfSpeech: "noun", type: WordType.GAIRAIGO, category: "food", kanji: [],
    mnemonic: "PAN → from Portuguese \"pão\" — baking bread in a pan.",
    examples: [
      { jp: "朝はパンを食べます。", reading: "あさはパンをたべます。", en: "I eat bread in the morning." },
      { jp: "このパンは温かい。", reading: "このパンはあたたかい。", en: "This bread is warm." },
    ],
    collocations: ["パンを焼く", "食パン"],
  },
  {
    lemma: "お茶", reading: "おちゃ", meaning: "(green) tea",
    partOfSpeech: "noun", type: WordType.KANGO, category: "food",
    kanji: [{ char: "茶", reading: "チャ", meaning: "tea", onyomi: ["チャ", "サ"] }],
    mnemonic: "O-CHA → honorific お politely offers a soothing cup of tea.",
    examples: [
      { jp: "お茶をどうぞ。", reading: "おちゃをどうぞ。", en: "Please have some tea." },
      { jp: "日本のお茶は緑です。", reading: "にほんのおちゃはみどりです。", en: "Japanese tea is green." },
    ],
    collocations: ["お茶を飲む", "緑茶"],
  },
];

const ALL: SeedWord[] = [...GREETINGS, ...FOOD];

async function main() {
  for (const s of ALL) {
    await prisma.word.upsert({
      where: { lemma_reading: { lemma: s.lemma, reading: s.reading } },
      update: {
        meaning: s.meaning,
        partOfSpeech: s.partOfSpeech,
        type: s.type,
        category: s.category,
        mnemonic: s.mnemonic,
        examples: s.examples,
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
        examples: s.examples,
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
  console.log(`Seeded ${ALL.length} JLPT N5 words (categories 1-2).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
