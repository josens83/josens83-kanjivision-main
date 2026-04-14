import { Router } from "express";
import { createWord, deleteWord, stats } from "../controllers/admin.controller";
import { requireAuth, requireTier } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth, requireTier("PREMIUM"));
router.get("/stats", stats);
router.post("/words", createWord);
router.delete("/words/:id", deleteWord);
export default router;
