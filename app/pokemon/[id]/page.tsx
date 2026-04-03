import { fetchPokemonDetail } from "@/lib/pokemon-api";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Generate metadata dynamically for SEO/shareability
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const pokemon = await fetchPokemonDetail(id);

  return {
    title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} - Pokémon Explorer`,
    description: `${pokemon.name} is a ${pokemon.types.map((t) => t.type.name).join(", ")} type Pokémon. Height: ${pokemon.height}, Weight: ${pokemon.weight}.`,
    openGraph: {
      title: pokemon.name,
      description: `Learn about ${pokemon.name} - abilities, types, and stats.`,
      images: [
        pokemon.sprites.other?.["official-artwork"]?.front_default ??
          pokemon.sprites.front_default,
      ].filter(Boolean) as string[],
    },
  };
}

export default async function PokemonDetailPage({ params }: PageProps) {
  const { id } = await params;
  let pokemon;

  try {
    pokemon = await fetchPokemonDetail(id);
  } catch {
    notFound();
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="capitalize">{pokemon.name}</span>
      </nav>

      {/* Detail Content */}
      <div className="bg-card text-card-foreground border border-border rounded-lg shadow-md overflow-hidden max-w-2xl mx-auto">
        <div className="relative w-full h-96 bg-muted">
          <Image
            src={
              pokemon.sprites.other?.["official-artwork"]?.front_default ||
              pokemon.sprites.front_default
            }
            alt={pokemon.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-contain p-4"
            priority
          />
        </div>

        <div className="p-6">
          <h1 className="text-3xl font-bold capitalize mb-2">{pokemon.name}</h1>
          <p className="text-muted-foreground mb-4">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>

          {/* Types */}
          <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">Types</h2>
            <div className="flex gap-2">
              {pokemon.types?.map(({ type }) => (
                <span
                  key={type.name}
                  className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full capitalize"
                >
                  {type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Height</h2>
              <p className="text-muted-foreground">{pokemon.height / 10} m</p>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-2">Weight</h2>
              <p className="text-muted-foreground">{pokemon.weight / 10} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
