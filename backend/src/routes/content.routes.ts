import { Router } from "express";
import { generateExample, generateMnemonic } from "../controllers/content.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.post("/mnemonic", generateMnemonic);
router.post("/example", generateExample);
export default router;
