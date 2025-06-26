"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useStartBattle, useTeams } from "@/orpc/hooks"
import type { BattleResultRo } from "@/schemas/battle"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

import { BattleArenaAdvanced } from "./battle"

export function BattleArena() {
  const [selectedTeam1, setSelectedTeam1] = useState<string>("")
  const [selectedTeam2, setSelectedTeam2] = useState<string>("")
  const [battleResult, setBattleResult] = useState<BattleResultRo | null>(null)
  const [showBattleAnimation, setShowBattleAnimation] = useState(false)

  const searchParams = useSearchParams()
  const preSelectedTeam = searchParams.get("team")

  const { data: teams, isLoading: teamsLoading } = useTeams()
  const startBattleMutation = useStartBattle()

  // Pre-select team from URL parameter
  useEffect(() => {
    if (preSelectedTeam && teams && !selectedTeam1) {
      const team = teams.find((t) => t.id === preSelectedTeam)
      if (team) {
        setSelectedTeam1(preSelectedTeam)
        toast.success(`${team.name} selected for battle!`)
      }
    }
  }, [preSelectedTeam, teams, selectedTeam1])

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
        toast.success("Battle simulation complete!")
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

  const handleBattleComplete = () => {
    const winnerName =
      battleResult?.winner === "team1"
        ? battleResult.team1.name
        : battleResult?.team2.name
    toast.success(`🏆 ${winnerName} wins the battle!`)
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

  // Show advanced battle visualization if battle result exists
  if (battleResult) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🔥 Epic Battle Arena</h1>
            <p className="text-muted-foreground">
              {battleResult.team1.name} vs {battleResult.team2.name} •{" "}
              {battleResult.totalRounds} Rounds •{" "}
              {Math.round(battleResult.battleDuration / 1000)}s
            </p>
          </div>
          <Button onClick={resetBattle} variant="outline">
            🆕 New Battle
          </Button>
        </div>

        <BattleArenaAdvanced
          battleResult={battleResult}
          onBattleComplete={handleBattleComplete}
          autoPlay={true}
          className="min-h-[700px]"
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold sm:text-3xl">
          ⚔️ Pokemon Battle Arena
        </h2>
        <p className="text-muted-foreground mt-2">
          Select two teams and watch an epic battle unfold with advanced
          visualization!
        </p>
      </div>

      {showBattleAnimation && (
        <Card className="bg-gradient-to-r from-blue-50 to-red-50 p-8 text-center">
          <div className="space-y-4">
            <div className="animate-pulse text-4xl">⚡</div>
            <h3 className="text-xl font-bold">Battle in Progress...</h3>
            <p className="text-muted-foreground">
              Simulating epic Pokemon combat
            </p>
          </div>
        </Card>
      )}

      {!showBattleAnimation && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Team 1 Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <span className="text-lg">🔵</span>
                Team 1 (Challenger)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTeam1} onValueChange={setSelectedTeam1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Challenger Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    ?.filter((team) => team.members.length === 6)
                    .map((team) => (
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
                            className="aspect-square w-full rounded-lg border-2 border-blue-200 object-cover transition-all group-hover:scale-105"
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
                            {pokemon.type.name.charAt(0).toUpperCase()}
                          </Badge>
                          <div className="absolute left-1 top-1 rounded bg-white/90 px-1 text-xs font-bold">
                            ⚡{pokemon.power}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="text-muted-foreground text-center text-sm">
                    Total Power:{" "}
                    <span className="font-bold text-blue-600">
                      {getSelectedTeam(selectedTeam1)!.totalPower}
                    </span>
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
                Team 2 (Defender)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedTeam2} onValueChange={setSelectedTeam2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Defender Team" />
                </SelectTrigger>
                <SelectContent>
                  {teams
                    ?.filter((team) => team.members.length === 6)
                    .map((team) => (
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
                            className="aspect-square w-full rounded-lg border-2 border-red-200 object-cover transition-all group-hover:scale-105"
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
                            {pokemon.type.name.charAt(0).toUpperCase()}
                          </Badge>
                          <div className="absolute left-1 top-1 rounded bg-white/90 px-1 text-xs font-bold">
                            ⚡{pokemon.power}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  <div className="text-muted-foreground text-center text-sm">
                    Total Power:{" "}
                    <span className="font-bold text-red-600">
                      {getSelectedTeam(selectedTeam2)!.totalPower}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Battle Button */}
      {!showBattleAnimation && (
        <div className="text-center">
          <Button
            onClick={handleStartBattle}
            disabled={
              !selectedTeam1 || !selectedTeam2 || startBattleMutation.isPending
            }
            size="lg"
            className="min-w-[300px] text-lg font-bold"
          >
            {startBattleMutation.isPending
              ? "⚡ Starting Battle..."
              : "🔥 Start Epic Battle"}
          </Button>

          {(!teams ||
            teams.filter((t) => t.members.length === 6).length < 2) && (
            <div className="mt-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <p className="text-sm text-yellow-800">
                ⚠️ You need at least 2 complete teams (6 Pokemon each) to
                battle!
              </p>
              <Button
                variant="link"
                onClick={() => (window.location.href = "/dashboard/teams")}
              >
                Create Teams →
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
