import { Prisma, PokemonTypeEnum } from "@prisma/client"

export class PokemonQuery {
  // Include type information
  static getInclude(): Prisma.PokemonInclude {
    return {
      type: true,
      _count: {
        select: {
          teamMemberships: true,
        },
      },
    }
  }

  // Where clause for filtering by type - proper type-safe solution
  static getByTypeWhere(typeEnum: PokemonTypeEnum): Prisma.PokemonWhereInput {
    return {
      type: {
        name: typeEnum,
      },
    }
  }

  // Where clause for filtering by type name (string) - converts to enum first
  static getByTypeNameWhere(typeName: string): Prisma.PokemonWhereInput {
    try {
      const typeEnum = PokemonTypeEnum[typeName.toUpperCase() as keyof typeof PokemonTypeEnum]
      return {
        type: {
          name: typeEnum,
        },
      }
    } catch {
      // If invalid type name, return empty where clause
      return {}
    }
  }

  // Where clause for filtering by power range
  static getByPowerRangeWhere(minPower: number, maxPower: number): Prisma.PokemonWhereInput {
    return {
      power: {
        gte: minPower,
        lte: maxPower,
      },
    }
  }

  // Where clause for filtering by life range
  static getByLifeRangeWhere(minLife: number, maxLife: number): Prisma.PokemonWhereInput {
    return {
      life: {
        gte: minLife,
        lte: maxLife,
      },
    }
  }

  // Where clause for searching by name
  static getByNameWhere(searchTerm: string): Prisma.PokemonWhereInput {
    return {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }
  }

  // Combined search where clause
  static getSearchWhere(params: {
    search?: string
    typeEnum?: PokemonTypeEnum
    minPower?: number
    maxPower?: number
    minLife?: number
    maxLife?: number
  }): Prisma.PokemonWhereInput {
    const conditions: Prisma.PokemonWhereInput[] = []

    if (params.search) {
      conditions.push(this.getByNameWhere(params.search))
    }

    if (params.typeEnum) {
      conditions.push(this.getByTypeWhere(params.typeEnum))
    }

    if (params.minPower !== undefined && params.maxPower !== undefined) {
      conditions.push(this.getByPowerRangeWhere(params.minPower, params.maxPower))
    }

    if (params.minLife !== undefined && params.maxLife !== undefined) {
      conditions.push(this.getByLifeRangeWhere(params.minLife, params.maxLife))
    }

    return conditions.length > 0 ? { AND: conditions } : {}
  }

  // Order by options
  static getOrderBy(orderBy: "name" | "power" | "life" = "name"): Prisma.PokemonOrderByWithRelationInput[] {
    switch (orderBy) {
      case "power":
        return [{ power: "desc" }, { name: "asc" }]
      case "life":
        return [{ life: "desc" }, { name: "asc" }]
      default:
        return [{ name: "asc" }]
    }
  }

  // Where clause for getting Pokemon IDs
  static getByIdsWhere(pokemonIds: string[]): Prisma.PokemonWhereInput {
    return {
      id: {
        in: pokemonIds,
      },
    }
  }
} 