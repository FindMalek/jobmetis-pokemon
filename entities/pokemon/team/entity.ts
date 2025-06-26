import { BattleTeamRo, TeamListItemRo, TeamRo, TeamSummaryRo } from "@/schemas"
import {
  Pokemon as PrismaPokemon,
  PokemonType as PrismaPokemonType,
  Team as PrismaTeam,
  TeamMember as PrismaTeamMember,
} from "@prisma/client"

import { PokemonEntity } from "../pokemon"

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

export class TeamEntity {
  // Convert Prisma model to RO
  static fromPrisma(prismaTeam: TeamWithMembers): TeamRo {
    const sortedMembers = prismaTeam.members
      .sort((a, b) => a.position - b.position)
      .map((member) => PokemonEntity.fromPrisma(member.pokemon))

    return {
      id: prismaTeam.id,
      name: prismaTeam.name,
      totalPower: prismaTeam.totalPower,
      members: sortedMembers,
      createdAt: prismaTeam.createdAt,
      updatedAt: prismaTeam.updatedAt,
    }
  }

  // Convert to summary (lighter weight)
  static fromPrismaToSummary(prismaTeam: TeamWithMembers): TeamSummaryRo {
    return {
      id: prismaTeam.id,
      name: prismaTeam.name,
      totalPower: prismaTeam.totalPower,
      memberCount: prismaTeam.members.length,
      createdAt: prismaTeam.createdAt,
      updatedAt: prismaTeam.updatedAt,
    }
  }

  // Convert to list item (for team lists)
  static fromPrismaToListItem(prismaTeam: TeamWithMembers): TeamListItemRo {
    const memberPreviews = prismaTeam.members
      .slice(0, 3) // Take first 3 Pokemon
      .map((member) => ({
        name: member.pokemon.name,
        image: member.pokemon.image,
        typeName: member.pokemon.type.name.toLowerCase(),
      }))

    return {
      id: prismaTeam.id,
      name: prismaTeam.name,
      totalPower: prismaTeam.totalPower,
      memberPreviews,
      createdAt: prismaTeam.createdAt,
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
  static calculateTotalPower(pokemon: Array<{ power: number }>): number {
    return pokemon.reduce((total, p) => total + p.power, 0)
  }

  // Validate team (must have exactly 6 Pokemon)
  static isValidTeam(pokemonIds: string[]): boolean {
    return pokemonIds.length === 6
  }

  // Get next active Pokemon for battle
  static getNextActivePokemon(
    battleTeam: BattleTeamRo
  ): TeamRo["members"][0] | null {
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
