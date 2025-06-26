import { publicProcedure, router } from "../context"
import { PokemonEntity, PokemonQuery } from "@/entities/pokemon"
import {
  CreatePokemonDto,
  createPokemonDtoSchema,
  pokemonRoSchema,
  PokemonQueryDto,
  pokemonQueryDtoSchema,
  UpdatePokemonDto,
  updatePokemonDtoSchema,
} from "@/schemas/pokemon"
import { z } from "zod"

export const pokemonRouter = router({
  // List all Pokemon with optional filtering
  list: publicProcedure
    .input(pokemonQueryDtoSchema.optional())
    .query(async ({ input, ctx }) => {
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
        ctx.db.pokemon.findMany({
          where: prismaQuery,
          orderBy: orderByClause,
          ...paginationOptions,
          include: PokemonQuery.getInclude(),
        }),
        ctx.db.pokemon.count({
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
    }),

  // Get single Pokemon by ID
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .output(pokemonRoSchema)
    .query(async ({ input, ctx }) => {
      const pokemon = await ctx.db.pokemon.findUnique({
        where: { id: input.id },
        include: PokemonQuery.getInclude(),
      })

      if (!pokemon) {
        throw new Error("Pokemon not found")
      }

      return PokemonEntity.fromPrisma(pokemon)
    }),

  // Create new Pokemon
  create: publicProcedure
    .input(createPokemonDtoSchema)
    .output(pokemonRoSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify that the type exists
      const typeExists = await ctx.db.pokemonType.findUnique({
        where: { id: input.typeId },
      })

      if (!typeExists) {
        throw new Error("Pokemon type not found")
      }

      const pokemon = await ctx.db.pokemon.create({
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
    }),

  // Update existing Pokemon
  update: publicProcedure
    .input(updatePokemonDtoSchema)
    .output(pokemonRoSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, ...updateData } = input

      // If typeId is being updated, verify it exists
      if (updateData.typeId) {
        const typeExists = await ctx.db.pokemonType.findUnique({
          where: { id: updateData.typeId },
        })

        if (!typeExists) {
          throw new Error("Pokemon type not found")
        }
      }

      const pokemon = await ctx.db.pokemon.update({
        where: { id },
        data: updateData,
        include: PokemonQuery.getInclude(),
      })

      return PokemonEntity.fromPrisma(pokemon)
    }),

  // Delete Pokemon
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.pokemon.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),

  // Get Pokemon by type
  getByType: publicProcedure
    .input(z.object({ typeId: z.string() }))
    .query(async ({ input, ctx }) => {
      const pokemon = await ctx.db.pokemon.findMany({
        where: { typeId: input.typeId },
        include: PokemonQuery.getInclude(),
        orderBy: { name: "asc" },
      })

      return pokemon.map((p) => PokemonEntity.fromPrisma(p))
    }),
})
