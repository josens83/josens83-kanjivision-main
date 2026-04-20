// KanjiVision AI — Seed vocabulary (JLPT N5) · 50 words
// 6 categories: 挨拶/日常 (10), 食べ物 (8), 場所/交通 (8),
// 時間/天気 (8), 家族/人 (8), 動詞 (8).

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
  imageUrl?: string | null;  // AI-generated mnemonic image (from MnemonicImage)
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

// ---------------------------------------------------------------------------
// Category 3 — 場所 / 交通 (place & transport) · 8 words
// ---------------------------------------------------------------------------

const PLACES: Word[] = [
  {
    id: "n5-p-001",
    lemma: "駅", reading: "えき", meaning: "(train) station",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "和語", category: "place",
    kanji: [{ char: "駅", reading: "エキ", meaning: "station", onyomi: ["エキ"] }],
    mnemonic: "E-KI → \"eh-key\" — the key to boarding the train waits at the station.",
    examples: [
      { jp: "駅で会いましょう。", reading: "えきであいましょう。", en: "Let's meet at the station." },
      { jp: "駅まで歩きます。", reading: "えきまであるきます。", en: "I'll walk to the station." },
    ],
    collocations: ["東京駅", "駅の前"],
    tier: "free",
  },
  {
    id: "n5-p-002",
    lemma: "病院", reading: "びょういん", meaning: "hospital",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "place",
    kanji: [
      { char: "病", reading: "ビョウ", meaning: "illness", onyomi: ["ビョウ", "ヘイ"], kunyomi: ["や(む)"] },
      { char: "院", reading: "イン", meaning: "institution, hall", onyomi: ["イン"] },
    ],
    mnemonic: "BYOU-IN → \"B-you-in\" — \"bed you in\" at the illness-institution.",
    examples: [
      { jp: "病院へ行きます。", reading: "びょういんへいきます。", en: "I'm going to the hospital." },
      { jp: "兄は病院で働いています。", reading: "あにはびょういんではたらいています。", en: "My older brother works at a hospital." },
    ],
    collocations: ["大きい病院", "病院で働く"],
    tier: "free",
  },
  {
    id: "n5-p-003",
    lemma: "銀行", reading: "ぎんこう", meaning: "bank",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "place",
    kanji: [
      { char: "銀", reading: "ギン", meaning: "silver", onyomi: ["ギン"] },
      { char: "行", reading: "コウ", meaning: "go; trade/shop", onyomi: ["コウ", "ギョウ"], kunyomi: ["い(く)"] },
    ],
    mnemonic: "GIN-KOU → silver (銀) + trade (行) = the silver-trade place → bank.",
    examples: [
      { jp: "銀行にお金を預けます。", reading: "ぎんこうにおかねをあずけます。", en: "I'll deposit money at the bank." },
      { jp: "銀行は九時に開きます。", reading: "ぎんこうはくじにひらきます。", en: "The bank opens at 9." },
    ],
    collocations: ["銀行員", "銀行口座"],
    tier: "free",
  },
  {
    id: "n5-p-004",
    lemma: "電車", reading: "でんしゃ", meaning: "train",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "place",
    kanji: [
      { char: "電", reading: "デン", meaning: "electricity", onyomi: ["デン"] },
      { char: "車", reading: "シャ", meaning: "car, vehicle", onyomi: ["シャ"], kunyomi: ["くるま"] },
    ],
    mnemonic: "DEN-SHA → electricity (電) + car (車) = electric car → train.",
    examples: [
      { jp: "電車で行きます。", reading: "でんしゃでいきます。", en: "I'll go by train." },
      { jp: "電車が遅れました。", reading: "でんしゃがおくれました。", en: "The train was delayed." },
    ],
    collocations: ["電車に乗る", "次の電車"],
    tier: "free",
  },
  {
    id: "n5-p-005",
    lemma: "バス", reading: "バス", meaning: "bus",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "外来語", category: "place", kanji: [],
    mnemonic: "BA-SU → English \"bus\" borrowed into Japanese with a short, crisp sound.",
    examples: [
      { jp: "バスに乗ります。", reading: "バスにのります。", en: "I'll take the bus." },
      { jp: "バス停はどこですか。", reading: "バスていはどこですか。", en: "Where is the bus stop?" },
    ],
    collocations: ["バスに乗る", "バス停"],
    tier: "free",
  },
  {
    id: "n5-p-006",
    lemma: "図書館", reading: "としょかん", meaning: "library",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "place",
    kanji: [
      { char: "図", reading: "ト / ズ", meaning: "diagram, plan", onyomi: ["ト", "ズ"] },
      { char: "書", reading: "ショ", meaning: "write, book", onyomi: ["ショ"], kunyomi: ["か(く)"] },
      { char: "館", reading: "カン", meaning: "hall, building", onyomi: ["カン"] },
    ],
    mnemonic: "TO-SHO-KAN → diagrams (図) + books (書) + hall (館) = the hall of books.",
    examples: [
      { jp: "図書館で勉強します。", reading: "としょかんでべんきょうします。", en: "I study at the library." },
      { jp: "図書館は静かです。", reading: "としょかんはしずかです。", en: "The library is quiet." },
    ],
    collocations: ["図書館で借りる", "大学の図書館"],
    tier: "free",
  },
  {
    id: "n5-p-007",
    lemma: "空港", reading: "くうこう", meaning: "airport",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "place",
    kanji: [
      { char: "空", reading: "クウ", meaning: "sky, empty", onyomi: ["クウ"], kunyomi: ["そら", "から"] },
      { char: "港", reading: "コウ", meaning: "port, harbor", onyomi: ["コウ"], kunyomi: ["みなと"] },
    ],
    mnemonic: "KUU-KOU → sky (空) + port (港) = sky-port → airport.",
    examples: [
      { jp: "空港までタクシーで行きます。", reading: "くうこうまでタクシーでいきます。", en: "I'll take a taxi to the airport." },
      { jp: "空港でお土産を買います。", reading: "くうこうでおみやげをかいます。", en: "I'll buy souvenirs at the airport." },
    ],
    collocations: ["成田空港", "空港に着く"],
    tier: "free",
  },
  {
    id: "n5-p-008",
    lemma: "学校", reading: "がっこう", meaning: "school",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "place",
    kanji: [
      { char: "学", reading: "ガク", meaning: "learn, study", onyomi: ["ガク"], kunyomi: ["まな(ぶ)"] },
      { char: "校", reading: "コウ", meaning: "school building", onyomi: ["コウ"] },
    ],
    mnemonic: "GAK-KOU → learn (学) + building (校) = a 'building for learning' → school.",
    examples: [
      { jp: "学校へ行きます。", reading: "がっこうへいきます。", en: "I go to school." },
      { jp: "新しい学校は大きい。", reading: "あたらしいがっこうはおおきい。", en: "The new school is big." },
    ],
    collocations: ["小学校", "学校に行く"],
    tier: "free",
  },
];

