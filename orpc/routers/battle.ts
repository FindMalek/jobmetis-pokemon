import { TeamEntity, TeamQuery } from "@/entities"
import { database } from "@/prisma/client"
import {
  BattleResultRo,
  battleResultRoSchema,
  BattleSummaryRo,
  battleSummaryRoSchema,
  StartBattleDto,
  startBattleDtoSchema,
} from "@/schemas/battle"
import { os } from "@orpc/server"
import { z } from "zod"

import { BattleEngineService } from "@/lib/services"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// Helper function to get type effectiveness
async function getTypeEffectiveness(
  attackerTypeId: string,
  defenderTypeId: string
): Promise<number> {
  const weakness = await database.weakness.findFirst({
    where: {
      type1Id: attackerTypeId,
      type2Id: defenderTypeId,
    },
  })

  return weakness?.factor ?? 1.0
}

// Start a battle between two teams with advanced simulation
export const startBattle = publicProcedure
  .input(startBattleDtoSchema)
  .output(battleResultRoSchema)
  .handler(async ({ input }): Promise<BattleResultRo> => {
    const { team1Id, team2Id } = input

    if (team1Id === team2Id) {
      throw new Error("A team cannot battle against itself")
    }

    // Fetch teams using proper query includes
    const [team1Prisma, team2Prisma] = await Promise.all([
      database.team.findUnique({
        where: { id: team1Id },
        include: TeamQuery.getInclude(),
      }),
      database.team.findUnique({
        where: { id: team2Id },
        include: TeamQuery.getInclude(),
      }),
    ])

    if (!team1Prisma || !team2Prisma) {
      throw new Error("One or both teams not found")
    }

    if (team1Prisma.members.length !== 6 || team2Prisma.members.length !== 6) {
      throw new Error("Both teams must have exactly 6 Pokemon")
    }

    // Convert to RO using entity converters
    const team1Ro = TeamEntity.fromPrisma(team1Prisma)
    const team2Ro = TeamEntity.fromPrisma(team2Prisma)

    // Use advanced battle engine for complete simulation
    const battleState = await BattleEngineService.simulateCompleteBattle(
      team1Ro,
      team2Ro,
      getTypeEffectiveness
    )

    // Convert battle teams to API format
    const battleTeam1 = {
      id: battleState.team1.id,
      name: battleState.team1.name,
      members: battleState.team1.pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        image: p.image,
        power: p.power,
        life: p.maxLife,
      })),
      currentPokemonIndex: battleState.team1.currentPokemonIndex,
      defeatedCount: battleState.team1.defeatedCount,
      isDefeated: battleState.team1.isDefeated,
    }

    const battleTeam2 = {
      id: battleState.team2.id,
      name: battleState.team2.name,
      members: battleState.team2.pokemon.map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        image: p.image,
        power: p.power,
        life: p.maxLife,
      })),
      currentPokemonIndex: battleState.team2.currentPokemonIndex,
      defeatedCount: battleState.team2.defeatedCount,
      isDefeated: battleState.team2.isDefeated,
    }

    // Create comprehensive battle result
    const battleResult: BattleResultRo = {
      id: battleState.id,
      team1: battleTeam1,
      team2: battleTeam2,
      rounds: battleState.rounds,
      winner: battleState.winner || "team1",
      totalRounds: battleState.rounds.length,
      battleDuration: battleState.battleDuration,
      createdAt: new Date(),
    }

    return battleResult
  })

// Get battle summary (for battle history)
export const getBattleSummary = publicProcedure
  .input(z.object({ battleId: z.string() }))
  .output(battleSummaryRoSchema)
  .handler(async ({ input }): Promise<BattleSummaryRo> => {
    // In a real app, you'd store battle results and retrieve them
    // For now, return a mock summary
    return {
      id: input.battleId,
      team1Name: "Team 1",
      team2Name: "Team 2",
      winner: "team1",
      totalRounds: 5,
      createdAt: new Date(),
    }
  })

// Get type effectiveness for battle planning
export const getTypeEffectivenessChart = publicProcedure
  .input(z.object({ attackerTypeId: z.string(), defenderTypeId: z.string() }))
  .output(z.object({ factor: z.number() }))
  .handler(async ({ input }) => {
    const { attackerTypeId, defenderTypeId } = input

    const factor = await getTypeEffectiveness(attackerTypeId, defenderTypeId)
    return { factor }
  })

// Get full type effectiveness chart for strategy
export const getFullTypeChart = publicProcedure
  .output(
    z.array(
      z.object({
        attackerType: z.string(),
        defenderType: z.string(),
        factor: z.number(),
      })
    )
  )
  .handler(async () => {
    const weaknesses = await database.weakness.findMany()

    return weaknesses.map((w) => ({
      attackerType: w.type1Id,
      defenderType: w.type2Id,
      factor: w.factor,
    }))
  })

export const battleRouter = {
  startBattle,
  getBattleSummary,
  getTypeEffectivenessChart,
  getFullTypeChart,
}
