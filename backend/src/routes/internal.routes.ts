import { Router } from "express";
import {
  generateWords,
  generateWordsBatch,
} from "../controllers/internal.controller";
import { requireInternalKey } from "../middleware/internal.middleware";

const router = Router();
router.use(requireInternalKey);
router.post("/generate-words", generateWords);
router.post("/generate-words-batch", generateWordsBatch);
export default router;
