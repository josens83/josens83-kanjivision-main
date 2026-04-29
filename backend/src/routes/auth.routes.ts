import { Router } from "express";
import { login, logout, me, refresh, signup, googleAuth, googleCallback, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authLimiter } from "../middleware/rateLimiter.middleware";

const router = Router();
router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/refresh", authLimiter, refresh);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.get("/google", googleAuth);
router.get("/callback/google", googleCallback);
router.post("/forgot-password", authLimiter, forgotPassword);
router.post("/reset-password", authLimiter, resetPassword);
export default router;
