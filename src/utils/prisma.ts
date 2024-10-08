import type { CoopResult, CoopResultQuery } from '@/models/coop_result.dto'
import type { CoopScheduleQuery } from '@/models/stage_schedule.dto'
import type { z } from '@hono/zod-openapi'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import dayjs from 'dayjs'
import type { Context } from 'hono'
import type { Bindings } from './bindings'

export namespace Prisma {
  const Prisma = (c: Context<{ Bindings: Bindings }>): PrismaClient => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    return prisma as unknown as PrismaClient
  }

  export namespace SCHEDULE {
    /**
     * スケジュール書き込み
     * @param c
     * @param schedules
     */
    export const create = async (prisma: PrismaClient, schedules: CoopScheduleQuery.Schedule[]): Promise<void> => {
      await Promise.all(schedules.map((schedule) => upsert(prisma, schedule)))
    }

    const upsert = async <T extends PrismaClient>(
      prisma: T,
      schedule: CoopScheduleQuery.Schedule
    ): Promise<unknown> => {
      return await prisma.schedule.upsert({
        where: { id: schedule.id },
        create: {
          id: schedule.id,
          startTime: dayjs(schedule.startTime).toDate(),
          endTime: dayjs(schedule.endTime).toDate(),
          stageId: schedule.stageId,
          bossId: schedule.bossId,
          weaponList: schedule.weaponList,
          mode: schedule.mode,
          rule: schedule.rule,
          rareWeapons: schedule.rareWeapons
        },
        update: {}
      })
    }
  }

  export namespace RESULT {
    export const create = async (
      c: Context<{ Bindings: Bindings }>,
      data: CoopResultQuery.CoopHistory<z.ZodTypeAny>
    ): Promise<void> => {
      const prisma = Prisma(c)
      // スケジュールだけ先に書き込む
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const schedules: CoopScheduleQuery.Schedule[] = data.histories.map((history: any) => history.schedule)
      console.info(await SCHEDULE.create(prisma, schedules))
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const results: CoopResultQuery.CoopResult[] = data.histories.flatMap((history: any) => history.results)
      console.info(await Promise.all(results.map((result) => upsert(prisma, result))))
      await prisma.$disconnect()
    }

    const upsert = async <T extends PrismaClient>(prisma: T, result: CoopResultQuery.CoopResult): Promise<unknown> => {
      const members = [result.myResult, ...result.otherResults]
      const bossResults: (boolean | null)[] =
        result.bossResults === null ? [null, null, null] : result.bossResults.map((result) => result.isBossDefeated)
      return await prisma.result.upsert({
        where: { id: result.id },
        create: {
          id: result.id,
          uuid: result.uuid,
          playTime: dayjs(result.playTime).toDate(),
          bossCounts: result.bossCounts,
          bossKillCounts: result.bossKillCounts,
          ikuraNum: result.ikuraNum,
          goldenIkuraNum: result.goldenIkuraNum,
          goldenIkuraAssistNum: result.goldenIkuraAssistNum,
          nightLess: result.waveDetails.every((wave) => wave.eventType === 0),
          dangerRate: result.dangerRate,
          members: members.map((member) => member.nplnUserId),
          bronze: result.scale === null ? null : result.scale[0],
          silver: result.scale === null ? null : result.scale[1],
          gold: result.scale === null ? null : result.scale[2],
          isClear: result.jobResult.isClear,
          failureWave: result.jobResult.failureWave,
          bossId: result.jobResult.bossId,
          isBossDefeated: result.jobResult.isBossDefeated,
          isGiantDefeated: bossResults[0],
          isRopeDefeated: bossResults[1],
          isJawDefeated: bossResults[2],
          scenarioCode: result.scenarioCode,
          schedule: {
            connectOrCreate: {
              where: { id: result.schedule.id },
              create: {
                id: result.schedule.id,
                startTime: dayjs(result.schedule.startTime).toDate(),
                endTime: dayjs(result.schedule.endTime).toDate(),
                stageId: result.schedule.stageId,
                bossId: result.schedule.bossId,
                weaponList: result.schedule.weaponList,
                mode: result.schedule.mode,
                rule: result.schedule.rule,
                rareWeapons: result.schedule.rareWeapons
              }
            }
          },
          players: {
            createMany: {
              data: members.map((member) => ({
                id: member.id,
                uuid: result.uuid,
                nplnUserId: member.nplnUserId,
                playTime: dayjs(result.playTime).toDate(),
                name: member.name,
                byname: member.byname,
                nameId: member.nameId,
                badges: member.nameplate.badges.map((badge) => badge ?? -1),
                nameplate: member.nameplate.background.id,
                textColor: [
                  member.nameplate.background.textColor.r,
                  member.nameplate.background.textColor.g,
                  member.nameplate.background.textColor.b,
                  member.nameplate.background.textColor.a
                ],
                uniform: member.uniform,
                bossKillCountsTotal: member.bossKillCountsTotal,
                bossKillCounts: member.bossKillCounts.map((count) => count ?? -1),
                deadCount: member.deadCount,
                helpCount: member.helpCount,
                ikuraNum: member.ikuraNum,
                goldenIkuraNum: member.goldenIkuraNum,
                goldenIkuraAssistNum: member.goldenIkuraAssistNum,
                jobBonus: member.jobBonus,
                jobRate: member.jobRate,
                jobScore: member.jobScore,
                kumaPoint: member.kumaPoint,
                gradeId: member.gradeId,
                gradePoint: member.gradePoint,
                smellMeter: member.smellMeter,
                species: member.species,
                specialId: member.specialId,
                specialCounts: member.specialCounts,
                weaponList: member.weaponList
              })),
              skipDuplicates: true
            }
          },
          waves: {
            createMany: {
              data: result.waveDetails.map((wave) => ({
                id: wave.id,
                uuid: result.uuid,
                playTime: dayjs(result.playTime).toDate(),
                waveId: wave.waveId,
                waterLevel: wave.waterLevel,
                eventType: wave.eventType,
                goldenIkuraNum: wave.goldenIkuraNum,
                goldenIkuraPopNum: wave.goldenIkuraPopNum,
                quotaNum: wave.quotaNum,
                isClear: wave.isClear
              })),
              skipDuplicates: true
            }
          }
        },
        update: {
          players: {
            update: {
              where: { id: result.myResult.id },
              data: {
                jobBonus: result.myResult.jobBonus,
                jobRate: result.myResult.jobRate,
                jobScore: result.myResult.jobScore,
                kumaPoint: result.myResult.kumaPoint,
                gradeId: result.myResult.gradeId,
                gradePoint: result.myResult.gradePoint,
                smellMeter: result.myResult.smellMeter,
                bossKillCounts: result.myResult.bossKillCounts.map((count) => count ?? -1)
              }
            }
          }
        }
      })
    }
  }
}
