// KanjiVision AI — Prisma seed (JLPT N5, 10 inlined words).
// Matches the current schema (commit 605f496):
//   Word: lemma / reading / meaning / examCategory / type / category /
//         tierRequired / mnemonic / examples (Json) / collocations
//   KanjiPart: wordId / position / char / reading / meaning / onyomi / kunyomi
// Unique key: @@unique([lemma, reading]) -> composite `lemma_reading`.
//
// Keeping the seed inlined (not imported from ../../src/data/words) so it
// works inside the Docker runtime image where only `backend/` is copied.
// 30 words now (10 greetings + 20 verbs/adjectives/family/place/time);
// later batches will extend back to 50.

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

  // --- Verbs (4) ---
  {
    lemma: "食べる", reading: "たべる", meaning: "to eat",
    partOfSpeech: "verb (ichidan)", type: WordType.WAGO, category: "verb",
    mnemonic: "TA-BE-RU → 食 shows a lid over a table of food — lift the lid to eat.",
    examples: [
      { jp: "ごはんを食べる。", reading: "ごはんをたべる。", en: "I eat rice." },
      { jp: "肉を食べます。", reading: "にくをたべます。", en: "I'll eat meat." },
    ],
    collocations: ["朝ごはんを食べる", "よく食べる"],
    kanji: [
      { char: "食", reading: "た(べる)", meaning: "eat, food", onyomi: ["ショク"], kunyomi: ["た(べる)", "く(う)"] },
    ],
  },
  {
    lemma: "飲む", reading: "のむ", meaning: "to drink",
    partOfSpeech: "verb (godan)", type: WordType.WAGO, category: "verb",
    mnemonic: "NO-MU → 飲 = 食 (food radical) + 欠 (yawn) — open mouth to drink.",
    examples: [
      { jp: "水を飲む。", reading: "みずをのむ。", en: "I drink water." },
      { jp: "お茶を飲みます。", reading: "おちゃをのみます。", en: "I'll drink tea." },
    ],
    collocations: ["水を飲む", "薬を飲む"],
    kanji: [
      { char: "飲", reading: "の(む)", meaning: "drink", onyomi: ["イン"], kunyomi: ["の(む)"] },
    ],
  },
  {
    lemma: "書く", reading: "かく", meaning: "to write",
    partOfSpeech: "verb (godan)", type: WordType.WAGO, category: "verb",
    mnemonic: "KA-KU → 書 shows a brush (聿) over 日 (day) — writing a diary each day.",
    examples: [
      { jp: "手紙を書く。", reading: "てがみをかく。", en: "I write a letter." },
      { jp: "名前を書きます。", reading: "なまえをかきます。", en: "I write my name." },
    ],
    collocations: ["名前を書く", "手紙を書く"],
    kanji: [
      { char: "書", reading: "か(く)", meaning: "write, book", onyomi: ["ショ"], kunyomi: ["か(く)"] },
    ],
  },
  {
    lemma: "読む", reading: "よむ", meaning: "to read",
    partOfSpeech: "verb (godan)", type: WordType.WAGO, category: "verb",
    mnemonic: "YO-MU → 読 = 言 (speech) + 売 (sell) — reading aloud as if selling the words.",
    examples: [
      { jp: "本を読む。", reading: "ほんをよむ。", en: "I read a book." },
      { jp: "新聞を読みます。", reading: "しんぶんをよみます。", en: "I read the newspaper." },
    ],
    collocations: ["本を読む", "新聞を読む"],
    kanji: [
      { char: "読", reading: "よ(む)", meaning: "read", onyomi: ["ドク", "トク"], kunyomi: ["よ(む)"] },
    ],
  },

  // --- Size i-adjectives (2) ---
  {
    lemma: "大きい", reading: "おおきい", meaning: "big, large",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "adjective",
    mnemonic: "OO-KI-I → 大 is a person stretching arms wide — \"this big!\"",
    examples: [
      { jp: "大きい犬です。", reading: "おおきいいぬです。", en: "It's a big dog." },
      { jp: "大きい声で話す。", reading: "おおきいこえではなす。", en: "Speak in a loud voice." },
    ],
    collocations: ["大きい犬", "大きい声"],
    kanji: [
      { char: "大", reading: "おお(きい)", meaning: "big", onyomi: ["ダイ", "タイ"], kunyomi: ["おお(きい)"] },
    ],
  },
  {
    lemma: "小さい", reading: "ちいさい", meaning: "small, little",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "adjective",
    mnemonic: "CHI-I-SA-I → 小 is a tiny figure with two specks at its side — small things.",
    examples: [
      { jp: "小さい猫です。", reading: "ちいさいねこです。", en: "It's a small cat." },
      { jp: "小さいかばんが欲しい。", reading: "ちいさいかばんがほしい。", en: "I want a small bag." },
    ],
    collocations: ["小さい子", "小さい声"],
    kanji: [
      { char: "小", reading: "ちい(さい)", meaning: "small", onyomi: ["ショウ"], kunyomi: ["ちい(さい)", "こ"] },
    ],
  },

  // --- Family + school (4) ---
  {
    lemma: "学校", reading: "がっこう", meaning: "school",
    partOfSpeech: "noun", type: WordType.KANGO, category: "place",
    mnemonic: "GAK-KOU → 学 (learn) + 校 (building) = 'building for learning' → school.",
    examples: [
      { jp: "学校へ行きます。", reading: "がっこうへいきます。", en: "I go to school." },
      { jp: "新しい学校は大きい。", reading: "あたらしいがっこうはおおきい。", en: "The new school is big." },
    ],
    collocations: ["小学校", "学校に行く"],
    kanji: [
      { char: "学", reading: "ガク", meaning: "learn, study", onyomi: ["ガク"], kunyomi: ["まな(ぶ)"] },
      { char: "校", reading: "コウ", meaning: "school building", onyomi: ["コウ"], kunyomi: [] },
    ],
  },
  {
    lemma: "先生", reading: "せんせい", meaning: "teacher; doctor",
    partOfSpeech: "noun", type: WordType.KANGO, category: "family",
    mnemonic: "SEN-SEI → 先 (ahead) + 生 (born) = 'born ahead of you' → teacher.",
    examples: [
      { jp: "田中先生は優しい。", reading: "たなかせんせいはやさしい。", en: "Tanaka-sensei is kind." },
      { jp: "先生に質問します。", reading: "せんせいにしつもんします。", en: "I'll ask the teacher a question." },
    ],
    collocations: ["日本語の先生", "先生になる"],
    kanji: [
      { char: "先", reading: "セン", meaning: "ahead, previous", onyomi: ["セン"], kunyomi: ["さき"] },
      { char: "生", reading: "セイ", meaning: "born, life", onyomi: ["セイ", "ショウ"], kunyomi: ["う(まれる)", "い(きる)"] },
    ],
  },
  {
    lemma: "友達", reading: "ともだち", meaning: "friend",
    partOfSpeech: "noun", type: WordType.KANGO, category: "family",
    mnemonic: "TO-MO-DA-CHI → 友 (friend) + 達 (reach) = 'friends who reach alongside'.",
    examples: [
      { jp: "友達と遊ぶ。", reading: "ともだちとあそぶ。", en: "I play with a friend." },
      { jp: "いい友達がいます。", reading: "いいともだちがいます。", en: "I have good friends." },
    ],
    collocations: ["いい友達", "古い友達"],
    kanji: [
      { char: "友", reading: "とも", meaning: "friend", onyomi: ["ユウ"], kunyomi: ["とも"] },
      { char: "達", reading: "たち / ダツ", meaning: "reach; plural", onyomi: ["タツ"], kunyomi: [] },
    ],
  },
  {
    lemma: "天気", reading: "てんき", meaning: "weather",
    partOfSpeech: "noun", type: WordType.KANGO, category: "time",
    mnemonic: "TEN-KI → 天 (sky) + 気 (mood) = 'the mood of the sky' → weather.",
    examples: [
      { jp: "今日は天気がいいです。", reading: "きょうはてんきがいいです。", en: "The weather is nice today." },
      { jp: "天気予報を見ます。", reading: "てんきよほうをみます。", en: "I watch the weather forecast." },
    ],
    collocations: ["いい天気", "天気予報"],
    kanji: [
      { char: "天", reading: "テン", meaning: "heaven, sky", onyomi: ["テン"], kunyomi: ["あま", "あめ"] },
      { char: "気", reading: "キ", meaning: "spirit, air, mood", onyomi: ["キ", "ケ"], kunyomi: [] },
    ],
  },

  // --- Place / transport (7) ---
  {
    lemma: "駅", reading: "えき", meaning: "(train) station",
    partOfSpeech: "noun", type: WordType.WAGO, category: "place",
    mnemonic: "E-KI → the key to boarding the train waits at the station.",
    examples: [
      { jp: "駅で会いましょう。", reading: "えきであいましょう。", en: "Let's meet at the station." },
      { jp: "駅まで歩きます。", reading: "えきまであるきます。", en: "I'll walk to the station." },
    ],
    collocations: ["東京駅", "駅の前"],
    kanji: [
      { char: "駅", reading: "エキ", meaning: "station", onyomi: ["エキ"], kunyomi: [] },
    ],
  },
  {
    lemma: "病院", reading: "びょういん", meaning: "hospital",
    partOfSpeech: "noun", type: WordType.KANGO, category: "place",
    mnemonic: "BYOU-IN → \"bed you in\" at the illness-institution.",
    examples: [
      { jp: "病院へ行きます。", reading: "びょういんへいきます。", en: "I'm going to the hospital." },
      { jp: "兄は病院で働いています。", reading: "あにはびょういんではたらいています。", en: "My brother works at a hospital." },
    ],
    collocations: ["大きい病院", "病院で働く"],
    kanji: [
      { char: "病", reading: "ビョウ", meaning: "illness", onyomi: ["ビョウ", "ヘイ"], kunyomi: ["や(む)"] },
      { char: "院", reading: "イン", meaning: "institution, hall", onyomi: ["イン"], kunyomi: [] },
    ],
  },
  {
    lemma: "銀行", reading: "ぎんこう", meaning: "bank",
    partOfSpeech: "noun", type: WordType.KANGO, category: "place",
    mnemonic: "GIN-KOU → silver (銀) + trade (行) = the silver-trade place → bank.",
    examples: [
      { jp: "銀行にお金を預けます。", reading: "ぎんこうにおかねをあずけます。", en: "I'll deposit money at the bank." },
      { jp: "銀行は九時に開きます。", reading: "ぎんこうはくじにひらきます。", en: "The bank opens at 9." },
    ],
    collocations: ["銀行員", "銀行口座"],
    kanji: [
      { char: "銀", reading: "ギン", meaning: "silver", onyomi: ["ギン"], kunyomi: [] },
      { char: "行", reading: "コウ", meaning: "go; trade", onyomi: ["コウ", "ギョウ"], kunyomi: ["い(く)"] },
    ],
  },
  {
    lemma: "電車", reading: "でんしゃ", meaning: "train",
    partOfSpeech: "noun", type: WordType.KANGO, category: "place",
    mnemonic: "DEN-SHA → 電 (electricity) + 車 (car) = electric car → train.",
    examples: [
      { jp: "電車で行きます。", reading: "でんしゃでいきます。", en: "I'll go by train." },
      { jp: "電車が遅れました。", reading: "でんしゃがおくれました。", en: "The train was delayed." },
    ],
    collocations: ["電車に乗る", "次の電車"],
    kanji: [
      { char: "電", reading: "デン", meaning: "electricity", onyomi: ["デン"], kunyomi: [] },
      { char: "車", reading: "シャ", meaning: "car, vehicle", onyomi: ["シャ"], kunyomi: ["くるま"] },
    ],
  },
  {
    lemma: "バス", reading: "バス", meaning: "bus",
    partOfSpeech: "noun", type: WordType.GAIRAIGO, category: "place",
    mnemonic: "BA-SU → English \"bus\" borrowed into Japanese with a short, crisp sound.",
    examples: [
      { jp: "バスに乗ります。", reading: "バスにのります。", en: "I'll take the bus." },
      { jp: "バス停はどこですか。", reading: "バスていはどこですか。", en: "Where is the bus stop?" },
    ],
    collocations: ["バスに乗る", "バス停"],
    kanji: [],
  },
  {
    lemma: "図書館", reading: "としょかん", meaning: "library",
    partOfSpeech: "noun", type: WordType.KANGO, category: "place",
    mnemonic: "TO-SHO-KAN → 図 + 書 + 館 = the hall of diagrams and books.",
    examples: [
      { jp: "図書館で勉強します。", reading: "としょかんでべんきょうします。", en: "I study at the library." },
      { jp: "図書館は静かです。", reading: "としょかんはしずかです。", en: "The library is quiet." },
    ],
    collocations: ["図書館で借りる", "大学の図書館"],
    kanji: [
      { char: "図", reading: "ト / ズ", meaning: "diagram, plan", onyomi: ["ト", "ズ"], kunyomi: [] },
      { char: "書", reading: "ショ", meaning: "write, book", onyomi: ["ショ"], kunyomi: ["か(く)"] },
      { char: "館", reading: "カン", meaning: "hall, building", onyomi: ["カン"], kunyomi: [] },
    ],
  },
  {
    lemma: "空港", reading: "くうこう", meaning: "airport",
    partOfSpeech: "noun", type: WordType.KANGO, category: "place",
    mnemonic: "KUU-KOU → 空 (sky) + 港 (port) = sky-port → airport.",
    examples: [
      { jp: "空港までタクシーで行きます。", reading: "くうこうまでタクシーでいきます。", en: "I'll take a taxi to the airport." },
      { jp: "空港でお土産を買います。", reading: "くうこうでおみやげをかいます。", en: "I'll buy souvenirs at the airport." },
    ],
    collocations: ["成田空港", "空港に着く"],
    kanji: [
      { char: "空", reading: "クウ", meaning: "sky, empty", onyomi: ["クウ"], kunyomi: ["そら", "から"] },
      { char: "港", reading: "コウ", meaning: "port, harbor", onyomi: ["コウ"], kunyomi: ["みなと"] },
    ],
  },

  // --- Time (3) ---
  {
    lemma: "今日", reading: "きょう", meaning: "today",
    partOfSpeech: "noun / adverb", type: WordType.KANGO, category: "time",
    mnemonic: "KYOU → 今 (now) + 日 (day) = this day = today.",
    examples: [
      { jp: "今日は忙しいです。", reading: "きょうはいそがしいです。", en: "I'm busy today." },
      { jp: "今日の天気はいいです。", reading: "きょうのてんきはいいです。", en: "Today's weather is nice." },
    ],
    collocations: ["今日の夕方", "今日の午後"],
    kanji: [
      { char: "今", reading: "コン / いま", meaning: "now", onyomi: ["コン", "キン"], kunyomi: ["いま"] },
      { char: "日", reading: "ニチ / ひ", meaning: "day, sun", onyomi: ["ニチ", "ジツ"], kunyomi: ["ひ", "か"] },
    ],
  },
  {
    lemma: "明日", reading: "あした", meaning: "tomorrow",
    partOfSpeech: "noun / adverb", type: WordType.KANGO, category: "time",
    mnemonic: "A-SHI-TA → 明 (bright) + 日 (day) = the bright day that comes after sleep.",
    examples: [
      { jp: "明日会いましょう。", reading: "あしたあいましょう。", en: "Let's meet tomorrow." },
      { jp: "明日も仕事です。", reading: "あしたもしごとです。", en: "I have work tomorrow too." },
    ],
    collocations: ["明日の朝", "明日の会議"],
    kanji: [
      { char: "明", reading: "メイ / あ", meaning: "bright", onyomi: ["メイ", "ミョウ"], kunyomi: ["あか(るい)", "あ(ける)"] },
      { char: "日", reading: "ひ", meaning: "day, sun", onyomi: ["ニチ"], kunyomi: ["ひ"] },
    ],
  },
  {
    lemma: "昨日", reading: "きのう", meaning: "yesterday",
    partOfSpeech: "noun / adverb", type: WordType.KANGO, category: "time",
    mnemonic: "KI-NO-U → 昨 (previous) + 日 (day) — yester-day.",
    examples: [
      { jp: "昨日は雨でした。", reading: "きのうはあめでした。", en: "Yesterday it rained." },
      { jp: "昨日映画を見ました。", reading: "きのうえいがをみました。", en: "I watched a movie yesterday." },
    ],
    collocations: ["昨日の夜", "昨日の新聞"],
    kanji: [
      { char: "昨", reading: "サク", meaning: "previous", onyomi: ["サク"], kunyomi: [] },
      { char: "日", reading: "ひ", meaning: "day, sun", onyomi: ["ニチ"], kunyomi: ["ひ"] },
    ],
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
