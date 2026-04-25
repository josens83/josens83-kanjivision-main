import { Router } from "express";
import { create, listActive, remove } from "../controllers/announcement.controller";
import { requireInternalKey } from "../middleware/internal.middleware";

const router = Router();
router.get("/", listActive);
router.post("/", requireInternalKey, create);
router.delete("/:id", requireInternalKey, remove);
export default router;
