import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

export async function listDecks(req: AuthenticatedRequest, res: Response) {
  const decks = await prisma.deck.findMany({ where: { userId: req.userId! }, orderBy: { updatedAt: "desc" } });
  res.json({ decks });
}

export async function createDeck(req: AuthenticatedRequest, res: Response) {
  const body = z.object({ name: z.string().min(1).max(100), description: z.string().max(500).optional(), wordIds: z.array(z.string()).default([]) }).parse(req.body);
  const deck = await prisma.deck.create({ data: { ...body, userId: req.userId! } });
  res.status(201).json({ deck });
}

export async function updateDeck(req: AuthenticatedRequest, res: Response) {
  const body = z.object({ name: z.string().min(1).max(100).optional(), description: z.string().max(500).optional(), isPublic: z.boolean().optional() }).parse(req.body);
  const deck = await prisma.deck.updateMany({ where: { id: req.params.id, userId: req.userId! }, data: body });
  res.json({ updated: deck.count });
}

export async function deleteDeck(req: AuthenticatedRequest, res: Response) {
  await prisma.deck.deleteMany({ where: { id: req.params.id, userId: req.userId! } });
  res.status(204).end();
}

export async function addWord(req: AuthenticatedRequest, res: Response) {
  const { wordId } = z.object({ wordId: z.string() }).parse(req.body);
  const deck = await prisma.deck.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!deck) return res.status(404).json({ error: "deck not found" });
  if (deck.wordIds.includes(wordId)) return res.json({ deck });
  const updated = await prisma.deck.update({ where: { id: deck.id }, data: { wordIds: { push: wordId } } });
  res.json({ deck: updated });
}

export async function removeWord(req: AuthenticatedRequest, res: Response) {
  const deck = await prisma.deck.findFirst({ where: { id: req.params.id, userId: req.userId! } });
  if (!deck) return res.status(404).json({ error: "deck not found" });
  const updated = await prisma.deck.update({ where: { id: deck.id }, data: { wordIds: deck.wordIds.filter((id) => id !== req.params.wordId) } });
  res.json({ deck: updated });
}

export async function publicDecks(_req: AuthenticatedRequest, res: Response) {
  const decks = await prisma.deck.findMany({ where: { isPublic: true }, orderBy: { createdAt: "desc" }, take: 20 });
  res.json({ decks });
}
