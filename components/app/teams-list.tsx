"use client"

import { useState } from "react"
import {
  useCreateTeam,
  useDeleteTeam,
  usePokemon,
  useTeams,
  useUpdateTeam,
} from "@/orpc/hooks"
import type { CreateTeamDto, TeamRo } from "@/schemas/team"

import { NotificationService, TeamService } from "@/lib/services"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

import { TeamCard } from "./teams/team-card"
import { TeamFormDialog } from "./teams/team-form-dialog"

export function TeamsList() {
  const { data: teams, isLoading: teamsLoading } = useTeams()
  const { data: pokemonData, isLoading: pokemonLoading } = usePokemon({
    limit: 50,
  })

  const createTeamMutation = useCreateTeam()
  const updateTeamMutation = useUpdateTeam()
  const deleteTeamMutation = useDeleteTeam()

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  // Handlers
  const handleCreateTeam = async (data: CreateTeamDto) => {
    await createTeamMutation.mutateAsync(data)
    NotificationService.teamCreated(data.name)
    setShowCreateDialog(false)
  }

  const handleEditTeam = (team: TeamRo) => {
    setEditingTeamId(team.id)
  }

  const handleUpdateTeam = async (data: CreateTeamDto) => {
    if (!editingTeamId) return

    await updateTeamMutation.mutateAsync({
      id: editingTeamId,
      name: data.name,
      pokemonIds: data.pokemonIds,
    })
    NotificationService.teamUpdated(data.name)
    setEditingTeamId(null)
  }

  const handleDeleteTeam = async () => {
    if (!editingTeamId) return

    const team = teams?.find((t) => t.id === editingTeamId)
    if (!team) return

    if (
      !NotificationService.confirmationRequired(
        `Are you sure you want to delete "${team.name}"?`
      )
    )
      return

    await deleteTeamMutation.mutateAsync(editingTeamId)
    NotificationService.teamDeleted(team.name)
    setEditingTeamId(null)
  }

  const handleBattleReady = (team: TeamRo) => {
    const { canBattle } = TeamService.canBattle(team)

    if (!canBattle) {
      NotificationService.teamNotBattleReady()
      return
    }

    NotificationService.teamBattleReady(team.name)
    window.location.href = TeamService.getBattleUrl(team.id)
  }

  // Get editing team data
  const editingTeam = teams?.find((t) => t.id === editingTeamId)
  const editingInitialData = editingTeam
    ? {
        name: editingTeam.name,
        pokemonIds: editingTeam.members.map((member) => member.id),
      }
    : undefined

  if (teamsLoading) {
    return <TeamsListSkeleton />
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

        <Button
          onClick={() => setShowCreateDialog(true)}
          className="w-full sm:w-auto"
        >
          Create New Team
        </Button>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {teams?.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onEdit={handleEditTeam}
            onBattleReady={handleBattleReady}
          />
        ))}

        {/* Empty State */}
        {teams?.length === 0 && <TeamsEmptyState />}
      </div>

      {/* Create Team Dialog */}
      <TeamFormDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateTeam}
        pokemonData={pokemonData?.data || []}
        isPending={createTeamMutation.isPending}
        title="Create New Team"
        submitLabel="Create Team"
        pokemonLoading={pokemonLoading}
      />

      {/* Edit Team Dialog */}
      <TeamFormDialog
        isOpen={!!editingTeamId}
        onClose={() => setEditingTeamId(null)}
        onSubmit={handleUpdateTeam}
        pokemonData={pokemonData?.data || []}
        isPending={updateTeamMutation.isPending}
        title="Edit Team"
        submitLabel="Update Team"
        initialData={editingInitialData}
        onDelete={handleDeleteTeam}
        pokemonLoading={pokemonLoading}
      />
    </div>
  )
}

// Loading skeleton component
function TeamsListSkeleton() {
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
            <CardContent className="p-6">
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Empty state component
function TeamsEmptyState() {
  return (
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
  )
}
