"use client"

import { orpc } from "@/orpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys factory
export const teamKeys = {
  all: ["teams"] as const,
  lists: () => [...teamKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...teamKeys.lists(), filters] as const,
  details: () => [...teamKeys.all, "detail"] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
}

// Get all teams
export function useTeams() {
  return useQuery({
    queryKey: teamKeys.lists(),
    queryFn: () => orpc.team.getAllTeams.call({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single team
export function useTeam(id: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => orpc.team.getTeamById.call({ id }),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  })
}

// Create team mutation
export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; pokemonIds: string[] }) =>
      orpc.team.createTeam.call(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
    },
  })
}

// Update team mutation
export function useUpdateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string; name?: string; pokemonIds?: string[] }) =>
      orpc.team.updateTeam.call(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(variables.id) })
    },
  })
}

// Delete team mutation
export function useDeleteTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => orpc.team.deleteTeam.call({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.all })
    },
  })
}

export function useUserTeams(userId?: string) {
  return useQuery({
    queryKey: [...teamKeys.lists(), "user", userId],
    queryFn: () => orpc.team.getUserTeams.call({ userId }),
    staleTime: 5 * 60 * 1000,
  })
}
