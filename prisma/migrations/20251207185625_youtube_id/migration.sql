/*
  Warnings:

  - A unique constraint covering the columns `[youtubeId]` on the table `Sermon` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Sermon" ADD COLUMN     "youtubeId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Sermon_youtubeId_key" ON "public"."Sermon"("youtubeId");
