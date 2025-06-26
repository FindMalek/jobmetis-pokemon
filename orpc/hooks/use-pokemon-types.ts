"use client"

import { orpc } from "@/orpc/client"
import { useQuery } from "@tanstack/react-query"

// Query keys factory
export const pokemonTypeKeys = {
  all: ["pokemonTypes"] as const,
  lists: () => [...pokemonTypeKeys.all, "list"] as const,
  details: () => [...pokemonTypeKeys.all, "detail"] as const,
  detail: (id: string) => [...pokemonTypeKeys.details(), id] as const,
  effectivenessChart: () =>
    [...pokemonTypeKeys.all, "effectivenessChart"] as const,
}

// Get all Pokemon types
export function usePokemonTypes() {
  return useQuery({
    queryKey: pokemonTypeKeys.lists(),
    queryFn: () => orpc.pokemonType.getAllTypes.call({}),
    staleTime: 10 * 60 * 1000, // 10 minutes - types don't change often
  })
}

// Get single Pokemon type
export function usePokemonTypeById(id: string) {
  return useQuery({
    queryKey: pokemonTypeKeys.detail(id),
    queryFn: () => orpc.pokemonType.getTypeById.call({ id }),
    enabled: !!id,
  })
}

// Get type effectiveness chart
export function usePokemonTypeEffectivenessChart() {
  return useQuery({
    queryKey: pokemonTypeKeys.effectivenessChart(),
    queryFn: () => orpc.pokemonType.getEffectivenessChart.call({}),
    staleTime: 15 * 60 * 1000, // 15 minutes - effectiveness rarely changes
  })
}
