import { Router } from "express";
import {
  addBookmark,
  checkBookmark,
  getBookmarks,
  removeBookmark,
  toggleBookmark,
} from "../controllers/bookmark.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/", getBookmarks);
router.post("/", addBookmark);
router.post("/toggle", toggleBookmark);
router.get("/:wordId", checkBookmark);
router.delete("/:wordId", removeBookmark);
export default router;
