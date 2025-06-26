import { Prisma } from "@prisma/client"

export class BattleQuery {
  // Include for weakness/type effectiveness queries
  static getWeaknessInclude(): Prisma.WeaknessInclude {
    return {}
  }

  // Where clause for getting type effectiveness
  static getTypeEffectivenessWhere(
    attackerTypeId: string,
    defenderTypeId: string
  ): Prisma.WeaknessWhereInput {
    return {
      type1Id: attackerTypeId,
      type2Id: defenderTypeId,
    }
  }

  // Where clause for getting all type effectiveness combinations
  static getAllTypeEffectivenessWhere(): Prisma.WeaknessWhereInput {
    return {}
  }

  // Unique where clause for type effectiveness lookup
  static getTypeEffectivenessUniqueWhere(
    attackerTypeId: string,
    defenderTypeId: string
  ): Prisma.WeaknessWhereUniqueInput {
    return {
      type1Id_type2Id: {
        type1Id: attackerTypeId,
        type2Id: defenderTypeId,
      },
    }
  }
}
