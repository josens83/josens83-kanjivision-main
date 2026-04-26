import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

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

async function getOrCreateLeague(tier: string, weekStart: Date, weekEnd: Date) {
  return prisma.league.upsert({
    where: { tier_weekStart: { tier, weekStart } },
    update: {},
    create: { tier, weekStart, weekEnd },
  });
}

async function getOrCreateMembership(userId: string, leagueId: string) {
  return prisma.leagueMembership.upsert({
    where: { userId_leagueId: { userId, leagueId } },
    update: {},
    create: { userId, leagueId, xp: 0 },
  });
}

export async function getLeague(req: AuthenticatedRequest, res: Response) {
  try {
    const { weekStart, weekEnd } = getCurrentWeek();
    const league = await getOrCreateLeague("BRONZE", weekStart, weekEnd);
    const membership = await getOrCreateMembership(req.userId!, league.id);
    const leaderboard = await prisma.leagueMembership.findMany({
      where: { leagueId: league.id },
      include: { user: { select: { id: true, displayName: true, email: true } } },
      orderBy: { xp: "desc" },
      take: 30,
    });
    const rank = leaderboard.findIndex((m) => m.userId === req.userId!) + 1;
    res.json({
      tier: "BRONZE", weekStart, weekEnd, myXp: membership.xp, rank,
      leaderboard: leaderboard.map((m, i) => ({
        rank: i + 1, userId: m.userId, name: m.user.displayName ?? m.user.email.split("@")[0], xp: m.xp,
      })),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "league error", detail: msg });
  }
}

export async function addXp(req: AuthenticatedRequest, res: Response) {
  try {
    const { xp } = z.object({ xp: z.number().int().min(1).max(100) }).parse(req.body);
    const { weekStart, weekEnd } = getCurrentWeek();
    const league = await getOrCreateLeague("BRONZE", weekStart, weekEnd);
    const membership = await prisma.leagueMembership.upsert({
      where: { userId_leagueId: { userId: req.userId!, leagueId: league.id } },
      update: { xp: { increment: xp } },
      create: { userId: req.userId!, leagueId: league.id, xp },
    });
    res.json({ xp: membership.xp });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: "xp error", detail: msg });
  }
}
