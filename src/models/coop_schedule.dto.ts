import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { camelcaseKeys } from '@/utils/camelcase_keys'
import { z } from '@hono/zod-openapi'
import { DateTime } from './common/datetime.dto'

const ScheduleModel = z.object({
  bigBoss: z.string().optional(),
  startTime: DateTime,
  endTime: DateTime,
  stage: z.nativeEnum(CoopStage.Id),
  weapons: z.array(z.nativeEnum(WeaponInfoMain.Id)),
  rareWeapons: z.array(z.nativeEnum(WeaponInfoMain.Id))
})

export const Request = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    return camelcaseKeys(input)
  },
  z.object({
    normal: z.array(ScheduleModel),
    bigRun: z.array(ScheduleModel),
    teamContest: z.array(ScheduleModel)
  })
)

export const Response = z.object({})

export class CoopScheduleQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({})
  }
}

type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
