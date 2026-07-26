"use client";

import { Gem, KeyRound, ScrollText } from "lucide-react";
import type { CurrencyMode } from "@/types/props";

interface CurrencyNavProps {
  value: CurrencyMode;
  onChange: (mode: CurrencyMode) => void;
}

export default function CurrencyNav({
  value,
  onChange,
}: CurrencyNavProps) {
  const button =
    "flex items-center gap-2 px-4 py-2 rounded-(--radius-sm) transition-all border";

  const active =
    "bg-(--accentMain) border-(--accentBright) text-(--textHighlight)";

  const inactive =
    "bg-(--backgroundComparator) border-(--accentMain)/40 text-(--textSecondary) hover:border-(--accentBright)";

  return (
    <div className="flex justify-center gap-3 py-3">

      <button
        onClick={() => onChange("keys")}
        className={`${button} ${
          value === "keys" ? active : inactive
        }`}
      >
        <KeyRound size={16} />
        Keys
      </button>

      <button
        onClick={() => onChange("scrolls")}
        className={`${button} ${
          value === "scrolls" ? active : inactive
        }`}
      >
        <ScrollText size={16} />
        Scrolls
      </button>

      <button
        onClick={() => onChange("viz")}
        className={`${button} ${
          value === "viz" ? active : inactive
        }`}
      >
        <Gem size={16} />
        Viz
      </button>

    </div>
  );
}