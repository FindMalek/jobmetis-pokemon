import { z } from "zod"

import { pokemonRoSchema } from "../pokemon/ro"

// Team Return Object Schema
export const teamRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalPower: z.number(),
  members: z.array(pokemonRoSchema).length(6),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Battle Team Schema (for battle simulation)
export const battleTeamRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  members: z.array(pokemonRoSchema).length(6),
  currentPokemonIndex: z.number().min(0).max(5),
  defeatedCount: z.number().min(0).max(6),
  isDefeated: z.boolean(),
})

// Team summary (for listing)
export const teamSummaryRoSchema = z.object({
  id: z.string(),
  name: z.string(),
  totalPower: z.number(),
  memberCount: z.number().default(6),
  createdAt: z.date(),
  updatedAt: z.date(),
})

// Team list item (minimal data for team lists)
export const teamListItemRoSchema = z.object({
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

export type TeamRo = z.infer<typeof teamRoSchema>
export type BattleTeamRo = z.infer<typeof battleTeamRoSchema>
export type TeamSummaryRo = z.infer<typeof teamSummaryRoSchema>
export type TeamListItemRo = z.infer<typeof teamListItemRoSchema>
