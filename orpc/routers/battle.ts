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
    try {
      console.log("🔥 Starting battle with teams:", input)
      const { team1Id, team2Id } = input

      if (team1Id === team2Id) {
        throw new Error("A team cannot battle against itself")
      }

      console.log("📊 Fetching teams from database...")
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

      console.log("🎯 Teams fetched:", {
        team1: team1Prisma?.name,
        team1Members: team1Prisma?.members.length,
        team2: team2Prisma?.name,
        team2Members: team2Prisma?.members.length,
      })

      if (!team1Prisma || !team2Prisma) {
        throw new Error("One or both teams not found")
      }

      if (
        team1Prisma.members.length !== 6 ||
        team2Prisma.members.length !== 6
      ) {
        throw new Error(
          `Both teams must have exactly 6 Pokemon. Team 1: ${team1Prisma.members.length}, Team 2: ${team2Prisma.members.length}`
        )
      }

      console.log("🔄 Converting teams to RO format...")
      // Convert to RO using entity converters
      const team1Ro = TeamEntity.fromPrisma(team1Prisma)
      const team2Ro = TeamEntity.fromPrisma(team2Prisma)

      console.log("⚔️ Starting battle simulation...")
      // Use advanced battle engine for complete simulation
      const battleState = await BattleEngineService.simulateCompleteBattle(
        team1Ro,
        team2Ro,
        getTypeEffectiveness
      )
      console.log("✅ Battle simulation complete:", {
        winner: battleState.winner,
        rounds: battleState.rounds.length,
        duration: battleState.battleDuration,
      })

      console.log("🔄 Converting battle state to API format...")

      try {
        // Convert battle teams to API format
        console.log("📝 Converting team 1...")
        const battleTeam1 = {
          id: battleState.team1.id,
          name: battleState.team1.name,
          members: battleState.team1.pokemon.map((p) => {
            console.log(`  - Converting Pokemon: ${p.name}`)
            return {
              id: p.id,
              name: p.name,
              type: p.type,
              image: p.image,
              power: p.power,
              life: p.maxLife,
            }
          }),
          currentPokemonIndex: battleState.team1.currentPokemonIndex,
          defeatedCount: battleState.team1.defeatedCount,
          isDefeated: battleState.team1.isDefeated,
        }
        console.log("✅ Team 1 converted successfully")

        console.log("📝 Converting team 2...")
        const battleTeam2 = {
          id: battleState.team2.id,
          name: battleState.team2.name,
          members: battleState.team2.pokemon.map((p) => {
            console.log(`  - Converting Pokemon: ${p.name}`)
            return {
              id: p.id,
              name: p.name,
              type: p.type,
              image: p.image,
              power: p.power,
              life: p.maxLife,
            }
          }),
          currentPokemonIndex: battleState.team2.currentPokemonIndex,
          defeatedCount: battleState.team2.defeatedCount,
          isDefeated: battleState.team2.isDefeated,
        }
        console.log("✅ Team 2 converted successfully")

        console.log("📋 Creating battle result object...")
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
        console.log("✅ Battle result created successfully")

        console.log("🔍 Validating battle result schema...")
        // Validate the result against the schema
        const validationResult = battleResultRoSchema.safeParse(battleResult)
        if (!validationResult.success) {
          console.error("💥 Schema validation failed:", validationResult.error)
          console.error(
            "Schema errors:",
            JSON.stringify(validationResult.error.errors, null, 2)
          )
          throw new Error(
            `Schema validation failed: ${validationResult.error.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")}`
          )
        }
        console.log("✅ Schema validation passed")

        console.log("🎉 Returning successful battle result")
        return battleResult
      } catch (conversionError) {
        console.error(
          "💥 Error during battle result conversion:",
          conversionError
        )
        console.error(
          "Battle state that failed:",
          JSON.stringify(battleState, null, 2)
        )
        throw new Error(
          `Failed to convert battle result: ${conversionError instanceof Error ? conversionError.message : "Unknown conversion error"}`
        )
      }
    } catch (error) {
      console.error("💥 Battle error:", error)
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "Unknown error"
      )
      throw error
    }
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
