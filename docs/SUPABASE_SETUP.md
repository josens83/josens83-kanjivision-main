# Supabase project setup — KanjiVision AI

> Heads-up: I can't provision a Supabase project automatically from this
> harness (no Supabase API creds available). This guide walks through the
> ~2 minutes of manual setup and leaves the project production-ready for
> Railway. Once you click through it and paste the URLs into Railway,
> the backend will boot and apply `prisma migrate deploy` on its own.

---

## 1. Create the project

1. https://supabase.com → **New project**
2. Name: `kanjivision`
3. Database password: generate and store in 1Password
4. Region: **Tokyo (ap-northeast-1)** — matches JLPT users
5. Plan: **Free** (Phase 1; upgrade to Pro later if needed)
6. Click **Create new project** and wait ~2 min for provisioning.

## 2. Grab the two connection strings

Settings → **Database** → **Connection string** → **URI**:

| Variable | Use | What to copy |
| --- | --- | --- |
| `DATABASE_URL` | Runtime (pooled) | `Transaction pooler` URI — port **6543** |
| `DIRECT_URL`   | Migrations       | `Session pooler` / Direct URI — port **5432** |

Append `?pgbouncer=true&connection_limit=1` to `DATABASE_URL` (Supabase
recommends this with PgBouncer).

## 3. Paste into Railway

Railway project → KanjiVision backend service → **Variables**:

```env
DATABASE_URL=postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
DIRECT_URL=postgresql://postgres.xxxxx:PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres

JWT_SECRET=<generate via `openssl rand -hex 32`>
NODE_ENV=production
PORT=8080
CORS_ORIGIN=https://kanjivision.app,http://localhost:3000

# Optional — fill in as you wire them up
ANTHROPIC_API_KEY=
STABILITY_API_KEY=
PADDLE_API_KEY=
PADDLE_WEBHOOK_SECRET=
TOSS_SECRET_KEY=
TOSS_WEBHOOK_SECRET=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=no-reply@kanjivision.app
```

## 4. Deploy

Railway auto-deploys from `main`. First boot:

1. Dockerfile builds (base → deps → builder → runner)
2. Container starts, runs `npx prisma migrate deploy` which applies
   `prisma/migrations/20260415000000_init/migration.sql`
3. Express listens on `0.0.0.0:8080`
4. Railway healthcheck probes `GET /health` → `{ "status": "ok", "service": "kanjivision" }`

## 5. Seed (one-time)

From your laptop with the same `DATABASE_URL`:

```bash
cd backend
npm install
npm run seed   # inserts the 50 JLPT N5 seed words
```

Or from a Railway one-off: `railway run npm run seed`.

## 6. Verify

```bash
curl https://<your-railway-host>/health
#  → {"status":"ok","service":"kanjivision"}

curl https://<your-railway-host>/api/words/count
#  → {"total":50,"byExam":{"JLPT_N5":50}}
```

---

## Rollback / clean reset

If you need to start the DB over:

```bash
# Danger: wipes all data.
DATABASE_URL=... DIRECT_URL=... npx prisma migrate reset --force
```

## Phase 2 upgrades

- Enable **Row Level Security** on `User`, `Progress`, `Subscription`,
  `Payment` and add policies keyed off `auth.jwt() ->> 'sub'`.
- Move `MnemonicImage` storage to Supabase Storage bucket `kanji-mnemonics`.
- Add Supabase-hosted Edge Functions for Paddle / Toss webhook verification
  if you want to drop the Express tier eventually.
