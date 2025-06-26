"use client"

import { useMemo, useState } from "react"
import { usePokemon, usePokemonTypes } from "@/orpc/hooks"
import type { PokemonQueryDto, PokemonRo } from "@/schemas/pokemon"

import { useDebouncedSearch } from "@/hooks/use-debounced-value"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { PokemonCard } from "./pokemon/pokemon-card"
import { PokemonFilters } from "./pokemon/pokemon-filters"

export function PokemonList() {
  // Local filter state (immediate UI updates)
  const [localFilters, setLocalFilters] = useState<PokemonQueryDto>({
    search: "",
    typeId: undefined,
    minPower: undefined,
    maxPower: undefined,
    orderBy: "name",
    page: 1,
    limit: 50, // Fetch more data upfront
  })

  // Debounced search term (for API calls)
  const debouncedSearch = useDebouncedSearch(localFilters.search || "", 500)

  // API filters - only trigger refetch when debounced values change
  const apiFilters = useMemo(
    () => ({
      search: debouncedSearch,
      typeId: localFilters.typeId,
      minPower: localFilters.minPower,
      maxPower: localFilters.maxPower,
      orderBy: localFilters.orderBy,
      page: 1, // Always fetch first page for now
      limit: 100, // Fetch larger set for client-side filtering
    }),
    [
      debouncedSearch,
      localFilters.typeId,
      localFilters.minPower,
      localFilters.maxPower,
      localFilters.orderBy,
    ]
  )

  const { data: pokemonData, isLoading: pokemonLoading } =
    usePokemon(apiFilters)
  const { data: types } = usePokemonTypes()

  // Client-side filtering and pagination for instant feedback
  const filteredAndPaginatedPokemon = useMemo(() => {
    if (!pokemonData?.data)
      return {
        data: [],
        pagination: { page: 1, limit: 12, totalCount: 0, totalPages: 0 },
      }

    let filtered = pokemonData.data

    // Apply instant search filter on client side for immediate feedback
    if (localFilters.search && localFilters.search !== debouncedSearch) {
      const searchLower = localFilters.search.toLowerCase()
      filtered = filtered.filter((pokemon: PokemonRo) =>
        pokemon.name.toLowerCase().includes(searchLower)
      )
    }

    // Apply type filter
    if (localFilters.typeId && localFilters.typeId !== "all") {
      filtered = filtered.filter(
        (pokemon: PokemonRo) => pokemon.type.id === localFilters.typeId
      )
    }

    // Apply power range filters
    if (localFilters.minPower) {
      filtered = filtered.filter(
        (pokemon: PokemonRo) => pokemon.power >= localFilters.minPower!
      )
    }
    if (localFilters.maxPower) {
      filtered = filtered.filter(
        (pokemon: PokemonRo) => pokemon.power <= localFilters.maxPower!
      )
    }

    // Apply sorting
    filtered = [...filtered].sort((a: PokemonRo, b: PokemonRo) => {
      switch (localFilters.orderBy) {
        case "power":
          return b.power - a.power
        case "life":
          return b.life - a.life
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    // Apply pagination
    const page = localFilters.page || 1
    const limit = 12
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedData = filtered.slice(startIndex, endIndex)

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalCount: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
      },
    }
  }, [pokemonData?.data, localFilters, debouncedSearch])

  const handleFilterChange = (
    key: keyof PokemonQueryDto,
    value: string | number | undefined
  ) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: key === "page" ? (value as number) : 1, // Reset to page 1 for filter changes
    }))
  }

  const clearFilters = () => {
    setLocalFilters({
      search: "",
      typeId: undefined,
      minPower: undefined,
      maxPower: undefined,
      orderBy: "name",
      page: 1,
      limit: 50,
    })
  }

  // Show loading state only on initial load
  if (pokemonLoading && !pokemonData) {
    return <PokemonListSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Performance indicator */}
      {localFilters.search && localFilters.search !== debouncedSearch && (
        <div className="text-muted-foreground rounded-lg bg-blue-50 py-2 text-center text-xs">
          🔍 Instant search active • Full search in{" "}
          {Math.max(0, 500 - localFilters.search.length * 50)}ms
        </div>
      )}

      {/* Filters */}
      <PokemonFilters
        filters={localFilters}
        types={types}
        onFiltersChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Loading indicator for background refresh */}
      {pokemonLoading && pokemonData && (
        <div className="text-muted-foreground text-center text-xs">
          🔄 Updating results...
        </div>
      )}

      {/* Pokemon Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {filteredAndPaginatedPokemon.data.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Pagination */}
      {filteredAndPaginatedPokemon.pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("page", localFilters.page! - 1)}
              disabled={localFilters.page! <= 1}
            >
              Previous
            </Button>
            <span className="text-muted-foreground px-2 text-sm">
              Page {localFilters.page} of{" "}
              {filteredAndPaginatedPokemon.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("page", localFilters.page! + 1)}
              disabled={
                localFilters.page! >=
                filteredAndPaginatedPokemon.pagination.totalPages
              }
            >
              Next
            </Button>
          </div>

          <div className="text-muted-foreground text-sm">
            {filteredAndPaginatedPokemon.pagination.totalCount} Pokemon{" "}
            {localFilters.search || localFilters.typeId ? "filtered" : "total"}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredAndPaginatedPokemon.data.length === 0 && (
        <PokemonEmptyState
          onClearFilters={clearFilters}
          hasFilters={
            !!(
              localFilters.search ||
              localFilters.typeId ||
              localFilters.minPower ||
              localFilters.maxPower
            )
          }
        />
      )}
    </div>
  )
}

// Loading skeleton component
function PokemonListSkeleton() {
  return (
    <div className="space-y-6">
      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pokemon Grid Skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-5 w-16" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <div className="flex justify-between text-sm">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Enhanced empty state component
function PokemonEmptyState({
  onClearFilters,
  hasFilters,
}: {
  onClearFilters: () => void
  hasFilters: boolean
}) {
  return (
    <Card className="p-8 text-center">
      <div className="space-y-4">
        <div className="text-4xl">{hasFilters ? "🔍" : "⚡"}</div>
        <div>
          <h3 className="font-medium">
            {hasFilters ? "No Pokemon Found" : "No Pokemon Available"}
          </h3>
          <p className="text-muted-foreground text-sm">
            {hasFilters
              ? "No Pokemon found matching your search criteria. Try adjusting your filters."
              : "No Pokemon have been added to the system yet."}
          </p>
        </div>
        {hasFilters && (
          <Button onClick={onClearFilters} variant="outline" size="sm">
            Clear All Filters
          </Button>
        )}
      </div>
    </Card>
  )
}
