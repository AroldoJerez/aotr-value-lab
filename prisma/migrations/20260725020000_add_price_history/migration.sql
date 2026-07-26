CREATE TABLE "PriceSnapshot" (
    "id" SERIAL NOT NULL,
    "itemId" INTEGER NOT NULL,
    "priceKeys" INTEGER,
    "priceViz" DOUBLE PRECISION,
    "priceScrolls" DOUBLE PRECISION,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PriceSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PriceSnapshot_itemId_recordedAt_idx" ON "PriceSnapshot"("itemId", "recordedAt");

ALTER TABLE "PriceSnapshot" ADD CONSTRAINT "PriceSnapshot_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed one point for every existing item so charts have a meaningful baseline.
INSERT INTO "PriceSnapshot" ("itemId", "priceKeys", "priceViz", "priceScrolls")
SELECT "id", "priceKeys", "priceViz", "priceScrolls" FROM "Item";
