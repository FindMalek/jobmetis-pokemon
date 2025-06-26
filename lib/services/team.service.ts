import type { TeamRo } from "@/schemas/team"

export class TeamService {
  /**
   * Validates if a team is battle ready (has exactly 6 Pokemon)
   */
  static isBattleReady(team: TeamRo): boolean {
    return team.members.length === 6
  }

  /**
   * Calculates average power of a team
   */
  static getAveragePower(team: TeamRo): number {
    if (team.members.length === 0) return 0
    return Math.round(team.totalPower / team.members.length)
  }

  /**
   * Gets team validation errors
   */
  static getValidationErrors(team: { members: unknown[] }): string[] {
    const errors: string[] = []

    if (team.members.length === 0) {
      errors.push("Team must have at least 1 Pokemon")
    }

    if (team.members.length > 6) {
      errors.push("Team cannot have more than 6 Pokemon")
    }

    return errors
  }

  /**
   * Checks if team can battle
   */
  static canBattle(team: TeamRo): { canBattle: boolean; reason?: string } {
    if (!this.isBattleReady(team)) {
      return {
        canBattle: false,
        reason: "Team must have exactly 6 Pokemon to battle",
      }
    }

    return { canBattle: true }
  }

  /**
   * Generates battle arena URL with pre-selected team
   */
  static getBattleUrl(teamId: string): string {
    return `/dashboard/battle?team=${teamId}`
  }
}
