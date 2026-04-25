import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function listActive(_req: Request, res: Response) {
  const now = new Date();
  const rows = await prisma.announcement.findMany({
    where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });
  res.json({ announcements: rows });
}

const createSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  type: z.enum(["INFO", "WARNING", "URGENT"]).default("INFO"),
  expiresAt: z.string().optional(),
});

export async function create(req: Request, res: Response) {
  const body = createSchema.parse(req.body);
  const row = await prisma.announcement.create({
    data: { ...body, expiresAt: body.expiresAt ? new Date(body.expiresAt) : null },
  });
  res.status(201).json({ announcement: row });
}

export async function remove(req: Request, res: Response) {
  await prisma.announcement.delete({ where: { id: req.params.id } });
  res.status(204).end();
}
