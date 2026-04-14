# KanjiVision AI

> **Japanese, Visualized.** JLPT N5 → N1 vocabulary learning with AI-generated
> mnemonics, kanji decomposition (漢字分解), and SM-2 spaced repetition.
> Web · Mobile PWA · Native apps (Phase 2 via Codemagic).

Part of the **Vision Platform** family — sibling to
[VocaVision](https://vocavision.app) (English) and
[HangeulVision](https://hangeulvision.app) (Korean).
Shared infra keeps per-service fixed cost at ~$2.67/month.

---

## Stack

| Layer | Tech |
| --- | --- |
| Framework | Next.js 14 (App Router) |
| UI | Tailwind CSS, Noto Sans JP, furigana via `<ruby>` |
| State | Zustand (localStorage persistence) |
| SRS | SM-2 algorithm, shared across all three Vision Platform services |
| Payments | **Paddle** (global) · **TossPayments** (Korea) |
| AI | Anthropic Claude (content) · Stability AI (imagery) |
| Hosting | Vercel (web) · Railway (API, Phase 2) |
| Mobile | PWA today · Codemagic-built iOS/Android shells (Phase 2) |

---

## Paid-site features in this MVP

- Landing page with hero, feature strip, JLPT pathway, cross-promo
- **Pricing page** with Free / Basic ($4.99) / Premium ($7.99) + one-shot N3/N2/N1 packs
- **Learn** flashcards: tap to flip, 4-grade SM-2 scoring, kanji decomposition, mnemonic, example
- **Dashboard** with streak, due counter, mastered count
- **Admin** table of seeded words (Phase 2: full CRUD)
- **PaywallGate** component enforces tier access per level
- API routes: `/api/health`, `/api/words`, `/api/subscribe`, `/api/progress`, Paddle & Toss webhook stubs
- PWA: installable, offline-cached via service worker
- Mobile-first responsive design with sticky bottom nav

---

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in Paddle / Toss / Claude keys when ready
npm run dev                  # http://localhost:3000
```

Scripts:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint via `next lint` |
| `npm run typecheck` | Strict TypeScript check |

---

## Seed content (MVP)

10 JLPT N5 words seeded in `src/data/words.ts`:

| Word | Reading | Meaning |
| --- | --- | --- |
| 食べる | たべる | to eat |
| 飲む | のむ | to drink |
| 書く | かく | to write |
| 読む | よむ | to read |
| 大きい | おおきい | big |
| 小さい | ちいさい | small |
| 学校 | がっこう | school |
| 先生 | せんせい | teacher |
| 友達 | ともだち | friend |
| 天気 | てんき | weather |

Etymology = **漢字分解**. Example: 学校 → 学 (*learn*) + 校 (*school building*).
先生 → 先 (*ahead*) + 生 (*born*) = "born ahead" → teacher.

---

## Directory layout

```
src/
  app/
    page.tsx              landing
    learn/page.tsx        flashcard session
    pricing/page.tsx      plans + one-shot packs + bundles
    dashboard/page.tsx    streak + stats
    admin/page.tsx        seed content table
    signin/page.tsx       demo auth
    legal/                terms + privacy
    api/
      health, words, subscribe, progress
      webhooks/paddle, webhooks/toss
  components/
    NavBar, FlashCard, PaywallGate, ServiceWorker
  data/words.ts           seed vocabulary + levels
  lib/
    srs.ts                SM-2 algorithm
    tiers.ts              Free / Basic / Premium plans
    store.ts              Zustand store (user, progress, streak)
public/
  manifest.json, icon.svg, sw.js   (PWA)
```

---

## Roadmap

- **Now (Phase 1, 6월):** MVP live · N5 + N4 decks · Paddle + Toss live · PWA
- **7월:** N3 expansion · native iOS/Android shells via Codemagic
- **8월:** Product Hunt launch #3 · bundles live with sibling services
- **9월+:** Extract `@vision-platform/core` — shared auth, SRS, payment, image-gen, email across all three services

---

## Service-level economics

| | Standalone × 3 | Shared infra | Per-service |
| --- | --- | --- | --- |
| Railway | $15/mo | $5/mo | **$1.67** |
| Supabase | Free × 3 | Free × 3 | $0 |
| Vercel | Free | Free | $0 |
| Domain | $36/yr | $36/yr | $12/yr |
| **Fixed cost** | $7/mo | $8/mo | **$2.67/mo** |

Any single paid subscriber puts the service in the black.

---

## Operator

Unipath · support@kanjivision.app

Licensed for Unipath internal use. Sibling services:
[vocavision.app](https://vocavision.app), [hangeulvision.app](https://hangeulvision.app).
