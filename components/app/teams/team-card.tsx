"use client"

import type { TeamRo } from "@/schemas/team"

import { TeamService } from "@/lib/services"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TeamCardProps {
  team: TeamRo
  onEdit: (team: TeamRo) => void
  onBattleReady: (team: TeamRo) => void
}

export function TeamCard({ team, onEdit, onBattleReady }: TeamCardProps) {
  const averagePower = TeamService.getAveragePower(team)
  const isBattleReady = TeamService.isBattleReady(team)

  return (
    <Card className="transition-shadow hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="truncate text-lg">{team.name}</CardTitle>
          <Badge variant="secondary">⚡{team.totalPower}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Pokemon Preview Grid */}
          <div className="grid grid-cols-3 gap-1">
            {team.members.slice(0, 6).map((pokemon, index) => (
              <div key={index} className="group relative">
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="aspect-square w-full rounded object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                  }}
                />
                <div className="absolute inset-0 rounded bg-black/0 transition-colors group-hover:bg-black/20" />
                <Badge
                  style={{ backgroundColor: pokemon.type.color }}
                  className="absolute bottom-0 right-0 origin-bottom-right scale-75 text-xs text-white"
                >
                  {pokemon.type.name.charAt(0)}
                </Badge>
              </div>
            ))}
          </div>

          {/* Team Stats */}
          <div className="text-muted-foreground flex justify-between text-sm">
            <span>{team.members.length} Pokemon</span>
            <span>Avg Power: {averagePower}</span>
          </div>

          {/* Battle Ready Indicator */}
          {isBattleReady && (
            <div className="flex items-center justify-center text-sm font-medium text-green-600">
              ✅ Battle Ready
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(team)}
            >
              Edit Team
            </Button>
            <Button
              size="sm"
              className="flex-1"
              onClick={() => onBattleReady(team)}
              disabled={!isBattleReady}
              variant={isBattleReady ? "default" : "secondary"}
            >
              {isBattleReady ? "Battle Ready" : `${team.members.length}/6`}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
