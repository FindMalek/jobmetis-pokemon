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

// Team DTOs
export const CreateTeamDtoSchema = z.object({
  name: z.string().min(1).max(50),
  pokemonIds: z.array(z.string()).length(6),
})

export const UpdateTeamDtoSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  pokemonIds: z.array(z.string()).length(6).optional(),
})

// Battle DTOs
export const StartBattleDtoSchema = z.object({
  team1Id: z.string(),
  team2Id: z.string(),
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

export const TeamQueryDtoSchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(["name", "power", "date"]).default("power"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export type CreatePokemonDto = z.infer<typeof CreatePokemonDtoSchema>
export type UpdatePokemonDto = z.infer<typeof UpdatePokemonDtoSchema>
export type CreateTeamDto = z.infer<typeof CreateTeamDtoSchema>
export type UpdateTeamDto = z.infer<typeof UpdateTeamDtoSchema>
export type StartBattleDto = z.infer<typeof StartBattleDtoSchema>
export type PokemonQueryDto = z.infer<typeof PokemonQueryDtoSchema>
export type TeamQueryDto = z.infer<typeof TeamQueryDtoSchema>
