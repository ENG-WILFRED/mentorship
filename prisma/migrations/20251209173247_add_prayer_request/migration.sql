-- CreateEnum
CREATE TYPE "PrayerPriority" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "PrayerStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'FULFILLED');

-- CreateTable
CREATE TABLE "PrayerRequest" (
    "id" SERIAL NOT NULL,
    "request" TEXT NOT NULL,
    "school" TEXT,
    "priority" "PrayerPriority" NOT NULL DEFAULT 'MEDIUM',
    "mentor" TEXT,
    "prayedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "studentId" TEXT,
    "grade" TEXT,
    "subject" TEXT,
    "status" "PrayerStatus" NOT NULL DEFAULT 'PENDING',
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "email" TEXT,
    "name" TEXT,

    CONSTRAINT "PrayerRequest_pkey" PRIMARY KEY ("id")
);
