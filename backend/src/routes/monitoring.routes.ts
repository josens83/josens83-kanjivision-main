import { Router } from "express";
import { cacheStats, clearCache, dbStats, health } from "../controllers/monitoring.controller";
import { requireInternalKey } from "../middleware/internal.middleware";

const router = Router();
router.get("/health", requireInternalKey, health);
router.get("/db-stats", requireInternalKey, dbStats);
router.get("/cache/stats", requireInternalKey, cacheStats);
router.post("/cache/clear", requireInternalKey, clearCache);
export default router;
