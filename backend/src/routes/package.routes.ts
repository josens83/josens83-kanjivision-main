import { Router } from "express";
import { getPackage, listPackages } from "../controllers/package.controller";

const router = Router();
router.get("/", listPackages);
router.get("/:slug", getPackage);
export default router;
