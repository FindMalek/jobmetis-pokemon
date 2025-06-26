import {
  BattlePokemonRo,
  BattleResultRo,
  BattleRoundRo,
  BattleTeamRo,
  PokemonRo,
  TeamRo,
} from "@/schemas"
import { Weakness as PrismaWeakness } from "@prisma/client"

export class BattleEntity {
  // Convert Pokemon to Battle Pokemon format
  static pokemonToBattlePokemon(
    pokemon: PokemonRo,
    currentLife?: number,
    isDefeated = false
  ): BattlePokemonRo {
    return {
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      image: pokemon.image,
      power: pokemon.power,
      life: pokemon.life,
      isDefeated,
      currentLife: currentLife ?? pokemon.life,
    }
  }

  // Convert Team to Battle Team format
  static teamToBattleTeam(team: TeamRo): BattleTeamRo {
    return {
      id: team.id,
      name: team.name,
      members: team.members,
      currentPokemonIndex: 0,
      defeatedCount: 0,
      isDefeated: false,
    }
  }

  // Create a battle round result
  static createBattleRound(params: {
    roundNumber: number
    pokemon1: BattlePokemonRo
    pokemon2: BattlePokemonRo
    damage1: number
    damage2: number
    typeEffectiveness1: number
    typeEffectiveness2: number
    winner?: "pokemon1" | "pokemon2" | "draw"
    defeated?: ("pokemon1" | "pokemon2")[]
  }): BattleRoundRo {
    return {
      roundNumber: params.roundNumber,
      pokemon1: params.pokemon1,
      pokemon2: params.pokemon2,
      damage1: params.damage1,
      damage2: params.damage2,
      typeEffectiveness1: params.typeEffectiveness1,
      typeEffectiveness2: params.typeEffectiveness2,
      winner: params.winner,
      defeated: params.defeated,
    }
  }

  // Create a complete battle result
  static createBattleResult(params: {
    team1: BattleTeamRo
    team2: BattleTeamRo
    rounds: BattleRoundRo[]
    winner?: "team1" | "team2"
    battleDuration: number
  }): BattleResultRo {
    return {
      id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      team1: params.team1,
      team2: params.team2,
      rounds: params.rounds,
      winner: params.winner,
      totalRounds: params.rounds.length,
      battleDuration: params.battleDuration,
      createdAt: new Date(),
    }
  }

  // Calculate damage based on power and type effectiveness
  static calculateDamage(attackerPower: number, effectiveness: number): number {
    return Math.floor(attackerPower * effectiveness)
  }

  // Determine battle winner based on damage
  static determineBattleWinner(
    damage1: number,
    damage2: number
  ): "team1" | "team2" | undefined {
    if (damage1 > damage2) return "team1"
    if (damage2 > damage1) return "team2"
    return undefined
  }

  // Determine round winner
  static determineRoundWinner(
    damage1: number,
    damage2: number
  ): "pokemon1" | "pokemon2" | "draw" | undefined {
    if (damage1 > damage2) return "pokemon1"
    if (damage2 > damage1) return "pokemon2"
    if (damage1 === damage2) return "draw"
    return undefined
  }

  // Get type effectiveness factor from weakness data
  static getEffectivenessFactor(weakness: PrismaWeakness | null): number {
    return weakness?.factor ?? 1.0
  }

  // Convert weakness to type chart entry (simplified without type includes)
  static weaknessToTypeChart(weakness: PrismaWeakness) {
    return {
      attackerType: weakness.type1Id,
      defenderType: weakness.type2Id,
      factor: weakness.factor,
    }
  }
}
