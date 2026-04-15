import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler, notFound } from "./middleware/error.middleware";
import { logger } from "./lib/logger";

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

app.listen(PORT, "0.0.0.0", () => {
  // eslint-disable-next-line no-console
  console.log("🚀 KanjiVision API running on port " + PORT);
  logger.info({ port: PORT, origins }, "kanjivision-backend listening");
});

export default app;
