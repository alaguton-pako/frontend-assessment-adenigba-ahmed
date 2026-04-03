import { Pokemon, PokemonListItem, PokemonListResponse } from "@/types/pokemon";

const BASE_URL = "https://pokeapi.co/api/v2";
const CACHE = { revalidate: 3600 } as const; // ISR: revalidate every hour

export async function fetchPokemonList(
  offset: number = 0,
  limit: number = 20,
): Promise<PokemonListResponse> {
  const response = await fetch(
    `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
    { next: CACHE },
  );
  if (!response.ok) throw new Error("Failed to fetch Pokémon list");
  return response.json();
}

export async function fetchPokemonDetail(idOrName: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`, {
    next: CACHE,
  });
  if (!response.ok) throw new Error("Failed to fetch Pokémon details");
  return response.json();
}

export async function fetchAllTypes(): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/type?limit=18`, {
    next: { revalidate: 86400 }, // types change very rarely, cache for 24h
  });
  if (!response.ok) throw new Error("Failed to fetch types");
  const data = await response.json();
  return data.results.map((t: { name: string }) => t.name);
}


export async function fetchPokemonByType(
  typeName: string,
): Promise<PokemonListItem[]> {
  const response = await fetch(`${BASE_URL}/type/${typeName}`, {
    next: CACHE,
  });
  if (!response.ok) throw new Error(`Failed to fetch type: ${typeName}`);
  const data = await response.json();

  return data.pokemon.map(
    (entry: { pokemon: { name: string; url: string } }) => entry.pokemon,
  );
}
