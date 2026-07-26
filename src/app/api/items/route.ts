import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany({
    where: {
      rarity: { not: "Unknown" },
    },
    orderBy: { name: "asc" },
  });

  return Response.json(
    items.map((item) => ({
      id: item.id,
      name: item.name,
      rarity: item.rarity,
      imageUrl: item.imageUrl,
      demand: item.demand,
      value: item.value, // rango original
      priceKeys: item.priceKeys,
      priceViz: item.priceViz,
      priceScrolls: item.priceScrolls,
      rateOfChange: item.rateOfChange,
      taxGems: item.taxGems,
      taxGold: item.taxGold,
      existingAmount: item.existingAmount,
    })),
  );
}
