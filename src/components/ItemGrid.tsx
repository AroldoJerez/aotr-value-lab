"use client";

import { useState } from "react";
import ItemCard from "@/components/ItemCard";
import SearchBar from "@/components/SearchBar";
import type { CurrencyMode } from "@/types/props";

interface Item {
  id: number;
  name: string;
  rarity: string;
  value?: string | number;
  priceKeys?: number;
  priceScrolls?: number;
  priceViz?: number;
}

interface ItemGridProps {
  items: Item[];
  currencyMode: CurrencyMode;
  onSelectItem?: (item: Item) => void;
}

export default function ItemGrid({
  items,
  currencyMode,
  onSelectItem,
}: ItemGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.rarity.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const visibleItems = filtered.slice(0, visibleCount);

  return (
    <div
      className="
        w-[96%]
        mx-auto
        border
        border-(--accentMain)
        rounded-(--radius-md)
        bg-(--accentMain)/20
        max-h-[600px]
        p-2
        overflow-y-auto
        overflow-x-hidden
      "
    >
      <div className="sticky top-0 z-10 pb-2">
        <SearchBar onSearch={(query) => { setSearchQuery(query); setVisibleCount(24); }} />
      </div>
      <div
        className="
          grid
          grid-cols-8
          gap-2
          auto-rows-fr
        "
      >
        {visibleItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            currencyMode={currencyMode}
            onClick={() => onSelectItem?.(item)}
          />
        ))}
      </div>
      {filtered.length > visibleCount && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + 24)}
            className="rounded-full border border-(--accentMain) bg-black/20 px-5 py-2 text-xs font-bold uppercase tracking-wider text-(--textHighlight) transition-colors hover:border-(--accentBright) hover:bg-(--accentMain)/30"
          >
            Mostrar 24 más ({filtered.length - visibleCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
