import { Prisma } from "@prisma/client"

export class PokemonTypeQuery {
  // Basic include for Pokemon Type
  static getInclude(): Prisma.PokemonTypeInclude {
    return {
      pokemon: true,
      _count: {
        select: {
          pokemon: true,
        },
      },
    }
  }

  // Where clause for active/available types
  static getActiveWhere(): Prisma.PokemonTypeWhereInput {
    return {
      // All types are considered active for now
    }
  }

  // Order by for consistent sorting
  static getOrderBy(): Prisma.PokemonTypeOrderByWithRelationInput[] {
    return [
      { name: "asc" },
    ]
  }
} 