import { z } from "zod"

// Battle DTOs
export const StartBattleDtoSchema = z.object({
  team1Id: z.string(),
  team2Id: z.string(),
})

export type StartBattleDto = z.infer<typeof StartBattleDtoSchema>
