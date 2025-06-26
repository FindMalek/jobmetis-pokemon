import { Metadata } from "next"

import { TeamsList } from "@/components/app/teams-list"

export const metadata: Metadata = {
  title: "Teams - Pokemon Battle Arena",
  description: "Manage your Pokemon teams",
}

export default function TeamsPage() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Teams</h2>
          <p className="text-muted-foreground">
            Create and manage your Pokemon teams for battle
          </p>
        </div>
      </div>
      <TeamsList />
    </div>
  )
}
