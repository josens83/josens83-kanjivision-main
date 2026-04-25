import { Router } from "express";
import { getQuestions, submitQuiz, levelTestQuestions, levelTestSubmit } from "../controllers/quiz.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.get("/questions", getQuestions);
router.post("/submit", requireAuth, submitQuiz);
router.get("/level-test", levelTestQuestions);
router.post("/level-test/submit", requireAuth, levelTestSubmit);
export default router;
