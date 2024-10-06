import type { CoopResultQuery } from '@/models/coop_result.dto'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import dayjs from 'dayjs'
import type { Context } from 'hono'
import type { Bindings } from './bindings'

export namespace Prisma {
  const Prisma = (c: Context<{ Bindings: Bindings }>) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    return prisma
  }

  export const create = async (
    c: Context<{ Bindings: Bindings }>,
    result: CoopResultQuery.CoopResult
  ): Promise<void> => {
    const prisma = Prisma(c)
    const members = [result.myResult, ...result.otherResults]
    const bossResults: (boolean | null)[] =
      result.bossResults === null ? [null, null, null] : result.bossResults.map((result) => result.isBossDefeated)
    await prisma.result.upsert({
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
    await prisma.$disconnect()
  }
}
