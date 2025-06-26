"use client"

import type { PokemonQueryDto } from "@/schemas/pokemon"
import type { PokemonTypeRo } from "@/schemas/pokemon-type"

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

interface PokemonFiltersProps {
  filters: PokemonQueryDto
  types?: PokemonTypeRo[]
  onFiltersChange: (
    key: keyof PokemonQueryDto,
    value: string | number | undefined
  ) => void
  onClearFilters: () => void
}

export function PokemonFilters({
  filters,
  types,
  onFiltersChange,
  onClearFilters,
}: PokemonFiltersProps) {
  return (
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
              onChange={(e) => onFiltersChange("search", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={filters.typeId || "all"}
              onValueChange={(value) => onFiltersChange("typeId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
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
                onFiltersChange(
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
                onFiltersChange(
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
                onFiltersChange("orderBy", value as "name" | "power" | "life")
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

          <Button variant="outline" onClick={onClearFilters} size="sm">
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
