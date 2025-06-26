import { PokemonTypeRo, PokemonTypeWithStatsRo } from "@/schemas"
import { PokemonTypeEnum } from "@prisma/client"

import { PokemonTypeWithPokemonDbData } from "./query"

export class PokemonTypeEntity {
  // Convert Prisma model to RO
  static fromPrisma(prismaType: PokemonTypeWithPokemonDbData): PokemonTypeRo {
    return {
      id: prismaType.id,
      name: this.enumToString(prismaType.name),
      displayName: this.enumToDisplayName(prismaType.name),
      color: this.getTypeColor(prismaType.name),
    }
  }

  // Create basic type RO from minimal type data
  static fromBasicTypeData(basicType: {
    id: string
    name: PokemonTypeEnum
  }): PokemonTypeRo {
    return {
      id: basicType.id,
      name: this.enumToDisplayName(basicType.name),
      displayName: this.enumToDisplayName(basicType.name),
      color: this.getTypeColor(basicType.name),
    }
  }

  // Convert Prisma model with stats to RO
  static fromPrismaWithStats(
    prismaType: PokemonTypeWithPokemonDbData
  ): PokemonTypeWithStatsRo {
    const avgPower =
      prismaType.pokemon.length > 0
        ? prismaType.pokemon.reduce((sum, p) => sum + p.power, 0) /
          prismaType.pokemon.length
        : 0

    const avgLife =
      prismaType.pokemon.length > 0
        ? prismaType.pokemon.reduce((sum, p) => sum + p.life, 0) /
          prismaType.pokemon.length
        : 0

    return {
      ...this.fromPrisma(prismaType),
      pokemonCount: prismaType._count.pokemon,
      averagePower: Math.round(avgPower),
      averageLife: Math.round(avgLife),
    }
  }

  // Convert enum to string for frontend
  static enumToString(enumValue: PokemonTypeEnum): string {
    return enumValue.toLowerCase()
  }

  // Convert string to enum for database operations
  static stringToEnum(stringValue: string): PokemonTypeEnum {
    const upperValue = stringValue.toUpperCase() as keyof typeof PokemonTypeEnum
    return PokemonTypeEnum[upperValue]
  }

  // Convert enum to display name
  static enumToDisplayName(enumValue: PokemonTypeEnum): string {
    switch (enumValue) {
      case PokemonTypeEnum.FIRE:
        return "Fire"
      case PokemonTypeEnum.WATER:
        return "Water"
      case PokemonTypeEnum.GRASS:
        return "Grass"
    }
  }

  // Get type effectiveness color for UI
  static getTypeColor(enumValue: PokemonTypeEnum): string {
    switch (enumValue) {
      case PokemonTypeEnum.FIRE:
        return "#ff6b6b" // Red
      case PokemonTypeEnum.WATER:
        return "#4fc3f7" // Blue
      case PokemonTypeEnum.GRASS:
        return "#66bb6a" // Green
      default:
        return "#757575" // Gray
    }
  }
}
