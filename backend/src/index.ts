import "dotenv/config";
import { exec } from "node:child_process";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler, notFound } from "./middleware/error.middleware";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import contentRoutes from "./routes/content.routes";
import healthRoutes from "./routes/health.routes";
import imageRoutes from "./routes/image.routes";
import internalRoutes from "./routes/internal.routes";
import learningRoutes from "./routes/learning.routes";
import paymentRoutes from "./routes/payment.routes";
import progressRoutes from "./routes/progress.routes";
import sessionRoutes from "./routes/session.routes";
import subscriptionRoutes from "./routes/subscription.routes";
import userRoutes from "./routes/user.routes";
import wordRoutes from "./routes/word.routes";

const app = express();
const PORT = Number(process.env.PORT ?? 3001);

const origins =
  process.env.CORS_ORIGIN?.split(",").map((s) => s.trim()).filter(Boolean) ?? [
    "http://localhost:3000",
  ];

app.use(helmet());
app.use(cors({ origin: origins, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// --- Root health endpoint (Railway healthcheckPath = /health) ---
// Always 200 — we want Railway to mark the service up even while the
// background DB bootstrap is still running. Application routes that need
// tables will fail until initDatabase() completes; the frontend falls back
// to its seed cards during that window.
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "kanjivision" });
});

// --- 11 API routes ---
app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/words", wordRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/learning", learningRoutes);
app.use("/api/internal", internalRoutes);

// --- 404 + error ---
app.use(notFound);
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Background DB bootstrap
//
// Why not in startCommand: `prisma db push` has been observed to hang against
// Supabase's pooler during the pre-listen phase, which blocks Railway's
// healthcheck and kills the container before any tables get created. Running
// it from inside the Node process lets the server listen immediately (health
// green) while the schema sync happens in the background.
//
// Flow:
//   1. Probe for a known table (Word.findFirst).
//   2. Already-exists → done, return.
//   3. P2021 (table missing) → exec `prisma db push`, then run the seed.
//   4. Other errors → log and move on; the API is up, the operator can
//      trigger a manual sync via /api/internal/generate-words-batch or by
//      pasting backend/prisma/migrations/.../migration.sql into Supabase.
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
    // Stream child output to our logs so we can see the hang if one happens.
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

app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log("🚀 KanjiVision API running on port " + PORT);
  logger.info({ port: PORT, origins }, "kanjivision-backend listening");
  // Fire-and-forget — never blocks listen().
  initDatabase().catch((err) => {
    logger.error({ err }, "initDatabase crashed");
  });
});

export default app;
