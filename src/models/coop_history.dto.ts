// import { CoopMode } from '@/enums/coop/coop_mode'
// import { CoopRule } from '@/enums/coop/coop_rule'
// import { CoopStage } from '@/enums/coop/coop_stage'
import { z } from '@hono/zod-openapi'
// import { CoopData } from './common/coop_data.dto'
// import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
// import { DateTime } from './common/datetime.dto'
// import { NodeList } from './common/node_list.dto'
// import { RawId } from './common/raw_id.dto'
// import { S3URL } from './common/s3_url.dto'
// import { WeaponInfoMainHash } from './common/weapon_hash.dto'
// import { CoopSchedule } from './coop_schedule.dto'
// import type { ResourceQuery } from './resource.interface'

import { createHash } from 'node:crypto'
import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { endTime } from 'hono/timing'
import { CoopData } from './common/coop_data.dto'
import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
import { CoopStageModel } from './common/coop_stage.dto'
import { DateTime } from './common/datetime.dto'
import { NodeList } from './common/node_list.dto'
import { RawId } from './common/raw_id.dto'
import { WeaponInfoMainId } from './common/weapon_hash.dto'

// const HistoryDetail = z.object({
//   id: CoopHistoryDetailId,
//   weapons: z.array(WeaponInfoMainHash),
//   coopStage: z.object({
//     id: RawId(CoopStage.Id)
//   })
// })

// const HistoryGroup = z
//   .object({
//     startTime: DateTime,
//     endTime: DateTime,
//     mode: z.nativeEnum(CoopMode),
//     playCount: z.number().int().min(0).nullable(),
//     rule: z.nativeEnum(CoopRule),
//     historyDetails: NodeList(HistoryDetail)
//   })
//   .transform((data) => {
//     const result: HistoryDetail = data.historyDetails.nodes[0]
//     return {
//       ...data,
//       weaponList: result.weapons.map((weapon) => weapon.id),
//       stageId: result.coopStage.id,
//       rareWeapons: [],
//       bossId: data.mode === CoopMode.PRIVATE_CUSTOM || data.mode === CoopMode.PRIVATE_SCENARIO ? null : undefined
//     }
//   })

// const CoopResultModel = z.object({
//   historyGroups: NodeList(HistoryGroup)
// })
// const CoopHistoryModel = z.object({
//   schedule: CoopSchedule.Response,
//   results: z.array(CoopHistoryDetailId)
// })

// export namespace CoopHistory {
//   export const Request = CoopData(
//     z.object({
//       coopResult: CoopResultModel
//     })
//   )

//   export const Response = z.object({
//     histories: z.array(CoopHistoryModel)
//   })

//   export type Request = z.infer<typeof Request>
//   export type Response = z.infer<typeof Response>
// }

// export class CoopHistoryQuery implements ResourceQuery {
//   private readonly request: CoopHistory.Request
//   private readonly response: CoopHistory.Response

//   constructor(data: object | unknown) {
//     this.request = CoopHistory.Request.parse(data)
//     this.response = CoopHistory.Response.parse({
//       histories: this.historyGroups.map((historyGroup) => {
//         return {
//           schedule: historyGroup,
//           results: historyGroup.historyDetails.nodes.map((historyDetail) => historyDetail.id)
//         }
//       })
//     })
//   }

//   private get historyDetails(): HistoryDetail[] {
//     return this.historyGroups.flatMap((group) => group.historyDetails.nodes)
//   }

//   /**
//    * 画像のURL
//    */
//   get assetURLs(): S3URL[] {
//     return Array.from(
//       new Set(this.historyDetails.flatMap((historyDetail) => historyDetail.weapons.map((weapon) => weapon.url)))
//     ).map((url) => S3URL.parse(url))
//   }

//   get histories(): CoopHistoryModel[] {
//     return this.response.histories
//   }

//   private get historyGroups(): HistoryGroup[] {
//     return this.request.data.coopResult.historyGroups.nodes
//   }

//   toJSON(): CoopHistory.Response {
//     return this.response
//   }
// }

// type CoopHistoryModel = z.infer<typeof CoopHistoryModel>
// type HistoryDetail = z.infer<typeof HistoryDetail>
// type HistoryGroup = z.infer<typeof HistoryGroup>

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
    .transform((v) => {
      return {
        startTime: v.startTime,
        endTime: v.endTime,
        mode: v.mode,
        rule: v.rule,
        bossId: CoopMode.REGULAR === v.mode ? undefined : null,
        rareWeapons: [],
        stageId: v.historyDetails.nodes[0].coopStage.id,
        weaponList: v.historyDetails.nodes[0].weapons.map((weapon) => weapon),
        results: v.historyDetails.nodes.map((detail) => detail.id)
      }
    })

  export const CoopResult = CoopData(
    z.object({
      coopResult: z.object({
        historyGroups: NodeList(HistoryGroup)
      })
    })
  ).transform((v) => {
    return {
      toJSON: () => ({
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
      })
    }
  })
  export type CoopResult = z.infer<typeof CoopResult>
}
