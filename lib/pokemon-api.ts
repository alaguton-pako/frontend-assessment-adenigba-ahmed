import { Pokemon, PokemonListResponse } from '@/types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(offset: number = 0, limit: number = 20): Promise<PokemonListResponse> {
  const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`, {
    next: { revalidate: 3600 } // ISR: revalidate every hour
  });
  
  if (!response.ok) throw new Error('Failed to fetch Pokémon list');
  return response.json();
}

export async function fetchPokemonDetail(idOrName: string): Promise<Pokemon> {
  const response = await fetch(`${BASE_URL}/pokemon/${idOrName}`, {
    next: { revalidate: 3600 }
  });
  
  if (!response.ok) throw new Error('Failed to fetch Pokémon details');
  return response.json();
}