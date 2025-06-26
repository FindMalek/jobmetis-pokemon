"use client"

import type { PokemonRo } from "@/schemas/pokemon"

import { PokemonService } from "@/lib/services"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PokemonCardProps {
  pokemon: PokemonRo
  onClick?: (pokemon: PokemonRo) => void
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  const powerLevel = PokemonService.getPowerLevel(pokemon.power)

  return (
    <Card
      className={`group overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={() => onClick?.(pokemon)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="truncate pr-2 text-lg">
            {pokemon.name}
          </CardTitle>
          <Badge
            style={{ backgroundColor: pokemon.type.color }}
            className="shrink-0 text-xs text-white"
          >
            {pokemon.type.displayName}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-gray-100">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="aspect-square w-full object-cover transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = PokemonService.getFallbackImageUrl(pokemon.name)
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </div>

          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">⚡</span>
              <span className="font-medium">{pokemon.power}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-red-500">❤️</span>
              <span className="font-medium">{pokemon.life}</span>
            </div>
          </div>

          {/* Power Level Indicator */}
          <div className="text-center">
            <span className={`text-xs font-medium ${powerLevel.color}`}>
              {powerLevel.level}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
