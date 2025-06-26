"use client"

import type { PokemonRo } from "@/schemas/pokemon"

import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

interface PokemonSelectorProps {
  pokemonData: PokemonRo[]
  selectedPokemonIds: string[]
  onToggleSelection: (pokemonId: string) => void
  isLoading?: boolean
  title?: string
}

export function PokemonSelector({
  pokemonData,
  selectedPokemonIds,
  onToggleSelection,
  isLoading = false,
  title = "Select Pokemon",
}: PokemonSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>
          {title} ({selectedPokemonIds.length}/6)
        </Label>
        <Badge
          variant={selectedPokemonIds.length === 6 ? "default" : "secondary"}
        >
          {selectedPokemonIds.length}/6 Selected
        </Badge>
      </div>

      <ScrollArea className="h-80">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 rounded border p-3"
              >
                <Skeleton className="h-12 w-12 rounded" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {pokemonData.map((pokemon) => (
              <div
                key={pokemon.id}
                className={`flex cursor-pointer items-center space-x-3 rounded border p-3 transition-colors ${
                  selectedPokemonIds.includes(pokemon.id)
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => onToggleSelection(pokemon.id)}
              >
                <div className="relative">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="h-12 w-12 rounded object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                    }}
                  />
                  {selectedPokemonIds.includes(pokemon.id) && (
                    <div className="bg-primary absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full">
                      <span className="text-xs font-bold text-white">
                        {selectedPokemonIds.indexOf(pokemon.id) + 1}
                      </span>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{pokemon.name}</p>
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <Badge
                      style={{ backgroundColor: pokemon.type.color }}
                      className="px-1 text-xs text-white"
                    >
                      {pokemon.type.displayName}
                    </Badge>
                    <span>⚡{pokemon.power}</span>
                    <span>❤️{pokemon.life}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}
