import { createHash } from 'node:crypto'
import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { sortedJSON } from '@/utils/sorted'
import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
import { DateTime } from './common/datetime.dto'
import { NodeList } from './common/node_list.dto'
import { RawId } from './common/raw_id.dto'
import { WeaponInfoMainId } from './common/weapon_hash.dto'
import { CoopScheduleQuery } from './stage_schedule.dto'

export namespace CoopHistoryQuery {
  const HistoryDetail = z.object({
    id: CoopHistoryDetailId,
    coopStage: RawId(CoopStage.Id),
    weapons: z.array(WeaponInfoMainId)
  })

  const HistoryGroup = z
    .object({
      startTime: DateTime,
      endTime: DateTime,
      mode: z.nativeEnum(CoopMode),
      rule: z.nativeEnum(CoopRule),
      historyDetails: NodeList(HistoryDetail)
    })
    .transform((v) => ({
      startTime: v.startTime,
      endTime: v.endTime,
      mode: v.mode,
      rule: v.rule,
      bossId: CoopMode.REGULAR === v.mode ? undefined : null,
      rareWeapons: [],
      stageId: v.historyDetails.nodes[0].coopStage.id,
      weaponList: v.historyDetails.nodes[0].weapons.map((weapon) => weapon),
      results: v.historyDetails.nodes.map((detail) => detail.id)
    }))
    .transform((v) =>
      CoopScheduleQuery.Schedule.merge(
        z.object({
          results: z.array(CoopHistoryDetailId)
        })
      ).parse({
        id: [CoopMode.PRIVATE_CUSTOM, CoopMode.PRIVATE_SCENARIO].includes(v.mode)
          ? createHash('md5')
              .update(`${v.mode}-${v.rule}-${v.stageId}-${v.weaponList.join(',')}`)
              .digest('hex')
          : createHash('md5').update(`${v.startTime}:${v.endTime}`).digest('hex'),
        ...v
      })
    )

  export const CoopResult = CoopData(
    z.object({
      coopResult: z.object({
        historyGroups: NodeList(HistoryGroup)
      })
    })
  )
    .transform((v) => ({
      histories: v.data.coopResult.historyGroups.nodes.map((node) => ({
        schedule: {
          id: [CoopMode.PRIVATE_CUSTOM, CoopMode.PRIVATE_SCENARIO].includes(node.mode)
            ? createHash('md5')
                .update(`${node.mode}-${node.rule}-${node.stageId}-${node.weaponList.join(',')}`)
                .digest('hex')
            : createHash('md5').update(`${node.startTime}:${node.endTime}`).digest('hex'),
          startTime: node.startTime,
          endTime: node.endTime,
          mode: node.mode,
          rule: node.rule,
          bossId: node.bossId,
          stageId: node.stageId,
          rareWeapons: node.rareWeapons,
          weaponList: node.weaponList
        },
        results: node.results
      }))
    }))
    .transform((v) => {
      return {
        ...v,
        toJSON: () => sortedJSON(v)
      }
    })
  export type CoopResult = z.infer<typeof CoopResult>
}
