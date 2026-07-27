import axios from "axios";
import * as XLSX from "xlsx";
import prisma from "@/lib/prisma";

const KEYS_PER_VIZ = 900;
const KEYS_PER_SCROLL = 3;
const SHEETS = [
  "Leaderboard",
  "ALL Cosmetics",
  "Anime All Star Crates",
  "Blade Burst Crate",
  "Scout Fashions",
  "Battlepass",
  "Event",
  "Other Cosmetics",
  "Family",
  "Artifact",
  "Perks",
  "Raid & Mission Drops",
  "Shop",
  "Robux Items",
];
type Row = Record<string, string>;
type SyncEvent = {
  type: "status" | "progress" | "complete" | "error";
  message?: string;
  completed?: number;
  total?: number;
  item?: string;
  stats?: {
    created: number;
    updated: number;
    unchanged: number;
    skipped: number;
    errors: number;
  };
};

function parseValue(value?: string) {
  if (!value) return { keys: null, viz: null, scrolls: null };
  const keysPart = value.split("/")[0];
  const multiplier = (suffix?: string) =>
    suffix?.toLowerCase() === "k"
      ? 1_000
      : suffix?.toLowerCase() === "m"
        ? 1_000_000
        : 1;
  const rangeMatch = keysPart.match(
    /([\d.]+)\s*([kKmM])?\s*[-–]\s*([\d.]+)\s*([kKmM])?/,
  );
  let keys: number | null = null;
  if (rangeMatch) {
    const min =
      parseFloat(rangeMatch[1]) * multiplier(rangeMatch[2] ?? rangeMatch[4]);
    const max =
      parseFloat(rangeMatch[3]) * multiplier(rangeMatch[4] ?? rangeMatch[2]);
    if (!Number.isNaN(min) && !Number.isNaN(max))
      keys = Math.round((min + max) / 2);
  } else {
    const singleMatch = keysPart.match(/([\d.]+)\s*([kKmM])?/);
    if (singleMatch) {
      const parsed = parseFloat(singleMatch[1]) * multiplier(singleMatch[2]);
      if (!Number.isNaN(parsed)) keys = Math.round(parsed);
    }
  }
  return keys === null
    ? { keys: null, viz: null, scrolls: null }
    : {
        keys,
        viz: Math.round((keys / KEYS_PER_VIZ) * 100) / 100,
        scrolls: Math.round(keys / KEYS_PER_SCROLL),
      };
}

export async function GET(request: Request) {
  const providedKey =
    request.headers.get("x-sync-key") ??
    new URL(request.url).searchParams.get("key");

  if (!process.env.SYNC_SECRET || providedKey !== process.env.SYNC_SECRET) {
    return new Response(JSON.stringify({ error: "No autorizado." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: SyncEvent) =>
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`),
        );
      const stats = {
        created: 0,
        updated: 0,
        unchanged: 0,
        skipped: 0,
        errors: 0,
      };
      try {
        send({ type: "status", message: "Descargando la value list…" });
        const response = await axios.get(
          "https://docs.google.com/spreadsheets/d/e/2PACX-1vR7naBmry1w8WlHFrtpxJ0n3XdgDj5cehW6XxTdJVDPMDivrnOefz83uuFCoYEGd028tjFQ6tcfPyBA/pub?output=xlsx",
          { responseType: "arraybuffer" },
        );
        const workbook = XLSX.read(response.data, { type: "buffer" });
        const entries = workbook.SheetNames.filter((sheet) =>
          SHEETS.includes(sheet),
        ).flatMap((sheetName) =>
          XLSX.utils
            .sheet_to_json<Row>(workbook.Sheets[sheetName], { defval: "" })
            .map((row) => ({ row, sheetName })),
        );
        send({
          type: "status",
          message: `Procesando ${entries.length} registros…`,
          total: entries.length,
          stats,
        });
        for (let index = 0; index < entries.length; index++) {
          const { row, sheetName } = entries[index];
          const name = row["Item Name"]?.trim();
          const rarity = row["Rarity"];
          if (
            !name ||
            name.toUpperCase().includes("GENERATION 0") ||
            !rarity ||
            rarity.toLowerCase() === "unknown"
          ) {
            stats.skipped++;
            continue;
          }
          try {
            const demand = row["Demand"];
            const value = row["Value"];
            const rateOfChange = row["Rate Of Change"];
            const taxGems = row["Tax (Gems)"];
            const taxGold = row["Tax (Gold)"];
            const existingAmount =
              sheetName === "Leaderboard" && row["Existing Amount"]
                ? parseInt(row["Existing Amount"])
                : null;
            const { keys, viz, scrolls } = parseValue(value);
            const existing = await prisma.item.findUnique({ where: { name } });
            const itemData = {
              rarity,
              demand: demand || null,
              value: value || null,
              rateOfChange: rateOfChange || null,
              taxGems: taxGems || null,
              taxGold: taxGold || null,
              existingAmount,
              priceKeys: keys,
              priceViz: viz,
              priceScrolls: scrolls,
            };
            const unchanged =
              existing &&
              existing.rarity === rarity &&
              existing.demand === itemData.demand &&
              existing.value === itemData.value &&
              existing.rateOfChange === itemData.rateOfChange &&
              existing.taxGems === itemData.taxGems &&
              existing.taxGold === itemData.taxGold &&
              existing.existingAmount === existingAmount &&
              existing.priceKeys === keys &&
              existing.priceViz === viz &&
              existing.priceScrolls === scrolls;
            if (unchanged) stats.unchanged++;
            else if (existing) {
              await prisma.$transaction(async (tx) => {
                await tx.item.update({
                  where: { id: existing.id },
                  data: itemData,
                });
                if (
                  existing.priceKeys !== keys ||
                  existing.priceViz !== viz ||
                  existing.priceScrolls !== scrolls
                )
                  await tx.priceSnapshot.create({
                    data: {
                      itemId: existing.id,
                      priceKeys: keys,
                      priceViz: viz,
                      priceScrolls: scrolls,
                    },
                  });
              });
              stats.updated++;
            } else {
              await prisma.item.create({
                data: {
                  name,
                  ...itemData,
                  priceHistory: {
                    create: {
                      priceKeys: keys,
                      priceViz: viz,
                      priceScrolls: scrolls,
                    },
                  },
                },
              });
              stats.created++;
            }
          } catch {
            stats.errors++;
          }
          const completed = index + 1;
          if (completed % 10 === 0 || completed === entries.length)
            send({
              type: "progress",
              completed,
              total: entries.length,
              item: name,
              stats,
            });
        }
        send({
          type: "complete",
          message: "Sincronización completada.",
          completed: entries.length,
          total: entries.length,
          stats,
        });
      } catch {
        send({
          type: "error",
          message: "No se pudo descargar o procesar la value list.",
          stats,
        });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
