import type { PokemonRo } from "@/schemas/pokemon"

export class PokemonService {
  /**
   * Generates fallback image URL for Pokemon
   */
  static getFallbackImageUrl(pokemonName: string): string {
    return `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemonName}`
  }

  /**
   * Determines Pokemon power level category
   */
  static getPowerLevel(power: number): { level: string; color: string } {
    if (power >= 80) return { level: "Legendary", color: "text-yellow-600" }
    if (power >= 60) return { level: "Strong", color: "text-green-600" }
    if (power >= 40) return { level: "Average", color: "text-blue-600" }
    return { level: "Weak", color: "text-gray-600" }
  }

  /**
   * Calculates battle effectiveness against another Pokemon
   */
  static calculateEffectiveness(
    attacker: PokemonRo,
    defender: PokemonRo,
    typeChart: Array<{
      attackerType: string
      defenderType: string
      factor: number
    }>
  ): number {
    const effectiveness = typeChart.find(
      (entry) =>
        entry.attackerType === attacker.type.id &&
        entry.defenderType === defender.type.id
    )
    return effectiveness?.factor ?? 1.0
  }

  /**
   * Formats Pokemon stats for display
   */
  static formatStats(pokemon: PokemonRo): {
    power: string
    life: string
    total: string
  } {
    return {
      power: `⚡${pokemon.power}`,
      life: `❤️${pokemon.life}`,
      total: `${pokemon.power + pokemon.life}`,
    }
  }
}
