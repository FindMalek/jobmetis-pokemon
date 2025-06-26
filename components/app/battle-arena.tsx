"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function BattleArena() {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Team Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Teams</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Team 1</label>
              <div className="mt-1 rounded-lg border-2 border-dashed p-4 text-center">
                <p className="text-muted-foreground text-sm">Select a team</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Team 2</label>
              <div className="mt-1 rounded-lg border-2 border-dashed p-4 text-center">
                <p className="text-muted-foreground text-sm">Select a team</p>
              </div>
            </div>
            <Button className="w-full" disabled>
              Start Battle
            </Button>
          </CardContent>
        </Card>

        {/* Battle Preview */}
        <Card>
          <CardHeader>
            <CardTitle>Battle Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="py-8 text-center">
                <div className="mb-4 text-6xl">⚔️</div>
                <h3 className="font-medium">Ready to Battle?</h3>
                <p className="text-muted-foreground text-sm">
                  Select two teams to start an epic Pokemon battle
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded bg-red-100 p-2">
                  <div className="font-medium text-red-600">🔥 Fire</div>
                  <div className="text-muted-foreground">vs Grass: 2x</div>
                </div>
                <div className="rounded bg-blue-100 p-2">
                  <div className="font-medium text-blue-600">💧 Water</div>
                  <div className="text-muted-foreground">vs Fire: 2x</div>
                </div>
                <div className="rounded bg-green-100 p-2">
                  <div className="font-medium text-green-600">🌿 Grass</div>
                  <div className="text-muted-foreground">vs Water: 2x</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Battle History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Battles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No battles yet</p>
            <p className="text-muted-foreground text-sm">
              Start your first battle to see results here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
