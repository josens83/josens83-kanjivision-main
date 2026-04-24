import type { Response } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

function isNewDay(last: Date | null): boolean {
  if (!last) return true;
  const now = new Date();
  return (
    now.getUTCFullYear() !== last.getUTCFullYear() ||
    now.getUTCMonth() !== last.getUTCMonth() ||
    now.getUTCDate() !== last.getUTCDate()
  );
}

async function resetIfNewDay(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { lastGoalReset: true },
  });
  if (isNewDay(user?.lastGoalReset ?? null)) {
    await prisma.user.update({
      where: { id: userId },
      data: { dailyProgress: 0, lastGoalReset: new Date() },
    });
  }
}

export async function getDailyGoal(req: AuthenticatedRequest, res: Response) {
  await resetIfNewDay(req.userId!);
  const user = await prisma.user.findUnique({
    where: { id: req.userId! },
    select: { dailyGoal: true, dailyProgress: true, lastGoalReset: true },
  });
  if (!user) return res.status(404).json({ error: "user not found" });
  res.json({
    dailyGoal: user.dailyGoal,
    dailyProgress: user.dailyProgress,
    completed: user.dailyProgress >= user.dailyGoal,
    remaining: Math.max(0, user.dailyGoal - user.dailyProgress),
  });
}

const updateSchema = z.object({
  goal: z.number().int().min(1).max(100),
});

export async function updateDailyGoal(req: AuthenticatedRequest, res: Response) {
  const { goal } = updateSchema.parse(req.body);
  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: { dailyGoal: goal },
    select: { dailyGoal: true, dailyProgress: true },
  });
  res.json({
    dailyGoal: user.dailyGoal,
    dailyProgress: user.dailyProgress,
    completed: user.dailyProgress >= user.dailyGoal,
  });
}

export async function incrementProgress(req: AuthenticatedRequest, res: Response) {
  await resetIfNewDay(req.userId!);
  const user = await prisma.user.update({
    where: { id: req.userId! },
    data: { dailyProgress: { increment: 1 } },
    select: { dailyGoal: true, dailyProgress: true },
  });
  res.json({
    dailyGoal: user.dailyGoal,
    dailyProgress: user.dailyProgress,
    completed: user.dailyProgress >= user.dailyGoal,
    remaining: Math.max(0, user.dailyGoal - user.dailyProgress),
  });
}
