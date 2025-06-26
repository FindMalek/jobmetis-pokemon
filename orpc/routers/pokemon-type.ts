import { router, protectedProcedure } from "../context"
import { PokemonTypeQuery, PokemonTypeEntity } from "@/entities"
import { PokemonTypeRoSchema } from "@/schemas"
import { z } from "zod"

export const pokemonTypeRouter = router({
  // Get all Pokemon types
  getAll: protectedProcedure
    .output(PokemonTypeRoSchema.array())
    .query(async ({ ctx }) => {
      const types = await ctx.db.pokemonType.findMany({
        ...PokemonTypeQuery.getInclude(),
        orderBy: PokemonTypeQuery.getOrderBy(),
      })

      return types.map(type => PokemonTypeEntity.fromPrisma(type))
    }),

  // Get type by ID
  getById: protectedProcedure
    .input(z.string())
    .output(PokemonTypeRoSchema)
    .query(async ({ ctx, input }) => {
      const type = await ctx.db.pokemonType.findUniqueOrThrow({
        where: { id: input },
        ...PokemonTypeQuery.getInclude(),
      })

      return PokemonTypeEntity.fromPrisma(type)
    }),

  // Get type effectiveness chart
  getEffectivenessChart: protectedProcedure
    .output(z.array(z.object({
      attackingType: PokemonTypeRoSchema,
      defendingType: PokemonTypeRoSchema,
      factor: z.number(),
    })))
    .query(async ({ ctx }) => {
      const weaknesses = await ctx.db.weakness.findMany({
        include: {
          attackingType: true,
          defendingType: true,
        },
      })

      return weaknesses.map(weakness => ({
        attackingType: PokemonTypeEntity.fromPrisma(weakness.attackingType),
        defendingType: PokemonTypeEntity.fromPrisma(weakness.defendingType),
        factor: weakness.factor,
      }))
    }),
}) 