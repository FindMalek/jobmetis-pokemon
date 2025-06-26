"use client"

import type { PokemonRo } from "@/schemas/pokemon"
import { createTeamDtoSchema, type CreateTeamDto } from "@/schemas/team"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { NotificationService } from "@/lib/services"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { PokemonSelector } from "./pokemon-selector"
import { SelectedPokemonPreview } from "./selected-pokemon-preview"

interface TeamFormDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateTeamDto) => Promise<void>
  pokemonData: PokemonRo[]
  isPending: boolean
  title: string
  submitLabel: string
  initialData?: CreateTeamDto
  onDelete?: () => void
  pokemonLoading?: boolean
}

export function TeamFormDialog({
  isOpen,
  onClose,
  onSubmit,
  pokemonData,
  isPending,
  title,
  submitLabel,
  initialData,
  onDelete,
  pokemonLoading = false,
}: TeamFormDialogProps) {
  const form = useForm<CreateTeamDto>({
    resolver: zodResolver(createTeamDtoSchema),
    defaultValues: initialData || {
      name: "",
      pokemonIds: [],
    },
  })

  const selectedPokemonIds = form.watch("pokemonIds")

  const handleSubmit = async (data: CreateTeamDto) => {
    try {
      await onSubmit(data)
      form.reset()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const togglePokemonSelection = (pokemonId: string) => {
    const currentIds = form.getValues("pokemonIds")

    if (currentIds.includes(pokemonId)) {
      form.setValue(
        "pokemonIds",
        currentIds.filter((id) => id !== pokemonId)
      )
    } else if (currentIds.length < 6) {
      form.setValue("pokemonIds", [...currentIds, pokemonId])
    } else {
      NotificationService.maxPokemonSelected()
    }
  }

  const getSelectedPokemon = () => {
    return pokemonData.filter((pokemon) =>
      selectedPokemonIds.includes(pokemon.id)
    )
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Team Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter team name..."
                      maxLength={50}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Pokemon Preview */}
            <SelectedPokemonPreview selectedPokemon={getSelectedPokemon()} />

            {/* Pokemon Selection */}
            <PokemonSelector
              pokemonData={pokemonData}
              selectedPokemonIds={selectedPokemonIds}
              onToggleSelection={togglePokemonSelection}
              isLoading={pokemonLoading}
            />

            {/* Form Errors */}
            {form.formState.errors.pokemonIds && (
              <p className="text-destructive text-sm">
                {form.formState.errors.pokemonIds.message}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  className="flex-1"
                >
                  Delete Team
                </Button>
              )}
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? `${submitLabel}...` : submitLabel}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
