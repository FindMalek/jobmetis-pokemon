"use client"

import { orpc } from "@/orpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys factory
export const teamKeys = {
  all: ["teams"] as const,
  lists: () => [...teamKeys.all, "list"] as const,
  list: (filters: string) => [...teamKeys.lists(), { filters }] as const,
  details: () => [...teamKeys.all, "detail"] as const,
  detail: (id: string) => [...teamKeys.details(), id] as const,
}

// Get all teams
export function useTeams(filters?: {
  sortBy?: "name" | "totalPower" | "createdAt"
  order?: "asc" | "desc"
  page?: number
  limit?: number
}) {
  return useQuery({
    queryKey: teamKeys.list(JSON.stringify(filters || {})),
    queryFn: () => orpc.team.getAllTeams.call(filters || {}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

// Get single team
export function useTeamById(id: string) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: () => orpc.team.getTeamById.call({ id }),
    enabled: !!id,
  })
}

// Create team mutation
export function useCreateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.team.createTeam.call,
    onSuccess: () => {
      // Invalidate and refetch team lists
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      })
    },
    onError: (error) => {
      console.error("Failed to create team:", error)
    },
  })
}

// Update team mutation
export function useUpdateTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.team.updateTeam.call,
    onSuccess: (data) => {
      // Invalidate and refetch team lists
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      })
      // Update specific team cache
      queryClient.setQueryData(teamKeys.detail(data.id), data)
    },
    onError: (error) => {
      console.error("Failed to update team:", error)
    },
  })
}

// Delete team mutation
export function useDeleteTeam() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.team.deleteTeam.call,
    onSuccess: () => {
      // Invalidate and refetch team lists
      queryClient.invalidateQueries({
        queryKey: teamKeys.lists(),
      })
    },
    onError: (error) => {
      console.error("Failed to delete team:", error)
    },
  })
}
