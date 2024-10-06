import { CoopBossInfo } from '@/enums/coop/coop_enemy'
import { CoopEvent } from '@/enums/coop/coop_event'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopWaterLevel } from '@/enums/coop/coop_water_level'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { Species } from '@/enums/weapon/species'
import { sortedJSON } from '@/utils/sorted'
import { z } from '@hono/zod-openapi'
import { CoopHistoryDetailQuery } from './coop_history_detail.dto'
import { CoopScheduleQuery } from './stage_schedule.dto'

export namespace CoopResultQuery {
  export const CoopHistory = z
    .object({
      histories: z.array(
        z
          .object({
            schedule: CoopScheduleQuery.Schedule,
            results: z.array(CoopHistoryDetailQuery.CoopHistoryDetail)
          })
          .transform((v) => ({
            schedule: v.schedule,
            results: v.results.map((result) =>
              sortedJSON({
                ...{ schedule: v.schedule },
                ...result.toJSON()
              })
            )
          }))
          .transform((v) => v)
      )
    })
    .transform((v) => ({
      ...v,
      toJSON: () => v
    }))

  const Nameplate = z.object({
    badges: z.array(z.number().int().nullable()).length(3),
    background: z.object({
      id: z.number().int(),
      textColor: z.object({
        r: z.number().min(0).max(1),
        g: z.number().min(0).max(1),
        b: z.number().min(0).max(1),
        a: z.number().min(0).max(1)
      })
    })
  })

  const WaveResult = z.object({
    id: z.string().length(32),
    waveId: z.number().int().min(0).max(4),
    waterLevel: z.nativeEnum(CoopWaterLevel.Id),
    eventType: z.nativeEnum(CoopEvent.Id),
    quotaNum: z.number().int().min(0).nullable(),
    goldenIkuraNum: z.number().int().min(0).nullable(),
    goldenIkuraPopNum: z.number().int().min(0),
    isClear: z.boolean()
  })

  const MemberResult = z.object({
    id: z.string().length(32),
    name: z.string(),
    byname: z.string(),
    nameId: z.string(),
    nameplate: Nameplate,
    uniform: z.number().int(),
    species: z.nativeEnum(Species),
    weaponList: z.array(z.nativeEnum(WeaponInfoMain.Id)),
    nplnUserId: z.string().length(20),
    specialId: z.nativeEnum(WeaponInfoSpecial.Id).nullable(),
    ikuraNum: z.number().int().min(0),
    goldenIkuraNum: z.number().int().min(0),
    goldenIkuraAssistNum: z.number().int().min(0),
    helpCount: z.number().int().min(0),
    deadCount: z.number().int().min(0),
    bossKillCountsTotal: z.number().int().min(0),
    isMyself: z.boolean(),
    smellMeter: z.number().int().min(0).max(5).nullable(),
    jobRate: z.number().min(0).nullable(),
    jobBonus: z.number().int().min(0).max(100).nullable(),
    jobScore: z.number().int().min(0).nullable(),
    kumaPoint: z.number().int().min(0).nullable(),
    gradeId: z.nativeEnum(CoopGrade.Id).nullable(),
    gradePoint: z.number().int().min(0).max(999).nullable(),
    bossKillCounts: z.array(z.number().int().min(0).nullable()).length(14),
    specialCounts: z.array(z.number().int().min(0).nullable())
  })

  const JobResult = z.object({
    failureWave: z.number().int().min(0).max(4).nullable(),
    isClear: z.boolean(),
    bossId: z.nativeEnum(CoopBossInfo.Id).nullable(),
    isBossDefeated: z.boolean().nullable()
  })

  const BossResult = z
    .object({
      bossId: z.nativeEnum(CoopBossInfo.Id),
      isBossDefeated: z.boolean()
    })
    .nullable()

  export const CoopResult = z.object({
    id: z.string().length(32),
    uuid: z.string().uuid(),
    scale: z.array(z.number().int().min(0).max(39).nullable()),
    myResult: MemberResult,
    otherResults: z.array(MemberResult),
    waveDetails: z.array(WaveResult),
    bossCounts: z.array(z.number().int().min(0).nullable()).length(14),
    bossKillCounts: z.array(z.number().int().min(0).nullable()).length(14),
    playTime: z.string().datetime(),
    goldenIkuraNum: z.number().int().min(0),
    ikuraNum: z.number().int().min(0),
    dangerRate: z.number().min(0).max(3.33),
    scenarioCode: z.string().nullable(),
    bossResults: z.array(BossResult).nullable(),
    jobResult: JobResult
  })

  export type CoopResult = z.infer<typeof CoopResult>
  export type CoopHistory = z.infer<typeof CoopHistory>
}
