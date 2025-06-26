"use client"

import { useState } from "react"
import { usePokemon, usePokemonTypes } from "@/orpc/hooks"
import type { PokemonQueryDto } from "@/schemas/pokemon"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { PokemonCard } from "./pokemon/pokemon-card"
import { PokemonFilters } from "./pokemon/pokemon-filters"

export function PokemonList() {
  const [filters, setFilters] = useState<PokemonQueryDto>({
    search: "",
    typeId: undefined,
    minPower: undefined,
    maxPower: undefined,
    orderBy: "name",
    page: 1,
    limit: 12,
  })

  const { data: pokemonData, isLoading: pokemonLoading } = usePokemon(filters)
  const { data: types } = usePokemonTypes()

  const handleFilterChange = (
    key: keyof PokemonQueryDto,
    value: string | number | undefined
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: key === "page" ? (value as number) : 1,
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      typeId: undefined,
      minPower: undefined,
      maxPower: undefined,
      orderBy: "name",
      page: 1,
      limit: 12,
    })
  }

  if (pokemonLoading && !pokemonData) {
    return <PokemonListSkeleton />
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <PokemonFilters
        filters={filters}
        types={types}
        onFiltersChange={handleFilterChange}
        onClearFilters={clearFilters}
      />

      {/* Pokemon Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {pokemonData?.data.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>

      {/* Pagination */}
      {pokemonData && pokemonData.pagination.totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("page", filters.page! - 1)}
              disabled={filters.page! <= 1}
            >
              Previous
            </Button>
            <span className="text-muted-foreground px-2 text-sm">
              Page {filters.page} of {pokemonData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange("page", filters.page! + 1)}
              disabled={filters.page! >= pokemonData.pagination.totalPages}
            >
              Next
            </Button>
          </div>

          <div className="text-muted-foreground text-sm">
            {pokemonData.pagination.totalCount} Pokemon total
          </div>
        </div>
      )}

      {/* Empty State */}
      {pokemonData?.data.length === 0 && (
        <PokemonEmptyState onClearFilters={clearFilters} />
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

// Empty state component
function PokemonEmptyState({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <Card className="p-8 text-center">
      <div className="space-y-4">
        <div className="text-4xl">🔍</div>
        <div>
          <h3 className="font-medium">No Pokemon Found</h3>
          <p className="text-muted-foreground text-sm">
            No Pokemon found matching your criteria.
          </p>
        </div>
        <Button onClick={onClearFilters} variant="outline" size="sm">
          Clear Filters
        </Button>
      </div>
    </Card>
  )
}
