import type { Request, Response } from "express";
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
