import { z } from "zod"

import { PokemonRoSchema } from "../pokemon/ro"

// Team Return Object Schema
export const TeamRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalPower: z.number(),
  members: z.array(PokemonRoSchema).length(6),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Battle Team Schema (for battle simulation)
export const BattleTeamRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(PokemonRoSchema).length(6),
  currentPokemonIndex: z.number().min(0).max(5),
  defeatedCount: z.number().min(0).max(6),
  isDefeated: z.boolean(),
})

// Team summary (for listing)
export const TeamSummaryRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalPower: z.number(),
  memberCount: z.number().default(6),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Team list item (minimal data for team lists)
export const TeamListItemRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalPower: z.number(),
  memberPreviews: z
    .array(
      z.object({
        name: z.string(),
        image: z.string(),
        typeName: z.string(),
      })
    )
    .max(3), // Show first 3 Pokemon as preview
  createdAt: z.date(),
})

export type TeamRo = z.infer<typeof TeamRoSchema>
export type BattleTeamRo = z.infer<typeof BattleTeamRoSchema>
export type TeamSummaryRo = z.infer<typeof TeamSummaryRoSchema>
export type TeamListItemRo = z.infer<typeof TeamListItemRoSchema>
