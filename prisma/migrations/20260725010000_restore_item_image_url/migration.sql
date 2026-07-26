-- Preserve the optional source image for each item card.
ALTER TABLE "Item" ADD COLUMN "imageUrl" TEXT;
