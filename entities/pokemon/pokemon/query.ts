import { Prisma } from "@prisma/client"

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

  // Where clause for filtering by type
  static getByTypeWhere(typeName: string): Prisma.PokemonWhereInput {
    return {
      type: {
        name: typeName.toUpperCase() as any,
      },
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

  // Where clause for searching by name
  static getByNameWhere(searchTerm: string): Prisma.PokemonWhereInput {
    return {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }
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
} 