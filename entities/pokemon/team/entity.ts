import { Team as PrismaTeam, TeamMember as PrismaTeamMember, Pokemon as PrismaPokemon, PokemonType as PrismaPokemonType } from "@prisma/client"
import { PokemonEntity, PokemonRo } from "../pokemon"

// Team member with full Pokemon data
type TeamMemberWithPokemon = PrismaTeamMember & {
  pokemon: PrismaPokemon & {
    type: PrismaPokemonType
  }
}

// Team with members
type TeamWithMembers = PrismaTeam & {
  members: TeamMemberWithPokemon[]
}

// Return Object for Team
export interface TeamRo {
  id: string
  name: string
  totalPower: number
  members: PokemonRo[]
  createdAt: Date
  updatedAt: Date
}

// Battle Team (for battle simulation)
export interface BattleTeamRo {
  id: string
  name: string
  members: PokemonRo[]
  currentPokemonIndex: number
  defeatedCount: number
  isDefeated: boolean
}

export class TeamEntity {
  // Convert Prisma model to RO
  static fromPrisma(prismaTeam: TeamWithMembers): TeamRo {
    const sortedMembers = prismaTeam.members
      .sort((a, b) => a.position - b.position)
      .map(member => PokemonEntity.fromPrisma(member.pokemon))

    return {
      id: prismaTeam.id,
      name: prismaTeam.name,
      totalPower: prismaTeam.totalPower,
      members: sortedMembers,
      createdAt: prismaTeam.createdAt,
      updatedAt: prismaTeam.updatedAt,
    }
  }

  // Convert Team to Battle Team
  static toBattleTeam(team: TeamRo): BattleTeamRo {
    return {
      id: team.id,
      name: team.name,
      members: team.members,
      currentPokemonIndex: 0,
      defeatedCount: 0,
      isDefeated: false,
    }
  }

  // Calculate total power from Pokemon array
  static calculateTotalPower(pokemon: PokemonRo[]): number {
    return pokemon.reduce((total, p) => total + p.power, 0)
  }

  // Validate team (must have exactly 6 Pokemon)
  static isValidTeam(pokemon: PokemonRo[]): boolean {
    return pokemon.length === 6
  }

  // Get next active Pokemon for battle
  static getNextActivePokemon(battleTeam: BattleTeamRo): PokemonRo | null {
    if (battleTeam.currentPokemonIndex >= battleTeam.members.length) {
      return null
    }
    return battleTeam.members[battleTeam.currentPokemonIndex]
  }

  // Switch to next Pokemon in battle
  static switchToNextPokemon(battleTeam: BattleTeamRo): BattleTeamRo {
    const newIndex = battleTeam.currentPokemonIndex + 1
    const defeatedCount = battleTeam.defeatedCount + 1
    
    return {
      ...battleTeam,
      currentPokemonIndex: newIndex,
      defeatedCount,
      isDefeated: newIndex >= battleTeam.members.length,
    }
  }
} 