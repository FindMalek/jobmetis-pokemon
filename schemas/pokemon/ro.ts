import { z } from "zod"

import { pokemonTypeRoSchema } from "../pokemon-type/ro"

// Pokemon Return Object Schema
export const pokemonRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
  power: z.number().min(10).max(100),
  life: z.number().min(10).max(100),
  type: pokemonTypeRoSchema,
})

// Battle Pokemon Schema (extends Pokemon with battle state)
export const battlePokemonRoSchema = pokemonRoSchema.extend({
  currentLife: z.number().min(0),
  isDefeated: z.boolean(),
})

// Pokemon with additional computed fields
export const pokemonWithStatsRoSchema = pokemonRoSchema.extend({
  rarity: z.enum(["common", "uncommon", "rare", "legendary"]),
  totalStats: z.number(),
  usageCount: z.number().default(0),
})

// Pokemon list item (minimal data for lists)
export const pokemonListItemRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  image: z.string().url(),
  power: z.number(),
  life: z.number(),
  typeName: z.string(),
  typeColor: z.string(),
})

export type PokemonRo = z.infer<typeof pokemonRoSchema>
export type BattlePokemonRo = z.infer<typeof battlePokemonRoSchema>
export type PokemonWithStatsRo = z.infer<typeof pokemonWithStatsRoSchema>
export type PokemonListItemRo = z.infer<typeof pokemonListItemRoSchema>
