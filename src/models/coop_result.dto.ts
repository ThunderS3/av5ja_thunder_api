import { z } from '@hono/zod-openapi'
import { Request as CoopHistoryDetailModel } from './coop_history_detail.dto'
import { Response as CoopScheduleModel } from './coop_schedule.dto'

const CoopResultModel = z.object({
  schedule: CoopScheduleModel,
  results: z.array(CoopHistoryDetailModel)
})

export const Request = z.object({
  histories: z.array(CoopResultModel)
})

export const Response = z.object({})

export class CoopResultQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({})
  }
}

type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