// ---------------------------------------------------------------------------
// Category 4 — 時間 / 天気 (time & weather) · 8 words
// ---------------------------------------------------------------------------

const TIMES: Word[] = [
  {
    id: "n5-t-001",
    lemma: "今日", reading: "きょう", meaning: "today",
    partOfSpeech: "noun / adverb", examCategory: "JLPT_N5", type: "漢語", category: "time",
    kanji: [
      { char: "今", reading: "コン / いま", meaning: "now", onyomi: ["コン", "キン"], kunyomi: ["いま"] },
      { char: "日", reading: "ニチ / ひ", meaning: "day, sun", onyomi: ["ニチ", "ジツ"], kunyomi: ["ひ", "か"] },
    ],
    mnemonic: "KYOU → now (今) + day (日) = this day = today.",
    examples: [
      { jp: "今日は忙しいです。", reading: "きょうはいそがしいです。", en: "I'm busy today." },
      { jp: "今日の天気はいいです。", reading: "きょうのてんきはいいです。", en: "Today's weather is nice." },
    ],
    collocations: ["今日の夕方", "今日の午後"],
    tier: "free",
  },
  {
    id: "n5-t-002",
    lemma: "明日", reading: "あした", meaning: "tomorrow",
    partOfSpeech: "noun / adverb", examCategory: "JLPT_N5", type: "漢語", category: "time",
    kanji: [
      { char: "明", reading: "メイ / あ", meaning: "bright", onyomi: ["メイ", "ミョウ"], kunyomi: ["あか(るい)", "あ(ける)"] },
      { char: "日", reading: "ひ", meaning: "day, sun", onyomi: ["ニチ"], kunyomi: ["ひ"] },
    ],
    mnemonic: "A-SHI-TA → the bright (明) day (日) that comes after tonight's sleep.",
    examples: [
      { jp: "明日会いましょう。", reading: "あしたあいましょう。", en: "Let's meet tomorrow." },
      { jp: "明日も仕事です。", reading: "あしたもしごとです。", en: "I have work tomorrow too." },
    ],
    collocations: ["明日の朝", "明日の会議"],
    tier: "free",
  },
  {
    id: "n5-t-003",
    lemma: "昨日", reading: "きのう", meaning: "yesterday",
    partOfSpeech: "noun / adverb", examCategory: "JLPT_N5", type: "漢語", category: "time",
    kanji: [
      { char: "昨", reading: "サク", meaning: "previous, yesterday", onyomi: ["サク"] },
      { char: "日", reading: "ひ", meaning: "day, sun", onyomi: ["ニチ"], kunyomi: ["ひ"] },
    ],
    mnemonic: "KI-NO-U → the previous (昨) day (日) — yester-day.",
    examples: [
      { jp: "昨日は雨でした。", reading: "きのうはあめでした。", en: "Yesterday it rained." },
      { jp: "昨日映画を見ました。", reading: "きのうえいがをみました。", en: "I watched a movie yesterday." },
    ],
    collocations: ["昨日の夜", "昨日の新聞"],
    tier: "free",
  },
  {
    id: "n5-t-004",
    lemma: "春", reading: "はる", meaning: "spring (season)",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "和語", category: "time",
    kanji: [{ char: "春", reading: "はる", meaning: "spring", onyomi: ["シュン"], kunyomi: ["はる"] }],
    mnemonic: "HA-RU → \"ha-roo\" — 春 contains 日 (sun) underneath — the sun returns in spring.",
    examples: [
      { jp: "春が好きです。", reading: "はるがすきです。", en: "I like spring." },
      { jp: "春になりました。", reading: "はるになりました。", en: "Spring has arrived." },
    ],
    collocations: ["春休み", "春の花"],
    tier: "free",
  },
  {
    id: "n5-t-005",
    lemma: "暑い", reading: "あつい", meaning: "hot (weather)",
    partOfSpeech: "i-adjective", examCategory: "JLPT_N5", type: "和語", category: "time",
    kanji: [{ char: "暑", reading: "あつ(い)", meaning: "hot", onyomi: ["ショ"], kunyomi: ["あつ(い)"] }],
    mnemonic: "A-TSU-I → \"ah! too-ee\" — gasp sound when stepping into the heat.",
    examples: [
      { jp: "今日は暑いです。", reading: "きょうはあついです。", en: "It's hot today." },
      { jp: "夏はとても暑い。", reading: "なつはとてもあつい。", en: "Summer is very hot." },
    ],
    collocations: ["暑い夏", "とても暑い"],
    tier: "free",
  },
  {
    id: "n5-t-006",
    lemma: "寒い", reading: "さむい", meaning: "cold (weather)",
    partOfSpeech: "i-adjective", examCategory: "JLPT_N5", type: "和語", category: "time",
    kanji: [{ char: "寒", reading: "さむ(い)", meaning: "cold", onyomi: ["カン"], kunyomi: ["さむ(い)"] }],
    mnemonic: "SA-MU-I → \"sa-moo-ee\" — teeth chattering sound when you are cold.",
    examples: [
      { jp: "冬は寒いです。", reading: "ふゆはさむいです。", en: "Winter is cold." },
      { jp: "今朝はとても寒い。", reading: "けさはとてもさむい。", en: "This morning is very cold." },
    ],
    collocations: ["寒い冬", "寒い朝"],
    tier: "free",
  },
  {
    id: "n5-t-007",
    lemma: "雨", reading: "あめ", meaning: "rain",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "和語", category: "time",
    kanji: [{ char: "雨", reading: "あめ", meaning: "rain", onyomi: ["ウ"], kunyomi: ["あめ", "あま"] }],
    mnemonic: "A-ME → 雨 is literally a cloud with four raindrops falling inside.",
    examples: [
      { jp: "雨が降っています。", reading: "あめがふっています。", en: "It is raining." },
      { jp: "明日は雨でしょう。", reading: "あしたはあめでしょう。", en: "It will probably rain tomorrow." },
    ],
    collocations: ["雨が降る", "大雨"],
    tier: "free",
  },
  {
    id: "n5-t-008",
    lemma: "天気", reading: "てんき", meaning: "weather",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "time",
    kanji: [
      { char: "天", reading: "テン", meaning: "heaven, sky", onyomi: ["テン"], kunyomi: ["あま", "あめ"] },
      { char: "気", reading: "キ", meaning: "spirit, air, mood", onyomi: ["キ", "ケ"] },
    ],
    mnemonic: "TEN-KI → sky (天) + mood (気) = 'the mood of the sky' → weather.",
    examples: [
      { jp: "今日は天気がいいです。", reading: "きょうはてんきがいいです。", en: "The weather is nice today." },
      { jp: "天気予報を見ます。", reading: "てんきよほうをみます。", en: "I watch the weather forecast." },
    ],
    collocations: ["いい天気", "天気予報"],
    tier: "free",
  },
];

