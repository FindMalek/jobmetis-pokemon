"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface RecentItem {
  id: string
  type: "pokemon" | "team" | "battle"
  name: string
  createdAt: Date
}

interface DashboardRecentActivityProps {
  recentItems?: RecentItem[]
}

export function DashboardRecentActivity({
  recentItems = [],
}: DashboardRecentActivityProps) {
  // Mock data for demonstration
  const mockRecentItems: RecentItem[] = [
    {
      id: "1",
      type: "pokemon",
      name: "Charizard",
      createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    },
    {
      id: "2",
      type: "team",
      name: "Fire Team Alpha",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    },
    {
      id: "3",
      type: "battle",
      name: "Battle vs Team Beta",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    },
  ]

  const displayItems = recentItems.length > 0 ? recentItems : mockRecentItems

  function getTypeIcon(type: string) {
    switch (type) {
      case "pokemon":
        return "🐾"
      case "team":
        return "👥"
      case "battle":
        return "⚔️"
      default:
        return "📝"
    }
  }

  function formatTimeAgo(date: Date) {
    const now = new Date()
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    )

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest Pokemon activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <span className="text-2xl">{getTypeIcon(item.type)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {item.name}
                </p>
                <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </p>
              </div>
              <div className="inline-flex items-center text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(item.createdAt)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
