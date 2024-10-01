import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
import { DateTime } from './common/datetime.dto'
import { NodeList } from './common/node_list.dto'
import { RawId } from './common/raw_id.dto'
import { WeaponInfoMainHash } from './common/weapon_hash.dto'
import { Response as CoopScheduleModel } from './coop_schedule.dto'

const HistoryDetail = z.object({
  id: CoopHistoryDetailId,
  weapons: z.array(WeaponInfoMainHash),
  coopStage: z.object({
    id: RawId(CoopStage.Id)
  })
})

const HistoryGroup = z
  .object({
    startTime: DateTime,
    endTime: DateTime,
    mode: z.nativeEnum(CoopMode),
    playCount: z.number().int().min(0).nullable(),
    rule: z.nativeEnum(CoopRule),
    historyDetails: NodeList(HistoryDetail)
  })
  .transform((data) => {
    const result: HistoryDetail = data.historyDetails.nodes[0]
    return {
      ...data,
      weaponList: result.weapons,
      stageId: result.coopStage.id,
      rareWeapons: [],
      bossId: data.mode === CoopMode.PRIVATE_CUSTOM || data.mode === CoopMode.PRIVATE_SCENARIO ? null : undefined
    }
  })

const CoopResultModel = z.object({
  historyGroups: NodeList(HistoryGroup)
})
const CoopHistoryModel = z.object({
  schedule: CoopScheduleModel,
  results: z.array(CoopHistoryDetailId)
})

export namespace CoopHistory {
  export const Request = CoopData(
    z.object({
      coopResult: CoopResultModel
    })
  )

  export const Response = z.object({
    histories: z.array(CoopHistoryModel)
  })

  export type Request = z.infer<typeof Request>
  export type Response = z.infer<typeof Response>
}

export class CoopHistoryQuery {
  private readonly request: CoopHistory.Request
  private readonly response: CoopHistory.Response

  constructor(data: object) {
    this.request = CoopHistory.Request.parse(data)
    this.response = CoopHistory.Response.parse({
      histories: this.historyGroups.map((historyGroup) => {
        return {
          schedule: historyGroup,
          results: historyGroup.historyDetails.nodes.map((historyDetail) => historyDetail.id)
        }
      })
    })
  }

  get histories(): CoopHistoryModel[] {
    return this.response.histories
  }

  private get historyGroups(): HistoryGroup[] {
    return this.request.data.coopResult.historyGroups.nodes
  }

  toJSON(): CoopHistory.Response {
    return this.response
  }
}

type CoopHistoryModel = z.infer<typeof CoopHistoryModel>
type HistoryDetail = z.infer<typeof HistoryDetail>
type HistoryGroup = z.infer<typeof HistoryGroup>
