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

# Force Railway/Docker build-cache invalidation — bump the date when Railway
# serves a stale cached build despite new commits on main.
RUN echo "Force rebuild 2026-04-16-14:00" > /tmp/rebuild-marker

EXPOSE 8080
ENV PORT=8080

# Wrap start with a preamble that echoes the effective start script to
# Railway's logs. Makes it obvious at a glance whether the image was built
# from the current package.json or a stale cache.
CMD ["sh", "-c", "echo '== PACKAGE.JSON START SCRIPT ==' && cat package.json | grep -A1 '\"start\"' && echo '== RUNNING NPM START ==' && npm start"]
