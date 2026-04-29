import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function listPackages(_req: Request, res: Response) {
  const packages = await prisma.productPackage.findMany({
    where: { isActive: true },
    orderBy: { displayOrder: "asc" },
    select: {
      id: true, name: true, nameEn: true, slug: true,
      shortDesc: true, shortDescEn: true, price: true,
      priceGlobal: true, originalPrice: true, durationDays: true,
      badge: true, badgeColor: true, imageUrl: true,
      isComingSoon: true, displayOrder: true,
      exam: true, paddlePriceId: true, paddleProductId: true,
      _count: { select: { words: true } },
    },
  });
  res.json({
    packages: packages.map((p) => ({
      ...p, wordCount: p._count.words, _count: undefined,
    })),
  });
}

export async function getPackage(req: Request, res: Response) {
  const pkg = await prisma.productPackage.findUnique({
    where: { slug: req.params.slug },
    include: {
      words: {
        orderBy: { displayOrder: "asc" },
        include: { word: { include: { kanjiParts: true } } },
        take: 20,
      },
      _count: { select: { words: true } },
    },
  });
  if (!pkg) return res.status(404).json({ error: "package not found" });
  res.json({ package: { ...pkg, wordCount: pkg._count.words } });
}

export async function listAllPackages(_req: Request, res: Response) {
  const packages = await prisma.productPackage.findMany({
    orderBy: { displayOrder: "asc" },
    select: {
      id: true, name: true, nameEn: true, slug: true,
      shortDesc: true, shortDescEn: true, price: true,
      priceGlobal: true, originalPrice: true, durationDays: true,
      badge: true, badgeColor: true, imageUrl: true,
      isActive: true, isComingSoon: true, displayOrder: true,
      exam: true, paddlePriceId: true, paddleProductId: true,
      _count: { select: { words: true } },
    },
  });
  res.json({
    packages: packages.map((p) => ({
      ...p, wordCount: p._count.words, _count: undefined,
    })),
  });
}

const updatePackageSchema = z.object({
  isActive: z.boolean().optional(),
  isComingSoon: z.boolean().optional(),
  paddlePriceId: z.string().nullable().optional(),
  paddleProductId: z.string().nullable().optional(),
  priceGlobal: z.string().nullable().optional(),
  badge: z.string().nullable().optional(),
  badgeColor: z.string().nullable().optional(),
  displayOrder: z.number().int().optional(),
});

export async function updatePackage(req: Request, res: Response) {
  const { id } = req.params;
  const body = updatePackageSchema.parse(req.body);
  const pkg = await prisma.productPackage.update({
    where: { id },
    data: body,
    select: {
      id: true, name: true, nameEn: true, slug: true,
      isActive: true, isComingSoon: true,
      paddlePriceId: true, paddleProductId: true,
      priceGlobal: true, badge: true, badgeColor: true,
      displayOrder: true,
    },
  });
  res.json({ package: pkg });
}
