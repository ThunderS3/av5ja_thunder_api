import { createHash } from 'node:crypto'
import { CoopBossInfo } from '@/enums/coop/coop_enemy'
import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { camelcaseKeys } from '@/utils/camelcase_keys'
import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'

export const ImageURL = <T>(S: T) =>
  z
    .object({
      image: z.object({
        url: z.string()
      })
    })
    .transform((object) => {
      return {
        ...object
      }
    })

export const Node = z.object({
  startTime: z.date(),
  endTime: z.date(),
  coopStage: ImageURL('CoopStage')
})

export const NodeList = (Node: z.AnyZodObject) =>
  z.object({
    nodes: z.array(Node)
  })

export namespace Oatmealdome {
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
      return {
        ...schedule,
        id: createHash('md5')
          .update(`${dayjs(object.startTime).toISOString()}:${dayjs(object.endTime).toISOString()}`)
          .digest('hex'),
        weaponList: object.weapons,
        bossId: object.bigBoss,
        stageId: object.stage,
        mode: object.bigBoss === null ? CoopMode.LIMITED : CoopMode.REGULAR,
        rule:
          object.bigBoss === null ? CoopRule.TEAM_CONTEST : object.stage >= 100 ? CoopRule.BIG_RUN : CoopRule.REGULAR
      }
    })

  export const Response = z.preprocess(
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
          get schedules() {
            return []
          },
          get hash(): string {
            return ''
          }
        }
      })
  )

  export type Response = z.infer<typeof Response>
  export type Schedule = z.infer<typeof Schedule>
}
