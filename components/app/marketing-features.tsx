import { Icons } from "@/components/shared/icons"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function MarketingFeatures() {
  return (
    <section className="w-full px-4 py-16 sm:py-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center sm:mb-16">
          <h2 className="mb-3 text-2xl font-bold sm:mb-4 sm:text-3xl md:text-4xl">
            Master the Pokemon Battle Arena
          </h2>
          <p className="text-muted-foreground mx-auto max-w-lg text-base sm:max-w-2xl sm:text-lg">
            Everything you need to become the ultimate Pokemon trainer. Build
            teams, battle strategically, and climb the ranks.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <Card className="hover:border-primary/20 border-2 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icons.zap className="h-8 w-8 text-yellow-500" />
                <CardTitle>Pokemon Collection</CardTitle>
              </div>
              <CardDescription>
                Browse through 15 unique Pokemon across Fire, Water, and Grass
                types. Each with unique stats, abilities, and strategic value.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/20 border-2 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icons.users className="h-8 w-8 text-blue-500" />
                <CardTitle>Team Building</CardTitle>
              </div>
              <CardDescription>
                Create teams of exactly 6 Pokemon. Build balanced squads with
                strategic type coverage for optimal battle performance.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/20 border-2 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icons.sword className="h-8 w-8 text-red-500" />
                <CardTitle>Strategic Battles</CardTitle>
              </div>
              <CardDescription>
                Engage in turn-based battles with type effectiveness mechanics.
                Fire beats Grass, Water beats Fire, Grass beats Water.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/20 border-2 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icons.barChart className="h-8 w-8 text-green-500" />
                <CardTitle>Advanced Statistics</CardTitle>
              </div>
              <CardDescription>
                Track your battle performance, win rates, and team
                effectiveness. Analyze your strategies and improve your skills.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/20 border-2 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icons.globe className="h-8 w-8 text-purple-500" />
                <CardTitle>Type Effectiveness</CardTitle>
              </div>
              <CardDescription>
                Master the rock-paper-scissors mechanic of Pokemon types. Learn
                matchups and build teams with optimal type coverage.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:border-primary/20 border-2 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Icons.sparkles className="h-8 w-8 text-pink-500" />
                <CardTitle>Real-time Battles</CardTitle>
              </div>
              <CardDescription>
                Experience fast-paced battles with instant results. Watch
                round-by-round combat with detailed damage calculations.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}
