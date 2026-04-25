import { Router } from "express";
import { login, logout, me, refresh, signup, googleAuth, googleCallback, forgotPassword, resetPassword } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
router.get("/google", googleAuth);
router.get("/callback/google", googleCallback);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
export default router;
