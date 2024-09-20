import { z } from '@hono/zod-openapi'
import { Response as CoopHistoryDetailModel, CoopHistoryDetailQuery } from './coop_history_detail.dto'
import { Response as CoopScheduleModel } from './coop_schedule.dto'

export namespace CoopResult {
  /**
   * この型で受け付けるだけで内部的なパースは実行しない
   */
  export const Request = z.object({
    histories: z.array(
      z.object({
        schedule: z.record(z.any()),
        results: z.array(z.record(z.any()))
      })
    )
  })

  /**
   * 実質的なレスポンスの型
   */
  export const Response = z.object({
    histories: z.array(
      z.object({
        schedule: CoopScheduleModel,
        results: z.array(CoopHistoryDetailModel)
      })
    )
  })

  export type Request = z.infer<typeof Request>
  export type Response = z.infer<typeof Response>
}

export class CoopResultQuery {
  private readonly request: CoopResult.Request
  private readonly response: CoopResult.Response

  constructor(data: object) {
    this.request = CoopResult.Request.parse(data)
    // console.log(JSON.stringify(this.request, null, 2))
    this.response = CoopResult.Response.parse({
      histories: this.request.histories.map((history) => ({
        schedule: CoopScheduleModel.parse(history.schedule),
        results: history.results.map((result) => {
          return {
            ...new CoopHistoryDetailQuery(result).result,
            schedule: history.schedule
          }
        })
      }))
    })
  }

  toJSON(): CoopResult.Response {
    return this.response
  }
}
