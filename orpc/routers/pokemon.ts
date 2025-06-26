import { PokemonEntity, PokemonQuery } from "@/entities/pokemon"
import { database } from "@/prisma/client"
import {
  CreatePokemonDto,
  createPokemonDtoSchema,
  PokemonQueryDto,
  pokemonQueryDtoSchema,
  pokemonRoSchema,
  UpdatePokemonDto,
  updatePokemonDtoSchema,
} from "@/schemas/pokemon"
import { os } from "@orpc/server"
import { z } from "zod"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// List all Pokemon with optional filtering
export const getAllPokemon = publicProcedure
  .input(pokemonQueryDtoSchema.optional())
  .output(
    z.object({
      data: pokemonRoSchema.array(),
      pagination: z.object({
        page: z.number(),
        limit: z.number(),
        totalCount: z.number(),
        totalPages: z.number(),
      }),
    })
  )
  .handler(async ({ input }) => {
    const query = input || {}
    const { search, typeId, minPower, maxPower, orderBy, page, limit } = query

    const prismaQuery = PokemonQuery.buildWhereClause({
      search,
      typeId,
      minPower,
      maxPower,
    })

    const orderByClause = PokemonQuery.buildOrderByClause(orderBy)
    const paginationOptions = PokemonQuery.buildPaginationOptions({
      page,
      limit,
    })

    const [pokemon, totalCount] = await Promise.all([
      database.pokemon.findMany({
        where: prismaQuery,
        orderBy: orderByClause,
        ...paginationOptions,
        include: PokemonQuery.getInclude(),
      }),
      database.pokemon.count({
        where: prismaQuery,
      }),
    ])

    return {
      data: pokemon.map((p) => PokemonEntity.fromPrisma(p)),
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    }
  })

// Get single Pokemon by ID
export const getPokemonById = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(pokemonRoSchema)
  .handler(async ({ input }) => {
    const pokemon = await database.pokemon.findUnique({
      where: { id: input.id },
      include: PokemonQuery.getInclude(),
    })

    if (!pokemon) {
      throw new Error("Pokemon not found")
    }

    return PokemonEntity.fromPrisma(pokemon)
  })

// Create new Pokemon
export const createPokemon = publicProcedure
  .input(createPokemonDtoSchema)
  .output(pokemonRoSchema)
  .handler(async ({ input }) => {
    // Verify that the type exists
    const typeExists = await database.pokemonType.findUnique({
      where: { id: input.typeId },
    })

    if (!typeExists) {
      throw new Error("Pokemon type not found")
    }

    const pokemon = await database.pokemon.create({
      data: {
        name: input.name,
        image: input.image,
        power: input.power,
        life: input.life,
        typeId: input.typeId,
      },
      include: PokemonQuery.getInclude(),
    })

    return PokemonEntity.fromPrisma(pokemon)
  })

// Update existing Pokemon
export const updatePokemon = publicProcedure
  .input(updatePokemonDtoSchema)
  .output(pokemonRoSchema)
  .handler(async ({ input }) => {
    const { id, ...updateData } = input

    // If typeId is being updated, verify it exists
    if (updateData.typeId) {
      const typeExists = await database.pokemonType.findUnique({
        where: { id: updateData.typeId },
      })

      if (!typeExists) {
        throw new Error("Pokemon type not found")
      }
    }

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

// Get Pokemon by type
export const getPokemonByType = publicProcedure
  .input(z.object({ typeId: z.string() }))
  .output(pokemonRoSchema.array())
  .handler(async ({ input }) => {
    const pokemon = await database.pokemon.findMany({
      where: { typeId: input.typeId },
      include: PokemonQuery.getInclude(),
      orderBy: { name: "asc" },
    })

    return pokemon.map((p) => PokemonEntity.fromPrisma(p))
  })

export const pokemonRouter = {
  getAllPokemon,
  getPokemonById,
  createPokemon,
  updatePokemon,
  deletePokemon,
  getPokemonByType,
}
