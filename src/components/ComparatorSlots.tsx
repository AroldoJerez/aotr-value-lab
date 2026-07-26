"use client";

import { useDroppable } from "@dnd-kit/core";
import { Sparkles, X } from "lucide-react";
import type { CurrencyMode } from "@/types/props";
import type { Item } from "@/types/item";
import { formatValue, getCurrencyLabel, getItemValue } from "@/types/item";

export interface DropFeedback {
  slot: "A" | "B";
  itemId: number;
  merged: boolean;
  sequence: number;
}
interface Props {
  slotAItems: Item[];
  slotBItems: Item[];
  setSlotAItems: React.Dispatch<React.SetStateAction<Item[]>>;
  setSlotBItems: React.Dispatch<React.SetStateAction<Item[]>>;
  activeSlot: "A" | "B" | null;
  setActiveSlot: (slot: "A" | "B") => void;
  currencyMode: CurrencyMode;
  dropFeedback: DropFeedback | null;
}

function Slot({
  slot,
  items,
  setItems,
  activeSlot,
  setActiveSlot,
  currencyMode,
  dropFeedback,
}: {
  slot: "A" | "B";
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  activeSlot: "A" | "B" | null;
  setActiveSlot: (slot: "A" | "B") => void;
  currencyMode: CurrencyMode;
  dropFeedback: DropFeedback | null;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${slot}`,
    data: { isCompatible: items.length < 25 },
  });
  const groups = Object.values(
    items.reduce<Record<number, { item: Item; count: number }>>((acc, item) => {
      acc[item.id] = acc[item.id]
        ? { ...acc[item.id], count: acc[item.id].count + 1 }
        : { item, count: 1 };
      return acc;
    }, {}),
  );
  const total = items.reduce(
    (sum, item) => sum + getItemValue(item, currencyMode),
    0,
  );
  const compatible = items.length < 25;
  const received = dropFeedback?.slot === slot;
  const title = slot === "A" ? "Tu oferta" : "Oferta rival";

  return (
    <section
      ref={setNodeRef}
      onClick={() => setActiveSlot(slot)}
      className={`relative min-h-52 flex-1 overflow-hidden rounded-(--radius-md) border bg-(--accentMain)/20 p-4 transition-all duration-200 ${activeSlot === slot ? "border-(--accentBright) bg-(--accentMain)/40 shadow-[0_0_28px_rgba(190,24,48,.42)] ring-1 ring-(--accentBright)/70" : "border-(--accentMain)"} ${isOver ? (compatible ? "slot-compatible" : "slot-incompatible") : ""} ${received ? "slot-landed" : ""}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-(--textHighlight)">{title}</h2>
          <p className="text-xs text-(--textSecondary)">
            {items.length}/25 ítems · Total {formatValue(total)}{" "}
            {getCurrencyLabel(currencyMode)}
          </p>
        </div>
        {activeSlot === slot && (
          <span className="flex items-center gap-1 text-xs font-semibold tracking-wider text-(--accentBright) uppercase">
            <span className="size-1.5 rounded-full bg-(--accentBright) shadow-[0_0_8px_var(--accentBright)]" />
            Activo
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-(--accentMain)/70 bg-black/10 text-center text-sm text-(--textSecondary)">
          Suelta un ítem aquí
          <br />o selecciona esta oferta y haz click en una carta
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map(({ item, count }) => {
            const fused =
              dropFeedback?.slot === slot &&
              dropFeedback.itemId === item.id &&
              dropFeedback.merged;
            return (
              <div
                key={item.id}
                className={`relative flex items-center justify-between rounded-md border border-(--accentMain)/80 bg-black/20 px-3 py-2 text-sm text-(--textHighlight) ${fused ? "item-fused" : ""}`}
              >
                <div className="min-w-0">
                  <span className="block truncate">{item.name}</span>
                  <span className="block truncate text-[10px] tracking-wide text-(--textSecondary) uppercase">
                    {item.rarity}
                  </span>
                </div>
                <div className="ml-3 flex shrink-0 items-center gap-2">
                  <span
                    className={
                      fused ? "stack-count" : "font-bold text-(--alert)"
                    }
                  >
                    ×{count}
                  </span>
                  <span className="text-xs text-(--accentBright)">
                    {formatValue(getItemValue(item, currencyMode) * count)}{" "}
                    {getCurrencyLabel(currencyMode)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Quitar ${item.name}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setItems((current) =>
                        current.filter((entry) => entry.id !== item.id),
                      );
                    }}
                    className="rounded p-0.5 text-(--textSecondary) hover:bg-(--accentMain) hover:text-white"
                  >
                    <X size={14} />
                  </button>
                </div>
                {fused && (
                  <Sparkles
                    className="fusion-sparkles pointer-events-none absolute right-14 text-(--alert)"
                    size={18}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
      {isOver && (
        <div
          className={`pointer-events-none absolute inset-0 grid place-items-center rounded-(--radius-md) bg-black/30 text-sm font-bold ${compatible ? "text-emerald-300" : "text-red-300"}`}
        >
          {compatible ? "Compatible · soltar aquí" : "Oferta llena"}
        </div>
      )}
    </section>
  );
}

export default function ComparatorSlots(props: Props) {
  const totalA = props.slotAItems.reduce(
    (sum, item) => sum + getItemValue(item, props.currencyMode),
    0,
  );
  const totalB = props.slotBItems.reduce(
    (sum, item) => sum + getItemValue(item, props.currencyMode),
    0,
  );
  const difference = Math.abs(totalA - totalB);
  const hasBothOffers = totalA > 0 && totalB > 0;
  const percentage = totalA > 0 ? ((totalB - totalA) / totalA) * 100 : 0;
  const isGain = percentage > 0;
  const isLoss = percentage < 0;
  const verdict = isGain
    ? "Ganas valor"
    : isLoss
      ? "Pierdes valor"
      : "Intercambio justo";
  const verdictClass = isGain
    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300"
    : isLoss
      ? "border-red-500/60 bg-red-500/10 text-red-300"
      : "border-(--accentMain) bg-black/20 text-(--textSecondary)";
  return (
    <section className="mx-auto mt-5 w-[96%]">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-bold text-(--textHighlight)">
            Comparador
          </h2>
          <p className="text-sm text-(--textSecondary)">
            Compara tu oferta con la oferta rival en{" "}
            {getCurrencyLabel(props.currencyMode)}.
          </p>
        </div>
        {hasBothOffers ? (
          <div
            aria-live="polite"
            className={`rounded-lg border px-3 py-2 text-right text-sm ${verdictClass}`}
          >
            <p className="font-bold">{verdict}</p>
            <p>
              Diferencia: {formatValue(difference)}{" "}
              {getCurrencyLabel(props.currencyMode)} · {isGain ? "+" : ""}
              {percentage.toFixed(1)}%
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-(--accentMain) bg-(--accentMain) px-3 py-2 text-sm text-white">
            Añade ítems a ambas ofertas
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Slot
          slot="A"
          items={props.slotAItems}
          setItems={props.setSlotAItems}
          activeSlot={props.activeSlot}
          setActiveSlot={props.setActiveSlot}
          currencyMode={props.currencyMode}
          dropFeedback={props.dropFeedback}
        />
        <Slot
          slot="B"
          items={props.slotBItems}
          setItems={props.setSlotBItems}
          activeSlot={props.activeSlot}
          setActiveSlot={props.setActiveSlot}
          currencyMode={props.currencyMode}
          dropFeedback={props.dropFeedback}
        />
      </div>
    </section>
  );
}
