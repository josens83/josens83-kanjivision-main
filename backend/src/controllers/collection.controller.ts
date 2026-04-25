import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function listCollections(_req: Request, res: Response) {
  const rows = await prisma.collection.findMany({ where: { isPublic: true }, orderBy: { displayOrder: "asc" } });
  res.json({ collections: rows.map((c) => ({ ...c, wordCount: c.wordIds.length })) });
}

export async function getCollection(req: Request, res: Response) {
  const row = await prisma.collection.findUnique({ where: { id: req.params.id } });
  if (!row) return res.status(404).json({ error: "not found" });
  const words = row.wordIds.length > 0
    ? await prisma.word.findMany({ where: { id: { in: row.wordIds } }, include: { kanjiParts: true } })
    : [];
  res.json({ collection: { ...row, wordCount: row.wordIds.length }, words });
}

export async function adminCreate(req: Request, res: Response) {
  const body = z.object({ name: z.string(), description: z.string().optional(), icon: z.string().optional(), wordIds: z.array(z.string()).default([]) }).parse(req.body);
  const row = await prisma.collection.create({ data: body });
  res.status(201).json({ collection: row });
}

export async function adminDelete(req: Request, res: Response) {
  await prisma.collection.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
