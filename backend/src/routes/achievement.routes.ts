import { Router } from "express";
import { checkAchievements, listAchievements } from "../controllers/achievement.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/", listAchievements);
router.post("/check", requireAuth, checkAchievements);
export default router;
