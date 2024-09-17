import { createHash } from 'node:crypto'
import { CoopBossInfo } from '@/enums/coop/coop_enemy'
import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { camelcaseKeys } from '@/utils/camelcase_keys'
import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { ImageURL } from './image_url.dto'

export const Node = z.object({
  startTime: z.date(),
  endTime: z.date(),
  coopStage: ImageURL
})

export const NodeList = <T extends z.AnyZodObject>(N: T) =>
  z.object({
    nodes: z.array(N)
  })

export const CoopScheduleModel = z.object({
  id: z.string(),
  startTime: z.string().datetime().nullable(),
  endTime: z.string().datetime().nullable(),
  mode: z.nativeEnum(CoopMode),
  rule: z.nativeEnum(CoopRule),
  bossId: z.nativeEnum(CoopBossInfo.Id).nullable(),
  stageId: z.nativeEnum(CoopStage.Id),
  weaponList: z.array(z.nativeEnum(WeaponInfoMain.Id)).min(0).max(4),
  rareWeapons: z.array(z.nativeEnum(WeaponInfoMain.Id))
})

export const Schedule = z
  .object({
    bigBoss: z
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      .preprocess((input: any) => {
        switch (input) {
          case 'SakeJaw':
            return CoopBossInfo.Id.SakeJaw
          case 'SakeRope':
            return CoopBossInfo.Id.SakeRope
          case 'SakelienGiant':
            return CoopBossInfo.Id.SakelienGiant
          case 'Triple':
            return CoopBossInfo.Id.Triple
          default:
            return null
        }
      }, z.nativeEnum(CoopBossInfo.Id))
      .nullable(),
    startTime: z
      .string()
      .datetime()
      .transform((date) => dayjs(date).utc().toDate()),
    endTime: z
      .string()
      .datetime()
      .transform((date) => dayjs(date).utc().toDate()),
    stage: z.nativeEnum(CoopStage.Id),
    weapons: z.array(z.nativeEnum(WeaponInfoMain.Id)).length(4),
    rareWeapons: z.array(z.nativeEnum(WeaponInfoMain.Id))
  })
  .transform((object) => {
    const { bigBoss, stage, weapons, ...schedule } = object
    const key: string = `${dayjs(object.startTime).toISOString()}:${dayjs(object.endTime).toISOString()}`
    return {
      ...schedule,
      key: key,
      data: CoopScheduleModel.parse({
        id: createHash('md5').update(key).digest('hex'),
        startTime: object.startTime,
        endTime: object.endTime,
        rareWeapons: object.rareWeapons,
        weaponList: object.weapons,
        bossId: object.bigBoss,
        stageId: object.stage,
        mode: object.bigBoss === null ? CoopMode.LIMITED : CoopMode.REGULAR,
        rule:
          object.bigBoss === null ? CoopRule.TEAM_CONTEST : object.stage >= 100 ? CoopRule.BIG_RUN : CoopRule.REGULAR
      })
    }
  })

export const Phase = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    return camelcaseKeys(input)
  },
  z
    .object({
      normal: z.array(Schedule),
      bigRun: z.array(Schedule),
      teamContest: z.array(Schedule)
    })
    .transform((object) => {
      return {
        ...object,
        get schedules(): Schedule[] {
          return object.normal.concat(object.bigRun).concat(object.teamContest)
        }
      }
    })
)

export type Phase = z.infer<typeof Phase>
export type Schedule = z.infer<typeof Schedule>
export type CoopScheduleModel = z.infer<typeof CoopScheduleModel>
