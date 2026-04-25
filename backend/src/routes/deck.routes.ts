import { Router } from "express";
import { addWord, createDeck, deleteDeck, listDecks, publicDecks, removeWord, updateDeck } from "../controllers/deck.controller";
import { requireAuth } from "../middleware/auth.middleware";

const router = Router();
router.use(requireAuth);
router.get("/", listDecks);
router.post("/", createDeck);
router.get("/public", publicDecks);
router.put("/:id", updateDeck);
router.delete("/:id", deleteDeck);
router.post("/:id/words", addWord);
router.delete("/:id/words/:wordId", removeWord);
export default router;
