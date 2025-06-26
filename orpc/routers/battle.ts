import { database } from "@/prisma/client"
import {
  BattleResultSchema,
  BattleSummarySchema,
  StartBattleDtoSchema,
} from "@/schemas"
import { os } from "@orpc/server"
import { z } from "zod"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// Start a battle between two teams
export const startBattle = publicProcedure
  .input(StartBattleDtoSchema)
  .output(BattleResultSchema)
  .handler(async ({ input }) => {
    const { team1Id, team2Id } = input

    if (team1Id === team2Id) {
      throw new Error("A team cannot battle against itself")
    }

    // Verify teams exist and are complete
    const [team1, team2] = await Promise.all([
      database.team.findUnique({
        where: { id: team1Id },
        include: { 
          members: { 
            include: { 
              pokemon: { 
                include: { type: true } 
              } 
            } 
          } 
        },
      }),
      database.team.findUnique({
        where: { id: team2Id },
        include: { 
          members: { 
            include: { 
              pokemon: { 
                include: { type: true } 
              } 
            } 
          } 
        },
      }),
    ])

    if (!team1 || !team2) {
      throw new Error("One or both teams not found")
    }

    if (team1.members.length !== 6 || team2.members.length !== 6) {
      throw new Error("Both teams must have exactly 6 Pokemon")
    }

    // Create a simple mock battle result
    const pokemon1 = team1.members[0].pokemon
    const pokemon2 = team2.members[0].pokemon

    // Get type effectiveness
    const effectiveness1to2 = await getTypeEffectiveness(pokemon1.type.id, pokemon2.type.id)
    const effectiveness2to1 = await getTypeEffectiveness(pokemon2.type.id, pokemon1.type.id)

    const damage1to2 = Math.floor(pokemon1.power * effectiveness1to2)
    const damage2to1 = Math.floor(pokemon2.power * effectiveness2to1)

    // Create battle result
    const battleResult = {
      id: `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      team1: {
        id: team1.id,
        name: team1.name,
        members: team1.members.map(m => ({
          id: m.pokemon.id,
          name: m.pokemon.name,
          image: m.pokemon.image,
          power: m.pokemon.power,
          life: m.pokemon.life,
          type: {
            id: m.pokemon.type.id,
            name: m.pokemon.type.name,
            displayName: m.pokemon.type.name.charAt(0).toUpperCase() + m.pokemon.type.name.slice(1).toLowerCase(),
            color: getTypeColor(m.pokemon.type.name),
          },
        })),
        currentPokemonIndex: 0,
        defeatedCount: 0,
        isDefeated: false,
      },
      team2: {
        id: team2.id,
        name: team2.name,
        members: team2.members.map(m => ({
          id: m.pokemon.id,
          name: m.pokemon.name,
          image: m.pokemon.image,
          power: m.pokemon.power,
          life: m.pokemon.life,
          type: {
            id: m.pokemon.type.id,
            name: m.pokemon.type.name,
            displayName: m.pokemon.type.name.charAt(0).toUpperCase() + m.pokemon.type.name.slice(1).toLowerCase(),
            color: getTypeColor(m.pokemon.type.name),
          },
        })),
        currentPokemonIndex: 0,
        defeatedCount: 0,
        isDefeated: false,
      },
      rounds: [
        {
          roundNumber: 1,
          pokemon1: {
            id: pokemon1.id,
            name: pokemon1.name,
            type: {
              id: pokemon1.type.id,
              name: pokemon1.type.name,
              displayName: pokemon1.type.name.charAt(0).toUpperCase() + pokemon1.type.name.slice(1).toLowerCase(),
              color: getTypeColor(pokemon1.type.name),
            },
            image: pokemon1.image,
            power: pokemon1.power,
            life: pokemon1.life,
            isDefeated: false,
            currentLife: pokemon1.life - damage2to1,
          },
          pokemon2: {
            id: pokemon2.id,
            name: pokemon2.name,
            type: {
              id: pokemon2.type.id,
              name: pokemon2.type.name,
              displayName: pokemon2.type.name.charAt(0).toUpperCase() + pokemon2.type.name.slice(1).toLowerCase(),
              color: getTypeColor(pokemon2.type.name),
            },
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
                     winner: damage1to2 > damage2to1 ? ("pokemon1" as const) : ("pokemon2" as const),
        },
      ],
             winner: damage1to2 > damage2to1 ? ("team1" as const) : ("team2" as const),
      totalRounds: 1,
      battleDuration: 1000,
      createdAt: new Date(),
    }

    return battleResult
  })

// Helper function to get type effectiveness
async function getTypeEffectiveness(attackerTypeId: string, defenderTypeId: string): Promise<number> {
  const weakness = await database.weakness.findUnique({
    where: {
      type1Id_type2Id: {
        type1Id: attackerTypeId,
        type2Id: defenderTypeId,
      },
    },
  })

  return weakness?.factor ?? 1.0
}

// Helper function to get type color
function getTypeColor(typeName: string): string {
  const colors = {
    FIRE: "#F08030",
    WATER: "#6890F0", 
    GRASS: "#78C850",
  }
  return colors[typeName as keyof typeof colors] || "#68A090"
}

// Get battle summary (for battle history)
export const getBattleSummary = publicProcedure
  .input(z.object({ battleId: z.string() }))
  .output(BattleSummarySchema)
  .handler(async ({ input }) => {
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

// Export the battle router
export const battleRouter = {
  startBattle,
  getBattleSummary,
  getTypeEffectivenessChart,
  getFullTypeChart,
} 