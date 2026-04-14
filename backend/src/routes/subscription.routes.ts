import { Router } from "express";
import { cancel, list } from "../controllers/subscription.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/", list);
router.post("/:id/cancel", cancel);
export default router;
