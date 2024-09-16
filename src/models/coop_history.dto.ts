import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { endTime, startTime } from 'hono/timing'
import { Data } from './coop_record.dto'
import { NodeList } from './schedule.dto'

export const CoopHistoryModel = Data(
  z.object({
    coopResult: z.object({
      historyGroups: NodeList(
        z.object({
          startTime: z.string().datetime().nullable(),
          endTime: z.string().datetime().nullable(),
          mode: z.nativeEnum(CoopMode),
          playCount: z.number().int().min(0),
          rule: z.nativeEnum(CoopRule),
          historyDetails: NodeList(
            z.object({
              id: z.string(),
              weapons: z.array(
                z.object({
                  image: z.object({
                    url: z.string().url()
                  })
                })
              )
            })
          )
        })
      )
    })
  })
)

export type CoopHistoryModel = z.infer<typeof CoopHistoryModel>
