import { pokemonTypeRouter } from "./pokemon-type"
import { userRouter } from "./user"

export const appRouter = {
  user: userRouter,
  pokemonType: pokemonTypeRouter,
}

export type AppRouter = typeof appRouter
