"use client"

import { useState } from "react"
import { usePokemon, usePokemonTypes } from "@/orpc/hooks"

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
  const [filters, setFilters] = useState({
    search: "",
    typeId: "",
    minPower: undefined as number | undefined,
    maxPower: undefined as number | undefined,
    orderBy: "name" as "name" | "power" | "life",
    page: 1,
    limit: 12,
  })

  const { data: pokemonData, isLoading: pokemonLoading } = usePokemon(filters)
  const { data: types, isLoading: typesLoading } = usePokemonTypes()

  const handleFilterChange = (key: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page when filters change
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

  if (pokemonLoading || typesLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-3/4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-32 w-full rounded-md" />
                <div className="mt-4 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
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
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Pokemon</Label>
              <Input
                id="search"
                placeholder="Enter Pokemon name..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={filters.typeId}
                onValueChange={(value) => handleFilterChange("typeId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  {types?.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.displayName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="orderBy">Sort by</Label>
              <Select
                value={filters.orderBy}
                onValueChange={(value) =>
                  handleFilterChange(
                    "orderBy",
                    value as "name" | "power" | "life"
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="power">Power</SelectItem>
                  <SelectItem value="life">Life</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button onClick={clearFilters} variant="outline">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pokemon Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pokemonData?.data.map((pokemon) => (
          <Card key={pokemon.id} className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{pokemon.name}</CardTitle>
                <Badge
                  style={{ backgroundColor: pokemon.type.color }}
                  className="text-white"
                >
                  {pokemon.type.displayName}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex aspect-square items-center justify-center rounded-lg bg-gray-100">
                  <img
                    src={pokemon.image}
                    alt={pokemon.name}
                    className="h-full w-full rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Power:</span> {pokemon.power}
                  </div>
                  <div>
                    <span className="font-medium">Life:</span> {pokemon.life}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Add to Team
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pokemonData && pokemonData.pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            disabled={filters.page <= 1}
            onClick={() => handleFilterChange("page", filters.page - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground text-sm">
            Page {filters.page} of {pokemonData.pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={filters.page >= pokemonData.pagination.totalPages}
            onClick={() => handleFilterChange("page", filters.page + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Empty State */}
      {pokemonData?.data.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">
            No Pokemon found matching your criteria.
          </p>
          <Button onClick={clearFilters} variant="outline" className="mt-4">
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  )
}
