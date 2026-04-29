import { Router } from "express";
import {
  generateWords,
  generateWordsBatch,
  generateWordsBatchGet,
  generateWordsGet,
  generateImagesGet,
} from "../controllers/internal.controller";
import { listAllPackages, updatePackage } from "../controllers/package.controller";
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

export default router;
