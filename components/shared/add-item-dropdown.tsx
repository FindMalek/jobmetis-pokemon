"use client"

import { Plus } from "lucide-react"

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
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          New Pokemon
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Teams</DropdownMenuLabel>
        <DropdownMenuItem>
          <Plus className="mr-2 h-4 w-4" />
          New Team
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
