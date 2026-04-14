import { Router } from "express";
import { deleteAccount, getProfile, updateProfile } from "../controllers/user.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/me", getProfile);
router.patch("/me", updateProfile);
router.delete("/me", deleteAccount);
export default router;
