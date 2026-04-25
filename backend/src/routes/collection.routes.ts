import { Router } from "express";
import { adminCreate, adminDelete, getCollection, listCollections } from "../controllers/collection.controller";
import { requireInternalKey } from "../middleware/internal.middleware";

const router = Router();
router.get("/", listCollections);
router.get("/:id", getCollection);
router.post("/", requireInternalKey, adminCreate);
router.delete("/:id", requireInternalKey, adminDelete);
export default router;
