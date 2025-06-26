import type { BattleRoundRo } from "@/schemas/battle"
import type { PokemonRo } from "@/schemas/pokemon"
import type { TeamRo } from "@/schemas/team"

export interface BattlePokemon extends PokemonRo {
  currentLife: number
  maxLife: number
  isDefeated: boolean
  totalDamageDealt: number
  totalDamageTaken: number
}

export interface BattleTeam {
  id: string
  name: string
  pokemon: BattlePokemon[]
  currentPokemonIndex: number
  defeatedCount: number
  isDefeated: boolean
}

export interface BattleState {
  id: string
  team1: BattleTeam
  team2: BattleTeam
  currentRound: number
  rounds: BattleRoundRo[]
  winner: "team1" | "team2" | null
  isComplete: boolean
  battleDuration: number
  startTime: number
}

export interface BattleAction {
  type: "attack" | "switch" | "defend"
  pokemonId: string
  targetId?: string
  damage?: number
  effectiveness?: number
}

export class BattleEngineService {
  /**
   * Initialize battle state from two teams
   */
  static initializeBattle(team1: TeamRo, team2: TeamRo): BattleState {
    const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    return {
      id: battleId,
      team1: this.initializeBattleTeam(team1),
      team2: this.initializeBattleTeam(team2),
      currentRound: 1,
      rounds: [],
      winner: null,
      isComplete: false,
      battleDuration: 0,
      startTime: Date.now(),
    }
  }

  /**
   * Convert team to battle team with combat stats
   */
  private static initializeBattleTeam(team: TeamRo): BattleTeam {
    return {
      id: team.id,
      name: team.name,
      pokemon: team.members.map((pokemon) => ({
        ...pokemon,
        currentLife: pokemon.life,
        maxLife: pokemon.life,
        isDefeated: false,
        totalDamageDealt: 0,
        totalDamageTaken: 0,
      })),
      currentPokemonIndex: 0,
      defeatedCount: 0,
      isDefeated: false,
    }
  }

  /**
   * Calculate damage between two Pokemon with type effectiveness
   */
  static calculateDamage(
    attacker: BattlePokemon,
    defender: BattlePokemon,
    typeEffectiveness: number = 1.0
  ): number {
    // Base damage formula: attacker's power * type effectiveness * random factor
    const baseDamage = attacker.power * typeEffectiveness
    const randomFactor = 0.85 + Math.random() * 0.3 // 85-115% variance
    const finalDamage = Math.floor(baseDamage * randomFactor)

    return Math.max(1, finalDamage) // Minimum 1 damage
  }

  /**
   * Apply damage to a Pokemon and update its state
   */
  static applyDamage(pokemon: BattlePokemon, damage: number): BattlePokemon {
    const newCurrentLife = Math.max(0, pokemon.currentLife - damage)
    const isDefeated = newCurrentLife === 0

    return {
      ...pokemon,
      currentLife: newCurrentLife,
      isDefeated,
      totalDamageTaken: pokemon.totalDamageTaken + damage,
    }
  }

  /**
   * Get the current active Pokemon for a team
   */
  static getActivePokemon(team: BattleTeam): BattlePokemon | null {
    if (team.currentPokemonIndex >= team.pokemon.length) return null

    const pokemon = team.pokemon[team.currentPokemonIndex]
    return pokemon.isDefeated ? null : pokemon
  }

  /**
   * Switch to next available Pokemon
   */
  static switchToNextPokemon(team: BattleTeam): BattleTeam {
    let nextIndex = team.currentPokemonIndex + 1

    // Find next non-defeated Pokemon
    while (
      nextIndex < team.pokemon.length &&
      team.pokemon[nextIndex].isDefeated
    ) {
      nextIndex++
    }

    const defeatedCount = team.pokemon.filter((p) => p.isDefeated).length
    const isDefeated = nextIndex >= team.pokemon.length

    return {
      ...team,
      currentPokemonIndex: nextIndex,
      defeatedCount,
      isDefeated,
    }
  }

