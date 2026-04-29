// VERY FIRST LINE — proves node entered the file. If we don't see this,
// the issue is upstream (build artifact missing, wrong CMD, etc.).
process.stdout.write("[boot] node entered dist/index.js\n");

// Surface any uncaught error to stdout BEFORE the process exits.
process.on("uncaughtException", (err) => {
  process.stderr.write(`[boot] uncaughtException: ${err.stack ?? err}\n`);
});
process.on("unhandledRejection", (reason) => {
  process.stderr.write(`[boot] unhandledRejection: ${String(reason)}\n`);
});

import "dotenv/config";
import { exec } from "node:child_process";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

process.stdout.write("[boot] core deps loaded\n");

import { errorHandler, notFound } from "./middleware/error.middleware";
import { rateLimiter } from "./middleware/rateLimiter.middleware";
import { logger } from "./lib/logger";
import { prisma, disconnectPrisma } from "./lib/prisma";
import { checkExpiringPurchases } from "./cron/expiry-notification";
import { collectContentStats } from "./cron/content-stats";

process.stdout.write("[boot] middleware + logger + prisma module loaded\n");

import achievementRoutes from "./routes/achievement.routes";
import adminRoutes from "./routes/admin.routes";
import announcementRoutes from "./routes/announcement.routes";
import authRoutes from "./routes/auth.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import chatRoutes from "./routes/chat.routes";
import deckRoutes from "./routes/deck.routes";
import collectionRoutes from "./routes/collection.routes";
import contentRoutes from "./routes/content.routes";
import goalsRoutes from "./routes/goals.routes";
import healthRoutes from "./routes/health.routes";
import imageRoutes from "./routes/image.routes";
import internalRoutes from "./routes/internal.routes";
import leagueRoutes from "./routes/league.routes";
import learningRoutes from "./routes/learning.routes";
import monitoringRoutes from "./routes/monitoring.routes";
import notificationRoutes from "./routes/notification.routes";
import packageRoutes from "./routes/package.routes";
import paddleRoutes from "./routes/paddle.routes";
import paymentRoutes from "./routes/payment.routes";
import progressRoutes from "./routes/progress.routes";
import quizRoutes from "./routes/quiz.routes";
import replyRoutes from "./routes/reply.routes";
import sessionRoutes from "./routes/session.routes";
import supportRoutes from "./routes/support.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import userRoutes from "./routes/user.routes";
import recommendRoutes from "./routes/recommend.routes";
import wordRoutes from "./routes/word.routes";

process.stdout.write("[boot] all route modules loaded\n");

const app = express();
const PORT = Number(process.env.PORT ?? 8080);

const origins: (string | RegExp)[] = [
  "https://josens83-kanjivision-main.vercel.app",
  "http://localhost:3000",
];
if (process.env.CORS_ORIGIN) {
  for (const o of process.env.CORS_ORIGIN.split(",")) {
    const trimmed = o.trim();
    if (trimmed) origins.push(trimmed);
  }
}

app.use(helmet());
app.use(compression({ level: 6, threshold: 1024 }));
app.use(rateLimiter);
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({
  limit: "1mb",
  verify: (req: any, _res, buf) => {
    if (req.url?.includes("/paddle/webhook")) {
      req.rawBody = buf.toString();
    }
  },
}));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- Root health endpoint (Railway healthcheckPath = /health) ---
// Always 200 — DB-free. Lets Railway mark the service healthy even while
// the background DB bootstrap is still running.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "kanjivision" });
});

// --- 11 API routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/users", userRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/replies", replyRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/paddle", paddleRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/goals", goalsRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/admin/monitoring", monitoringRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/internal", internalRoutes);
app.use("/api/league", leagueRoutes);
app.use("/api/recommend", recommendRoutes);

// --- 404 + error ---
app.use(notFound);
app.use(errorHandler);

process.stdout.write(`[boot] express app configured, calling listen(${PORT})\n`);

const server = app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log("🚀 KanjiVision API running on port " + PORT);
  logger.info({ port: PORT, origins }, "kanjivision-backend listening");
  initDatabase().catch((err) => {
    logger.error({ err }, "initDatabase crashed");
  });

  // Daily expiry check — runs every 24h
  const DAY_MS = 24 * 60 * 60 * 1000;
  setInterval(() => {
    checkExpiringPurchases().catch((err) => logger.error({ err }, "expiry cron failed"));
  }, DAY_MS);
  // Run once 30s after boot
  setTimeout(() => {
    checkExpiringPurchases().catch((err) => logger.error({ err }, "expiry cron initial run failed"));
    collectContentStats().catch((err) => logger.error({ err }, "content stats initial run failed"));
  }, 30_000);
  setInterval(() => {
    collectContentStats().catch((err) => logger.error({ err }, "content stats cron failed"));
  }, DAY_MS);
});

// --- Graceful shutdown ---
async function shutdown(signal: string) {
  logger.info({ signal }, "shutting down");
  server.close();
  await disconnectPrisma();
  process.exit(0);
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ---------------------------------------------------------------------------
// Background DB bootstrap (declared AFTER listen — never blocks boot)
// ---------------------------------------------------------------------------

interface PrismaError {
  code?: string;
  message?: string;
}

function runCommand(cmd: string, timeoutMs = 120_000): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = exec(cmd, { timeout: timeoutMs }, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`${err.message}\nstderr: ${stderr}`));
        return;
      }
      resolve(stdout + (stderr ? `\n[stderr]\n${stderr}` : ""));
    });
    child.stdout?.on("data", (d: Buffer) => process.stdout.write(d));
    child.stderr?.on("data", (d: Buffer) => process.stderr.write(d));
  });
}

async function initDatabase(): Promise<void> {
  try {
    await prisma.word.findFirst();
    // eslint-disable-next-line no-console
    console.log("✅ Database tables already exist — skipping bootstrap.");
    return;
  } catch (err) {
    const e = err as PrismaError;
    if (e.code !== "P2021") {
      logger.error({ err }, "unexpected DB probe failure; skipping bootstrap");
      return;
    }
    // eslint-disable-next-line no-console
    console.log("⚠️  Tables missing. Running prisma db push in background...");
  }

  try {
    const pushOut = await runCommand(
      "npx prisma db push --accept-data-loss --skip-generate"
    );
    // eslint-disable-next-line no-console
    console.log("✅ Schema synced via db push.\n" + pushOut);
  } catch (err) {
    logger.error({ err }, "prisma db push failed");
    return;
  }

  try {
    const seedOut = await runCommand("npx prisma db seed");
    // eslint-disable-next-line no-console
    console.log("✅ Seeded.\n" + seedOut);
  } catch (err) {
    logger.warn({ err }, "prisma db seed failed (API still up)");
  }
}

export default app;
