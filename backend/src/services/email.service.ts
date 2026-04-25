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
