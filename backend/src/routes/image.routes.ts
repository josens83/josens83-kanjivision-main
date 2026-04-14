import { Router } from "express";
import { generate, listForWord } from "../controllers/image.controller";
import { requireAuth, requireTier } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth, requireTier("BASIC"));
router.post("/generate", generate);
router.get("/word/:wordId", listForWord);
export default router;
