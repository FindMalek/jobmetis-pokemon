"use client"

import { useState } from "react"
import { useStartBattle, useTeams } from "@/orpc/hooks"
import type { BattleResultRo } from "@/schemas/battle"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

export function BattleArena() {
  const [selectedTeam1, setSelectedTeam1] = useState<string>("")
  const [selectedTeam2, setSelectedTeam2] = useState<string>("")
  const [battleResult, setBattleResult] = useState<BattleResultRo | null>(null)
  const [showBattleAnimation, setShowBattleAnimation] = useState(false)

  const { data: teams, isLoading: teamsLoading } = useTeams()
  const startBattleMutation = useStartBattle()

  const handleStartBattle = async () => {
    if (!selectedTeam1 || !selectedTeam2) {
      toast.error("Please select both teams")
      return
    }

    if (selectedTeam1 === selectedTeam2) {
      toast.error("Teams cannot battle themselves")
      return
    }

    setShowBattleAnimation(true)
    setBattleResult(null)

    try {
      const result = await startBattleMutation.mutateAsync({
        team1Id: selectedTeam1,
        team2Id: selectedTeam2,
      })

      // Simulate battle animation delay
      setTimeout(() => {
        setBattleResult(result)
        setShowBattleAnimation(false)
        toast.success("Battle completed!")
      }, 2000)
    } catch (error) {
      setShowBattleAnimation(false)
      toast.error("Battle failed to start")
      console.error(error)
    }
  }

  const resetBattle = () => {
    setBattleResult(null)
    setSelectedTeam1("")
    setSelectedTeam2("")
  }

  const getSelectedTeam = (teamId: string) => {
    return teams?.find((team) => team.id === teamId)
  }

  if (teamsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-40 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">Battle Arena</h2>
        <p className="text-muted-foreground mt-2">
          Select two teams and watch them battle!
        </p>
      </div>

      {!battleResult ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team 1 Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <span className="text-lg">🔵</span>
                Team 1
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team 1" />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      disabled={team.id === selectedTeam2}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span>{team.name}</span>
                        <Badge variant="outline">⚡{team.totalPower}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTeam1 && getSelectedTeam(selectedTeam1) && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {getSelectedTeam(selectedTeam1)!.members.map(
                      (pokemon, index) => (
                        <div key={index} className="group relative">
                          <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="aspect-square w-full rounded-lg border-2 border-blue-200 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                            }}
                          />
                          <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors group-hover:bg-black/20" />
                          <Badge
                            style={{ backgroundColor: pokemon.type.color }}
                            className="absolute bottom-1 right-1 scale-75 text-xs text-white"
                          >
                            {pokemon.type.name.charAt(0)}
                          </Badge>
                          <div className="absolute left-1 top-1 rounded bg-white/90 px-1 text-xs">
                            ⚡{pokemon.power}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="text-muted-foreground text-center text-sm">
                    Total Power: {getSelectedTeam(selectedTeam1)!.totalPower}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Team 2 Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <span className="text-lg">🔴</span>
                Team 2
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Team 2" />
                </SelectTrigger>
                <SelectContent>
                  {teams?.map((team) => (
                    <SelectItem
                      key={team.id}
                      value={team.id}
                      disabled={team.id === selectedTeam1}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span>{team.name}</span>
                        <Badge variant="outline">⚡{team.totalPower}</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedTeam2 && getSelectedTeam(selectedTeam2) && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    {getSelectedTeam(selectedTeam2)!.members.map(
                      (pokemon, index) => (
                        <div key={index} className="group relative">
                          <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="aspect-square w-full rounded-lg border-2 border-red-200 object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                            }}
                          />
                          <div className="absolute inset-0 rounded-lg bg-black/0 transition-colors group-hover:bg-black/20" />
                          <Badge
                            style={{ backgroundColor: pokemon.type.color }}
                            className="absolute bottom-1 right-1 scale-75 text-xs text-white"
                          >
                            {pokemon.type.name.charAt(0)}
                          </Badge>
                          <div className="absolute left-1 top-1 rounded bg-white/90 px-1 text-xs">
                            ⚡{pokemon.power}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="text-muted-foreground text-center text-sm">
                    Total Power: {getSelectedTeam(selectedTeam2)!.totalPower}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Battle Animation/Loading */}
      {showBattleAnimation && (
        <Card>
          <CardContent className="p-8">
            <div className="space-y-6 text-center">
              <div className="animate-bounce text-4xl">⚔️</div>
              <div>
                <h3 className="text-lg font-medium">Battle in Progress!</h3>
                <p className="text-muted-foreground text-sm">
                  Watch the epic showdown unfold...
                </p>
              </div>
              <Progress value={100} className="animate-pulse" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Battle Controls */}
      {!battleResult && !showBattleAnimation && (
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button
            onClick={handleStartBattle}
            disabled={
              !selectedTeam1 || !selectedTeam2 || startBattleMutation.isPending
            }
            size="lg"
            className="w-full sm:w-auto"
          >
            {startBattleMutation.isPending
              ? "Starting Battle..."
              : "Start Battle!"}
          </Button>
        </div>
      )}

      {/* Battle Results */}
      {battleResult && (
        <div className="space-y-6">
          {/* Winner Announcement */}
          <Card className="border-2 border-yellow-400 bg-yellow-50">
            <CardContent className="p-6 text-center">
              <div className="mb-2 text-4xl">🏆</div>
              <h3 className="text-xl font-bold text-yellow-800">
                {battleResult.winner === "team1"
                  ? battleResult.team1.name
                  : battleResult.team2.name}{" "}
                Wins!
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Battle completed in {battleResult.totalRounds} round(s) (
                {battleResult.battleDuration}ms)
              </p>
            </CardContent>
          </Card>

          {/* Battle Rounds */}
          <Card>
            <CardHeader>
              <CardTitle>Battle Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80">
                <div className="space-y-4">
                  {battleResult.rounds.map((round, index) => (
                    <div key={index} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium">
                          Round {round.roundNumber}
                        </h4>
                        <Badge
                          variant={
                            round.winner === "pokemon1"
                              ? "default"
                              : "secondary"
                          }
                        >
                          Winner:{" "}
                          {round.winner === "pokemon1"
                            ? round.pokemon1.name
                            : round.pokemon2.name}
                        </Badge>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Pokemon 1 */}
                        <div className="flex items-center gap-3 rounded bg-blue-50 p-3">
                          <img
                            src={round.pokemon1.image}
                            alt={round.pokemon1.name}
                            className="h-12 w-12 rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${round.pokemon1.name}`
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                              {round.pokemon1.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge
                                style={{
                                  backgroundColor: round.pokemon1.type.color,
                                }}
                                className="text-white"
                              >
                                {round.pokemon1.type.displayName}
                              </Badge>
                              <span>DMG: {round.damage1}</span>
                              {round.typeEffectiveness1 !== 1 && (
                                <span
                                  className={
                                    round.typeEffectiveness1 > 1
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {round.typeEffectiveness1}x
                                </span>
                              )}
                            </div>
                            <Progress
                              value={
                                (round.pokemon1.currentLife /
                                  round.pokemon1.life) *
                                100
                              }
                              className="mt-1 h-2"
                            />
                            <div className="text-muted-foreground text-xs">
                              {Math.max(0, round.pokemon1.currentLife)}/
                              {round.pokemon1.life} HP
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-center">
                          <span className="text-2xl">⚔️</span>
                        </div>

                        {/* Pokemon 2 */}
                        <div className="flex items-center gap-3 rounded bg-red-50 p-3">
                          <img
                            src={round.pokemon2.image}
                            alt={round.pokemon2.name}
                            className="h-12 w-12 rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${round.pokemon2.name}`
                            }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-medium">
                              {round.pokemon2.name}
                            </p>
                            <div className="flex items-center gap-2 text-xs">
                              <Badge
                                style={{
                                  backgroundColor: round.pokemon2.type.color,
                                }}
                                className="text-white"
                              >
                                {round.pokemon2.type.displayName}
                              </Badge>
                              <span>DMG: {round.damage2}</span>
                              {round.typeEffectiveness2 !== 1 && (
                                <span
                                  className={
                                    round.typeEffectiveness2 > 1
                                      ? "text-green-600"
                                      : "text-red-600"
                                  }
                                >
                                  {round.typeEffectiveness2}x
                                </span>
                              )}
                            </div>
                            <Progress
                              value={
                                (round.pokemon2.currentLife /
                                  round.pokemon2.life) *
                                100
                              }
                              className="mt-1 h-2"
                            />
                            <div className="text-muted-foreground text-xs">
                              {Math.max(0, round.pokemon2.currentLife)}/
                              {round.pokemon2.life} HP
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Battle Again */}
          <div className="flex justify-center">
            <Button onClick={resetBattle} variant="outline" size="lg">
              Battle Again
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {teams?.length === 0 && (
        <Card className="p-8 text-center">
          <div className="space-y-4">
            <div className="text-6xl">⚔️</div>
            <div>
              <h3 className="font-medium">No Teams Available</h3>
              <p className="text-muted-foreground text-sm">
                Create at least 2 teams to start battling
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Type Effectiveness Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Type Effectiveness Quick Reference
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-center sm:grid-cols-3">
            <div className="rounded-lg bg-red-50 p-4">
              <div className="mb-2 text-lg font-medium text-red-600">
                🔥 Fire
              </div>
              <div className="text-muted-foreground text-sm">
                <div className="text-green-600">Strong vs Grass (2x)</div>
                <div className="text-red-600">Weak vs Water (0.5x)</div>
              </div>
            </div>
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="mb-2 text-lg font-medium text-blue-600">
                💧 Water
              </div>
              <div className="text-muted-foreground text-sm">
                <div className="text-green-600">Strong vs Fire (2x)</div>
                <div className="text-red-600">Weak vs Grass (0.5x)</div>
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="mb-2 text-lg font-medium text-green-600">
                🌿 Grass
              </div>
              <div className="text-muted-foreground text-sm">
                <div className="text-green-600">Strong vs Water (2x)</div>
                <div className="text-red-600">Weak vs Fire (0.5x)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
