import { PokemonTypeEntity, PokemonTypeQuery } from "@/entities/pokemon"
import { database } from "@/prisma/client"
import { pokemonTypeRoSchema } from "@/schemas/pokemon-type"
import { os } from "@orpc/server"
import { z } from "zod"

import type { ORPCContext } from "../types"

const baseProcedure = os.$context<ORPCContext>()
const publicProcedure = baseProcedure.use(({ context, next }) => {
  return next({ context })
})

// Get all Pokemon types
export const getAllTypes = publicProcedure
  .input(z.object({}))
  .output(pokemonTypeRoSchema.array())
  .handler(async () => {
    const types = await database.pokemonType.findMany({
      include: {
        ...PokemonTypeQuery.getInclude(),
      },
      orderBy: PokemonTypeQuery.getOrderBy(),
    })

    return types.map((type) => PokemonTypeEntity.fromPrisma(type))
  })

// Get type by ID
export const getTypeById = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(pokemonTypeRoSchema)
  .handler(async ({ input }) => {
    const type = await database.pokemonType.findUniqueOrThrow({
      where: { id: input.id },
      include: {
        ...PokemonTypeQuery.getInclude(),
      },
    })

    return PokemonTypeEntity.fromPrisma(type)
  })

// Get type effectiveness chart
export const getEffectivenessChart = publicProcedure
  .input(z.object({}))
  .output(
    z.array(
      z.object({
        attackingType: pokemonTypeRoSchema,
        defendingType: pokemonTypeRoSchema,
        factor: z.number(),
      })
    )
  )
  .handler(async () => {
    const weaknesses = await database.weakness.findMany({
      include: {
        attackingType: true,
        defendingType: true,
      },
    })

    return weaknesses.map((weakness) => ({
      attackingType: PokemonTypeEntity.fromPrisma(weakness.attackingType),
      defendingType: PokemonTypeEntity.fromPrisma(weakness.defendingType),
      factor: weakness.factor,
    }))
  })

export const pokemonTypeRouter = {
  getAllTypes,
  getTypeById,
  getEffectivenessChart,
}
