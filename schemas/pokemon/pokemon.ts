import { z } from "zod"
import { PokemonTypeRoSchema } from "./pokemon-type"

// Pokemon Return Object Schema
export const PokemonRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
  power: z.number().min(10).max(100),
  life: z.number().min(10).max(100),
  type: PokemonTypeRoSchema,
})

// Battle Pokemon Schema (extends Pokemon with battle state)
export const BattlePokemonRoSchema = PokemonRoSchema.extend({
  currentLife: z.number().min(0),
  isDefeated: z.boolean(),
})

// Pokemon with additional computed fields
export const PokemonWithStatsSchema = PokemonRoSchema.extend({
  rarity: z.enum(["common", "uncommon", "rare", "legendary"]),
  totalStats: z.number(),
  usageCount: z.number().optional(),
})

export type PokemonRo = z.infer<typeof PokemonRoSchema>
export type BattlePokemonRo = z.infer<typeof BattlePokemonRoSchema>
export type PokemonWithStats = z.infer<typeof PokemonWithStatsSchema> 