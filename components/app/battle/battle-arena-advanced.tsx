"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import type { BattleResultRo, BattleRoundRo } from "@/schemas/battle"
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react"

import { BattleEngineService } from "@/lib/services"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
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
}

function PokemonDisplay({
  pokemon,
  damage,
  effectiveness,
  isActive,
  isAttacking,
  side,
}: PokemonDisplayProps) {
  const healthPercentage = Math.max(
    0,
    Math.round((pokemon.currentLife / pokemon.life) * 100)
  )
  const healthColor = BattleEngineService.getHealthBarColor(healthPercentage)

  return (
    <div
      className={cn(
        "relative flex flex-col items-center space-y-4 transition-all duration-300",
        side === "left" ? "items-start" : "items-end",
        isAttacking && "translate-x-2 transform",
        isActive && "scale-105"
      )}
    >
      {/* Pokemon Info Header */}
      <div
        className={cn(
          "flex items-center space-x-3",
          side === "right" && "flex-row-reverse space-x-reverse"
        )}
      >
        <div className="text-center">
          <h3 className="text-foreground text-xl font-bold">{pokemon.name}</h3>
          <Badge
            variant="outline"
            className="text-xs"
            style={{
              backgroundColor: pokemon.type.color + "20",
              borderColor: pokemon.type.color,
            }}
          >
            {pokemon.type.displayName}
          </Badge>
        </div>
      </div>

      {/* Health Bar */}
      <div className="w-full max-w-[300px] space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">HP</span>
          <span className="text-muted-foreground">
            {pokemon.currentLife}/{pokemon.life}
          </span>
        </div>
        <div className="relative h-4 overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              healthColor.replace("bg-", "bg-")
            )}
            style={{ width: `${healthPercentage}%` }}
          />
        </div>
        <div className="text-muted-foreground text-center text-xs">
          {healthPercentage}% Health
        </div>
      </div>

      {/* Pokemon Image */}
      <div
        className={cn(
          "relative transition-all duration-200",
          isAttacking && "rotate-2 transform"
        )}
      >
        <div
          className={cn(
            "relative h-48 w-48 rounded-full border-4 transition-all duration-300",
            isActive
              ? "border-primary shadow-primary/50 shadow-lg"
              : "border-gray-300",
            pokemon.isDefeated && "opacity-50 grayscale"
          )}
        >
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className="object-contain p-4"
          />

          {/* Defeated Overlay */}
          {pokemon.isDefeated && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
              <span className="text-lg font-bold text-white">DEFEATED</span>
            </div>
          )}
        </div>

        {/* Power Badge */}
        <div className="bg-primary text-primary-foreground absolute -bottom-2 -right-2 flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold">
          {pokemon.power}
        </div>
      </div>

      {/* Damage & Effectiveness Display */}
      {damage && damage > 0 && (
        <div className="absolute left-1/2 top-0 z-10 -translate-x-1/2 transform animate-bounce">
          <div className="rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
            -{damage}
          </div>
          {effectiveness && effectiveness !== 1 && (
            <div className="mt-1 text-center">
              <Badge variant="secondary" className="text-xs">
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
  isPlayerTeam = false,
}: {
  team: BattleResultRo["team1"]
  currentPokemonIndex: number
  isPlayerTeam?: boolean
}) {
  return (
    <div
      className={cn(
        "flex justify-center space-x-2 py-4",
        isPlayerTeam ? "order-2" : "order-1"
      )}
    >
      {team.members.map((pokemon, index) => (
        <div
          key={pokemon.id}
          className={cn(
            "relative h-16 w-16 rounded-full border-2 transition-all duration-300 hover:scale-110",
            index === currentPokemonIndex
              ? "border-primary ring-primary/50 scale-110 ring-2"
              : "border-gray-300",
            index < team.defeatedCount && "opacity-50 grayscale"
          )}
        >
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            fill
            className="rounded-full object-contain p-1"
          />

          {/* Position Number */}
          <div className="bg-primary text-primary-foreground absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold">
            {index + 1}
          </div>

          {/* Defeated X */}
          {index < team.defeatedCount && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-red-500/80">
              <span className="text-sm font-bold text-white">✕</span>
            </div>
          )}
        </div>
      ))}
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
  const [showDamage, setShowDamage] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentRound = battleResult.rounds[currentRoundIndex]
  const isLastRound = currentRoundIndex === battleResult.rounds.length - 1

  // Auto-play functionality
  useEffect(() => {
    if (isPlaying && !isLastRound) {
      intervalRef.current = setInterval(() => {
        setCurrentRoundIndex((prev) => {
          if (prev >= battleResult.rounds.length - 1) {
            setIsPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 3000) // 3 seconds per round
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isLastRound, battleResult.rounds.length])

  // Show damage animation
  useEffect(() => {
    setShowDamage(true)
    const timer = setTimeout(() => setShowDamage(false), 2000)
    return () => clearTimeout(timer)
  }, [currentRoundIndex])

  // Complete battle callback
  useEffect(() => {
    if (isLastRound && isPlaying) {
      setIsPlaying(false)
      onBattleComplete?.()
    }
  }, [isLastRound, isPlaying, onBattleComplete])

  const handlePrevious = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1)
      setIsPlaying(false)
    }
  }

  const handleNext = () => {
    if (currentRoundIndex < battleResult.rounds.length - 1) {
      setCurrentRoundIndex(currentRoundIndex + 1)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleRestart = () => {
    setCurrentRoundIndex(0)
    setIsPlaying(false)
  }

  if (!currentRound) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No battle data available</p>
      </Card>
    )
  }

  return (
    <Card
      className={cn(
        "bg-gradient-to-br from-blue-50 to-purple-50 p-6 dark:from-blue-950 dark:to-purple-950",
        className
      )}
    >
      {/* Team 1 Display */}
      <TeamDisplay
        team={battleResult.team1}
        currentPokemonIndex={battleResult.team1.currentPokemonIndex}
        isPlayerTeam={false}
      />

      {/* Battle Control Header */}
      <div className="flex items-center justify-between border-b py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
          disabled={currentRoundIndex === 0}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Previous
        </Button>

        <div className="space-y-2 text-center">
          <h2 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            ROUND {currentRound.roundNumber}
          </h2>
          <div className="flex items-center justify-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePlayPause}>
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleNext}
          disabled={isLastRound}
        >
          Next
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>

      {/* Main Battle Arena */}
      <div className="py-8">
        <div className="grid grid-cols-2 items-center gap-8">
          {/* Pokemon 1 */}
          <PokemonDisplay
            pokemon={currentRound.pokemon1}
            damage={showDamage ? currentRound.damage2 : undefined}
            effectiveness={currentRound.typeEffectiveness2}
            isActive={currentRound.winner === "pokemon1"}
            isAttacking={showDamage && currentRound.damage1 > 0}
            side="left"
          />

          {/* VS Divider */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={cn(
                "text-primary text-4xl font-bold transition-all duration-300",
                showDamage && "scale-125"
              )}
            >
              VS
            </div>

            {/* Round Winner Badge */}
            {currentRound.winner && (
              <Badge
                variant={
                  currentRound.winner === "draw" ? "secondary" : "default"
                }
                className="animate-pulse text-sm font-bold"
              >
                {currentRound.winner === "draw"
                  ? "Draw!"
                  : `${currentRound.winner === "pokemon1" ? currentRound.pokemon1.name : currentRound.pokemon2.name} Wins!`}
              </Badge>
            )}
          </div>

          {/* Pokemon 2 */}
          <PokemonDisplay
            pokemon={currentRound.pokemon2}
            damage={showDamage ? currentRound.damage1 : undefined}
            effectiveness={currentRound.typeEffectiveness1}
            isActive={currentRound.winner === "pokemon2"}
            isAttacking={showDamage && currentRound.damage2 > 0}
            side="right"
          />
        </div>
      </div>

      {/* Team 2 Display */}
      <TeamDisplay
        team={battleResult.team2}
        currentPokemonIndex={battleResult.team2.currentPokemonIndex}
        isPlayerTeam={true}
      />

      {/* Battle Status Footer */}
      <div className="border-t pt-4">
        <div className="text-muted-foreground flex items-center justify-between text-sm">
          <span>
            Round {currentRound.roundNumber} of {battleResult.totalRounds}
          </span>
          <span>
            Duration: {Math.round(battleResult.battleDuration / 1000)}s
          </span>
          <span className="font-medium">
            Winner:{" "}
            <span className="text-primary">
              {battleResult.winner === "team1"
                ? battleResult.team1.name
                : battleResult.team2.name}
            </span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mt-2">
          <Progress
            value={((currentRoundIndex + 1) / battleResult.rounds.length) * 100}
            className="h-2"
          />
        </div>
      </div>
    </Card>
  )
}
