import { z } from "zod"

// Pokemon Type Enum Schema
export const pokemonTypeEnumSchema = z.enum(["FIRE", "WATER", "GRASS"])

// Pokemon Type Return Object Schema
export const pokemonTypeRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  color: z.string(),
})

// Pokemon Type with stats for admin/analytics
export const pokemonTypeWithStatsRoSchema = pokemonTypeRoSchema.extend({
  pokemonCount: z.number(),
  averagePower: z.number(),
  averageLife: z.number(),
})

export type PokemonTypeEnum = z.infer<typeof pokemonTypeEnumSchema>
export type PokemonTypeRo = z.infer<typeof pokemonTypeRoSchema>
export type PokemonTypeWithStatsRo = z.infer<
  typeof pokemonTypeWithStatsRoSchema
>
