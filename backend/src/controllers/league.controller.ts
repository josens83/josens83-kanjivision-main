import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const TIERS = ["BRONZE", "SILVER", "GOLD", "SAPPHIRE", "RUBY", "EMERALD", "AMETHYST", "PEARL", "OBSIDIAN", "DIAMOND"];

function getCurrentWeek() {
  const now = new Date();
  const day = now.getUTCDay();
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() - ((day + 6) % 7));
  monday.setUTCHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setUTCDate(monday.getUTCDate() + 6);
  sunday.setUTCHours(23, 59, 59, 999);
  return { weekStart: monday, weekEnd: sunday };
}

export async function getLeague(req: AuthenticatedRequest, res: Response) {
  const { weekStart, weekEnd } = getCurrentWeek();
  const tier = "BRONZE";
  let league = await prisma.league.findUnique({ where: { tier_weekStart: { tier, weekStart } } });
  if (!league) {
    league = await prisma.league.create({ data: { tier, weekStart, weekEnd } });
  }
  let membership = await prisma.leagueMembership.findUnique({
    where: { userId_leagueId: { userId: req.userId!, leagueId: league.id } },
  });
  if (!membership) {
    membership = await prisma.leagueMembership.create({
      data: { userId: req.userId!, leagueId: league.id },
    });
  }
  const leaderboard = await prisma.leagueMembership.findMany({
    where: { leagueId: league.id },
    include: { user: { select: { id: true, displayName: true, email: true } } },
    orderBy: { xp: "desc" },
    take: 30,
  });
  const rank = leaderboard.findIndex((m) => m.userId === req.userId!) + 1;
  res.json({
    tier, weekStart, weekEnd, myXp: membership.xp, rank,
    leaderboard: leaderboard.map((m, i) => ({
      rank: i + 1, userId: m.userId, name: m.user.displayName ?? m.user.email.split("@")[0], xp: m.xp,
    })),
  });
}

export async function addXp(req: AuthenticatedRequest, res: Response) {
  const { xp } = z.object({ xp: z.number().int().min(1).max(100) }).parse(req.body);
  const { weekStart, weekEnd } = getCurrentWeek();
  const tier = "BRONZE";
  let league = await prisma.league.findUnique({ where: { tier_weekStart: { tier, weekStart } } });
  if (!league) league = await prisma.league.create({ data: { tier, weekStart, weekEnd } });
  const membership = await prisma.leagueMembership.upsert({
    where: { userId_leagueId: { userId: req.userId!, leagueId: league.id } },
    update: { xp: { increment: xp } },
    create: { userId: req.userId!, leagueId: league.id, xp },
  });
  res.json({ xp: membership.xp });
}
