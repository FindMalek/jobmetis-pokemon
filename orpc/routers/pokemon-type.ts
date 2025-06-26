import { PokemonTypeEntity, PokemonTypeQuery } from "@/entities"
import { database } from "@/prisma/client"
import {
  pokemonTypeRoSchema,
  typeEffectivenessChartRoSchema,
} from "@/schemas/pokemon-type"
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
  .output(typeEffectivenessChartRoSchema)
  .handler(async () => {
    const weaknesses = await database.weakness.findMany({
      include: {
        attackingType: true,
        defendingType: true,
      },
    })

    return weaknesses.map((weakness) => ({
      attackingType: PokemonTypeEntity.fromBasicTypeData(
        weakness.attackingType
      ),
      defendingType: PokemonTypeEntity.fromBasicTypeData(
        weakness.defendingType
      ),
      factor: weakness.factor,
    }))
  })

export const pokemonTypeRouter = {
  getAllTypes,
  getTypeById,
  getEffectivenessChart,
}
