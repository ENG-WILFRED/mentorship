-- CreateTable
CREATE TABLE "public"."Sermon" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "videoUrl" TEXT,
    "audioUrl" TEXT,
    "coverImage" TEXT,
    "topic" TEXT,
    "author" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" INTEGER,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SermonComment" (
    "id" SERIAL NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "userId" INTEGER,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SermonComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SermonReaction" (
    "id" SERIAL NOT NULL,
    "sermonId" INTEGER NOT NULL,
    "userId" INTEGER,
    "emoji" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SermonReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SermonReaction_sermonId_userId_emoji_key" ON "public"."SermonReaction"("sermonId", "userId", "emoji");

-- AddForeignKey
ALTER TABLE "public"."Sermon" ADD CONSTRAINT "Sermon_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SermonComment" ADD CONSTRAINT "SermonComment_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "public"."Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SermonComment" ADD CONSTRAINT "SermonComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SermonReaction" ADD CONSTRAINT "SermonReaction_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "public"."Sermon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SermonReaction" ADD CONSTRAINT "SermonReaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
