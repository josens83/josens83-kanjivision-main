import { Router } from "express";
import {
  completeSession,
  getSession,
  learningStats,
  queue,
  recordSessionProgress,
  startSession,
} from "../controllers/learning.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/queue", queue);
router.get("/stats", learningStats);
router.post("/sessions", startSession);
router.get("/sessions/:id", getSession);
router.post("/sessions/:id/progress", recordSessionProgress);
router.post("/sessions/:id/complete", completeSession);
export default router;
