// KanjiVision AI — Seed vocabulary (JLPT N5)
// Expansion in progress: categories 1-2 first (greetings + food = 18 words).
// Categories 3-6 (place/transport, time/weather, family/people, verbs) follow
// in a subsequent commit.

export type ExamCategory = "JLPT_N5" | "JLPT_N4" | "JLPT_N3" | "JLPT_N2" | "JLPT_N1";

export type WordType = "漢語" | "和語" | "外来語";

export type Category =
  | "greeting"
  | "food"
  | "place"
  | "time"
  | "family"
  | "verb";

export interface KanjiPart {
  char: string;
  reading: string;
  meaning: string;
  onyomi?: string[];
  kunyomi?: string[];
}

export interface Example {
  jp: string;
  reading: string;
  en: string;
}

export interface Word {
  id: string;
  lemma: string;
  reading: string;
  meaning: string;
  partOfSpeech: string;
  examCategory: ExamCategory;
  type: WordType;
  category: Category;
  kanji: KanjiPart[];
  mnemonic: string;          // English syllable breakdown
  examples: Example[];       // 2 examples (N5 scope)
  collocations: string[];    // 2 collocations
  tier: "free" | "basic" | "premium";
}

// ---------------------------------------------------------------------------
// Category 1 — 挨拶 / 日常 (greetings & daily courtesy) · 10 words
// ---------------------------------------------------------------------------

