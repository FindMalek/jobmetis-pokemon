import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pokemon Dashboard",
  description: "Manage your Pokemon teams and battles",
}

export default async function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Pokemon Dashboard</h2>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-3">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Total Pokemon</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">15</div>
            <p className="text-muted-foreground text-xs">
              Fire, Water, and Grass types
            </p>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Teams Created</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">3</div>
            <p className="text-muted-foreground text-xs">Ready for battle</p>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Battles Won</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-muted-foreground text-xs">Victories achieved</p>
          </div>
        </div>
        <div className="rounded-lg border p-3">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Win Rate</h3>
          </div>
          <div>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-muted-foreground text-xs">
              12 wins out of 16 battles
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Quick Actions</h3>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border p-4 text-center">
            <h4 className="font-medium">Create New Team</h4>
            <p className="text-muted-foreground mt-2 text-sm">
              Build a team of 6 Pokemon for battle
            </p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <h4 className="font-medium">Start Battle</h4>
            <p className="text-muted-foreground mt-2 text-sm">
              Challenge another team to a Pokemon battle
            </p>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <h4 className="font-medium">View Pokemon</h4>
            <p className="text-muted-foreground mt-2 text-sm">
              Browse all available Pokemon and their stats
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
