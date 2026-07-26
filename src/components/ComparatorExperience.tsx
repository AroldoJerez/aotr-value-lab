"use client";

import { useEffect, useState } from "react";
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import ItemGrid from "@/components/ItemGrid";
import { ItemCardPreview } from "@/components/ItemCard";
import ComparatorSlots, { type DropFeedback } from "@/components/ComparatorSlots";
import CurrencyNav from "@/components/PriceNav";
import type { CurrencyMode } from "@/types/props";
import type { Item } from "@/types/item";

export default function ComparatorExperience() {
  const [items, setItems] = useState<Item[]>([]); const [slotAItems, setSlotAItems] = useState<Item[]>([]); const [slotBItems, setSlotBItems] = useState<Item[]>([]);
  const [activeSlot, setActiveSlot] = useState<"A" | "B" | null>("A"); const [currencyMode, setCurrencyMode] = useState<CurrencyMode>("keys");
  const [draggedItem, setDraggedItem] = useState<Item | null>(null); const [tilt, setTilt] = useState({ x: 0, y: 0 }); const [dropFeedback, setDropFeedback] = useState<DropFeedback | null>(null);
  const sensors = useSensors(useSensor(MouseSensor, { activationConstraint: { distance: 6 } }), useSensor(TouchSensor, { activationConstraint: { delay: 160, tolerance: 6 } }));
  useEffect(() => { fetch("/api/items").then((response) => response.json()).then(setItems).catch(() => setItems([])); }, []);
  useEffect(() => { if (!dropFeedback) return; const timeout = window.setTimeout(() => setDropFeedback(null), 620); return () => window.clearTimeout(timeout); }, [dropFeedback]);
  const addToSlot = (item: Item, slot: "A" | "B") => { const current = slot === "A" ? slotAItems : slotBItems; if (current.length >= 25) return; const merged = current.some((entry) => entry.id === item.id); const update = slot === "A" ? setSlotAItems : setSlotBItems; update((entries) => [...entries, item]); setDropFeedback({ slot, itemId: item.id, merged, sequence: Date.now() }); };
  const onDragStart = (event: DragStartEvent) => setDraggedItem(event.active.data.current?.item as Item);
  const onDragEnd = (event: DragEndEvent) => { const item = event.active.data.current?.item as Item | undefined; const slot = event.over?.id === "slot-A" ? "A" : event.over?.id === "slot-B" ? "B" : null; if (item && slot) { addToSlot(item, slot); setActiveSlot(slot); } setDraggedItem(null); setTilt({ x: 0, y: 0 }); };
  return <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={onDragStart} onDragMove={({ delta }) => setTilt({ x: Math.max(-8, Math.min(8, delta.y / 13)), y: Math.max(-8, Math.min(8, delta.x / 13)) })} onDragCancel={() => setDraggedItem(null)} onDragEnd={onDragEnd}>{draggedItem && <div className="drag-dim" />}<main className="relative mx-auto min-h-screen max-w-5xl px-4 pb-8 pt-24 md:px-8"><div className="rounded-(--radius-lg) border border-(--accentMain) bg-(--backgroundComparator)/72 pb-7"><CurrencyNav value={currencyMode} onChange={setCurrencyMode} /><ItemGrid items={items} currencyMode={currencyMode} onSelectItem={(item) => activeSlot && addToSlot(item, activeSlot)} /><ComparatorSlots slotAItems={slotAItems} slotBItems={slotBItems} setSlotAItems={setSlotAItems} setSlotBItems={setSlotBItems} activeSlot={activeSlot} setActiveSlot={setActiveSlot} currencyMode={currencyMode} dropFeedback={dropFeedback} /></div></main><DragOverlay dropAnimation={{ duration: 220, easing: "cubic-bezier(.22,.61,.36,1)" }}>{draggedItem && <div className="drag-overlay w-36" style={{ transform: `perspective(550px) rotateX(${-tilt.x}deg) rotateY(${tilt.y}deg)` }}><ItemCardPreview item={draggedItem} currencyMode={currencyMode} /></div>}</DragOverlay></DndContext>;
}