const GREETINGS: Word[] = [
  {
    id: "n5-g-001",
    lemma: "おはよう",
    reading: "おはよう",
    meaning: "good morning",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "O-HA-YOU → \"Oh! Ha, you!\" — bright surprise at seeing someone first thing in the morning.",
    examples: [
      { jp: "おはようございます。", reading: "おはようございます。", en: "Good morning (polite)." },
      { jp: "先生、おはよう。", reading: "せんせい、おはよう。", en: "Good morning, teacher." },
    ],
    collocations: ["おはようございます", "毎朝おはよう"],
    tier: "free",
  },
  {
    id: "n5-g-002",
    lemma: "すみません",
    reading: "すみません",
    meaning: "excuse me; sorry; thank you (for trouble)",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "SU-MI-MA-SEN → \"Soo-me-ma-sen\" — sounds like someone slipping apologetically between people on a crowded train.",
    examples: [
      { jp: "すみません、トイレはどこですか。", reading: "すみません、トイレはどこですか。", en: "Excuse me, where is the restroom?" },
      { jp: "遅れてすみません。", reading: "おくれてすみません。", en: "Sorry for being late." },
    ],
    collocations: ["すみません、ちょっと", "本当にすみません"],
    tier: "free",
  },
  {
    id: "n5-g-003",
    lemma: "ありがとう",
    reading: "ありがとう",
    meaning: "thank you",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "A-RI-GA-TOU → \"Alligator\" — imagine thanking an alligator for not biting you.",
    examples: [
      { jp: "ありがとうございます。", reading: "ありがとうございます。", en: "Thank you (polite)." },
      { jp: "プレゼント、ありがとう！", reading: "プレゼント、ありがとう！", en: "Thanks for the present!" },
    ],
    collocations: ["ありがとうございます", "どうもありがとう"],
    tier: "free",
  },
  {
    id: "n5-g-004",
    lemma: "いい",
    reading: "いい",
    meaning: "good; fine; okay",
    partOfSpeech: "i-adjective",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "I-I → two quick \"ee!\" sounds of approval — \"ee-ee, that's good!\"",
    examples: [
      { jp: "今日はいい天気ですね。", reading: "きょうはいいてんきですね。", en: "The weather is nice today, isn't it?" },
      { jp: "この本はいいですよ。", reading: "このほんはいいですよ。", en: "This book is good." },
    ],
    collocations: ["いい天気", "いい人"],
    tier: "free",
  },
  {
    id: "n5-g-005",
    lemma: "元気",
    reading: "げんき",
    meaning: "healthy; energetic; well",
    partOfSpeech: "na-adjective",
    examCategory: "JLPT_N5",
    type: "漢語",
    category: "greeting",
    kanji: [
      { char: "元", reading: "ゲン", meaning: "origin, source", onyomi: ["ゲン", "ガン"], kunyomi: ["もと"] },
      { char: "気", reading: "キ", meaning: "spirit, energy", onyomi: ["キ", "ケ"] },
    ],
    mnemonic: "GEN-KI → \"Gen-key\" — the key that starts your origin-energy engine every morning.",
    examples: [
      { jp: "お元気ですか。", reading: "おげんきですか。", en: "How are you? (Are you well?)" },
      { jp: "子供たちはとても元気です。", reading: "こどもたちはとてもげんきです。", en: "The children are very lively." },
    ],
    collocations: ["お元気ですか", "元気な子供"],
    tier: "free",
  },
  {
    id: "n5-g-006",
    lemma: "こんにちは",
    reading: "こんにちは",
    meaning: "hello; good afternoon",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "KON-NI-CHI-WA → \"Cone-nee-chee-wa\" — picture tipping an ice-cream cone to greet a friend at noon.",
    examples: [
      { jp: "こんにちは、田中さん。", reading: "こんにちは、たなかさん。", en: "Hello, Tanaka-san." },
      { jp: "こんにちは、元気ですか。", reading: "こんにちは、げんきですか。", en: "Hi, how are you?" },
    ],
    collocations: ["みなさん、こんにちは", "こんにちは、先生"],
    tier: "free",
  },
  {
    id: "n5-g-007",
    lemma: "さようなら",
    reading: "さようなら",
    meaning: "goodbye",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "SA-YOU-NA-RA → \"Say-oh-na-ra\" — literally \"say, so-long\" — a long farewell wave.",
    examples: [
      { jp: "さようなら、また明日。", reading: "さようなら、またあした。", en: "Goodbye, see you tomorrow." },
      { jp: "先生にさようならを言う。", reading: "せんせいにさようならをいう。", en: "I say goodbye to the teacher." },
    ],
    collocations: ["さようなら、みんな", "また明日、さようなら"],
    tier: "free",
  },
  {
    id: "n5-g-008",
    lemma: "お願い",
    reading: "おねがい",
    meaning: "please; a request",
    partOfSpeech: "noun / interjection",
    examCategory: "JLPT_N5",
    type: "漢語",
    category: "greeting",
    kanji: [
      { char: "願", reading: "ねが(い)", meaning: "wish, request", onyomi: ["ガン"], kunyomi: ["ねが(う)"] },
    ],
    mnemonic: "O-NE-GA-I → \"Oh-neh-guy\" — imagine the O-neh-guy bowing to ask a favor.",
    examples: [
      { jp: "お願いします。", reading: "おねがいします。", en: "Please (I request it)." },
      { jp: "一つお願いがあります。", reading: "ひとつおねがいがあります。", en: "I have one request." },
    ],
    collocations: ["お願いします", "一つのお願い"],
    tier: "free",
  },
  {
    id: "n5-g-009",
    lemma: "はい",
    reading: "はい",
    meaning: "yes",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "HAI → \"High\" — raise your hand up high to affirm.",
    examples: [
      { jp: "はい、わかりました。", reading: "はい、わかりました。", en: "Yes, I understand." },
      { jp: "はい、そうです。", reading: "はい、そうです。", en: "Yes, that's right." },
    ],
    collocations: ["はい、どうぞ", "はい、そうです"],
    tier: "free",
  },
  {
    id: "n5-g-010",
    lemma: "いいえ",
    reading: "いいえ",
    meaning: "no",
    partOfSpeech: "interjection",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "greeting",
    kanji: [],
    mnemonic: "I-I-E → \"Ee-eh\" — a hesitant head-shake sound that trails off to \"no\".",
    examples: [
      { jp: "いいえ、違います。", reading: "いいえ、ちがいます。", en: "No, that's wrong." },
      { jp: "いいえ、結構です。", reading: "いいえ、けっこうです。", en: "No, I'm fine (polite refusal)." },
    ],
    collocations: ["いいえ、違います", "いいえ、結構です"],
    tier: "free",
  },
];

// ---------------------------------------------------------------------------
// Category 2 — 食べ物 (food) · 8 words
// ---------------------------------------------------------------------------