  /**
   * Execute a battle round between two active Pokemon
   */
  static executeRound(
    battleState: BattleState,
    type1Effectiveness: number,
    type2Effectiveness: number
  ): BattleState {
    const pokemon1 = this.getActivePokemon(battleState.team1)
    const pokemon2 = this.getActivePokemon(battleState.team2)

    if (!pokemon1 || !pokemon2) {
      return { ...battleState, isComplete: true }
    }

    // Calculate damage for both Pokemon
    const damage1to2 = this.calculateDamage(
      pokemon1,
      pokemon2,
      type1Effectiveness
    )
    const damage2to1 = this.calculateDamage(
      pokemon2,
      pokemon1,
      type2Effectiveness
    )

    // Apply damage
    const updatedPokemon1 = this.applyDamage(pokemon1, damage2to1)
    const updatedPokemon2 = this.applyDamage(pokemon2, damage1to2)

    // Update team states
    let updatedTeam1 = { ...battleState.team1 }
    let updatedTeam2 = { ...battleState.team2 }

    updatedTeam1.pokemon[updatedTeam1.currentPokemonIndex] = updatedPokemon1
    updatedTeam2.pokemon[updatedTeam2.currentPokemonIndex] = updatedPokemon2

    // Check for defeats and switch Pokemon if needed
    if (updatedPokemon1.isDefeated) {
      updatedTeam1 = this.switchToNextPokemon(updatedTeam1)
    }
    if (updatedPokemon2.isDefeated) {
      updatedTeam2 = this.switchToNextPokemon(updatedTeam2)
    }

    // Determine round winner
    let roundWinner: "pokemon1" | "pokemon2" | "draw"
    if (updatedPokemon1.isDefeated && updatedPokemon2.isDefeated) {
      roundWinner = "draw"
    } else if (updatedPokemon1.isDefeated) {
      roundWinner = "pokemon2"
    } else if (updatedPokemon2.isDefeated) {
      roundWinner = "pokemon1"
    } else {
      roundWinner = damage1to2 > damage2to1 ? "pokemon1" : "pokemon2"
    }

    // Create round result
    const round: BattleRoundRo = {
      roundNumber: battleState.currentRound,
      pokemon1: {
        id: pokemon1.id,
        name: pokemon1.name,
        type: pokemon1.type,
        image: pokemon1.image,
        power: pokemon1.power,
        life: pokemon1.maxLife,
        currentLife: updatedPokemon1.currentLife,
        isDefeated: updatedPokemon1.isDefeated,
      },
      pokemon2: {
        id: pokemon2.id,
        name: pokemon2.name,
        type: pokemon2.type,
        image: pokemon2.image,
        power: pokemon2.power,
        life: pokemon2.maxLife,
        currentLife: updatedPokemon2.currentLife,
        isDefeated: updatedPokemon2.isDefeated,
      },
      damage1: damage1to2,
      damage2: damage2to1,
      typeEffectiveness1: type1Effectiveness,
      typeEffectiveness2: type2Effectiveness,
      winner: roundWinner,
    }

    // Determine battle winner
    let winner: "team1" | "team2" | null = null
    let isComplete = false

    if (updatedTeam1.isDefeated && updatedTeam2.isDefeated) {
      winner =
        updatedTeam1.defeatedCount < updatedTeam2.defeatedCount
          ? "team1"
          : "team2"
      isComplete = true
    } else if (updatedTeam1.isDefeated) {
      winner = "team2"
      isComplete = true
    } else if (updatedTeam2.isDefeated) {
      winner = "team1"
      isComplete = true
    }

    return {
      ...battleState,
      team1: updatedTeam1,
      team2: updatedTeam2,
      currentRound: battleState.currentRound + 1,
      rounds: [...battleState.rounds, round],
      winner,
      isComplete,
      battleDuration: Date.now() - battleState.startTime,
    }
  }

  /**
   * Calculate health percentage for UI
   */
  static getHealthPercentage(pokemon: BattlePokemon): number {
    return Math.max(
      0,
      Math.round((pokemon.currentLife / pokemon.maxLife) * 100)
    )
  }

  /**
   * Get health bar color based on percentage
   */
  static getHealthBarColor(percentage: number): string {
    if (percentage > 60) return "bg-green-500"
    if (percentage > 30) return "bg-yellow-500"
    if (percentage > 15) return "bg-orange-500"
    return "bg-red-500"
  }

  /**
   * Get type effectiveness message
   */
  static getEffectivenessMessage(factor: number): string {
    if (factor >= 2.0) return "Super effective!"
    if (factor >= 1.5) return "It's effective!"
    if (factor <= 0.5) return "Not very effective..."
    if (factor <= 0.25) return "It barely affected the opponent!"
    return ""
  }

  /**
   * Simulate complete battle automatically
   */
  static async simulateCompleteBattle(
    team1: TeamRo,
    team2: TeamRo,
    getTypeEffectiveness: (
      attacker: string,
      defender: string
    ) => Promise<number>
  ): Promise<BattleState> {
    let battleState = this.initializeBattle(team1, team2)

    while (!battleState.isComplete && battleState.currentRound <= 50) {
      const pokemon1 = this.getActivePokemon(battleState.team1)
      const pokemon2 = this.getActivePokemon(battleState.team2)

      if (!pokemon1 || !pokemon2) break

      const effectiveness1to2 = await getTypeEffectiveness(
        pokemon1.type.id,
        pokemon2.type.id
      )
      const effectiveness2to1 = await getTypeEffectiveness(
        pokemon2.type.id,
        pokemon1.type.id
      )

      battleState = this.executeRound(
        battleState,
        effectiveness1to2,
        effectiveness2to1
      )

      // Add small delay for realistic battle pacing
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    return battleState
  }
}
