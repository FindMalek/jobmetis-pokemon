import {
  BattlePokemonRo,
  PokemonListItemRo,
  PokemonRo,
  PokemonWithStatsRo,
} from "@/schemas"
import {
  Pokemon as PrismaPokemon,
  PokemonType as PrismaPokemonType,
} from "@prisma/client"

import { PokemonTypeEntity } from "../pokemon-type"

// Pokemon with type information
type PokemonWithType = PrismaPokemon & {
  type: PrismaPokemonType
}

export class PokemonEntity {
  // Convert Prisma model to RO
  static fromPrisma(prismaPokemon: PokemonWithType): PokemonRo {
    return {
      id: prismaPokemon.id,
      name: prismaPokemon.name,
      image: prismaPokemon.image,
      power: prismaPokemon.power,
      life: prismaPokemon.life,
      type: PokemonTypeEntity.fromPrisma(prismaPokemon.type),
    }
  }

  // Convert to list item (lighter weight for lists)
  static fromPrismaToListItem(
    prismaPokemon: PokemonWithType
  ): PokemonListItemRo {
    return {
      id: prismaPokemon.id,
      name: prismaPokemon.name,
      image: prismaPokemon.image,
      power: prismaPokemon.power,
      life: prismaPokemon.life,
      typeName: PokemonTypeEntity.enumToDisplayName(prismaPokemon.type.name),
      typeColor: PokemonTypeEntity.getTypeColor(prismaPokemon.type.name),
    }
  }

  // Convert to Pokemon with stats
  static fromPrismaWithStats(
    prismaPokemon: PokemonWithType & {
      _count?: { teamMemberships: number }
    }
  ): PokemonWithStatsRo {
    const baseRo = this.fromPrisma(prismaPokemon)
    return {
      ...baseRo,
      rarity: this.getRarity(baseRo),
      totalStats: baseRo.power + baseRo.life,
      usageCount: prismaPokemon._count?.teamMemberships || 0,
    }
  }

  // Convert Pokemon to Battle Pokemon
  static toBattlePokemon(pokemon: PokemonRo): BattlePokemonRo {
    return {
      ...pokemon,
      currentLife: pokemon.life,
      isDefeated: false,
    }
  }

  // Apply damage to Pokemon in battle
  static applyDamage(
    battlePokemon: BattlePokemonRo,
    damage: number
  ): BattlePokemonRo {
    const newLife = Math.max(0, battlePokemon.currentLife - damage)
    return {
      ...battlePokemon,
      currentLife: newLife,
      isDefeated: newLife <= 0,
    }
  }

  // Check if Pokemon is valid (within power/life constraints)
  static isValidStats(power: number, life: number): boolean {
    return power >= 10 && power <= 100 && life >= 10 && life <= 100
  }

  // Get Pokemon rarity based on total stats
  static getRarity(
    pokemon: PokemonRo
  ): "common" | "uncommon" | "rare" | "legendary" {
    const totalStats = pokemon.power + pokemon.life
    if (totalStats >= 160) return "legendary"
    if (totalStats >= 130) return "rare"
    if (totalStats >= 100) return "uncommon"
    return "common"
  }
}
