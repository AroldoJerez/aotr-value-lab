"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [search, setSearch] = useState("");
  const updateSearch = (value: string) => {
    setSearch(value);
    onSearch(value);
  };

  return (
    <div className="flex items-center">
      <input
        type="search"
        placeholder="Buscar artículo..."
        value={search}
        onChange={(event) => updateSearch(event.target.value)}
        className="font-body w-full rounded-md border bg-(--backgroundComparator) px-4 py-2"
        style={{
          borderColor: "var(--accentMain)",
          color: "var(--textPrimary)",
          fontFamily: "var(--font-body)",
        }}
      />
      {search && (
        <button
          type="button"
          onClick={() => updateSearch("")}
          className="font-navigation shrink-0 rounded-md border px-4 py-2 uppercase transition-colors"
          style={{
            borderColor: "var(--accentBright)",
            backgroundColor: "var(--accentMain)",
            color: "var(--textHighlight)",
            fontFamily: "var(--font-navigation)",
          }}
        >
          Limpiar
        </button>
      )}
    </div>
  );
}
