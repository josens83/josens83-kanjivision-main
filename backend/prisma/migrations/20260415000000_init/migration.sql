-- KanjiVision AI — initial Prisma migration
-- Generated from prisma/schema.prisma (commit 5258205).

-- CreateEnum
CREATE TYPE "ExamCategory" AS ENUM ('JLPT_N5', 'JLPT_N4', 'JLPT_N3', 'JLPT_N2', 'JLPT_N1', 'THEME', 'GENERAL');

-- CreateEnum
CREATE TYPE "WordType" AS ENUM ('KANGO', 'WAGO', 'GAIRAIGO');

-- CreateEnum
CREATE TYPE "UserTier" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE', 'TRIALING');

-- CreateEnum
CREATE TYPE "PaymentProcessor" AS ENUM ('PADDLE', 'TOSS');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "displayName" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "googleId" TEXT,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "tier" "UserTier" NOT NULL DEFAULT 'FREE',
    "dailyGoal" INTEGER NOT NULL DEFAULT 20,
    "dailyProgress" INTEGER NOT NULL DEFAULT 0,
    "lastGoalReset" TIMESTAMP(3),
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "id" TEXT NOT NULL,
    "lemma" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "examCategory" "ExamCategory" NOT NULL,
    "type" "WordType" NOT NULL DEFAULT 'WAGO',
    "category" TEXT,
    "tierRequired" "UserTier" NOT NULL DEFAULT 'FREE',
    "mnemonic" TEXT,
    "examples" JSONB,
    "collocations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KanjiPart" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "char" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "onyomi" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "kunyomi" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KanjiPart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "threshold" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Achievement_key_key" ON "Achievement"("key");

-- CreateTable
CREATE TABLE "UserAchievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserAchievement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserAchievement_userId_achievementId_key" ON "UserAchievement"("userId", "achievementId");
CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserAchievement" ADD CONSTRAINT "UserAchievement_achievementId_fkey" FOREIGN KEY ("achievementId") REFERENCES "Achievement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed achievements
INSERT INTO "Achievement" ("id","key","name","description","icon","condition","threshold") VALUES
  ('ach_01','first_step','First Step','Learn your first word','🌱','words_learned',1),
  ('ach_02','quick_learner','Quick Learner','Learn 10 words','📖','words_learned',10),
  ('ach_03','bookworm','Bookworm','Learn 50 words','📚','words_learned',50),
  ('ach_04','on_fire','On Fire','3-day streak','🔥','streak',3),
  ('ach_05','blazing','Blazing','7-day streak','🔥','streak',7),
  ('ach_06','collector','Collector','Bookmark 5 words','⭐','bookmarks',5),
  ('ach_07','perfect_score','Perfect Score','100% on a quiz','💯','quiz_perfect',1),
  ('ach_08','master','Master','Master 50 words','🏆','mastered',50);

-- CreateTable
CREATE TABLE "Bookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Bookmark_userId_wordId_key" ON "Bookmark"("userId", "wordId");
CREATE INDEX "Bookmark_userId_idx" ON "Bookmark"("userId");

ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Bookmark" ADD CONSTRAINT "Bookmark_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Progress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "repetition" INTEGER NOT NULL DEFAULT 0,
    "interval" INTEGER NOT NULL DEFAULT 0,
    "easiness" DOUBLE PRECISION NOT NULL DEFAULT 2.5,
    "dueAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastReviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudySession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "examCategory" "ExamCategory" NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "cardsSeen" INTEGER NOT NULL DEFAULT 0,
    "cardsCorrect" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "StudySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MnemonicImage" (
    "id" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "userId" TEXT,
    "prompt" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'stability',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MnemonicImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "processor" "PaymentProcessor" NOT NULL,
    "externalId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentPeriodEnd" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "processor" "PaymentProcessor" NOT NULL,
    "externalId" TEXT NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "rawEvent" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "Word_examCategory_idx" ON "Word"("examCategory");
CREATE INDEX "Word_tierRequired_idx" ON "Word"("tierRequired");
CREATE INDEX "Word_category_idx" ON "Word"("category");
CREATE UNIQUE INDEX "Word_lemma_reading_key" ON "Word"("lemma", "reading");

-- CreateIndex
CREATE INDEX "KanjiPart_wordId_idx" ON "KanjiPart"("wordId");
CREATE INDEX "KanjiPart_char_idx" ON "KanjiPart"("char");

-- CreateIndex
CREATE UNIQUE INDEX "Progress_userId_wordId_key" ON "Progress"("userId", "wordId");
CREATE INDEX "Progress_userId_dueAt_idx" ON "Progress"("userId", "dueAt");

-- CreateIndex
CREATE INDEX "StudySession_userId_startedAt_idx" ON "StudySession"("userId", "startedAt");

-- CreateIndex
CREATE INDEX "MnemonicImage_wordId_idx" ON "MnemonicImage"("wordId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_externalId_key" ON "Subscription"("externalId");
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_externalId_key" ON "Payment"("externalId");
CREATE INDEX "Payment_userId_idx" ON "Payment"("userId");

-- AddForeignKey
ALTER TABLE "KanjiPart" ADD CONSTRAINT "KanjiPart_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "StudySession" ADD CONSTRAINT "StudySession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "MnemonicImage" ADD CONSTRAINT "MnemonicImage_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "MnemonicImage" ADD CONSTRAINT "MnemonicImage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
