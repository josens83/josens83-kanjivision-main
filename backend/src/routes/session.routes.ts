import { Router } from "express";
import { end, listSessions, start } from "../controllers/session.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.post("/start", start);
router.post("/end", end);
router.get("/", listSessions);
export default router;
