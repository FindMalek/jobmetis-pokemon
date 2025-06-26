import { TeamEntity, TeamQuery } from "@/entities/pokemon"
import { database } from "@/prisma/client"
import { teamRoSchema } from "@/schemas/team"
import { os } from "@orpc/server"
import { z } from "zod"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// List all teams
export const getAllTeams = publicProcedure
  .output(teamRoSchema.array())
  .handler(async () => {
    const teams = await database.team.findMany({
      include: TeamQuery.getInclude(),
      orderBy: { createdAt: "desc" },
    })

    return teams.map((team) => TeamEntity.fromPrisma(team))
  })

// Get team by ID
export const getTeamById = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(teamRoSchema)
  .handler(async ({ input }) => {
    const team = await database.team.findUnique({
      where: { id: input.id },
      include: TeamQuery.getInclude(),
    })

    if (!team) {
      throw new Error("Team not found")
    }

    return TeamEntity.fromPrisma(team)
  })

// Create new team with 6 Pokemon
export const createTeam = publicProcedure
  .input(
    z.object({
      name: z.string().min(1).max(50),
      pokemonIds: z.array(z.string()).length(6),
    })
  )
  .output(teamRoSchema)
  .handler(async ({ input }) => {
    // Verify all Pokemon exist
    const pokemon = await database.pokemon.findMany({
      where: { id: { in: input.pokemonIds } },
    })

    if (pokemon.length !== 6) {
      throw new Error("All 6 Pokemon must exist")
    }

    // Calculate total power
    const totalPower = pokemon.reduce((sum, p) => sum + p.power, 0)

    const team = await database.team.create({
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
  })

// Update team
export const updateTeam = publicProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string().min(1).max(50).optional(),
      pokemonIds: z.array(z.string()).length(6).optional(),
    })
  )
  .output(teamRoSchema)
  .handler(async ({ input }) => {
    const { id, name, pokemonIds } = input

    let updateData: any = {}

    if (name) {
      updateData.name = name
    }

    if (pokemonIds) {
      // Verify all Pokemon exist
      const pokemon = await database.pokemon.findMany({
        where: { id: { in: pokemonIds } },
      })

      if (pokemon.length !== 6) {
        throw new Error("All 6 Pokemon must exist")
      }

      // Calculate new total power
      const totalPower = pokemon.reduce((sum, p) => sum + p.power, 0)
      updateData.totalPower = totalPower

      // Delete existing members and create new ones
      await database.teamMember.deleteMany({
        where: { teamId: id },
      })

      updateData.members = {
        create: pokemonIds.map((pokemonId, index) => ({
          pokemonId,
          position: index,
        })),
      }
    }

    const team = await database.team.update({
      where: { id },
      data: updateData,
      include: TeamQuery.getInclude(),
    })

    return TeamEntity.fromPrisma(team)
  })

// Delete team
export const deleteTeam = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await database.team.delete({
      where: { id: input.id },
    })

    return { success: true }
  })

// Get user's teams (placeholder for when auth is added)
export const getUserTeams = publicProcedure
  .input(z.object({ userId: z.string().optional() }))
  .output(teamRoSchema.array())
  .handler(async () => {
    // For now, return all teams since we don't have user auth yet
    const teams = await database.team.findMany({
      include: TeamQuery.getInclude(),
      orderBy: { createdAt: "desc" },
    })

    return teams.map((team) => TeamEntity.fromPrisma(team))
  })

export const teamRouter = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
  getUserTeams,
}
