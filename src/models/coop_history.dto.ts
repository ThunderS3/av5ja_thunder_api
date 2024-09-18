import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { DateTime } from './common/datetime.dto'
import { ImageURL } from './common/image_url.dto'
import { NodeList } from './common/node_list.dto'
import { RawId } from './common/raw_id.dto'
import { CoopHistoryDetailId } from './coop_history_id.dto'

const HistoryDetail = z.object({
  id: CoopHistoryDetailId,
  weapons: z.array(ImageURL),
  coopStage: z.object({
    id: RawId(CoopStage.Id)
  })
})

const HistoryGroup = z.object({
  startTime: DateTime,
  endTime: DateTime,
  mode: z.nativeEnum(CoopMode),
  playCount: z.number().int().min(0).nullable(),
  rule: z.nativeEnum(CoopRule),
  historyDetails: NodeList(HistoryDetail)
})

const CoopHistoryModel = z.object({
  historyGroups: NodeList(HistoryGroup)
})

export const Request = CoopData(
  z.object({
    coopResult: CoopHistoryModel
  })
)
export const Response = z.object({})

export class CoopHistoryQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({})
  }
}

type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
