"use client"

import { orpc } from "@/orpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys factory
export const battleKeys = {
  all: ["battles"] as const,
  lists: () => [...battleKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...battleKeys.lists(), filters] as const,
  details: () => [...battleKeys.all, "detail"] as const,
  detail: (id: string) => [...battleKeys.details(), id] as const,
  typeChart: () => [...battleKeys.all, "typeChart"] as const,
}

// Get battle summary
export function useBattleSummary(battleId: string) {
  return useQuery({
    queryKey: battleKeys.detail(battleId),
    queryFn: () => orpc.battle.getBattleSummary.call({ battleId }),
    enabled: !!battleId,
    staleTime: 5 * 60 * 1000,
  })
}

// Start battle mutation
export function useStartBattle() {
  return useMutation({
    mutationFn: (data: { team1Id: string; team2Id: string }) =>
      orpc.battle.startBattle.call(data),
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
    queryKey: battleKeys.typeChart(),
    queryFn: () => orpc.battle.getFullTypeChart.call({}),
    staleTime: 10 * 60 * 1000, // Type chart rarely changes
  })
}
