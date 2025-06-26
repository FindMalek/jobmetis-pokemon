import { z } from "zod"

// Pokemon DTOs (Data Transfer Objects)
export const createPokemonDtoSchema = z.object({
  name: z.string().min(1).max(50),
  typeId: z.string(),
  image: z.string().url(),
  power: z.number().min(10).max(100),
  life: z.number().min(10).max(100),
})

export const updatePokemonDtoSchema = createPokemonDtoSchema.partial().extend({
  id: z.string(),
})

// Query DTOs
export const pokemonQueryDtoSchema = z.object({
  search: z.string().optional(),
  typeId: z.string().optional(),
  minPower: z.number().min(10).max(100).optional(),
  maxPower: z.number().min(10).max(100).optional(),
  orderBy: z.enum(["name", "power", "life"]).optional().default("name"),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(20),
})

export type CreatePokemonDto = z.infer<typeof createPokemonDtoSchema>
export type UpdatePokemonDto = z.infer<typeof updatePokemonDtoSchema>
export type PokemonQueryDto = z.infer<typeof pokemonQueryDtoSchema>
