import { Router } from "express";
import { byExam, count, daily, getOne, list, search } from "../controllers/word.controller";

const router = Router();
router.get("/", list);
router.get("/daily", daily);
router.get("/count", count);
router.get("/search", search);
router.get("/by-exam/:exam", byExam);
router.get("/:id", getOne);
export default router;
