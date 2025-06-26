import { z } from "zod"

// Pokemon DTOs (Data Transfer Objects)
export const CreatePokemonDtoSchema = z.object({
  name: z.string().min(1).max(50),
  typeId: z.string(),
  image: z.string().url(),
  power: z.number().min(10).max(100),
  life: z.number().min(10).max(100),
})

export const UpdatePokemonDtoSchema = CreatePokemonDtoSchema.partial().extend({
  id: z.string(),
})

// Query DTOs
export const PokemonQueryDtoSchema = z.object({
  search: z.string().optional(),
  typeId: z.string().optional(),
  minPower: z.number().min(10).max(100).optional(),
  maxPower: z.number().min(10).max(100).optional(),
  orderBy: z.enum(["name", "power", "life"]).default("name"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export type CreatePokemonDto = z.infer<typeof CreatePokemonDtoSchema>
export type UpdatePokemonDto = z.infer<typeof UpdatePokemonDtoSchema>
export type PokemonQueryDto = z.infer<typeof PokemonQueryDtoSchema>
