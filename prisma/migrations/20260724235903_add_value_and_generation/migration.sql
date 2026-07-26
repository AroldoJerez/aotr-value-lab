/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Item` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "imageUrl",
ADD COLUMN     "value" TEXT;
