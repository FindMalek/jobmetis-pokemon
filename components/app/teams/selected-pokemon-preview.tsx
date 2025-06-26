"use client"

import type { PokemonRo } from "@/schemas/pokemon"

interface SelectedPokemonPreviewProps {
  selectedPokemon: PokemonRo[]
  maxSlots?: number
}

export function SelectedPokemonPreview({
  selectedPokemon,
  maxSlots = 6,
}: SelectedPokemonPreviewProps) {
  if (selectedPokemon.length === 0) return null

  return (
    <div className="bg-muted grid grid-cols-3 gap-2 rounded-lg p-3 sm:grid-cols-6">
      {selectedPokemon.map((pokemon, index) => (
        <div key={pokemon.id} className="relative">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="aspect-square w-full rounded object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
            }}
          />
          <div className="bg-primary absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full">
            <span className="text-xs font-bold text-white">{index + 1}</span>
          </div>
        </div>
      ))}

      {/* Empty slots */}
      {[...Array(maxSlots - selectedPokemon.length)].map((_, index) => (
        <div
          key={`empty-${index}`}
          className="border-muted-foreground/30 flex aspect-square items-center justify-center rounded border-2 border-dashed"
        >
          <span className="text-muted-foreground text-xs">Empty</span>
        </div>
      ))}
    </div>
  )
}
