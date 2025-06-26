import { z } from "zod"

import { battlePokemonRoSchema } from "../pokemon/ro"
import { battleTeamRoSchema } from "../team/ro"

// Battle Round Result
export const battleRoundRoSchema = z.object({
  roundNumber: z.number().min(1),
  pokemon1: battlePokemonRoSchema,
  pokemon2: battlePokemonRoSchema,
  damage1: z.number().min(0),
  damage2: z.number().min(0),
  typeEffectiveness1: z.number(),
  typeEffectiveness2: z.number(),
  winner: z.enum(["pokemon1", "pokemon2", "draw"]).optional(),
  defeated: z.array(z.enum(["pokemon1", "pokemon2"])).optional(),
})

// Complete Battle Result
export const battleResultRoSchema = z.object({
  id: z.string(),
  team1: battleTeamRoSchema,
  team2: battleTeamRoSchema,
  rounds: z.array(battleRoundRoSchema),
  winner: z.enum(["team1", "team2"]).optional(),
  totalRounds: z.number(),
  battleDuration: z.number(), // in milliseconds
  createdAt: z.date(),
})

// Battle Summary (for history)
export const battleSummaryRoSchema = z.object({
  id: z.string(),
  team1Name: z.string(),
  team2Name: z.string(),
  winner: z.enum(["team1", "team2"]).optional(),
  totalRounds: z.number(),
  createdAt: z.date(),
})

export type BattleRoundRo = z.infer<typeof battleRoundRoSchema>
export type BattleResultRo = z.infer<typeof battleResultRoSchema>
export type BattleSummaryRo = z.infer<typeof battleSummaryRoSchema>
