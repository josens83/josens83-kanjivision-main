import { Router } from "express";
import { checkout, paddleWebhook, tossWebhook } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/checkout", requireAuth, checkout);
router.post("/webhooks/paddle", paddleWebhook);
router.post("/webhooks/toss", tossWebhook);
export default router;
