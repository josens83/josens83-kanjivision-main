import { Router } from "express";
import {
  generateWords,
  generateWordsBatch,
  generateWordsBatchGet,
  generateWordsGet,
  generateImagesGet,
} from "../controllers/internal.controller";
import { requireInternalKey } from "../middleware/internal.middleware";

const router = Router();
router.use(requireInternalKey);

// Server-to-server (JSON body, x-internal-key header)
router.post("/generate-words", generateWords);
router.post("/generate-words-batch", generateWordsBatch);

// Browser-friendly (query params, ?key=…)
// e.g. GET /api/internal/generate-words?key=XXX&exam=JLPT_N5&count=10&category=food
// e.g. GET /api/internal/generate-words-batch?key=XXX&exam=JLPT_N5&batchSize=10&totalTarget=50
router.get("/generate-words", generateWordsGet);
router.get("/generate-words-batch", generateWordsBatchGet);
router.get("/generate-images", generateImagesGet);

export default router;
