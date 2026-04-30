import { Router } from "express";
import { checkout, downloadReceipt, paddleWebhook, tossWebhook } from "../controllers/payment.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/checkout", requireAuth, checkout);
router.post("/webhooks/paddle", paddleWebhook);
router.post("/webhooks/toss", tossWebhook);
router.get("/receipt/:purchaseId", requireAuth, downloadReceipt);
export default router;
