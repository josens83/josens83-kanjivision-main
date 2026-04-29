import { Router } from "express";
import { billingHistory, cancelSubscription, createCheckout, getSubscription, webhook } from "../controllers/paddle.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/create-checkout", requireAuth, createCheckout);
router.post("/webhook", webhook);
router.get("/subscription", requireAuth, getSubscription);
router.post("/cancel", requireAuth, cancelSubscription);
router.get("/billing-history", requireAuth, billingHistory);
export default router;
