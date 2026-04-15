import { Router } from "express";
import { login, logout, me, refresh, signup } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", requireAuth, logout);
router.get("/me", requireAuth, me);
export default router;
