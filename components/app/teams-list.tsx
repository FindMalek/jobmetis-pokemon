"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function TeamsList() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Teams</h3>
          <p className="text-muted-foreground text-sm">
            Create and manage your Pokemon teams
          </p>
        </div>
        <Button>Create New Team</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder for teams */}
        <Card className="p-6 text-center">
          <div className="space-y-4">
            <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
              <span className="text-2xl">⚔️</span>
            </div>
            <div>
              <h4 className="font-medium">No teams yet</h4>
              <p className="text-muted-foreground text-sm">
                Create your first team to start battling
              </p>
            </div>
            <Button variant="outline" size="sm">
              Create Team
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
