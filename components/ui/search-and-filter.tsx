"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Button from "./button";

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

  // Build and push URL — does NOT read searchParams, avoids the infinite loop
  const pushURL = useCallback(
    (nextSearch: string, nextType: string) => {
      const params = new URLSearchParams();
      if (nextSearch) params.set("search", nextSearch);
      if (nextType) params.set("type", nextType);
      // Always reset to page 1 when filters change
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
    // ✅ No searchParams here — that was the infinite-loop culprit
  }, [search, type, pushURL]);

  const handleClear = () => {
    setSearch("");
    setType("");
    router.push("/", { scroll: false });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <input
        type="text"
        placeholder="Search Pokémon..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Types</option>
        {availableTypes.map((t) => (
          <option key={t} value={t} className="capitalize">
            {t}
          </option>
        ))}
      </select>

      {(search || type) && (
        <Button
          onClick={handleClear}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Clear ✕
        </Button>
      )}
    </div>
  );
}
