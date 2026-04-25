import { Router } from "express";
import { createTicket, getTicket, myTickets } from "../controllers/support.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.post("/ticket", createTicket);
router.get("/tickets", requireAuth, myTickets);
router.get("/tickets/:id", requireAuth, getTicket);
export default router;
