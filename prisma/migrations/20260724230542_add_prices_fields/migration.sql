/*
  Warnings:

  - You are about to drop the column `price` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `stats` on the `Item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Item` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Item" DROP COLUMN "price",
DROP COLUMN "stats",
ADD COLUMN     "demand" TEXT,
ADD COLUMN     "existingAmount" INTEGER,
ADD COLUMN     "generation" TEXT,
ADD COLUMN     "priceKeys" INTEGER,
ADD COLUMN     "priceScrolls" INTEGER,
ADD COLUMN     "priceViz" INTEGER,
ADD COLUMN     "rateOfChange" TEXT,
ADD COLUMN     "taxGems" TEXT,
ADD COLUMN     "taxGold" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_key" ON "Item"("name");