// ---------------------------------------------------------------------------
// Category 5 — 家族 / 人 (family & people) · 8 words
// ---------------------------------------------------------------------------

const FAMILY: Word[] = [
  {
    id: "n5-fa-001",
    lemma: "お母さん", reading: "おかあさん", meaning: "mother (polite)",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "family",
    kanji: [{ char: "母", reading: "かあ / ボ", meaning: "mother", onyomi: ["ボ"], kunyomi: ["はは", "かあ"] }],
    mnemonic: "O-KAA-SAN → 母 has two dots in the middle — a mother nursing her child.",
    examples: [
      { jp: "お母さんは台所にいます。", reading: "おかあさんはだいどころにいます。", en: "Mom is in the kitchen." },
      { jp: "お母さんの料理はおいしい。", reading: "おかあさんのりょうりはおいしい。", en: "Mom's cooking is delicious." },
    ],
    collocations: ["お母さんの料理", "優しいお母さん"],
    tier: "free",
  },
  {
    id: "n5-fa-002",
    lemma: "お父さん", reading: "おとうさん", meaning: "father (polite)",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "family",
    kanji: [{ char: "父", reading: "とう / フ", meaning: "father", onyomi: ["フ"], kunyomi: ["ちち", "とう"] }],
    mnemonic: "O-TOU-SAN → 父 shows crossed arms — dad welcoming you home.",
    examples: [
      { jp: "お父さんは会社員です。", reading: "おとうさんはかいしゃいんです。", en: "Dad is an office worker." },
      { jp: "お父さんと公園へ行きます。", reading: "おとうさんとこうえんへいきます。", en: "I'll go to the park with Dad." },
    ],
    collocations: ["お父さんの車", "優しいお父さん"],
    tier: "free",
  },
  {
    id: "n5-fa-003",
    lemma: "学生", reading: "がくせい", meaning: "student",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "family",
    kanji: [
      { char: "学", reading: "ガク", meaning: "learn, study", onyomi: ["ガク"], kunyomi: ["まな(ぶ)"] },
      { char: "生", reading: "セイ", meaning: "born, life", onyomi: ["セイ", "ショウ"], kunyomi: ["う(まれる)", "い(きる)"] },
    ],
    mnemonic: "GAKU-SEI → learn (学) + life (生) = a life of learning → student.",
    examples: [
      { jp: "私は大学の学生です。", reading: "わたしはだいがくのがくせいです。", en: "I am a university student." },
      { jp: "あの人は学生ですか。", reading: "あのひとはがくせいですか。", en: "Is that person a student?" },
    ],
    collocations: ["大学生", "高校生"],
    tier: "free",
  },
  {
    id: "n5-fa-004",
    lemma: "兄", reading: "あに", meaning: "older brother (humble)",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "和語", category: "family",
    kanji: [{ char: "兄", reading: "あに / ケイ", meaning: "older brother", onyomi: ["ケイ"], kunyomi: ["あに"] }],
    mnemonic: "A-NI → 兄 shows a mouth (口) over legs — the older one who speaks up first.",
    examples: [
      { jp: "兄は医者です。", reading: "あにはいしゃです。", en: "My older brother is a doctor." },
      { jp: "兄が二人います。", reading: "あにがふたりいます。", en: "I have two older brothers." },
    ],
    collocations: ["お兄さん", "兄弟"],
    tier: "free",
  },
  {
    id: "n5-fa-005",
    lemma: "姉", reading: "あね", meaning: "older sister (humble)",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "和語", category: "family",
    kanji: [{ char: "姉", reading: "あね / シ", meaning: "older sister", onyomi: ["シ"], kunyomi: ["あね"] }],
    mnemonic: "A-NE → 姉 has 女 (woman) on the left — the elder woman of the family.",
    examples: [
      { jp: "姉は東京に住んでいます。", reading: "あねはとうきょうにすんでいます。", en: "My older sister lives in Tokyo." },
      { jp: "姉のように優しい。", reading: "あねのようにやさしい。", en: "Kind like an older sister." },
    ],
    collocations: ["お姉さん", "姉妹"],
    tier: "free",
  },
  {
    id: "n5-fa-006",
    lemma: "子供", reading: "こども", meaning: "child, children",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "family",
    kanji: [
      { char: "子", reading: "コ / シ", meaning: "child", onyomi: ["シ", "ス"], kunyomi: ["こ"] },
      { char: "供", reading: "ども / キョウ", meaning: "accompany; plural", onyomi: ["キョウ", "ク"], kunyomi: ["とも", "そな(える)"] },
    ],
    mnemonic: "KO-DO-MO → child (子) + companion (供) = small companions → children.",
    examples: [
      { jp: "子供たちが遊んでいます。", reading: "こどもたちがあそんでいます。", en: "The children are playing." },
      { jp: "子供のとき東京にいました。", reading: "こどものときとうきょうにいました。", en: "When I was a child, I lived in Tokyo." },
    ],
    collocations: ["子供の時", "三人の子供"],
    tier: "free",
  },
  {
    id: "n5-fa-007",
    lemma: "先生", reading: "せんせい", meaning: "teacher; doctor",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "family",
    kanji: [
      { char: "先", reading: "セン", meaning: "ahead, previous", onyomi: ["セン"], kunyomi: ["さき"] },
      { char: "生", reading: "セイ", meaning: "born, life", onyomi: ["セイ", "ショウ"], kunyomi: ["う(まれる)", "い(きる)"] },
    ],
    mnemonic: "SEN-SEI → ahead (先) + born (生) = 'born ahead of you' → teacher / master.",
    examples: [
      { jp: "田中先生は優しい。", reading: "たなかせんせいはやさしい。", en: "Tanaka-sensei is kind." },
      { jp: "先生に質問します。", reading: "せんせいにしつもんします。", en: "I'll ask the teacher a question." },
    ],
    collocations: ["日本語の先生", "先生になる"],
    tier: "free",
  },
  {
    id: "n5-fa-008",
    lemma: "友達", reading: "ともだち", meaning: "friend",
    partOfSpeech: "noun", examCategory: "JLPT_N5", type: "漢語", category: "family",
    kanji: [
      { char: "友", reading: "とも", meaning: "friend", onyomi: ["ユウ"], kunyomi: ["とも"] },
      { char: "達", reading: "たち / ダツ", meaning: "reach; plural", onyomi: ["タツ"] },
    ],
    mnemonic: "TO-MO-DA-CHI → friend (友) + reach (達) = 'friends who reach alongside'.",
    examples: [
      { jp: "友達と遊ぶ。", reading: "ともだちとあそぶ。", en: "I play with a friend." },
      { jp: "いい友達がいます。", reading: "いいともだちがいます。", en: "I have good friends." },
    ],
    collocations: ["いい友達", "古い友達"],
    tier: "free",
  },
];

