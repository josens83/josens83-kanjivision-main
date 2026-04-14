# KanjiVision AI — Backend

Express + TypeScript + Prisma API for the KanjiVision AI paid platform.
Mirrors the backend structure of the other Vision Platform services
(VocaVision, HangeulVision); only `ExamCategory` changes:

```prisma
enum ExamCategory {
  JLPT_N5
  JLPT_N4
  JLPT_N3
  JLPT_N2
  JLPT_N1
  THEME
  GENERAL
}
```

## Stack

- Node 20 · TypeScript 5.5
- Express 4 + Helmet + CORS + Morgan
- Prisma 5 (Postgres / Supabase)
- bcryptjs + JSON Web Tokens for auth
- Zod for input validation
- Pino for logging

## 11 API modules

| Prefix | Purpose |
| --- | --- |
| `/api/health` | Liveness + DB check |
| `/api/auth` | Signup / login / me |
| `/api/users` | Profile read / update / delete |
| `/api/words` | List + get words, filter by JLPT level |
| `/api/progress` | SM-2 grading, due queue, stats |
| `/api/sessions` | Start / end study sessions |
| `/api/subscriptions` | List + cancel subscriptions |
| `/api/payments` | Checkout + Paddle/Toss webhooks |
| `/api/admin` | (Premium) stats, CRUD seed words |
| `/api/content` | AI mnemonic + example generation |
| `/api/images` | Stability AI image generation |

## Local development

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run seed       # 10 JLPT N5 words
npm run dev        # http://localhost:3001
```

## Deploy (Railway)

`Dockerfile` + `railway.json` are wired up:

- Build: `docker build` → Prisma generate → `tsc`
- Start: `prisma migrate deploy && node dist/index.js`
- Healthcheck: `GET /api/health`

## Phase 2

Once VocaVision / HangeulVision / KanjiVision stabilize, extract shared
modules (auth, SRS, payment, image-gen, email) into
`@vision-platform/core` and consolidate into a multi-tenant backend.
