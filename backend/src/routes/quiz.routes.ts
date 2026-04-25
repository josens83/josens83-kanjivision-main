import { Router } from "express";
import { getQuestions, submitQuiz } from "../controllers/quiz.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/questions", getQuestions);
router.post("/submit", requireAuth, submitQuiz);
export default router;
