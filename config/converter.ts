// Pokemon-specific conversion functions

export function convertPokemonTypeToDisplayName(type: string): string {
  switch (type.toUpperCase()) {
    case "FIRE":
      return "🔥 Fire"
    case "WATER":
      return "💧 Water"
    case "GRASS":
      return "🌱 Grass"
    default:
      return type
  }
}

export function convertBattleResultToString(
  winner?: "team1" | "team2"
): string {
  if (!winner) return "Draw"
  return winner === "team1" ? "Team 1 Wins" : "Team 2 Wins"
}

export function convertPowerToRating(power: number): string {
  if (power >= 90) return "Legendary"
  if (power >= 75) return "Elite"
  if (power >= 60) return "Strong"
  if (power >= 45) return "Average"
  return "Weak"
}
