import { Router } from "express";
import {
  generateWords,
  generateWordsBatch,
  generateWordsBatchGet,
  generateWordsGet,
  generateImagesGet,
} from "../controllers/internal.controller";
import { listAllPackages, updatePackage } from "../controllers/package.controller";
import { dashboard as analyticsDashboard } from "../controllers/analytics.controller";
import { requireInternalKey } from "../middleware/internal.middleware";
import { prisma } from "../lib/prisma";

const router = Router();
router.use(requireInternalKey);

// Server-to-server (JSON body, x-internal-key header)
router.post("/generate-words", generateWords);
router.post("/generate-words-batch", generateWordsBatch);

// Browser-friendly (query params, ?key=…)
router.get("/generate-words", generateWordsGet);
router.get("/generate-words-batch", generateWordsBatchGet);
router.get("/generate-images", generateImagesGet);

// Admin package management
router.get("/packages", listAllPackages);
router.patch("/packages/:id", updatePackage);

// Admin subscribers list
router.get("/subscribers", async (_req, res) => {
  const subscribers = await prisma.user.findMany({
    where: { tier: { not: "FREE" } },
    select: { id: true, email: true, tier: true, subscriptionPlan: true, subscriptionStatus: true, subscriptionEnd: true, autoRenewal: true },
    orderBy: { subscriptionEnd: "asc" },
  });
  res.json({ subscribers });
});

// Broadcast notification to all users
router.post("/broadcast", async (req, res) => {
  const { title, message, type } = req.body as { title?: string; message?: string; type?: string };
  if (!title || !message) return res.status(400).json({ error: "title and message required" });
  const users = await prisma.user.findMany({ select: { id: true } });
  let created = 0;
  for (const u of users) {
    await prisma.notification.create({
      data: { userId: u.id, type: type ?? "ANNOUNCEMENT", title, message },
    }).catch(() => {});
    created++;
  }
  res.json({ ok: true, created, total: users.length });
});

// Analytics dashboard
router.get("/analytics", analyticsDashboard);

// Content gaps (levels below target)
router.get("/content-gaps", async (_req, res) => {
  const { getContentGaps } = await import("../cron/content-stats");
  const gaps = await getContentGaps();
  res.json({ gaps });
});

export default router;
