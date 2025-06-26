import { z } from "zod"

// Pokemon Type Enum Schema
export const PokemonTypeEnumSchema = z.enum(["FIRE", "WATER", "GRASS"])

// Pokemon Type Return Object Schema
export const PokemonTypeRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  displayName: z.string(),
})

// Pokemon Type with stats
export const PokemonTypeWithStatsSchema = PokemonTypeRoSchema.extend({
  pokemonCount: z.number().optional(),
  averagePower: z.number().optional(),
})

export type PokemonTypeEnum = z.infer<typeof PokemonTypeEnumSchema>
export type PokemonTypeRo = z.infer<typeof PokemonTypeRoSchema>
export type PokemonTypeWithStats = z.infer<typeof PokemonTypeWithStatsSchema> 