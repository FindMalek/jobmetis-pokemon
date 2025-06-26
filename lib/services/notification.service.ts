import { toast } from "sonner"

export class NotificationService {
  // Team notifications
  static teamCreated(teamName: string) {
    toast.success(`Team "${teamName}" created successfully!`)
  }

  static teamUpdated(teamName: string) {
    toast.success(`Team "${teamName}" updated successfully!`)
  }

  static teamDeleted(teamName: string) {
    toast.success(`Team "${teamName}" deleted successfully!`)
  }

  static teamBattleReady(teamName: string) {
    toast.success(`${teamName} is ready for battle!`)
  }

  static teamNotBattleReady() {
    toast.error("Team must have exactly 6 Pokemon to be battle ready!")
  }

  static teamSelected(teamName: string) {
    toast.success(`${teamName} selected for battle!`)
  }

  // Pokemon notifications
  static pokemonCreated(pokemonName: string) {
    toast.success(`Pokemon "${pokemonName}" created successfully!`)
  }

  static pokemonUpdated(pokemonName: string) {
    toast.success(`Pokemon "${pokemonName}" updated successfully!`)
  }

  static pokemonDeleted(pokemonName: string) {
    toast.success(`Pokemon "${pokemonName}" deleted successfully!`)
  }

  // Battle notifications
  static battleStarted() {
    toast.success("Battle started!")
  }

  static battleCompleted() {
    toast.success("Battle completed!")
  }

  static battleFailed() {
    toast.error("Battle failed to start")
  }

  // Selection notifications
  static maxPokemonSelected() {
    toast.error("You can only select 6 Pokemon per team")
  }

  static bothTeamsRequired() {
    toast.error("Please select both teams")
  }

  static sameTeamSelected() {
    toast.error("Teams cannot battle themselves")
  }

  // Generic notifications
  static operationFailed(operation: string) {
    toast.error(`Failed to ${operation}`)
  }

  static confirmationRequired(message: string): boolean {
    return confirm(message)
  }
}
