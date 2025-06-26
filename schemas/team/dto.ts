import { z } from "zod"

// Team DTOs (Data Transfer Objects)
export const createTeamDtoSchema = z.object({
  name: z
    .string()
    .min(1, "Team name is required")
    .max(50, "Team name must be 50 characters or less"),
  pokemonIds: z.array(z.string()).length(6, "Team must have exactly 6 Pokemon"),
})

export const updateTeamDtoSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Team name is required")
    .max(50, "Team name must be 50 characters or less")
    .optional(),
  pokemonIds: z
    .array(z.string())
    .length(6, "Team must have exactly 6 Pokemon")
    .optional(),
})

export const teamQueryDtoSchema = z.object({
  sortBy: z.enum(["name", "totalPower", "createdAt"]).default("createdAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
})

export type CreateTeamDto = z.infer<typeof createTeamDtoSchema>
export type UpdateTeamDto = z.infer<typeof updateTeamDtoSchema>
export type TeamQueryDto = z.infer<typeof teamQueryDtoSchema>
