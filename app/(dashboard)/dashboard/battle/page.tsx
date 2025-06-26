import { Metadata } from "next"

import { BattleArena } from "@/components/app/battle-arena"

export const metadata: Metadata = {
  title: "Battle Arena - Pokemon Battle Arena",
  description: "Start Pokemon battles between teams",
}

export default function BattlePage() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Battle Arena</h2>
          <p className="text-muted-foreground">
            Start battles between Pokemon teams
          </p>
        </div>
      </div>
      <BattleArena />
    </div>
  )
}
