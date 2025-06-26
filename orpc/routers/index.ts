import { pokemonTypeRouter } from "./pokemon-type"
import { pokemonRouter } from "./pokemon"
import { teamRouter } from "./team"
import { userRouter } from "./user"

export const appRouter = {
  user: userRouter,
  pokemonType: pokemonTypeRouter,
  pokemon: pokemonRouter,
  team: teamRouter,
}

export type AppRouter = typeof appRouter
