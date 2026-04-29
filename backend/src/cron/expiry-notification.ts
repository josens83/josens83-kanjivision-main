import { prisma } from "../lib/prisma";
import { logger } from "../lib/logger";
import { sendExpiryNotification } from "../services/email.service";

export async function checkExpiringPurchases(): Promise<number> {
  const now = new Date();
  const in7Days = new Date(now.getTime() + 7 * 86400000);
  const in8Days = new Date(now.getTime() + 8 * 86400000);

  const expiring = await prisma.userPurchase.findMany({
    where: {
      status: "ACTIVE",
      expiresAt: { gte: in7Days, lt: in8Days },
    },
    include: {
      user: { select: { email: true, displayName: true } },
      package: { select: { name: true, nameEn: true, slug: true } },
    },
  });

  let sent = 0;
  for (const purchase of expiring) {
    const pkgName = purchase.package.nameEn ?? purchase.package.name;
    try {
      await sendExpiryNotification(
        purchase.user.email,
        purchase.user.displayName,
        pkgName,
        7,
        purchase.package.slug,
      );
      sent++;
    } catch {
      logger.error({ userId: purchase.userId, slug: purchase.package.slug }, "expiry email failed");
    }
  }

  if (sent > 0) logger.info({ sent, total: expiring.length }, "expiry notifications sent");
  return sent;
}
