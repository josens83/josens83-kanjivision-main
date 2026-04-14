import { Router } from "express";
import { due, grade, stats } from "../controllers/progress.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.post("/grade", grade);
router.get("/due", due);
router.get("/stats", stats);
export default router;
