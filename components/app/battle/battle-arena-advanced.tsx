"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { BattleResultRo, BattleRoundRo } from "@/schemas/battle"
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Pause,
  Play,
  RotateCcw,
  Sword,
  Zap,
} from "lucide-react"

import { BattleEngineService } from "@/lib/services"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface BattleArenaAdvancedProps {
  battleResult: BattleResultRo
  onBattleComplete?: () => void
  autoPlay?: boolean
  className?: string
}

interface PokemonDisplayProps {
  pokemon: BattleRoundRo["pokemon1"] | BattleRoundRo["pokemon2"]
  damage?: number
  effectiveness?: number
  isActive: boolean
  isAttacking: boolean
  side: "left" | "right"
  isWinner: boolean
}

function PokemonDisplay({
  pokemon,
  damage,
  effectiveness,
  isActive,
  isAttacking,
  side,
  isWinner,
}: PokemonDisplayProps) {
  const [showDamage, setShowDamage] = useState(false)
  const healthPercentage = Math.max(
    0,
    Math.round((pokemon.currentLife / pokemon.life) * 100)
  )

  // Show damage animation when damage changes
  useEffect(() => {
    if (damage && damage > 0) {
      setShowDamage(true)
      const timer = setTimeout(() => setShowDamage(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [damage])

  const getHealthColor = (percentage: number) => {
    if (percentage > 60) return "bg-green-500"
    if (percentage > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getEffectivenessColor = (factor: number) => {
    if (factor > 1) return "text-green-400"
    if (factor < 1) return "text-red-400"
    return "text-gray-400"
  }

  return (
    <div
      className={cn(
        "relative flex flex-col items-center space-y-6 transition-all duration-500 ease-in-out",
        side === "left" ? "items-start" : "items-end",
        isAttacking && "animate-pulse",
        isWinner && "scale-105"
      )}
    >
      {/* Pokemon Name & Type */}
      <div
        className={cn(
          "flex flex-col items-center space-y-2",
          side === "right" && "items-end"
        )}
      >
        <div className="flex items-center space-x-2">
          <h3 className="text-foreground text-2xl font-bold">{pokemon.name}</h3>
          {isWinner && (
            <Badge
              variant="default"
              className="animate-bounce bg-yellow-500 text-black"
            >
              WINNER
            </Badge>
          )}
        </div>
        <Badge
          variant="outline"
          className="px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: pokemon.type.color + "15",
            borderColor: pokemon.type.color,
            color: pokemon.type.color,
          }}
        >
          {pokemon.type.displayName}
        </Badge>
      </div>

      {/* Health Bar */}
      <div className="w-full max-w-[320px] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-semibold">Health</span>
          </div>
          <span className="text-muted-foreground font-mono text-sm">
            {pokemon.currentLife}/{pokemon.life}
          </span>
        </div>

        <div className="relative">
          <div className="h-6 overflow-hidden rounded-full border-2 border-gray-300 bg-gray-200">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                getHealthColor(healthPercentage),
                healthPercentage > 0 && "shadow-lg"
              )}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold text-white drop-shadow-lg">
              {healthPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Pokemon Image Container */}
      <div
        className={cn(
          "group relative transition-all duration-300",
          isAttacking && "animate-bounce",
          isActive && "drop-shadow-2xl"
        )}
      >
        {/* Glow Effect */}
        <div
          className={cn(
            "absolute inset-0 rounded-full blur-xl transition-all duration-300",
            isActive ? "scale-110 bg-blue-400/30" : "bg-transparent",
            isWinner && "animate-pulse bg-yellow-400/40"
          )}
        />

        {/* Pokemon Image */}
        <div
          className={cn(
            "relative h-56 w-56 overflow-hidden rounded-full border-4 transition-all duration-300",
            isActive
              ? "border-blue-500 shadow-2xl shadow-blue-500/50"
              : "border-gray-300",
            pokemon.isDefeated && "opacity-60 grayscale",
            isWinner && "border-yellow-500 shadow-yellow-500/50"
          )}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent" />
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className="object-contain p-6 transition-all duration-300 group-hover:scale-105"
            priority
          />

          {/* Defeated Overlay */}
          {pokemon.isDefeated && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
              <div className="text-center">
                <span className="text-2xl font-bold text-white drop-shadow-lg">
                  DEFEATED
                </span>
                <div className="text-6xl opacity-50">💀</div>
              </div>
            </div>
          )}
        </div>

        {/* Power Badge */}
        <div
          className={cn(
            "absolute -bottom-3 -right-3 flex h-14 w-14 items-center justify-center rounded-full border-4 border-white transition-all duration-300",
            "bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg",
            isActive && "scale-110 animate-pulse"
          )}
        >
          <div className="text-center">
            <Sword className="mx-auto mb-1 h-4 w-4" />
            <span className="text-xs font-bold">{pokemon.power}</span>
          </div>
        </div>
      </div>

      {/* Damage Display */}
      {showDamage && damage && damage > 0 && (
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 transform animate-bounce">
          <div className="rounded-full border-2 border-red-300 bg-red-500 px-4 py-2 text-white shadow-lg">
            <div className="flex items-center space-x-1">
              <Zap className="h-4 w-4" />
              <span className="font-bold">-{damage}</span>
            </div>
          </div>
          {effectiveness && effectiveness !== 1 && (
            <div className="mt-2 text-center">
              <Badge
                variant="secondary"
                className={cn(
                  "text-xs font-bold",
                  getEffectivenessColor(effectiveness)
                )}
              >
                {BattleEngineService.getEffectivenessMessage(effectiveness)}
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function TeamDisplay({
  team,
  currentPokemonIndex,
}: {
  team: BattleResultRo["team1"]
  currentPokemonIndex: number
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white/50 p-4 backdrop-blur-sm dark:border-gray-700 dark:bg-gray-800/50">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-lg font-bold">{team.name}</h4>
        <Badge variant="outline" className="text-xs">
          {6 - team.defeatedCount} / 6 Active
        </Badge>
      </div>

      <div className="flex justify-center space-x-3">
        {team.members.map((pokemon, index) => {
          const isActive = index === currentPokemonIndex
          const isDefeated = index < team.defeatedCount

          return (
            <div
              key={`${pokemon.id}-${index}`}
              className={cn(
                "border-3 relative h-20 w-20 cursor-pointer rounded-xl transition-all duration-300 hover:scale-105",
                isActive
                  ? "scale-110 border-blue-500 shadow-lg ring-2 ring-blue-300"
                  : "border-gray-300",
                isDefeated && "opacity-40 grayscale"
              )}
            >
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                fill
                className="rounded-xl object-contain p-2"
              />

              {/* Position Number */}
              <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-blue-500 text-xs font-bold text-white">
                {index + 1}
              </div>

              {/* Active Indicator */}
              {isActive && !isDefeated && (
                <div className="absolute -right-1 -top-1 h-4 w-4 animate-pulse rounded-full border-2 border-white bg-green-500" />
              )}

              {/* Defeated Indicator */}
              {isDefeated && (
                <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-red-500/80 backdrop-blur-sm">
                  <span className="text-lg font-bold text-white">✕</span>
                </div>
              )}

              {/* Power Level Indicator */}
              <div className="absolute bottom-1 left-1 right-1 h-1 overflow-hidden rounded-full bg-gray-200">
                <div
                  className={cn(
                    "h-full transition-all duration-300",
                    pokemon.power > 80
                      ? "bg-purple-500"
                      : pokemon.power > 60
                        ? "bg-blue-500"
                        : pokemon.power > 40
                          ? "bg-green-500"
                          : "bg-yellow-500"
                  )}
                  style={{ width: `${(pokemon.power / 100) * 100}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function BattleArenaAdvanced({
  battleResult,
  onBattleComplete,
  autoPlay = false,
  className,
}: BattleArenaAdvancedProps) {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [battlePhase, setBattlePhase] = useState<
    "intro" | "fighting" | "complete"
  >("intro")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentRound = battleResult.rounds[currentRoundIndex]
  const isLastRound = currentRoundIndex === battleResult.rounds.length - 1

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isLastRound) {
      setBattlePhase("fighting")
      intervalRef.current = setInterval(() => {
        setCurrentRoundIndex((prev) => {
          if (prev >= battleResult.rounds.length - 1) {
            setIsPlaying(false)
            setBattlePhase("complete")
            return prev
          }
          return prev + 1
        })
      }, 2500) // 2.5 seconds per round
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isLastRound, battleResult.rounds.length])

  // Complete battle callback
  useEffect(() => {
    if (isLastRound && battlePhase === "complete") {
      onBattleComplete?.()
    }
  }, [isLastRound, battlePhase, onBattleComplete])

  const handlePrevious = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1)
      setIsPlaying(false)
      setBattlePhase("fighting")
    }
  }

  const handleNext = () => {
    if (currentRoundIndex < battleResult.rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1)
      setBattlePhase("fighting")
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) setBattlePhase("fighting")
  }

  const handleRestart = () => {
    setCurrentRoundIndex(0)
    setIsPlaying(false)
    setBattlePhase("intro")
  }

  if (!currentRound) {
    return (
      <Card className="p-12 text-center">
        <div className="space-y-4">
          <div className="text-6xl">⚔️</div>
          <h3 className="text-xl font-bold">No battle data available</h3>
          <p className="text-muted-foreground">Please start a new battle</p>
        </div>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Battle Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">⚔️ Epic Battle Arena</h1>
              <p className="text-blue-100">
                {battleResult.team1.name} vs {battleResult.team2.name}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-2xl font-bold">
                Round {currentRound.roundNumber}
              </div>
              <div className="text-sm text-blue-100">
                {battleResult.rounds.length} total rounds
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team 1 Display */}
      <TeamDisplay
        team={battleResult.team1}
        currentPokemonIndex={battleResult.team1.currentPokemonIndex}
      />

      {/* Main Battle Arena */}
      <Card className="border-2 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900">
        <CardContent className="p-8">
          {/* Battle Controls */}
          <div className="mb-8 flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevious}
              disabled={currentRoundIndex === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-5 w-5" />
              <span>Previous</span>
            </Button>

            <div className="flex items-center space-x-4">
              <Button
                variant={isPlaying ? "destructive" : "default"}
                size="lg"
                onClick={handlePlayPause}
                className="flex items-center space-x-2"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={handleRestart}
                className="flex items-center space-x-2"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Restart</span>
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleNext}
              disabled={isLastRound}
              className="flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          {/* Pokemon Battle Display */}
          <div className="grid min-h-[500px] grid-cols-1 items-center gap-8 lg:grid-cols-3">
            {/* Pokemon 1 */}
            <div className="flex justify-center">
              <PokemonDisplay
                pokemon={currentRound.pokemon1}
                damage={currentRound.damage2}
                effectiveness={currentRound.typeEffectiveness2}
                isActive={battlePhase === "fighting"}
                isAttacking={
                  battlePhase === "fighting" && currentRound.damage1 > 0
                }
                side="left"
                isWinner={currentRound.winner === "pokemon1"}
              />
            </div>

            {/* VS Section */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <div
                className={cn(
                  "text-6xl font-bold transition-all duration-300",
                  battlePhase === "fighting" && "scale-110 animate-pulse",
                  "bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent"
                )}
              >
                VS
              </div>

              {/* Round Result */}
              {currentRound.winner && (
                <div className="space-y-2 text-center">
                  <Badge
                    variant={
                      currentRound.winner === "draw" ? "secondary" : "default"
                    }
                    className={cn(
                      "px-4 py-2 text-lg font-bold",
                      currentRound.winner === "draw" && "bg-gray-500",
                      currentRound.winner === "pokemon1" && "bg-blue-500",
                      currentRound.winner === "pokemon2" && "bg-red-500",
                      battlePhase === "complete" && "animate-bounce"
                    )}
                  >
                    {currentRound.winner === "draw"
                      ? "DRAW!"
                      : currentRound.winner === "pokemon1"
                        ? `${currentRound.pokemon1.name} WINS!`
                        : `${currentRound.pokemon2.name} WINS!`}
                  </Badge>
                </div>
              )}

              {/* Battle Stats */}
              <div className="space-y-2 rounded-lg bg-white/80 p-4 text-center backdrop-blur-sm dark:bg-gray-800/80">
                <div className="text-muted-foreground text-sm">
                  Damage Dealt
                </div>
                <div className="flex justify-between space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentRound.damage1}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {currentRound.pokemon1.name}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {currentRound.damage2}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      {currentRound.pokemon2.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pokemon 2 */}
            <div className="flex justify-center">
              <PokemonDisplay
                pokemon={currentRound.pokemon2}
                damage={currentRound.damage1}
                effectiveness={currentRound.typeEffectiveness1}
                isActive={battlePhase === "fighting"}
                isAttacking={
                  battlePhase === "fighting" && currentRound.damage2 > 0
                }
                side="right"
                isWinner={currentRound.winner === "pokemon2"}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team 2 Display */}
      <TeamDisplay
        team={battleResult.team2}
        currentPokemonIndex={battleResult.team2.currentPokemonIndex}
      />

      {/* Battle Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Battle Progress</span>
              <span className="text-muted-foreground">
                Round {currentRoundIndex + 1} of {battleResult.rounds.length}
              </span>
            </div>

            <Progress
              value={
                ((currentRoundIndex + 1) / battleResult.rounds.length) * 100
              }
              className="h-3"
            />

            <div className="text-muted-foreground flex items-center justify-between text-sm">
              <span>
                Duration: {Math.round(battleResult.battleDuration / 1000)}s
              </span>
              <span className="text-foreground font-medium">
                🏆 Winner:{" "}
                {battleResult.winner === "team1"
                  ? battleResult.team1.name
                  : battleResult.team2.name}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
