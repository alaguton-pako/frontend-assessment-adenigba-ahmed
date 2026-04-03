"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

interface SearchAndFilterProps {
  initialSearch: string;
  initialType: string;
  availableTypes: string[];
}

export default function SearchAndFilter({
  initialSearch,
  initialType,
  availableTypes,
}: SearchAndFilterProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);
  const [type, setType] = useState(initialType);
  const isFirstRender = useRef(true);

  const pushURL = useCallback(
    (nextSearch: string, nextType: string) => {
      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextType) params.set("type", nextType);

      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  // Debounced effect — only fires after the first render
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const timeout = setTimeout(() => {
      pushURL(search, type);
    }, 300);

    return () => clearTimeout(timeout);
  }, [search, type, pushURL]);

  const handleClear = () => {
    setSearch("");
    setType("");
    router.push("/", { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">


      <label htmlFor="pokemon-search" className="sr-only">
        Search Pokémon
      </label>
      <input
        id="pokemon-search"
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-2 border border-border rounded-lg bg-card text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <label htmlFor="pokemon-type" className="sr-only">
        Filter by type
      </label>
      <select
        id="pokemon-type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="p-2 border border-border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Types</option>
        {availableTypes.map((t) => (
          <option key={t} value={t} className="capitalize">
            {t}
          </option>
        ))}
      </select>

      {(search || type) && (
        <button
          onClick={handleClear}
          aria-label="Clear search and filters"
          className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          Clear ✕
        </button>
      )}
    </div>
  );
}
