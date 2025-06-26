import { publicProcedure, router } from "../context"
import { TeamEntity, TeamQuery } from "@/entities/pokemon"
import {
  teamRoSchema,
} from "@/schemas/team"
import { z } from "zod"

export const teamRouter = router({
  // List all teams
  list: publicProcedure.query(async ({ ctx }) => {
    const teams = await ctx.db.team.findMany({
      include: TeamQuery.getInclude(),
      orderBy: { createdAt: "desc" },
    })

    return teams.map((team) => TeamEntity.fromPrisma(team))
  }),

  // Get team by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(teamRoSchema)
    .query(async ({ input, ctx }) => {
      const team = await ctx.db.team.findUnique({
        where: { id: input.id },
        include: TeamQuery.getInclude(),
      })

      if (!team) {
        throw new Error("Team not found")
      }

      return TeamEntity.fromPrisma(team)
    }),

  // Create new team with 6 Pokemon
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(50),
        pokemonIds: z.array(z.string()).length(6),
      })
    )
    .output(teamRoSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify all Pokemon exist
      const pokemon = await ctx.db.pokemon.findMany({
        where: { id: { in: input.pokemonIds } },
      })

      if (pokemon.length !== 6) {
        throw new Error("All 6 Pokemon must exist")
      }

      // Calculate total power
      const totalPower = pokemon.reduce((sum, p) => sum + p.power, 0)

      const team = await ctx.db.team.create({
        data: {
          name: input.name,
          totalPower,
          members: {
            create: input.pokemonIds.map((pokemonId, index) => ({
              pokemonId,
              position: index,
            })),
          },
        },
        include: TeamQuery.getInclude(),
      })

      return TeamEntity.fromPrisma(team)
    }),

  // Update team
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(50).optional(),
        pokemonIds: z.array(z.string()).length(6).optional(),
      })
    )
    .output(teamRoSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, name, pokemonIds } = input

      let updateData: any = {}
      
      if (name) {
        updateData.name = name
      }

      if (pokemonIds) {
        // Verify all Pokemon exist
        const pokemon = await ctx.db.pokemon.findMany({
          where: { id: { in: pokemonIds } },
        })

        if (pokemon.length !== 6) {
          throw new Error("All 6 Pokemon must exist")
        }

        // Calculate new total power
        const totalPower = pokemon.reduce((sum, p) => sum + p.power, 0)
        updateData.totalPower = totalPower

        // Delete existing members and create new ones
        await ctx.db.teamMember.deleteMany({
          where: { teamId: id },
        })

        updateData.members = {
          create: pokemonIds.map((pokemonId, index) => ({
            pokemonId,
            position: index,
          })),
        }
      }

      const team = await ctx.db.team.update({
        where: { id },
        data: updateData,
        include: TeamQuery.getInclude(),
      })

      return TeamEntity.fromPrisma(team)
    }),

  // Delete team
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.team.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get user's teams (placeholder for when auth is added)
  getUserTeams: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx }) => {
      // For now, return all teams since we don't have user auth yet
      const teams = await ctx.db.team.findMany({
        include: TeamQuery.getInclude(),
        orderBy: { createdAt: "desc" },
      })

      return teams.map((team) => TeamEntity.fromPrisma(team))
    }),
})
