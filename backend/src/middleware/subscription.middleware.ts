import type { NextFunction, Response } from "express";
import { ExamCategory } from "@prisma/client";
import { prisma } from "../lib/prisma";
import type { AuthenticatedRequest } from "./auth.middleware";

const ACCESS_MAP: Record<string, ExamCategory[]> = {
  FREE: [ExamCategory.JLPT_N5],
  BASIC: [ExamCategory.JLPT_N5, ExamCategory.JLPT_N4],
  PREMIUM: [
    ExamCategory.JLPT_N5, ExamCategory.JLPT_N4, ExamCategory.JLPT_N3,
    ExamCategory.JLPT_N2, ExamCategory.JLPT_N1,
    ExamCategory.THEME, ExamCategory.GENERAL,
  ],
};

export async function checkContentAccess(
  userId: string | undefined,
  exam: ExamCategory
): Promise<string | null> {
  if (!userId) {
    return ACCESS_MAP.FREE.includes(exam) ? null : "sign in required";
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { tier: true, subscriptionStatus: true, subscriptionEnd: true },
  });
  if (!user) return "user not found";

  const tier = user.tier ?? "FREE";
  const allowed = ACCESS_MAP[tier] ?? ACCESS_MAP.FREE;

  if (user.subscriptionStatus === "CANCELLED" && user.subscriptionEnd) {
    if (new Date() > user.subscriptionEnd) {
      return allowed.includes(exam) ? null : `upgrade to access ${exam}`;
    }
  }

  return allowed.includes(exam) ? null : `upgrade to access ${exam}`;
}

export function requireContentAccess(examParam: string = "exam") {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const exam = (req.params[examParam] ?? req.query[examParam]) as ExamCategory | undefined;
    if (!exam) return next();

    const error = await checkContentAccess(req.userId, exam);
    if (error) {
      res.status(403).json({ error, requiredTier: "BASIC" });
      return;
    }
    next();
  };
}
