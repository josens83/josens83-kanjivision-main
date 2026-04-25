import { prisma } from "../lib/prisma";

export async function createNotification(
  userId: string,
  type: string,
  title: string,
  message: string,
  data?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: { userId, type, title, message, data: (data as any) ?? undefined },
  });
}
