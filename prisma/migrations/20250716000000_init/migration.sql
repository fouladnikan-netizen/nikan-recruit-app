-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "education" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "excel_skill" TEXT NOT NULL,
    "ai_skill" TEXT NOT NULL,
    "motivation" TEXT NOT NULL,
    "expectations" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'رزومه دریافت شد',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);
