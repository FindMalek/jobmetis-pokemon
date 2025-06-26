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

  // Include for battle operations (same as getInclude but explicit)
  static getBattleInclude(): Prisma.TeamInclude {
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

  // Where clause for teams with exactly 6 members (battle-ready)
  static getBattleReadyTeamsWhere(): Prisma.TeamWhereInput {
    return {
      members: {
        some: {},
      },
    }
  }

  // Where clause for getting teams by IDs
  static getByIdsWhere(teamIds: string[]): Prisma.TeamWhereInput {
    return {
      id: {
        in: teamIds,
      },
    }
  }

  // Order by total power (descending)
  static getOrderByPower(): Prisma.TeamOrderByWithRelationInput[] {
    return [{ totalPower: "desc" }, { name: "asc" }]
  }

  // Order by creation date (newest first)
  static getOrderByDate(): Prisma.TeamOrderByWithRelationInput[] {
    return [{ createdAt: "desc" }]
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
