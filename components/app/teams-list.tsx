"use client"

import { useCreateTeam, usePokemon, useTeams } from "@/orpc/hooks"
import { createTeamDtoSchema, type CreateTeamDto } from "@/schemas/team"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"

export function TeamsList() {
  const { data: teams, isLoading: teamsLoading } = useTeams()
  const { data: pokemonData, isLoading: pokemonLoading } = usePokemon({
    limit: 50,
  })
  const createTeamMutation = useCreateTeam()

  const form = useForm<CreateTeamDto>({
    resolver: zodResolver(createTeamDtoSchema),
    defaultValues: {
      name: "",
      pokemonIds: [],
    },
  })

  const selectedPokemonIds = form.watch("pokemonIds")

  const handleCreateTeam = async (data: CreateTeamDto) => {
    try {
      await createTeamMutation.mutateAsync(data)
      toast.success("Team created successfully!")
      form.reset()
    } catch (error) {
      toast.error("Failed to create team")
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
      toast.error("You can only select 6 Pokemon per team")
    }
  }

  const getSelectedPokemon = () => {
    if (!pokemonData?.data) return []
    return pokemonData.data.filter((pokemon) =>
      selectedPokemonIds.includes(pokemon.id)
    )
  }

  if (teamsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="mt-2 h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-medium">Your Teams</h3>
          <p className="text-muted-foreground text-sm">
            Create and manage your Pokemon teams
          </p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Create New Team</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] w-[95vw] max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create New Team</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleCreateTeam)}
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

                {/* Pokemon Selection */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>
                      Select Pokemon ({selectedPokemonIds.length}/6)
                    </Label>
                    <Badge
                      variant={
                        selectedPokemonIds.length === 6
                          ? "default"
                          : "secondary"
                      }
                    >
                      {selectedPokemonIds.length}/6 Selected
                    </Badge>
                  </div>

                  {/* Selected Pokemon Preview */}
                  {selectedPokemonIds.length > 0 && (
                    <div className="bg-muted grid grid-cols-3 gap-2 rounded-lg p-3 sm:grid-cols-6">
                      {getSelectedPokemon().map((pokemon, index) => (
                        <div key={pokemon.id} className="relative">
                          <img
                            src={pokemon.image}
                            alt={pokemon.name}
                            className="aspect-square w-full rounded object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                            }}
                          />
                          <div className="bg-primary absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full">
                            <span className="text-xs font-bold text-white">
                              {index + 1}
                            </span>
                          </div>
                        </div>
                      ))}
                      {/* Empty slots */}
                      {[...Array(6 - selectedPokemonIds.length)].map(
                        (_, index) => (
                          <div
                            key={`empty-${index}`}
                            className="border-muted-foreground/30 flex aspect-square items-center justify-center rounded border-2 border-dashed"
                          >
                            <span className="text-muted-foreground text-xs">
                              Empty
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  <ScrollArea className="h-80">
                    {pokemonLoading ? (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-3 rounded border p-3"
                          >
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="mt-1 h-3 w-16" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {pokemonData?.data.map((pokemon) => (
                          <div
                            key={pokemon.id}
                            className={`flex cursor-pointer items-center space-x-3 rounded border p-3 transition-colors ${
                              selectedPokemonIds.includes(pokemon.id)
                                ? "border-primary bg-primary/5"
                                : "hover:bg-muted/50"
                            }`}
                            onClick={() => togglePokemonSelection(pokemon.id)}
                          >
                            <div className="relative">
                              <img
                                src={pokemon.image}
                                alt={pokemon.name}
                                className="h-12 w-12 rounded object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                                }}
                              />
                              {selectedPokemonIds.includes(pokemon.id) && (
                                <div className="bg-primary absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full">
                                  <span className="text-xs font-bold text-white">
                                    {selectedPokemonIds.indexOf(pokemon.id) + 1}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">
                                {pokemon.name}
                              </p>
                              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                <Badge
                                  style={{
                                    backgroundColor: pokemon.type.color,
                                  }}
                                  className="px-1 text-xs text-white"
                                >
                                  {pokemon.type.displayName}
                                </Badge>
                                <span>⚡{pokemon.power}</span>
                                <span>❤️{pokemon.life}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Form Errors */}
                {form.formState.errors.pokemonIds && (
                  <p className="text-destructive text-sm">
                    {form.formState.errors.pokemonIds.message}
                  </p>
                )}

                {/* Create Button */}
                <Button
                  type="submit"
                  disabled={createTeamMutation.isPending}
                  className="w-full"
                >
                  {createTeamMutation.isPending ? "Creating..." : "Create Team"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams?.map((team) => (
          <Card key={team.id} className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="truncate text-lg">{team.name}</CardTitle>
                <Badge variant="secondary">⚡{team.totalPower}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Pokemon Preview Grid */}
                <div className="grid grid-cols-3 gap-1">
                  {team.members.slice(0, 6).map((pokemon, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={pokemon.image}
                        alt={pokemon.name}
                        className="aspect-square w-full rounded object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `https://api.dicebear.com/7.x/shapes/svg?seed=${pokemon.name}`
                        }}
                      />
                      <div className="absolute inset-0 rounded bg-black/0 transition-colors group-hover:bg-black/20" />
                      <Badge
                        style={{ backgroundColor: pokemon.type.color }}
                        className="absolute bottom-0 right-0 origin-bottom-right scale-75 text-xs text-white"
                      >
                        {pokemon.type.name.charAt(0)}
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Team Stats */}
                <div className="text-muted-foreground flex justify-between text-sm">
                  <span>{team.members.length} Pokemon</span>
                  <span>
                    Avg Power:{" "}
                    {Math.round(team.totalPower / team.members.length)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit Team
                  </Button>
                  <Button size="sm" className="flex-1">
                    Battle Ready
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Empty State */}
        {teams?.length === 0 && (
          <Card className="col-span-full p-6 text-center sm:p-8">
            <div className="space-y-4">
              <div className="bg-muted mx-auto flex h-16 w-16 items-center justify-center rounded-full">
                <span className="text-2xl">⚔️</span>
              </div>
              <div>
                <h4 className="font-medium">No teams yet</h4>
                <p className="text-muted-foreground text-sm">
                  Create your first team to start battling
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
