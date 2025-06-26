import { router } from "../context"
import { pokemonRouter } from "./pokemon"
import { pokemonTypeRouter } from "./pokemon-type"
import { teamRouter } from "./team"
import { battleRouter } from "./battle"
import { userRouter } from "./user"

export const appRouter = router({
  user: userRouter,
  pokemonType: pokemonTypeRouter,
  pokemon: pokemonRouter,
  team: teamRouter,
  battle: battleRouter,
})

export type AppRouter = typeof appRouter
