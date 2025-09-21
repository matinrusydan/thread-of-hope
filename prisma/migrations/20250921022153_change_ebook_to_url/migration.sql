/*
  Warnings:

  - You are about to drop the column `downloadCount` on the `Ebook` table. All the data in the column will be lost.
  - You are about to drop the column `filePath` on the `Ebook` table. All the data in the column will be lost.
  - Added the required column `externalUrl` to the `Ebook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Ebook" DROP COLUMN "downloadCount",
DROP COLUMN "filePath",
ADD COLUMN     "externalUrl" TEXT NOT NULL,
ADD COLUMN     "viewCount" INTEGER NOT NULL DEFAULT 0;
