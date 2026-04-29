import sgMail from "@sendgrid/mail";
import { logger } from "../lib/logger";

const FROM = process.env.EMAIL_FROM ?? "noreply@kanjivision.app";

function init() {
  const key = process.env.SENDGRID_API_KEY;
  if (key) sgMail.setApiKey(key);
}

async function send(to: string, subject: string, html: string) {
  init();
  if (!process.env.SENDGRID_API_KEY) {
    logger.warn({ to, subject }, "SendGrid not configured — email skipped");
    return;
  }
  try {
    await sgMail.send({ to, from: FROM, subject, html });
  } catch (err) {
    logger.error({ err, to }, "email send failed");
  }
}

export async function sendWelcomeEmail(to: string, name?: string | null) {
  const greeting = name ? `Hi ${name}` : "Welcome";
  await send(to, "Welcome to KanjiVision AI!", `
    <h2>${greeting}!</h2>
    <p>Your KanjiVision AI account is ready. Start learning JLPT vocabulary with AI-powered kanji decomposition and spaced repetition.</p>
    <p><a href="https://kanjivision.app/learn?level=JLPT_N5">Start with N5 →</a></p>
    <p style="color:#888;font-size:12px">KanjiVision AI · Part of the Vision Platform</p>
  `);
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  await send(to, "Reset your password — KanjiVision AI", `
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password. This link expires in 1 hour.</p>
    <p><a href="${resetUrl}">Reset Password →</a></p>
    <p style="color:#888;font-size:12px">If you didn't request this, ignore this email.</p>
  `);
}

export async function sendGoalAchievedEmail(to: string, name: string | null, goal: number) {
  await send(to, "Daily goal achieved! 🎉", `
    <h2>${name ?? "Hey"}, you did it!</h2>
    <p>You've reviewed ${goal} cards today. Keep up the great work!</p>
    <p style="color:#888;font-size:12px">KanjiVision AI</p>
  `);
}

export async function sendPurchaseReceipt(
  to: string, name: string | null, packageName: string,
  amount: string, transactionId: string, expiresAt: string
) {
  await send(to, `Purchase confirmed — ${packageName}`, `
    <h2>${name ?? "Hello"}, your purchase is confirmed!</h2>
    <table style="border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:4px 12px;color:#888">Pack</td><td style="padding:4px 12px;font-weight:bold">${packageName}</td></tr>
      <tr><td style="padding:4px 12px;color:#888">Amount</td><td style="padding:4px 12px">${amount}</td></tr>
      <tr><td style="padding:4px 12px;color:#888">Transaction</td><td style="padding:4px 12px;font-size:12px">${transactionId}</td></tr>
      <tr><td style="padding:4px 12px;color:#888">Access until</td><td style="padding:4px 12px">${expiresAt}</td></tr>
    </table>
    <p><a href="https://kanjivision.app/learn">Start learning →</a></p>
    <p style="color:#888;font-size:12px">KanjiVision AI · Part of the Vision Platform</p>
  `);
}

export async function sendSubscriptionWelcome(
  to: string, name: string | null, tier: string, cycle: string, amount: string
) {
  await send(to, `Welcome to KanjiVision ${tier}!`, `
    <h2>${name ?? "Hello"}, your ${tier} subscription is active!</h2>
    <table style="border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:4px 12px;color:#888">Plan</td><td style="padding:4px 12px;font-weight:bold">${tier}</td></tr>
      <tr><td style="padding:4px 12px;color:#888">Billing</td><td style="padding:4px 12px">${amount} / ${cycle}</td></tr>
    </table>
    <p><a href="https://kanjivision.app/learn">Start learning →</a></p>
    <p style="color:#888;font-size:12px">KanjiVision AI</p>
  `);
}

export async function sendPaymentFailedEmail(to: string, name: string | null) {
  await send(to, "Payment failed — KanjiVision AI", `
    <h2>${name ?? "Hello"}, your payment could not be processed.</h2>
    <p>Please update your payment method to continue using your subscription.</p>
    <p><a href="https://kanjivision.app/settings">Update payment →</a></p>
    <p style="color:#888;font-size:12px">If this was resolved, you can ignore this email.</p>
  `);
}

export async function sendExpiryNotification(
  to: string, name: string | null, packageName: string, daysLeft: number, slug: string
) {
  await send(to, `Your ${packageName} pack expires in ${daysLeft} days`, `
    <h2>${name ?? "Hello"}, your pack is expiring soon!</h2>
    <p>Your <b>${packageName}</b> access expires in <b>${daysLeft} days</b>.</p>
    <p>Renew now to keep your progress and continue learning.</p>
    <p><a href="https://kanjivision.app/packages/${slug}">Renew pack →</a></p>
    <p style="color:#888;font-size:12px">KanjiVision AI · Part of the Vision Platform</p>
  `);
}
