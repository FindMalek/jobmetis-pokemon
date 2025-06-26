import { database } from "@/prisma/client"
import { PokemonTypeQuery, PokemonTypeEntity } from "@/entities"
import { PokemonTypeRoSchema } from "@/schemas"
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
  .output(PokemonTypeRoSchema.array())
  .handler(async () => {
    const types = await database.pokemonType.findMany({
      ...PokemonTypeQuery.getInclude(),
      orderBy: PokemonTypeQuery.getOrderBy(),
    })

    return types.map(type => PokemonTypeEntity.fromPrisma(type))
  })

// Get type by ID
export const getTypeById = publicProcedure
  .input(z.object({ id: z.string() }))
  .output(PokemonTypeRoSchema)
  .handler(async ({ input }) => {
    const type = await database.pokemonType.findUniqueOrThrow({
      where: { id: input.id },
      ...PokemonTypeQuery.getInclude(),
    })

    return PokemonTypeEntity.fromPrisma(type)
  })

// Get type effectiveness chart
export const getEffectivenessChart = publicProcedure
  .input(z.object({}))
  .output(z.array(z.object({
    attackingType: PokemonTypeRoSchema,
    defendingType: PokemonTypeRoSchema,
    factor: z.number(),
  })))
  .handler(async () => {
    const weaknesses = await database.weakness.findMany({
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
  })

export const pokemonTypeRouter = {
  getAllTypes,
  getTypeById,
  getEffectivenessChart,
} 