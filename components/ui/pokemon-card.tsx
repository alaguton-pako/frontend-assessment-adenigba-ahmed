"use client";
import Image from "next/image";
import Link from "next/link";

interface PokemonCardProps {
  name: string;
  id: number;
  priority?: boolean;
}

export default function PokemonCard({
  name,
  id,
  priority = false,
}: PokemonCardProps) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  const fallbackImage = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

  return (
    <Link href={`/pokemon/${id}`}>
      <div className="border border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer bg-card text-card-foreground">
        <div className="relative w-full h-48 mb-4 bg-muted rounded-lg">
          <Image
            src={imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
            className="object-contain"
            priority={priority}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = fallbackImage;
            }}
          />
        </div>
        <h2 className="text-xl font-semibold capitalize text-center">{name}</h2>
        <p className="text-muted-foreground text-center">
          #{id.toString().padStart(3, "0")}
        </p>
      </div>
    </Link>
  );
}
