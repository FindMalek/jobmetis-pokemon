import type { TeamRo } from "@/schemas/team"

export class BattleService {
  /**
   * Validates if two teams can battle
   */
  static canStartBattle(
    team1: TeamRo,
    team2: TeamRo
  ): {
    canBattle: boolean
    reason?: string
  } {
    if (team1.id === team2.id) {
      return {
        canBattle: false,
        reason: "A team cannot battle against itself",
      }
    }

    if (team1.members.length !== 6) {
      return {
        canBattle: false,
        reason: `${team1.name} must have exactly 6 Pokemon`,
      }
    }

    if (team2.members.length !== 6) {
      return {
        canBattle: false,
        reason: `${team2.name} must have exactly 6 Pokemon`,
      }
    }

    return { canBattle: true }
  }

  /**
   * Predicts battle outcome based on total power
   */
  static predictOutcome(
    team1: TeamRo,
    team2: TeamRo
  ): {
    favorite: TeamRo
    underdog: TeamRo
    powerDifference: number
    confidence: string
  } {
    const powerDiff = Math.abs(team1.totalPower - team2.totalPower)
    const favorite = team1.totalPower > team2.totalPower ? team1 : team2
    const underdog = team1.totalPower > team2.totalPower ? team2 : team1

    let confidence = "Even match"
    if (powerDiff > 100) confidence = "Strong favorite"
    else if (powerDiff > 50) confidence = "Slight favorite"

    return {
      favorite,
      underdog,
      powerDifference: powerDiff,
      confidence,
    }
  }

  /**
   * Formats battle duration
   */
  static formatBattleDuration(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000)
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }
}
