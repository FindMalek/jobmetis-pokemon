import { Prisma } from "@prisma/client"

export class TeamQuery {
  // Include members with Pokemon and type data
  static getInclude(): Prisma.TeamInclude {
    return {
      members: {
        include: {
          pokemon: {
            include: {
              type: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    }
  }

  // Where clause for teams with full members
  static getCompleteTeamsWhere(): Prisma.TeamWhereInput {
    return {
      members: {
        some: {},
      },
    }
  }

  // Order by total power (descending)
  static getOrderByPower(): Prisma.TeamOrderByWithRelationInput[] {
    return [
      { totalPower: "desc" },
      { name: "asc" },
    ]
  }

  // Order by creation date (newest first)
  static getOrderByDate(): Prisma.TeamOrderByWithRelationInput[] {
    return [
      { createdAt: "desc" },
    ]
  }

  // Where clause for searching by name
  static getByNameWhere(searchTerm: string): Prisma.TeamWhereInput {
    return {
      name: {
        contains: searchTerm,
        mode: "insensitive",
      },
    }
  }
} 