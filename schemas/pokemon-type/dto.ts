import { z } from "zod"

import { pokemonTypeRoSchema } from "./ro"

// Type Effectiveness Chart DTO
export const typeEffectivenessChartRoSchema = z.array(
  z.object({
    attackingType: pokemonTypeRoSchema,
    defendingType: pokemonTypeRoSchema,
    factor: z.number(),
  })
)

export type TypeEffectivenessChartRo = z.infer<
  typeof typeEffectivenessChartRoSchema
>
