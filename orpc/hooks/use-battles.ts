"use client"

import { orpc } from "@/orpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys factory
export const battleKeys = {
  all: ["battles"] as const,
  lists: () => [...battleKeys.all, "list"] as const,
  list: (filters: string) => [...battleKeys.lists(), { filters }] as const,
  details: () => [...battleKeys.all, "detail"] as const,
  detail: (id: string) => [...battleKeys.details(), id] as const,
}

// Get battle summary
export function useBattleSummary(battleId: string) {
  return useQuery({
    queryKey: battleKeys.detail(battleId),
    queryFn: () => orpc.battle.getBattleSummary.call({ battleId }),
    enabled: !!battleId,
  })
}

// Start battle mutation
export function useStartBattle() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.battle.startBattle.call,
    onSuccess: () => {
      // Invalidate battle lists to show new battle
      queryClient.invalidateQueries({
        queryKey: battleKeys.lists(),
      })
    },
    onError: (error) => {
      console.error("Failed to start battle:", error)
    },
  })
}

// Get type effectiveness chart
export function useTypeEffectivenessChart(
  attackerTypeId: string,
  defenderTypeId: string
) {
  return useQuery({
    queryKey: [
      ...battleKeys.all,
      "effectiveness",
      attackerTypeId,
      defenderTypeId,
    ],
    queryFn: () =>
      orpc.battle.getTypeEffectivenessChart.call({
        attackerTypeId,
        defenderTypeId,
      }),
    enabled: !!attackerTypeId && !!defenderTypeId,
    staleTime: 10 * 60 * 1000, // 10 minutes - effectiveness rarely changes
  })
}

// Get full type effectiveness chart
export function useFullTypeChart() {
  return useQuery({
    queryKey: [...battleKeys.all, "fullTypeChart"],
    queryFn: () => orpc.battle.getFullTypeChart.call({}),
    staleTime: 15 * 60 * 1000, // 15 minutes - effectiveness rarely changes
  })
}
