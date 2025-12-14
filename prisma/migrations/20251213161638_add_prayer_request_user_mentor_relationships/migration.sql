/*
  Warnings:

  - You are about to drop the column `mentor` on the `PrayerRequest` table. All the data in the column will be lost.
  - You are about to drop the column `prayedBy` on the `PrayerRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PrayerRequest" DROP COLUMN "mentor",
DROP COLUMN "prayedBy",
ADD COLUMN     "assignedMentorId" INTEGER,
ADD COLUMN     "createdById" INTEGER;

-- CreateTable
CREATE TABLE "PrayerRequestPrayedBy" (
    "prayerRequestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "prayedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrayerRequestPrayedBy_pkey" PRIMARY KEY ("prayerRequestId","userId")
);

-- CreateIndex
CREATE INDEX "PrayerRequestPrayedBy_userId_idx" ON "PrayerRequestPrayedBy"("userId");

-- CreateIndex
CREATE INDEX "PrayerRequest_createdById_idx" ON "PrayerRequest"("createdById");

-- CreateIndex
CREATE INDEX "PrayerRequest_assignedMentorId_idx" ON "PrayerRequest"("assignedMentorId");

-- CreateIndex
CREATE INDEX "PrayerRequest_status_idx" ON "PrayerRequest"("status");

-- AddForeignKey
ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerRequest" ADD CONSTRAINT "PrayerRequest_assignedMentorId_fkey" FOREIGN KEY ("assignedMentorId") REFERENCES "Mentor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerRequestPrayedBy" ADD CONSTRAINT "PrayerRequestPrayedBy_prayerRequestId_fkey" FOREIGN KEY ("prayerRequestId") REFERENCES "PrayerRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrayerRequestPrayedBy" ADD CONSTRAINT "PrayerRequestPrayedBy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
