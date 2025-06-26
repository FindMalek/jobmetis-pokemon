import { z } from "zod"
import { BattlePokemonRoSchema } from "./pokemon"
import { BattleTeamRoSchema } from "./team"

// Battle Round Result
export const BattleRoundSchema = z.object({
  roundNumber: z.number().min(1),
  pokemon1: BattlePokemonRoSchema,
  pokemon2: BattlePokemonRoSchema,
  damage1: z.number().min(0),
  damage2: z.number().min(0),
  typeEffectiveness1: z.number(),
  typeEffectiveness2: z.number(),
  winner: z.enum(["pokemon1", "pokemon2", "draw"]).optional(),
  defeated: z.array(z.enum(["pokemon1", "pokemon2"])).optional(),
})

// Complete Battle Result
export const BattleResultSchema = z.object({
  id: z.string(),
  team1: BattleTeamRoSchema,
  team2: BattleTeamRoSchema,
  rounds: z.array(BattleRoundSchema),
  winner: z.enum(["team1", "team2"]).optional(),
  totalRounds: z.number(),
  battleDuration: z.number(), // in milliseconds
  createdAt: z.date(),
})

// Battle Summary (for history)
export const BattleSummarySchema = z.object({
  id: z.string(),
  team1Name: z.string(),
  team2Name: z.string(),
  winner: z.enum(["team1", "team2"]).optional(),
  totalRounds: z.number(),
  createdAt: z.date(),
})

export type BattleRound = z.infer<typeof BattleRoundSchema>
export type BattleResult = z.infer<typeof BattleResultSchema>
export type BattleSummary = z.infer<typeof BattleSummarySchema> 