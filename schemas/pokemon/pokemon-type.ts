import { z } from "zod"

// Pokemon Type Enum Schema
export const PokemonTypeEnumSchema = z.enum(["FIRE", "WATER", "GRASS"])

// Pokemon Type Return Object Schema
export const PokemonTypeRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
  color: z.string(),
})

// Pokemon Type with stats for admin/analytics
export const PokemonTypeWithStatsRoSchema = PokemonTypeRoSchema.extend({
  pokemonCount: z.number(),
  averagePower: z.number(),
  averageLife: z.number(),
})

export type PokemonTypeEnum = z.infer<typeof PokemonTypeEnumSchema>
export type PokemonTypeRo = z.infer<typeof PokemonTypeRoSchema>
export type PokemonTypeWithStatsRo = z.infer<typeof PokemonTypeWithStatsRoSchema> 