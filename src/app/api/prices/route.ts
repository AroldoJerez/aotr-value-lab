import prisma from "@/lib/prisma";

export async function GET() {
  const items = await prisma.item.findMany({
    where: { rarity: { not: "Unknown" } },
    orderBy: { name: "asc" },
    include: { priceHistory: { orderBy: { recordedAt: "asc" }, take: 30 } },
  });
  return Response.json(items.map((item) => ({ ...item, priceHistory: item.priceHistory.map((snapshot) => ({ ...snapshot, recordedAt: snapshot.recordedAt.toISOString() })) })));
}
