import { Router } from "express";
import { addXp, getLeague } from "../controllers/league.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/", getLeague);
router.post("/xp", addXp);
export default router;
