FROM node:20-slim AS base

FROM base AS deps
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json ./
COPY prisma ./prisma/
RUN npm install

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
ENV NODE_ENV=production
COPY package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Force rebuild marker — bump the date when Railway serves a stale build.
RUN echo "Force rebuild 2026-04-16-15:00" > /tmp/rebuild-marker

EXPOSE 8080
ENV PORT=8080

# Direct exec-form CMD — no shell wrapper, no railway.json override.
# initDatabase() inside src/index.ts handles DB bootstrap after listen().
# Healthcheck path should be set in the Railway dashboard → Service
# Settings → Deploy → Healthcheck Path: /health
CMD ["node", "dist/index.js"]
