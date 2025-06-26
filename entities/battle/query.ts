import { Prisma } from "@prisma/client"

export type WeaknessWithTypesDbData = Prisma.WeaknessGetPayload<{
  include: ReturnType<typeof BattleQuery.getWeaknessInclude>
}>

export class BattleQuery {
  // Include for weakness/type effectiveness queries
  static getWeaknessInclude() {
    return {} satisfies Prisma.WeaknessInclude
  }

  // Where clause for getting type effectiveness
  static getTypeEffectivenessWhere(
    attackerTypeId: string,
    defenderTypeId: string
  ) {
    return {
      type1Id: attackerTypeId,
      type2Id: defenderTypeId,
    } satisfies Prisma.WeaknessWhereInput
  }

  // Where clause for getting all type effectiveness combinations
  static getAllTypeEffectivenessWhere() {
    return {} satisfies Prisma.WeaknessWhereInput
  }

  // Unique where clause for type effectiveness lookup
  static getTypeEffectivenessUniqueWhere(
    attackerTypeId: string,
    defenderTypeId: string
  ) {
    return {
      type1Id_type2Id: {
        type1Id: attackerTypeId,
        type2Id: defenderTypeId,
      },
    } satisfies Prisma.WeaknessWhereUniqueInput
  }
}
