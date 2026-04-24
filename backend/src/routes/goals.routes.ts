import { Router } from "express";
import { getDailyGoal, incrementProgress, updateDailyGoal } from "../controllers/goals.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/daily", getDailyGoal);
router.put("/daily", updateDailyGoal);
router.post("/progress", incrementProgress);
export default router;
