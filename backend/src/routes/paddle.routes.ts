import { Router } from "express";
import { createCheckout, getSubscription, webhook } from "../controllers/paddle.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/create-checkout", requireAuth, createCheckout);
router.post("/webhook", webhook);
router.get("/subscription", requireAuth, getSubscription);
export default router;
