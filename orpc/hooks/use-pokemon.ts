"use client"

import { orpc } from "@/orpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys factory
export const pokemonKeys = {
  all: ["pokemon"] as const,
  lists: () => [...pokemonKeys.all, "list"] as const,
  list: (filters: string) => [...pokemonKeys.lists(), { filters }] as const,
  details: () => [...pokemonKeys.all, "detail"] as const,
  detail: (id: string) => [...pokemonKeys.details(), id] as const,
  byType: (typeId: string) => [...pokemonKeys.all, "byType", typeId] as const,
}

// Get all Pokemon with filters
export function usePokemon(filters?: {
  search?: string
  typeId?: string
  minPower?: number
  maxPower?: number
  orderBy?: "name" | "power" | "life"
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: pokemonKeys.list(JSON.stringify(filters || {})),
    queryFn: () => orpc.pokemon.getAllPokemon.call(filters || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single Pokemon
export function usePokemonById(id: string) {
  return useQuery({
    queryKey: pokemonKeys.detail(id),
    queryFn: () => orpc.pokemon.getPokemonById.call({ id }),
    enabled: !!id,
  })
}

// Get Pokemon by type
export function usePokemonByType(typeId: string) {
  return useQuery({
    queryKey: pokemonKeys.byType(typeId),
    queryFn: () => orpc.pokemon.getPokemonByType.call({ typeId }),
    enabled: !!typeId,
  })
}

// Create Pokemon mutation
export function useCreatePokemon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.pokemon.createPokemon.call,
    onSuccess: () => {
      // Invalidate and refetch Pokemon lists
      queryClient.invalidateQueries({
        queryKey: pokemonKeys.lists(),
      })
    },
    onError: (error) => {
      console.error("Failed to create Pokemon:", error)
    },
  })
}

// Update Pokemon mutation
export function useUpdatePokemon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.pokemon.updatePokemon.call,
    onSuccess: (data) => {
      // Invalidate and refetch Pokemon lists
      queryClient.invalidateQueries({
        queryKey: pokemonKeys.lists(),
      })
      // Update specific Pokemon cache
      queryClient.setQueryData(pokemonKeys.detail(data.id), data)
    },
    onError: (error) => {
      console.error("Failed to update Pokemon:", error)
    },
  })
}

// Delete Pokemon mutation
export function useDeletePokemon() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.pokemon.deletePokemon.call,
    onSuccess: () => {
      // Invalidate and refetch Pokemon lists
      queryClient.invalidateQueries({
        queryKey: pokemonKeys.lists(),
      })
    },
    onError: (error) => {
      console.error("Failed to delete Pokemon:", error)
    },
  })
}
