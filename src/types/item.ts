export interface Item {
  id: number;
  name: string;
  rarity: string;
  imageUrl?: string | null;
  priceKeys?: number;
  priceScrolls?: number;
  priceViz?: number;
}

export const getItemValue = (item: Item, currency: "keys" | "scrolls" | "viz") =>
  currency === "keys"
    ? item.priceKeys ?? 0
    : currency === "scrolls"
      ? item.priceScrolls ?? 0
      : item.priceViz ?? 0;

export const getCurrencyLabel = (currency: "keys" | "scrolls" | "viz") =>
  currency === "keys" ? "Keys" : currency === "scrolls" ? "Scrolls" : "Viz";

export const formatValue = (value: number) =>
  new Intl.NumberFormat("es-AR", { maximumFractionDigits: 2 }).format(value);
