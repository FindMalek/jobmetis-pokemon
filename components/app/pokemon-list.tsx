"use client"

import { useState } from "react"
import { usePokemon, usePokemonTypes } from "@/orpc/hooks"
import type { PokemonQueryDto } from "@/schemas/pokemon"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function PokemonList() {
  const [filters, setFilters] = useState<PokemonQueryDto>({
    search: "",
    typeId: "",
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
      [key]: value,
      page: key === "page" ? (value as number) : 1,
    }))
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      typeId: "",
      minPower: undefined,
      maxPower: undefined,
      orderBy: "name",
      page: 1,
      limit: 12,
    })
  }

  if (pokemonLoading && !pokemonData) {
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

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Pokemon</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Search Pokemon..."
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={filters.typeId || ""}
                onValueChange={(value) => handleFilterChange("typeId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Types</SelectItem>
                  {types?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: type.color }}
                        />
                        {type.displayName}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minPower">Min Power</Label>
              <Input
                id="minPower"
                type="number"
                placeholder="10"
                value={filters.minPower || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "minPower",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxPower">Max Power</Label>
              <Input
                id="maxPower"
                type="number"
                placeholder="100"
                value={filters.maxPower || ""}
                onChange={(e) =>
                  handleFilterChange(
                    "maxPower",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Label htmlFor="sortBy" className="text-sm">
                Sort by:
              </Label>
              <Select
                value={filters.orderBy}
                onValueChange={(value) =>
                  handleFilterChange(
                    "orderBy",
                    value as "name" | "power" | "life"
                  )
                }
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="power">Power</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pokemon Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {pokemonData?.data.map((pokemon) => (
          <Card
            key={pokemon.id}
            className="group overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg"
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
                      target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
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
              </div>
            </CardContent>
          </Card>
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
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-4xl">🔍</div>
            <div>
              <h3 className="font-medium">No Pokemon Found</h3>
              <p className="text-muted-foreground text-sm">
                No Pokemon found matching your criteria.
              </p>
            </div>
            <Button onClick={clearFilters} variant="outline" size="sm">
              Clear Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}
