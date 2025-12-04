/*
  Warnings:

  - The values [MEMBER,PASTOR] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Announcement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Comment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Donation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Group` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pastor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PrayerRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reaction` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sermon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupMembers` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Mentor` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[memorableId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `memorableId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."MissionStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('STUDENT', 'MENTOR', 'ADMIN', 'GUEST');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'GUEST';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Announcement" DROP CONSTRAINT "Announcement_postedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_sermonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Donation" DROP CONSTRAINT "Donation_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Pastor" DROP CONSTRAINT "Pastor_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."PrayerRequest" DROP CONSTRAINT "PrayerRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reaction" DROP CONSTRAINT "Reaction_sermonId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reaction" DROP CONSTRAINT "Reaction_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Sermon" DROP CONSTRAINT "Sermon_uploadedById_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GroupMembers" DROP CONSTRAINT "_GroupMembers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_GroupMembers" DROP CONSTRAINT "_GroupMembers_B_fkey";

-- AlterTable
ALTER TABLE "public"."Mentor" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "education" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "experience" INTEGER,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "maritalStatus" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "skills" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "memorableId" TEXT NOT NULL,
ALTER COLUMN "role" SET DEFAULT 'GUEST';

-- DropTable
DROP TABLE "public"."Announcement";

-- DropTable
DROP TABLE "public"."Attendance";

-- DropTable
DROP TABLE "public"."Comment";

-- DropTable
DROP TABLE "public"."Donation";

-- DropTable
DROP TABLE "public"."Event";

-- DropTable
DROP TABLE "public"."Group";

-- DropTable
DROP TABLE "public"."Pastor";

-- DropTable
DROP TABLE "public"."PrayerRequest";

-- DropTable
DROP TABLE "public"."Reaction";

-- DropTable
DROP TABLE "public"."Sermon";

-- DropTable
DROP TABLE "public"."_GroupMembers";

-- DropEnum
DROP TYPE "public"."PrayerStatus";

-- CreateTable
CREATE TABLE "public"."School" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "population" INTEGER NOT NULL,
    "contact" TEXT,
    "logo" TEXT,

    CONSTRAINT "School_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mission" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "public"."MissionStatus" NOT NULL DEFAULT 'UPCOMING',
    "description" TEXT,
    "goals" TEXT,
    "outcomes" TEXT,
    "notes" TEXT,
    "students" INTEGER NOT NULL,
    "topic" TEXT NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MissionMentor" (
    "missionId" INTEGER NOT NULL,
    "mentorId" INTEGER NOT NULL,

    CONSTRAINT "MissionMentor_pkey" PRIMARY KEY ("missionId","mentorId")
);

-- CreateTable
CREATE TABLE "public"."MissionSchool" (
    "missionId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,

    CONSTRAINT "MissionSchool_pkey" PRIMARY KEY ("missionId","schoolId")
);

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" SERIAL NOT NULL,
    "missionId" INTEGER NOT NULL,
    "schoolId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "topic" TEXT NOT NULL,
    "students" INTEGER NOT NULL,
    "outcome" TEXT NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "caption" TEXT,
    "missionId" INTEGER,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_userId_key" ON "public"."Mentor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_memorableId_key" ON "public"."User"("memorableId");

-- AddForeignKey
ALTER TABLE "public"."MissionMentor" ADD CONSTRAINT "MissionMentor_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MissionMentor" ADD CONSTRAINT "MissionMentor_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "public"."Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MissionSchool" ADD CONSTRAINT "MissionSchool_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MissionSchool" ADD CONSTRAINT "MissionSchool_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Report" ADD CONSTRAINT "Report_schoolId_fkey" FOREIGN KEY ("schoolId") REFERENCES "public"."School"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "public"."Mission"("id") ON DELETE SET NULL ON UPDATE CASCADE;
