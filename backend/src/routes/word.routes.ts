import { Router } from "express";
import { byLevel, getOne, list } from "../controllers/word.controller";

const router = Router();
router.get("/", list);
router.get("/level/:level", byLevel);
router.get("/:id", getOne);
export default router;
