// KanjiVision AI — Prisma seed (JLPT N5, 10 inlined words).
// Matches the current schema (commit 605f496):
//   Word: lemma / reading / meaning / examCategory / type / category /
//         tierRequired / mnemonic / examples (Json) / collocations
//   KanjiPart: wordId / position / char / reading / meaning / onyomi / kunyomi
// Unique key: @@unique([lemma, reading]) -> composite `lemma_reading`.
//
// Keeping the seed inlined (not imported from ../../src/data/words) so it
// works inside the Docker runtime image where only `backend/` is copied.
// 50 words across 6 categories: 挨拶/日常 (10), 食べ物 (7), 場所/交通 (8),
// 時間/天気 (7), 家族/人 (8), 動詞 + 形容詞 (10).

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

  // --- Weather (4) ---
  {
    lemma: "春", reading: "はる", meaning: "spring (season)",
    partOfSpeech: "noun", type: WordType.WAGO, category: "time",
    mnemonic: "HA-RU → 春 has 日 (sun) underneath; the sun returns in spring.",
    examples: [
      { jp: "春が好きです。", reading: "はるがすきです。", en: "I like spring." },
      { jp: "春になりました。", reading: "はるになりました。", en: "Spring has arrived." },
    ],
    collocations: ["春休み", "春の花"],
    kanji: [
      { char: "春", reading: "はる", meaning: "spring", onyomi: ["シュン"], kunyomi: ["はる"] },
    ],
  },
  {
    lemma: "暑い", reading: "あつい", meaning: "hot (weather)",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "time",
    mnemonic: "A-TSU-I → \"ah! too-ee\" — gasp sound when stepping into the heat.",
    examples: [
      { jp: "今日は暑いです。", reading: "きょうはあついです。", en: "It's hot today." },
      { jp: "夏はとても暑い。", reading: "なつはとてもあつい。", en: "Summer is very hot." },
    ],
    collocations: ["暑い夏", "とても暑い"],
    kanji: [
      { char: "暑", reading: "あつ(い)", meaning: "hot", onyomi: ["ショ"], kunyomi: ["あつ(い)"] },
    ],
  },
  {
    lemma: "寒い", reading: "さむい", meaning: "cold (weather)",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "time",
    mnemonic: "SA-MU-I → teeth chattering sound when you are cold.",
    examples: [
      { jp: "冬は寒いです。", reading: "ふゆはさむいです。", en: "Winter is cold." },
      { jp: "今朝はとても寒い。", reading: "けさはとてもさむい。", en: "This morning is very cold." },
    ],
    collocations: ["寒い冬", "寒い朝"],
    kanji: [
      { char: "寒", reading: "さむ(い)", meaning: "cold", onyomi: ["カン"], kunyomi: ["さむ(い)"] },
    ],
  },
  {
    lemma: "雨", reading: "あめ", meaning: "rain",
    partOfSpeech: "noun", type: WordType.WAGO, category: "time",
    mnemonic: "A-ME → 雨 is literally a cloud with four raindrops falling inside.",
    examples: [
      { jp: "雨が降っています。", reading: "あめがふっています。", en: "It is raining." },
      { jp: "明日は雨でしょう。", reading: "あしたはあめでしょう。", en: "It will probably rain tomorrow." },
    ],
    collocations: ["雨が降る", "大雨"],
    kanji: [
      { char: "雨", reading: "あめ", meaning: "rain", onyomi: ["ウ"], kunyomi: ["あめ", "あま"] },
    ],
  },

  // --- Family / people (6) ---
  {
    lemma: "お母さん", reading: "おかあさん", meaning: "mother (polite)",
    partOfSpeech: "noun", type: WordType.KANGO, category: "family",
    mnemonic: "O-KAA-SAN → 母 has two dots — a mother nursing her child.",
    examples: [
      { jp: "お母さんは台所にいます。", reading: "おかあさんはだいどころにいます。", en: "Mom is in the kitchen." },
      { jp: "お母さんの料理はおいしい。", reading: "おかあさんのりょうりはおいしい。", en: "Mom's cooking is delicious." },
    ],
    collocations: ["お母さんの料理", "優しいお母さん"],
    kanji: [
      { char: "母", reading: "かあ / ボ", meaning: "mother", onyomi: ["ボ"], kunyomi: ["はは", "かあ"] },
    ],
  },
  {
    lemma: "お父さん", reading: "おとうさん", meaning: "father (polite)",
    partOfSpeech: "noun", type: WordType.KANGO, category: "family",
    mnemonic: "O-TOU-SAN → 父 shows crossed arms — dad welcoming you home.",
    examples: [
      { jp: "お父さんは会社員です。", reading: "おとうさんはかいしゃいんです。", en: "Dad is an office worker." },
      { jp: "お父さんと公園へ行きます。", reading: "おとうさんとこうえんへいきます。", en: "I'll go to the park with Dad." },
    ],
    collocations: ["お父さんの車", "優しいお父さん"],
    kanji: [
      { char: "父", reading: "とう / フ", meaning: "father", onyomi: ["フ"], kunyomi: ["ちち", "とう"] },
    ],
  },
  {
    lemma: "学生", reading: "がくせい", meaning: "student",
    partOfSpeech: "noun", type: WordType.KANGO, category: "family",
    mnemonic: "GAKU-SEI → 学 (learn) + 生 (life) = a life of learning → student.",
    examples: [
      { jp: "私は大学の学生です。", reading: "わたしはだいがくのがくせいです。", en: "I am a university student." },
      { jp: "あの人は学生ですか。", reading: "あのひとはがくせいですか。", en: "Is that person a student?" },
    ],
    collocations: ["大学生", "高校生"],
    kanji: [
      { char: "学", reading: "ガク", meaning: "learn, study", onyomi: ["ガク"], kunyomi: ["まな(ぶ)"] },
      { char: "生", reading: "セイ", meaning: "born, life", onyomi: ["セイ", "ショウ"], kunyomi: ["う(まれる)", "い(きる)"] },
    ],
  },
  {
    lemma: "兄", reading: "あに", meaning: "older brother (humble)",
    partOfSpeech: "noun", type: WordType.WAGO, category: "family",
    mnemonic: "A-NI → 兄 shows a mouth over legs — the older one who speaks up first.",
    examples: [
      { jp: "兄は医者です。", reading: "あにはいしゃです。", en: "My older brother is a doctor." },
      { jp: "兄が二人います。", reading: "あにがふたりいます。", en: "I have two older brothers." },
    ],
    collocations: ["お兄さん", "兄弟"],
    kanji: [
      { char: "兄", reading: "あに / ケイ", meaning: "older brother", onyomi: ["ケイ"], kunyomi: ["あに"] },
    ],
  },
  {
    lemma: "姉", reading: "あね", meaning: "older sister (humble)",
    partOfSpeech: "noun", type: WordType.WAGO, category: "family",
    mnemonic: "A-NE → 姉 has 女 (woman) on the left — the elder woman of the family.",
    examples: [
      { jp: "姉は東京に住んでいます。", reading: "あねはとうきょうにすんでいます。", en: "My older sister lives in Tokyo." },
      { jp: "姉のように優しい。", reading: "あねのようにやさしい。", en: "Kind like an older sister." },
    ],
    collocations: ["お姉さん", "姉妹"],
    kanji: [
      { char: "姉", reading: "あね / シ", meaning: "older sister", onyomi: ["シ"], kunyomi: ["あね"] },
    ],
  },
  {
    lemma: "子供", reading: "こども", meaning: "child, children",
    partOfSpeech: "noun", type: WordType.KANGO, category: "family",
    mnemonic: "KO-DO-MO → 子 (child) + 供 (companion) = small companions → children.",
    examples: [
      { jp: "子供たちが遊んでいます。", reading: "こどもたちがあそんでいます。", en: "The children are playing." },
      { jp: "子供のとき東京にいました。", reading: "こどものときとうきょうにいました。", en: "When I was a child, I lived in Tokyo." },
    ],
    collocations: ["子供の時", "三人の子供"],
    kanji: [
      { char: "子", reading: "コ / シ", meaning: "child", onyomi: ["シ", "ス"], kunyomi: ["こ"] },
      { char: "供", reading: "ども / キョウ", meaning: "accompany; plural", onyomi: ["キョウ", "ク"], kunyomi: ["とも", "そな(える)"] },
    ],
  },

  // --- More verbs (4) ---
  {
    lemma: "行く", reading: "いく", meaning: "to go",
    partOfSpeech: "verb (godan)", type: WordType.WAGO, category: "verb",
    mnemonic: "I-KU → 行 shows a person striding forward on two legs.",
    examples: [
      { jp: "学校へ行きます。", reading: "がっこうへいきます。", en: "I go to school." },
      { jp: "明日東京へ行く。", reading: "あしたとうきょうへいく。", en: "I'll go to Tokyo tomorrow." },
    ],
    collocations: ["学校へ行く", "旅行に行く"],
    kanji: [
      { char: "行", reading: "い(く) / コウ", meaning: "go", onyomi: ["コウ", "ギョウ"], kunyomi: ["い(く)", "おこな(う)"] },
    ],
  },
  {
    lemma: "来る", reading: "くる", meaning: "to come",
    partOfSpeech: "verb (irregular)", type: WordType.WAGO, category: "verb",
    mnemonic: "KU-RU → 来 shows a person approaching — someone is coming toward you.",
    examples: [
      { jp: "友達が来ます。", reading: "ともだちがきます。", en: "My friend is coming." },
      { jp: "電車が来ました。", reading: "でんしゃがきました。", en: "The train has arrived." },
    ],
    collocations: ["電車が来る", "家に来る"],
    kanji: [
      { char: "来", reading: "く(る) / ライ", meaning: "come", onyomi: ["ライ"], kunyomi: ["く(る)", "き(たる)"] },
    ],
  },
  {
    lemma: "見る", reading: "みる", meaning: "to see, to watch",
    partOfSpeech: "verb (ichidan)", type: WordType.WAGO, category: "verb",
    mnemonic: "MI-RU → 見 is an eye (目) on legs — the eye walks around and sees.",
    examples: [
      { jp: "映画を見ます。", reading: "えいがをみます。", en: "I watch a movie." },
      { jp: "空を見てください。", reading: "そらをみてください。", en: "Please look at the sky." },
    ],
    collocations: ["テレビを見る", "映画を見る"],
    kanji: [
      { char: "見", reading: "み(る) / ケン", meaning: "see", onyomi: ["ケン"], kunyomi: ["み(る)"] },
    ],
  },
  {
    lemma: "寝る", reading: "ねる", meaning: "to sleep; to go to bed",
    partOfSpeech: "verb (ichidan)", type: WordType.WAGO, category: "verb",
    mnemonic: "NE-RU → 寝 has 宀 (roof) over a person — lying under a roof to sleep.",
    examples: [
      { jp: "十時に寝ます。", reading: "じゅうじにねます。", en: "I go to bed at 10." },
      { jp: "昨日早く寝ました。", reading: "きのうはやくねました。", en: "I went to bed early yesterday." },
    ],
    collocations: ["早く寝る", "よく寝る"],
    kanji: [
      { char: "寝", reading: "ね(る) / シン", meaning: "sleep, lie down", onyomi: ["シン"], kunyomi: ["ね(る)"] },
    ],
  },

  // --- Food (6) ---
  {
    lemma: "ごはん", reading: "ごはん", meaning: "cooked rice; a meal",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    mnemonic: "GO-HAN → \"Go, Han!\" — Han Solo dashing to a hot rice bowl.",
    examples: [
      { jp: "ごはんを食べましょう。", reading: "ごはんをたべましょう。", en: "Let's eat." },
      { jp: "朝ごはんはパンです。", reading: "あさごはんはパンです。", en: "Breakfast is bread." },
    ],
    collocations: ["朝ごはん", "ごはんを食べる"],
    kanji: [],
  },
  {
    lemma: "水", reading: "みず", meaning: "water",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    mnemonic: "MI-ZU → \"Me-zoo\" — every zoo animal needs water.",
    examples: [
      { jp: "水を一杯ください。", reading: "みずをいっぱいください。", en: "One glass of water, please." },
      { jp: "冷たい水が好きです。", reading: "つめたいみずがすきです。", en: "I like cold water." },
    ],
    collocations: ["水を飲む", "冷たい水"],
    kanji: [
      { char: "水", reading: "みず", meaning: "water", onyomi: ["スイ"], kunyomi: ["みず"] },
    ],
  },
  {
    lemma: "肉", reading: "にく", meaning: "meat",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    mnemonic: "NI-KU → 肉 looks like ribs hanging from a hook.",
    examples: [
      { jp: "肉が大好きです。", reading: "にくがだいすきです。", en: "I love meat." },
      { jp: "今夜は肉を食べます。", reading: "こんやはにくをたべます。", en: "I'll eat meat tonight." },
    ],
    collocations: ["肉を食べる", "お肉屋さん"],
    kanji: [
      { char: "肉", reading: "にく", meaning: "meat, flesh", onyomi: ["ニク"], kunyomi: [] },
    ],
  },
  {
    lemma: "魚", reading: "さかな", meaning: "fish",
    partOfSpeech: "noun", type: WordType.WAGO, category: "food",
    mnemonic: "SA-KA-NA → the kanji 魚 is literally a fish — head, scaled body, tail fins.",
    examples: [
      { jp: "魚が好きです。", reading: "さかながすきです。", en: "I like fish." },
      { jp: "魚を焼きます。", reading: "さかなをやきます。", en: "I'll grill fish." },
    ],
    collocations: ["魚を食べる", "新しい魚"],
    kanji: [
      { char: "魚", reading: "さかな", meaning: "fish", onyomi: ["ギョ"], kunyomi: ["さかな", "うお"] },
    ],
  },
  {
    lemma: "おいしい", reading: "おいしい", meaning: "delicious; tasty",
    partOfSpeech: "i-adjective", type: WordType.WAGO, category: "food",
    mnemonic: "O-I-SHI-I → \"Oh-ee-she-ee!\" — a gasp of joy after the first bite.",
    examples: [
      { jp: "このケーキはおいしい。", reading: "このケーキはおいしい。", en: "This cake is delicious." },
      { jp: "とてもおいしかったです。", reading: "とてもおいしかったです。", en: "It was very tasty." },
    ],
    collocations: ["おいしい料理", "とてもおいしい"],
    kanji: [],
  },
  {
    lemma: "食堂", reading: "しょくどう", meaning: "cafeteria; dining hall",
    partOfSpeech: "noun", type: WordType.KANGO, category: "food",
    mnemonic: "SHOKU-DOU → 食 (eat) + 堂 (hall) = \"eating hall\" → cafeteria.",
    examples: [
      { jp: "学校の食堂で食べます。", reading: "がっこうのしょくどうでたべます。", en: "I eat in the school cafeteria." },
      { jp: "食堂は一階にあります。", reading: "しょくどうはいっかいにあります。", en: "The cafeteria is on the first floor." },
    ],
    collocations: ["社員食堂", "学生食堂"],
    kanji: [
      { char: "食", reading: "ショク", meaning: "eat, food", onyomi: ["ショク"], kunyomi: ["た(べる)", "く(う)"] },
      { char: "堂", reading: "ドウ", meaning: "hall, chamber", onyomi: ["ドウ"], kunyomi: [] },
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
