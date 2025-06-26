import { publicProcedure, router } from "../context"
import { TeamEntity, TeamQuery } from "@/entities/pokemon"
import {
  battleResultRoSchema,
  battleSummaryRoSchema,
  BattleResultRo,
  BattleSummaryRo,
} from "@/schemas/battle"
import {
  startBattleDtoSchema,
  StartBattleDto,
} from "@/schemas/battle"
import { z } from "zod"

// Helper function to get type effectiveness
async function getTypeEffectiveness(
  ctx: any,
  attackerTypeId: string,
  defenderTypeId: string
): Promise<number> {
  const weakness = await ctx.db.weakness.findUnique({
    where: {
      type1Id_type2Id: {
        type1Id: attackerTypeId,
        type2Id: defenderTypeId,
      },
    },
  })

  return weakness?.factor ?? 1.0
}

export const battleRouter = router({
  // Start a battle between two teams
  start: publicProcedure
    .input(startBattleDtoSchema)
    .output(battleResultRoSchema)
    .mutation(async ({ input, ctx }): Promise<BattleResultRo> => {
      const { team1Id, team2Id } = input

      if (team1Id === team2Id) {
        throw new Error("A team cannot battle against itself")
      }

      // Fetch teams using proper query includes
      const [team1Prisma, team2Prisma] = await Promise.all([
        ctx.db.team.findUnique({
          where: { id: team1Id },
          include: TeamQuery.getInclude(),
        }),
        ctx.db.team.findUnique({
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
        ctx,
        pokemon1.type.id,
        pokemon2.type.id
      )
      const effectiveness2to1 = await getTypeEffectiveness(
        ctx,
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
    }),

  // Get battle summary (for battle history)
  getSummary: publicProcedure
    .input(z.object({ battleId: z.string() }))
    .output(battleSummaryRoSchema)
    .query(async ({ input }): Promise<BattleSummaryRo> => {
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
    }),

  // Get type effectiveness chart
  getTypeEffectiveness: publicProcedure
    .input(z.object({ attackerTypeId: z.string(), defenderTypeId: z.string() }))
    .output(z.object({ factor: z.number() }))
    .query(async ({ input, ctx }) => {
      const { attackerTypeId, defenderTypeId } = input

      const factor = await getTypeEffectiveness(ctx, attackerTypeId, defenderTypeId)
      return { factor }
    }),

  // Get full type effectiveness chart
  getFullTypeChart: publicProcedure
    .output(
      z.array(
        z.object({
          attackerType: z.string(),
          defenderType: z.string(),
          factor: z.number(),
        })
      )
    )
    .query(async ({ ctx }) => {
      const weaknesses = await ctx.db.weakness.findMany()

      return weaknesses.map((w) => ({
        attackerType: w.type1Id,
        defenderType: w.type2Id,
        factor: w.factor,
      }))
    }),
})
