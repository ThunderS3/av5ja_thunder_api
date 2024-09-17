import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { endTime, startTime } from 'hono/timing'
import { CoopHistoryDetailId } from './coop_history_id.dto'
import { Data } from './coop_record.dto'
import { RawId } from './image_url.dto'
import { CoopScheduleModel, NodeList } from './schedule.dto'

export namespace CoopHistoryModel {
  export const Req = Data(
    z.object({
      coopResult: z.object({
        historyGroups: NodeList(
          z.object({
            startTime: z
              .string()
              .datetime()
              .nullable()
              .transform((value) => (value === null ? null : dayjs(value).toISOString())),
            endTime: z
              .string()
              .datetime()
              .nullable()
              .transform((value) => (value === null ? null : dayjs(value).toISOString())),
            mode: z.nativeEnum(CoopMode),
            playCount: z.number().int().min(0).nullable(),
            rule: z.nativeEnum(CoopRule),
            historyDetails: NodeList(
              z.object({
                id: CoopHistoryDetailId,
                weapons: z.array(
                  z.object({
                    image: z.object({
                      url: z.string().url()
                    })
                  })
                ),
                coopStage: z.object({
                  id: RawId(CoopStage.Id)
                })
              })
            )
          })
        )
      })
    })
  )

  export const Res = z.object({
    histories: z.array(
      z.object({
        schedule: CoopScheduleModel,
        results: z.array(CoopHistoryDetailId)
      })
    )
  })

  export type Req = z.infer<typeof Req>
}
