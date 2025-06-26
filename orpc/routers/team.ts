import { database } from "@/prisma/client"
import { TeamQuery, TeamEntity, PokemonQuery } from "@/entities"
import { 
  TeamRoSchema, 
  TeamListItemRoSchema,
  TeamSummaryRoSchema,
  TeamQueryDtoSchema,
  CreateTeamDtoSchema,
  UpdateTeamDtoSchema 
} from "@/schemas"
import { os } from "@orpc/server"
import { z } from "zod"
import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// Get all teams with filtering and pagination
export const getAllTeams = publicProcedure
  .input(TeamQueryDtoSchema)
  .output(z.object({
    teams: TeamListItemRoSchema.array(),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }))
  .handler(async ({ input }) => {
    const { page, limit, search, orderBy } = input

    let where = TeamQuery.getCompleteTeamsWhere()
    if (search) {
      where = {
        ...where,
        ...TeamQuery.getByNameWhere(search),
      }
    }

    let orderByClause
    switch (orderBy) {
      case "power":
        orderByClause = TeamQuery.getOrderByPower()
        break
      case "date":
        orderByClause = TeamQuery.getOrderByDate()
        break
      default:
        orderByClause = [{ name: "asc" }]
    }

    const [teams, total] = await Promise.all([
      database.team.findMany({
        where,
        include: TeamQuery.getInclude(),
        orderBy: orderByClause,
        skip: (page - 1) * limit,
        take: limit,
      }),
      database.team.count({ where }),
    ])

    return {
      teams: teams.map(t => TeamEntity.fromPrismaToListItem(t)),
      total,
      page,
      limit,
    }
  })

// Get team by ID
export const getTeamById = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(TeamRoSchema)
  .handler(async ({ input }) => {
    const team = await database.team.findUniqueOrThrow({
      where: { id: input.id },
      include: TeamQuery.getInclude(),
    })

    return TeamEntity.fromPrisma(team)
  })

// Create new team
export const createTeam = publicProcedure
  .input(CreateTeamDtoSchema)
  .output(TeamRoSchema)
  .handler(async ({ input }) => {
    const { name, pokemonIds } = input

    // Validate team composition
    if (!TeamEntity.isValidTeam(pokemonIds)) {
      throw new Error("Team must have exactly 6 Pokemon")
    }

    // Verify all Pokemon exist
    const pokemon = await database.pokemon.findMany({
      where: PokemonQuery.getByIdsWhere(pokemonIds),
    })

    if (pokemon.length !== 6) {
      throw new Error("Some Pokemon not found")
    }

    // Calculate total power
    const totalPower = TeamEntity.calculateTotalPower(pokemon)

    // Create team and members in a transaction
    const team = await database.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name,
          totalPower,
        },
      })

      // Create team members
      await tx.teamMember.createMany({
        data: pokemonIds.map((pokemonId, index) => ({
          teamId: newTeam.id,
          pokemonId,
          position: index + 1,
        })),
      })

      return tx.team.findUniqueOrThrow({
        where: { id: newTeam.id },
        include: TeamQuery.getInclude(),
      })
    })

    return TeamEntity.fromPrisma(team)
  })

// Update team
export const updateTeam = publicProcedure
  .input(UpdateTeamDtoSchema)
  .output(TeamRoSchema)
  .handler(async ({ input }) => {
    const { id, name, pokemonIds } = input

    const team = await database.$transaction(async (tx) => {
      // Update team name if provided
      if (name) {
        await tx.team.update({
          where: { id },
          data: { name },
        })
      }

      // Update team composition if provided
      if (pokemonIds) {
        if (!TeamEntity.isValidTeam(pokemonIds)) {
          throw new Error("Team must have exactly 6 Pokemon")
        }

        // Verify all Pokemon exist
        const pokemon = await tx.pokemon.findMany({
          where: PokemonQuery.getByIdsWhere(pokemonIds),
        })

        if (pokemon.length !== 6) {
          throw new Error("Some Pokemon not found")
        }

        // Delete existing members
        await tx.teamMember.deleteMany({
          where: { teamId: id },
        })

        // Create new members
        await tx.teamMember.createMany({
          data: pokemonIds.map((pokemonId, index) => ({
            teamId: id,
            pokemonId,
            position: index + 1,
          })),
        })

        // Update total power
        const totalPower = TeamEntity.calculateTotalPower(pokemon)
        await tx.team.update({
          where: { id },
          data: { totalPower },
        })
      }

      return tx.team.findUniqueOrThrow({
        where: { id },
        include: TeamQuery.getInclude(),
      })
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

export const teamRouter = {
  getAllTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,
} 