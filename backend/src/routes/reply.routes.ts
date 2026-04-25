import { Router } from "express";
import { adminListReplies, adminUpdateStatus, createReply, myReplies } from "../controllers/reply.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { requireInternalKey } from "../middleware/internal.middleware";

const router = Router();
router.post("/", requireAuth, createReply);
router.get("/mine", requireAuth, myReplies);
router.get("/admin", requireInternalKey, adminListReplies);
router.put("/admin/:id/status", requireInternalKey, adminUpdateStatus);
export default router;
