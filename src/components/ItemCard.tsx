"use client";

import { useDraggable } from "@dnd-kit/core";
import { Gem, KeyRound, ScrollText } from "lucide-react";
import type { CurrencyMode } from "@/types/props";
import type { Item } from "@/types/item";
import { formatValue, getItemValue } from "@/types/item";

interface ItemCardProps {
  item: Item;
  currencyMode: CurrencyMode;
  onClick?: () => void;
}

export function ItemCardPreview({ item, currencyMode, className = "" }: ItemCardProps & { className?: string }) {
  const value = getItemValue(item, currencyMode);
  const Icon = currencyMode === "keys" ? KeyRound : currencyMode === "scrolls" ? ScrollText : Gem;

  return (
    <div className={`item-card relative flex aspect-square w-full select-none flex-col overflow-hidden rounded-(--radius-md) border border-(--accentMain) bg-card-gradient p-2 pb-0.5 ${className}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_25%,rgba(255,72,97,.14),transparent_45%)]" />
      <div className="relative flex min-h-12 items-center justify-center overflow-hidden rounded-sm">
        <div className="flex size-10 items-center justify-center rounded-full border border-(--accentMain)/70 bg-black/20 shadow-[0_0_18px_rgba(190,24,48,.2)]">
          <span className="text-[10px] font-bold text-(--textHighlight)">{item.name.slice(0, 2).toUpperCase()}</span>
        </div>
        {item.imageUrl && <img src={item.imageUrl} alt={item.name} onError={(event) => { event.currentTarget.style.display = "none"; }} className="absolute inset-0 size-full rounded-sm object-contain" />}
      </div>
      <div className="relative mt-auto">
        <h3 title={item.name} className="line-clamp-2 h-7 text-center text-[10px] font-semibold leading-[13px] text-(--textHighlight)">{item.name}</h3>
      </div>
      <div className="relative flex items-center justify-center gap-1">
        <Icon size={12} className="text-(--accentBright)" />
        <span className="text-[10px] font-bold text-(--accentBright)">{value ? formatValue(value) : "-"}</span>
      </div>
    </div>
  );
}

export default function ItemCard({ item, currencyMode, onClick }: ItemCardProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `catalog-${item.id}`,
    data: { item },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      onClick={onClick}
      className={`group cursor-grab touch-none text-left transition-[transform,filter] duration-200 hover:scale-[1.03] hover:drop-shadow-[0_12px_16px_rgba(0,0,0,.5)] active:cursor-grabbing ${isDragging ? "opacity-35" : ""}`}
      {...listeners}
      {...attributes}
    >
      <ItemCardPreview item={item} currencyMode={currencyMode} className="transition-colors duration-200 group-hover:border-(--accentBright)" />
    </button>
  );
}
