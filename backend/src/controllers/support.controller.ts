import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const ticketSchema = z.object({
  email: z.string().email(),
  name: z.string().max(80).optional(),
  category: z.enum(["Bug", "Feature", "Account", "Billing", "Other"]),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(5000),
});

export async function createTicket(req: Request, res: Response) {
  const body = ticketSchema.parse(req.body);
  const userId = (req as AuthenticatedRequest).userId ?? null;
  const ticket = await prisma.supportTicket.create({
    data: { ...body, userId },
  });
  res.status(201).json({ ticket });
}

export async function myTickets(req: AuthenticatedRequest, res: Response) {
  const rows = await prisma.supportTicket.findMany({
    where: { userId: req.userId! },
    orderBy: { createdAt: "desc" },
  });
  res.json({ tickets: rows });
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const ticket = await prisma.supportTicket.findFirst({
    where: { id: req.params.id, userId: req.userId! },
  });
  if (!ticket) return res.status(404).json({ error: "not found" });
  res.json({ ticket });
}

export async function adminListTickets(req: Request, res: Response) {
  const rows = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  res.json({ tickets: rows });
}

export async function adminUpdateTicket(req: Request, res: Response) {
  const { status } = z.object({ status: z.string() }).parse(req.body);
  const ticket = await prisma.supportTicket.update({
    where: { id: req.params.id },
    data: { status },
  });
  res.json({ ticket });
}
