"use client"

import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function AddItemDropdown() {
  const router = useRouter()

  const handleNewPokemon = () => {
    // Navigate to Pokemon page where they can create new Pokemon
    router.push("/dashboard/pokemon")
    toast.success("Navigate to Pokemon page to create new Pokemon")
  }

  const handleNewTeam = () => {
    // Navigate to Teams page where they can create new team
    router.push("/dashboard/teams")
    toast.success("Navigate to Teams page to create new team")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Pokemon</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleNewPokemon}>
          <Plus className="mr-2 h-4 w-4" />
          New Pokemon
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Teams</DropdownMenuLabel>
        <DropdownMenuItem onClick={handleNewTeam}>
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
