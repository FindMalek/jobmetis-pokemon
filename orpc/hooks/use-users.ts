"use client"

import { orpc } from "@/orpc/client"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

// Query keys factory
export const userKeys = {
  all: ["users"] as const,
  waitlistCount: () => [...userKeys.all, "waitlistCount"] as const,
  userCount: () => [...userKeys.all, "userCount"] as const,
}

// Join waitlist mutation
export function useJoinWaitlist() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: orpc.user.joinWaitlist.call,
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate waitlist count to refetch
        queryClient.invalidateQueries({
          queryKey: userKeys.waitlistCount(),
        })
      }
    },
    onError: (error) => {
      console.error("Failed to join waitlist:", error)
    },
  })
}

// Get waitlist count
export function useWaitlistCount() {
  return useQuery({
    queryKey: userKeys.waitlistCount(),
    queryFn: () => orpc.user.getWaitlistCount.call({}),
    staleTime: 30 * 1000, // 30 seconds - more responsive for waitlist count
    refetchOnWindowFocus: true, // Refetch when user returns to the page
  })
}

// Get user count
export function useUserCount() {
  return useQuery({
    queryKey: userKeys.userCount(),
    queryFn: () => orpc.user.getUserCount.call({}),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
