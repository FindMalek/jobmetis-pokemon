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
    try {
      console.log("🔧 Initializing battle with teams:", {
        team1: {
          id: team1.id,
          name: team1.name,
          membersCount: team1.members.length,
        },
        team2: {
          id: team2.id,
          name: team2.name,
          membersCount: team2.members.length,
        },
      })

      const battleId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      const battleState = {
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

      console.log("✅ Battle initialized successfully:", battleId)
      return battleState
    } catch (error) {
      console.error("💥 Error initializing battle:", error)
      throw new Error(
        `Failed to initialize battle: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  /**
   * Convert team to battle team with combat stats
   */
  private static initializeBattleTeam(team: TeamRo): BattleTeam {
    try {
      console.log(
        `🎯 Initializing battle team: ${team.name} (${team.members.length} members)`
      )

      if (!team.members || team.members.length === 0) {
        throw new Error(`Team ${team.name} has no members`)
      }

      if (team.members.length !== 6) {
        throw new Error(
          `Team ${team.name} must have exactly 6 members, has ${team.members.length}`
        )
      }

      const battleTeam = {
        id: team.id,
        name: team.name,
        pokemon: team.members.map((pokemon, index) => {
          if (!pokemon) {
            throw new Error(
              `Team ${team.name} has null/undefined member at position ${index}`
            )
          }
          if (!pokemon.id || !pokemon.name) {
            throw new Error(
              `Team ${team.name} has invalid member at position ${index}: missing id or name`
            )
          }
          if (
            typeof pokemon.power !== "number" ||
            typeof pokemon.life !== "number"
          ) {
            throw new Error(
              `Team ${team.name} member ${pokemon.name} has invalid power/life values`
            )
          }

          return {
            ...pokemon,
            currentLife: pokemon.life,
            maxLife: pokemon.life,
            isDefeated: false,
            totalDamageDealt: 0,
            totalDamageTaken: 0,
          }
        }),
        currentPokemonIndex: 0,
        defeatedCount: 0,
        isDefeated: false,
      }

      console.log(`✅ Battle team initialized: ${team.name}`)
      return battleTeam
    } catch (error) {
      console.error(`💥 Error initializing battle team ${team.name}:`, error)
      throw error
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
    try {
      if (typeof attacker.power !== "number") {
        throw new Error(
          `Attacker ${attacker.name} has invalid power: ${attacker.power}`
        )
      }
      if (typeof typeEffectiveness !== "number" || typeEffectiveness < 0) {
        throw new Error(`Invalid type effectiveness: ${typeEffectiveness}`)
      }

      // Base damage formula: attacker's power * type effectiveness * random factor
      const baseDamage = attacker.power * typeEffectiveness
      const randomFactor = 0.85 + Math.random() * 0.3 // 85-115% variance
      const finalDamage = Math.floor(baseDamage * randomFactor)

      return Math.max(1, finalDamage) // Minimum 1 damage
    } catch (error) {
      console.error("💥 Error calculating damage:", error)
      return 1 // Fallback to 1 damage
    }
  }

  /**
   * Apply damage to a Pokemon and update its state
   */
  static applyDamage(pokemon: BattlePokemon, damage: number): BattlePokemon {
    try {
      if (typeof damage !== "number" || damage < 0) {
        throw new Error(`Invalid damage value: ${damage}`)
      }

      const newCurrentLife = Math.max(0, pokemon.currentLife - damage)
      const isDefeated = newCurrentLife === 0

      return {
        ...pokemon,
        currentLife: newCurrentLife,
        isDefeated,
        totalDamageTaken: pokemon.totalDamageTaken + damage,
      }
    } catch (error) {
      console.error(`💥 Error applying damage to ${pokemon.name}:`, error)
      return pokemon // Return unchanged on error
    }
  }

  /**
   * Get the current active Pokemon for a team
   */
  static getActivePokemon(team: BattleTeam): BattlePokemon | null {
    try {
      if (!team.pokemon || team.pokemon.length === 0) {
        console.warn(`Team ${team.name} has no Pokemon`)
        return null
      }

      if (team.currentPokemonIndex >= team.pokemon.length) {
        console.warn(
          `Team ${team.name} currentPokemonIndex ${team.currentPokemonIndex} is out of bounds`
        )
        return null
      }

      const pokemon = team.pokemon[team.currentPokemonIndex]
      if (!pokemon) {
        console.warn(
          `Team ${team.name} has null Pokemon at index ${team.currentPokemonIndex}`
        )
        return null
      }

      return pokemon.isDefeated ? null : pokemon
    } catch (error) {
      console.error(
        `💥 Error getting active Pokemon for team ${team.name}:`,
        error
      )
      return null
    }
  }

  /**
   * Switch to next available Pokemon
   */
  static switchToNextPokemon(team: BattleTeam): BattleTeam {
    try {
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

      // If team is defeated, keep currentPokemonIndex at last valid index (5)
      // to satisfy schema validation (max 5)
      const finalIndex = isDefeated ? team.pokemon.length - 1 : nextIndex

      return {
        ...team,
        currentPokemonIndex: finalIndex,
        defeatedCount,
        isDefeated,
      }
    } catch (error) {
      console.error(`💥 Error switching Pokemon for team ${team.name}:`, error)
      return team // Return unchanged on error
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
    try {
      console.log(`⚔️ Executing round ${battleState.currentRound}`)

      const pokemon1 = this.getActivePokemon(battleState.team1)
      const pokemon2 = this.getActivePokemon(battleState.team2)

      if (!pokemon1 || !pokemon2) {
        console.log("🏁 Battle ending: no active Pokemon")
        return { ...battleState, isComplete: true }
      }

      console.log(`🥊 ${pokemon1.name} vs ${pokemon2.name}`)

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

      console.log(
        `💥 Damage: ${pokemon1.name} deals ${damage1to2}, ${pokemon2.name} deals ${damage2to1}`
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
        console.log(`💀 ${pokemon1.name} defeated!`)
        updatedTeam1 = this.switchToNextPokemon(updatedTeam1)
      }
      if (updatedPokemon2.isDefeated) {
        console.log(`💀 ${pokemon2.name} defeated!`)
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

      if (isComplete) {
        console.log(`🏆 Battle complete! Winner: ${winner}`)
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
    } catch (error) {
      console.error(
        `💥 Error executing round ${battleState.currentRound}:`,
        error
      )
      throw new Error(
        `Round execution failed: ${error instanceof Error ? error.message : "Unknown error"}`
      )
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
    try {
      console.log("🚀 Starting complete battle simulation")

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
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      console.log("🏁 Battle simulation complete:", {
        winner: battleState.winner,
        rounds: battleState.rounds.length,
        duration: battleState.battleDuration,
      })

      return battleState
    } catch (error) {
      console.error("💥 Error in complete battle simulation:", error)
      throw new Error(
        `Battle simulation failed: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }
}
