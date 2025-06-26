"use client"

import { useUserCount } from "@/orpc/hooks"

import { StatCard } from "@/components/shared/stat-card"

export function MarketingStats() {
  const { data: userData, isLoading: userLoading } = useUserCount()

  const userCount = userData?.total ?? 0

  return (
    <section className="w-full px-4 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="xs:grid-cols-2 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          <StatCard
            value={userLoading ? "..." : userCount.toString()}
            label="POKEMON TRAINERS"
          />
          <StatCard value="150+" label="POKEMON SPECIES" />
          <div className="xs:col-span-2 lg:col-span-1">
            <StatCard value="∞" label="BATTLES TO WIN" />
          </div>
        </div>
      </div>
    </section>
  )
}
