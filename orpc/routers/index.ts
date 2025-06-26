import { battleRouter } from "./battle"
import { pokemonRouter } from "./pokemon"
import { pokemonTypeRouter } from "./pokemon-type"
import { teamRouter } from "./team"
import { userRouter } from "./user"

export const appRouter = {
  user: userRouter,
  pokemonType: pokemonTypeRouter,
  pokemon: pokemonRouter,
  team: teamRouter,
  battle: battleRouter,
}

export type AppRouter = typeof appRouter
