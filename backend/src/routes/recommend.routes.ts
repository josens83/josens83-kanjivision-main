import { Router } from "express";
import { nextWords } from "../controllers/recommend.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/next-words", requireAuth, nextWords);
export default router;
