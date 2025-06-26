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

// Start a battle between two teams
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

    // Convert to battle format using entity methods
    const battleTeam1 = TeamEntity.toBattleTeam(team1Ro)
    const battleTeam2 = TeamEntity.toBattleTeam(team2Ro)

    // Simple battle simulation
    const startTime = Date.now()
    const pokemon1 = team1Ro.members[0]
    const pokemon2 = team2Ro.members[0]

    // Get type effectiveness
    const effectiveness1to2 = await getTypeEffectiveness(
      pokemon1.type.id,
      pokemon2.type.id
    )
    const effectiveness2to1 = await getTypeEffectiveness(
      pokemon2.type.id,
      pokemon1.type.id
    )

    // Calculate damage
    const damage1to2 = Math.floor(pokemon1.power * effectiveness1to2)
    const damage2to1 = Math.floor(pokemon2.power * effectiveness2to1)

    // Create battle result manually (simplified)
    const battleResult: BattleResultRo = {
      id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      team1: battleTeam1,
      team2: battleTeam2,
      rounds: [
        {
          roundNumber: 1,
          pokemon1: {
            id: pokemon1.id,
            name: pokemon1.name,
            type: pokemon1.type,
            image: pokemon1.image,
            power: pokemon1.power,
            life: pokemon1.life,
            isDefeated: false,
            currentLife: pokemon1.life - damage2to1,
          },
          pokemon2: {
            id: pokemon2.id,
            name: pokemon2.name,
            type: pokemon2.type,
            image: pokemon2.image,
            power: pokemon2.power,
            life: pokemon2.life,
            isDefeated: false,
            currentLife: pokemon2.life - damage1to2,
          },
          damage1: damage1to2,
          damage2: damage2to1,
          typeEffectiveness1: effectiveness1to2,
          typeEffectiveness2: effectiveness2to1,
          winner: damage1to2 > damage2to1 ? "pokemon1" : "pokemon2",
        },
      ],
      winner: damage1to2 > damage2to1 ? "team1" : "team2",
      totalRounds: 1,
      battleDuration: Date.now() - startTime,
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

// Get type effectiveness chart
export const getTypeEffectivenessChart = publicProcedure
  .input(z.object({ attackerTypeId: z.string(), defenderTypeId: z.string() }))
  .output(z.object({ factor: z.number() }))
  .handler(async ({ input }) => {
    const { attackerTypeId, defenderTypeId } = input

    const factor = await getTypeEffectiveness(attackerTypeId, defenderTypeId)
    return { factor }
  })

// Get full type effectiveness chart
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