const FOOD: Word[] = [
  {
    id: "n5-f-001",
    lemma: "ごはん",
    reading: "ごはん",
    meaning: "cooked rice; a meal",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "food",
    kanji: [],
    mnemonic: "GO-HAN → \"Go, Han!\" — picture Han Solo rushing to eat a hot bowl of rice.",
    examples: [
      { jp: "ごはんを食べましょう。", reading: "ごはんをたべましょう。", en: "Let's eat." },
      { jp: "朝ごはんはパンです。", reading: "あさごはんはパンです。", en: "Breakfast is bread." },
    ],
    collocations: ["朝ごはん", "ごはんを食べる"],
    tier: "free",
  },
  {
    id: "n5-f-002",
    lemma: "水",
    reading: "みず",
    meaning: "water",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "food",
    kanji: [
      { char: "水", reading: "みず", meaning: "water", onyomi: ["スイ"], kunyomi: ["みず"] },
    ],
    mnemonic: "MI-ZU → \"Me-zoo\" — imagine a zoo where every animal needs water to survive.",
    examples: [
      { jp: "水を一杯ください。", reading: "みずをいっぱいください。", en: "One glass of water, please." },
      { jp: "冷たい水が好きです。", reading: "つめたいみずがすきです。", en: "I like cold water." },
    ],
    collocations: ["水を飲む", "冷たい水"],
    tier: "free",
  },
  {
    id: "n5-f-003",
    lemma: "肉",
    reading: "にく",
    meaning: "meat",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "food",
    kanji: [
      { char: "肉", reading: "にく", meaning: "meat, flesh", onyomi: ["ニク"], kunyomi: [] },
    ],
    mnemonic: "NI-KU → \"Knee-ku\" — the kanji 肉 looks like a slab of ribs hanging from a hook.",
    examples: [
      { jp: "肉が大好きです。", reading: "にくがだいすきです。", en: "I love meat." },
      { jp: "今夜は肉を食べます。", reading: "こんやはにくをたべます。", en: "I'll eat meat tonight." },
    ],
    collocations: ["肉を食べる", "お肉屋さん"],
    tier: "free",
  },
  {
    id: "n5-f-004",
    lemma: "魚",
    reading: "さかな",
    meaning: "fish",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "food",
    kanji: [
      { char: "魚", reading: "さかな", meaning: "fish", onyomi: ["ギョ"], kunyomi: ["さかな", "うお"] },
    ],
    mnemonic: "SA-KA-NA → \"Sah-kah-nah\" — the kanji 魚 is literally a fish: head on top, scaled body, tail fins.",
    examples: [
      { jp: "魚が好きです。", reading: "さかながすきです。", en: "I like fish." },
      { jp: "魚を焼きます。", reading: "さかなをやきます。", en: "I'll grill fish." },
    ],
    collocations: ["魚を食べる", "新しい魚"],
    tier: "free",
  },
  {
    id: "n5-f-005",
    lemma: "おいしい",
    reading: "おいしい",
    meaning: "delicious; tasty",
    partOfSpeech: "i-adjective",
    examCategory: "JLPT_N5",
    type: "和語",
    category: "food",
    kanji: [],
    mnemonic: "O-I-SHI-I → \"Oh-ee-she-ee!\" — a gasp of joy after the first bite.",
    examples: [
      { jp: "このケーキはおいしい。", reading: "このケーキはおいしい。", en: "This cake is delicious." },
      { jp: "とてもおいしかったです。", reading: "とてもおいしかったです。", en: "It was very tasty." },
    ],
    collocations: ["おいしい料理", "とてもおいしい"],
    tier: "free",
  },
  {
    id: "n5-f-006",
    lemma: "食堂",
    reading: "しょくどう",
    meaning: "cafeteria; dining hall",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "漢語",
    category: "food",
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
    tier: "free",
  },
  {
    id: "n5-f-007",
    lemma: "パン",
    reading: "パン",
    meaning: "bread",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "外来語",
    category: "food",
    kanji: [],
    mnemonic: "PAN → from Portuguese \"pão\" — picture baking bread in a pan.",
    examples: [
      { jp: "朝はパンを食べます。", reading: "あさはパンをたべます。", en: "I eat bread in the morning." },
      { jp: "このパンは温かい。", reading: "このパンはあたたかい。", en: "This bread is warm." },
    ],
    collocations: ["パンを焼く", "食パン"],
    tier: "free",
  },
  {
    id: "n5-f-008",
    lemma: "お茶",
    reading: "おちゃ",
    meaning: "(green) tea",
    partOfSpeech: "noun",
    examCategory: "JLPT_N5",
    type: "漢語",
    category: "food",
    kanji: [
      { char: "茶", reading: "チャ", meaning: "tea", onyomi: ["チャ", "サ"] },
    ],
    mnemonic: "O-CHA → \"Oh-cha\" — the honorific お politely offers a soothing cup of tea.",
    examples: [
      { jp: "お茶をどうぞ。", reading: "おちゃをどうぞ。", en: "Please have some tea." },
      { jp: "日本のお茶は緑です。", reading: "にほんのおちゃはみどりです。", en: "Japanese tea is green." },
    ],
    collocations: ["お茶を飲む", "緑茶"],
    tier: "free",
  },
];

export const WORDS: Word[] = [...GREETINGS, ...FOOD];

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

export function wordsByCategory(cat: Category): Word[] {
  return WORDS.filter((w) => w.category === cat);
}
