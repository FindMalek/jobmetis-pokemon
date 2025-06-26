import { Metadata } from "next"

import { PokemonList } from "@/components/app/pokemon-list"

export const metadata: Metadata = {
  title: "Pokemon - Pokemon Battle Arena",
  description: "Browse and manage all available Pokemon",
}

export default function PokemonPage() {
  return (
    <div className="flex-1 space-y-6 p-6 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Pokemon</h2>
          <p className="text-muted-foreground">
            Browse and manage all available Pokemon
          </p>
        </div>
      </div>
      <PokemonList />
    </div>
  )
}
