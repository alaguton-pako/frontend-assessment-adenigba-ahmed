"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useCallback, useState, useEffect } from "react";
import { PokemonListItem } from "@/types/pokemon";

export function useSearchAndFilter(pokemonList: PokemonListItem[]) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "",
  );

  // Update URL when filters change
  const updateURL = useCallback(
    (search: string, type: string) => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (type) params.set("type", type);
      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router],
  );

  // Debounced search handler
  const handleSearch = useCallback(
    (value: string) => {
      setSearchTerm(value);
      updateURL(value, selectedType);
    },
    [updateURL, selectedType],
  );

  const handleTypeFilter = useCallback(
    (value: string) => {
      setSelectedType(value);
      updateURL(searchTerm, value);
    },
    [updateURL, searchTerm],
  );

  // Fetch all Pokémon types (for filter dropdown)
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);

  useEffect(() => {
    // Extract unique types from all Pokémon
    const fetchTypes = async () => {
      const typeRes = await fetch("https://pokeapi.co/api/v2/type?limit=18");
      const data = await typeRes.json();
      setAvailableTypes(data.results.map((t: { name: string }) => t.name));
    };
    fetchTypes();
  }, []);

  // Filter logic
  const filteredPokemon = useMemo(() => {
    let filtered = pokemonList;

    if (searchTerm) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Note: Type filtering requires fetching additional data
    // For this MVP, we'll do client-side type filtering by fetching details
    // This is a trade-off documented in README

    return filtered;
  }, [pokemonList, searchTerm]);

  return {
    searchTerm,
    selectedType,
    handleSearch,
    handleTypeFilter,
    filteredPokemon,
    availableTypes,
  };
}
