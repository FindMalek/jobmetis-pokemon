import { database } from "@/prisma/client"

export const GET = async () => {
  // Simple health check using Pokemon types table
  const pokemonTypesCount = await database.pokemonType.count()

  return Response.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    pokemonTypesCount,
  })
}
