import {
  fetchPokemonList,
  fetchPokemonByType,
  fetchAllTypes,
} from "@/lib/pokemon-api";
import PokemonCard from "@/components/ui/pokemon-card";
import Pagination from "@/components/ui/pagination";
import SearchAndFilter from "@/components/ui/search-and-filter";
import { PokemonListItem } from "@/types/pokemon";

interface PageProps {
  searchParams: Promise<{ page?: string; search?: string; type?: string }>;
}

const ITEMS_PER_PAGE = 20;

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number(params?.page) || 1);
  const searchTerm = params?.search?.toLowerCase() || "";
  const typeFilter = params?.type || "";

  // Fetch types server-side so the client component doesn't need to
  const availableTypes = await fetchAllTypes();

  let allMatchingPokemon: PokemonListItem[] = [];

  if (typeFilter) {
    // ✅ Server-side type filter: PokeAPI gives us the full list for a type
    const byType = await fetchPokemonByType(typeFilter);

    // Then apply name search on top if present
    allMatchingPokemon = searchTerm
      ? byType.filter((p) => p.name.toLowerCase().includes(searchTerm))
      : byType;
  } else if (searchTerm) {
    // Name-only search: fetch a large batch to search through.
    // PokeAPI has no server-side name search endpoint, so we grab the first
    // 1302 (full dex) and filter. The response is tiny (just name + url per
    // entry) and is cached via ISR, so this is fast in practice.
    const all = await fetchPokemonList(0, 1302);
    allMatchingPokemon = all.results.filter((p) =>
      p.name.toLowerCase().includes(searchTerm),
    );
  } else {
    // No filters — regular paginated fetch (most common path)
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    const data = await fetchPokemonList(offset, ITEMS_PER_PAGE);
    console.log(data);

    const totalPages = Math.ceil(data.count / ITEMS_PER_PAGE);
    const ids = data.results.map((p) =>
      Number(p.url.split("/").filter(Boolean).pop()),
    );

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Pokémon Explorer</h1>
        <SearchAndFilter
          initialSearch=""
          initialType=""
          availableTypes={availableTypes}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {data.results.map((pokemon, index) => (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              id={ids[index]}
              priority={index < 4}
            />
          ))}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    );
  }

  // ── Filtered path: paginate allMatchingPokemon in memory ──────────────────
  const totalPages = Math.max(
    1,
    Math.ceil(allMatchingPokemon.length / ITEMS_PER_PAGE),
  );

  // Clamp page to valid range after filtering
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * ITEMS_PER_PAGE;
  const pageSlice = allMatchingPokemon.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pokémon Explorer</h1>
      <SearchAndFilter
        initialSearch={params?.search || ""}
        initialType={params?.type || ""}
        availableTypes={availableTypes}
      />

      {pageSlice.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-2xl mb-2">😕</p>
          <p className="text-gray-600 font-medium">No Pokémon found.</p>
          <p className="text-gray-400 text-sm mt-1">
            Try a different name or type.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">
            {allMatchingPokemon.length} result
            {allMatchingPokemon.length !== 1 ? "s" : ""}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-2">
            {pageSlice.map((pokemon, index) => {
              const id = Number(pokemon.url.split("/").filter(Boolean).pop());
              return (
                <PokemonCard
                  key={pokemon.name}
                  name={pokemon.name}
                  id={id}
                  priority={index < 4}
                />
              );
            })}
          </div>
          <Pagination currentPage={safePage} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
