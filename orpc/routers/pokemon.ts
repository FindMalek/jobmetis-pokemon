import { database } from "@/prisma/client"
import { PokemonQuery, PokemonEntity } from "@/entities"
import { 
  PokemonRoSchema, 
  PokemonListItemRoSchema,
  PokemonWithStatsRoSchema,
  PokemonQueryDtoSchema,
  CreatePokemonDtoSchema,
  UpdatePokemonDtoSchema 
} from "@/schemas"
import { os } from "@orpc/server"
import { z } from "zod"
import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// Get all Pokemon with filtering and pagination
export const getAllPokemon = publicProcedure
  .input(PokemonQueryDtoSchema)
  .output(z.object({
    pokemon: PokemonListItemRoSchema.array(),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }))
  .handler(async ({ input }) => {
    const { page, limit, search, typeId, minPower, maxPower, orderBy } = input

    const where = PokemonQuery.getSearchWhere({
      search,
      minPower,
      maxPower,
    })

    const [pokemon, total] = await Promise.all([
      database.pokemon.findMany({
        where,
        include: PokemonQuery.getInclude(),
        orderBy: PokemonQuery.getOrderBy(orderBy),
        skip: (page - 1) * limit,
        take: limit,
      }),
      database.pokemon.count({ where }),
    ])

    return {
      pokemon: pokemon.map(p => PokemonEntity.fromPrismaToListItem(p)),
      total,
      page,
      limit,
    }
  })

// Get Pokemon by ID
export const getPokemonById = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(PokemonRoSchema)
  .handler(async ({ input }) => {
    const pokemon = await database.pokemon.findUniqueOrThrow({
      where: { id: input.id },
      include: PokemonQuery.getInclude(),
    })

    return PokemonEntity.fromPrisma(pokemon)
  })

// Get Pokemon with stats
export const getPokemonWithStats = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(PokemonWithStatsRoSchema)
  .handler(async ({ input }) => {
    const pokemon = await database.pokemon.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        ...PokemonQuery.getInclude(),
        _count: {
          select: {
            teamMemberships: true,
          },
        },
      },
    })

    return PokemonEntity.fromPrismaWithStats(pokemon)
  })

// Create new Pokemon
export const createPokemon = publicProcedure
  .input(CreatePokemonDtoSchema)
  .output(PokemonRoSchema)
  .handler(async ({ input }) => {
    const pokemon = await database.pokemon.create({
      data: input,
      include: PokemonQuery.getInclude(),
    })

    return PokemonEntity.fromPrisma(pokemon)
  })

// Update Pokemon
export const updatePokemon = publicProcedure
  .input(UpdatePokemonDtoSchema)
  .output(PokemonRoSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input
    
    const pokemon = await database.pokemon.update({
      where: { id },
      data: updateData,
      include: PokemonQuery.getInclude(),
    })

    return PokemonEntity.fromPrisma(pokemon)
  })

// Delete Pokemon
export const deletePokemon = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(z.object({ success: z.boolean() }))
  .handler(async ({ input }) => {
    await database.pokemon.delete({
      where: { id: input.id },
    })

    return { success: true }
  })

export const pokemonRouter = {
  getAllPokemon,
  getPokemonById,
  getPokemonWithStats,
  createPokemon,
  updatePokemon,
  deletePokemon,
} 