// ---------------------------------------------------------------------------
// Category 6 — 動詞 (core verbs) · 8 words
// ---------------------------------------------------------------------------

const VERBS: Word[] = [
  {
    id: "n5-v-001",
    lemma: "行く", reading: "いく", meaning: "to go",
    partOfSpeech: "verb (godan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "行", reading: "い(く) / コウ", meaning: "go", onyomi: ["コウ", "ギョウ"], kunyomi: ["い(く)", "おこな(う)"] }],
    mnemonic: "I-KU → \"ee-koo\" — 行 shows a person striding forward on two legs.",
    examples: [
      { jp: "学校へ行きます。", reading: "がっこうへいきます。", en: "I go to school." },
      { jp: "明日東京へ行く。", reading: "あしたとうきょうへいく。", en: "I'll go to Tokyo tomorrow." },
    ],
    collocations: ["学校へ行く", "旅行に行く"],
    tier: "free",
  },
  {
    id: "n5-v-002",
    lemma: "来る", reading: "くる", meaning: "to come",
    partOfSpeech: "verb (irregular)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "来", reading: "く(る) / ライ", meaning: "come", onyomi: ["ライ"], kunyomi: ["く(る)", "き(たる)"] }],
    mnemonic: "KU-RU → 来 shows a person approaching — someone is coming toward you.",
    examples: [
      { jp: "友達が来ます。", reading: "ともだちがきます。", en: "My friend is coming." },
      { jp: "電車が来ました。", reading: "でんしゃがきました。", en: "The train has arrived." },
    ],
    collocations: ["電車が来る", "家に来る"],
    tier: "free",
  },
  {
    id: "n5-v-003",
    lemma: "見る", reading: "みる", meaning: "to see, to watch",
    partOfSpeech: "verb (ichidan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "見", reading: "み(る) / ケン", meaning: "see", onyomi: ["ケン"], kunyomi: ["み(る)"] }],
    mnemonic: "MI-RU → 見 is an eye (目) on legs — the eye walks around and sees.",
    examples: [
      { jp: "映画を見ます。", reading: "えいがをみます。", en: "I watch a movie." },
      { jp: "空を見てください。", reading: "そらをみてください。", en: "Please look at the sky." },
    ],
    collocations: ["テレビを見る", "映画を見る"],
    tier: "free",
  },
  {
    id: "n5-v-004",
    lemma: "寝る", reading: "ねる", meaning: "to sleep; to go to bed",
    partOfSpeech: "verb (ichidan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "寝", reading: "ね(る) / シン", meaning: "sleep, lie down", onyomi: ["シン"], kunyomi: ["ね(る)"] }],
    mnemonic: "NE-RU → 寝 has 宀 (roof) over a person — lying under a roof to sleep.",
    examples: [
      { jp: "十時に寝ます。", reading: "じゅうじにねます。", en: "I go to bed at 10." },
      { jp: "昨日早く寝ました。", reading: "きのうはやくねました。", en: "I went to bed early yesterday." },
    ],
    collocations: ["早く寝る", "よく寝る"],
    tier: "free",
  },
  {
    id: "n5-v-005",
    lemma: "食べる", reading: "たべる", meaning: "to eat",
    partOfSpeech: "verb (ichidan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "食", reading: "た(べる)", meaning: "eat, food", onyomi: ["ショク"], kunyomi: ["た(べる)", "く(う)"] }],
    mnemonic: "TA-BE-RU → 食 shows a lid over a table of food — lift the lid to eat.",
    examples: [
      { jp: "ごはんを食べる。", reading: "ごはんをたべる。", en: "I eat rice." },
      { jp: "肉を食べます。", reading: "にくをたべます。", en: "I'll eat meat." },
    ],
    collocations: ["朝ごはんを食べる", "よく食べる"],
    tier: "free",
  },
  {
    id: "n5-v-006",
    lemma: "飲む", reading: "のむ", meaning: "to drink",
    partOfSpeech: "verb (godan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "飲", reading: "の(む)", meaning: "drink", onyomi: ["イン"], kunyomi: ["の(む)"] }],
    mnemonic: "NO-MU → 飲 = 食 (food radical) + 欠 (yawn / open mouth) — opening the mouth to drink.",
    examples: [
      { jp: "水を飲む。", reading: "みずをのむ。", en: "I drink water." },
      { jp: "お茶を飲みます。", reading: "おちゃをのみます。", en: "I'll drink tea." },
    ],
    collocations: ["水を飲む", "薬を飲む"],
    tier: "free",
  },
  {
    id: "n5-v-007",
    lemma: "読む", reading: "よむ", meaning: "to read",
    partOfSpeech: "verb (godan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "読", reading: "よ(む)", meaning: "read", onyomi: ["ドク", "トク"], kunyomi: ["よ(む)"] }],
    mnemonic: "YO-MU → 読 = 言 (speech) + 売 (sell) — reading aloud as if selling the words.",
    examples: [
      { jp: "本を読む。", reading: "ほんをよむ。", en: "I read a book." },
      { jp: "新聞を読みます。", reading: "しんぶんをよみます。", en: "I read the newspaper." },
    ],
    collocations: ["本を読む", "新聞を読む"],
    tier: "free",
  },
  {
    id: "n5-v-008",
    lemma: "書く", reading: "かく", meaning: "to write",
    partOfSpeech: "verb (godan)", examCategory: "JLPT_N5", type: "和語", category: "verb",
    kanji: [{ char: "書", reading: "か(く)", meaning: "write, book", onyomi: ["ショ"], kunyomi: ["か(く)"] }],
    mnemonic: "KA-KU → 書 shows a brush (聿) over 日 (day) — writing a diary each day.",
    examples: [
      { jp: "手紙を書く。", reading: "てがみをかく。", en: "I write a letter." },
      { jp: "名前を書きます。", reading: "なまえをかきます。", en: "I write my name." },
    ],
    collocations: ["名前を書く", "手紙を書く"],
    tier: "free",
  },
];

export const WORDS: Word[] = [...GREETINGS, ...FOOD, ...PLACES, ...TIMES, ...FAMILY, ...VERBS];

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
