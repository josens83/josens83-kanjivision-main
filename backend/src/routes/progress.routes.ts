import { Router } from "express";
import { getOne, grade, list, remove, stats } from "../controllers/progress.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/stats", stats);
router.get("/", list);
router.get("/:wordId", getOne);
router.post("/:wordId/grade", grade);
router.delete("/:wordId", remove);
export default router;
