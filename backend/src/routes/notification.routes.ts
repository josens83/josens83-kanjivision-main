import { Router } from "express";
import { list, markAllRead, markRead, unreadCount } from "../controllers/notification.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/", list);
router.get("/unread-count", unreadCount);
router.put("/read-all", markAllRead);
router.put("/:id/read", markRead);
export default router;
