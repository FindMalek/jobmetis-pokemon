import { Pokemon as PrismaPokemon, PokemonType as PrismaPokemonType } from "@prisma/client"
import { PokemonTypeEntity, PokemonTypeRo } from "../pokemon-type"

// Pokemon with type information
type PokemonWithType = PrismaPokemon & {
  type: PrismaPokemonType
}

// Return Object for Pokemon
export interface PokemonRo {
  id: string
  name: string
  image: string
  power: number
  life: number
  type: PokemonTypeRo
}

// Battle Pokemon (with current life during battle)
export interface BattlePokemonRo extends PokemonRo {
  currentLife: number
  isDefeated: boolean
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

  // Convert Pokemon to Battle Pokemon
  static toBattlePokemon(pokemon: PokemonRo): BattlePokemonRo {
    return {
      ...pokemon,
      currentLife: pokemon.life,
      isDefeated: false,
    }
  }

  // Apply damage to Pokemon in battle
  static applyDamage(battlePokemon: BattlePokemonRo, damage: number): BattlePokemonRo {
    const newLife = Math.max(0, battlePokemon.currentLife - damage)
    return {
      ...battlePokemon,
      currentLife: newLife,
      isDefeated: newLife <= 0,
    }
  }

  // Check if Pokemon is valid (within power/life constraints)
  static isValidStats(power: number, life: number): boolean {
    return (
      power >= 10 && power <= 100 &&
      life >= 10 && life <= 100
    )
  }

  // Get Pokemon rarity based on total stats
  static getRarity(pokemon: PokemonRo): "common" | "uncommon" | "rare" | "legendary" {
    const totalStats = pokemon.power + pokemon.life
    if (totalStats >= 160) return "legendary"
    if (totalStats >= 130) return "rare"
    if (totalStats >= 100) return "uncommon"
    return "common"
  }
} 