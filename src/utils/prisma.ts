import type { CoopHistoryDetail } from '@/models/coop_history_detail.dto'
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
    result: CoopHistoryDetail.Response
  ): Promise<void> => {
    const prisma = Prisma(c)
    const members = [result.myResult, ...result.otherResults]
    const bossResults: (boolean | null)[] =
      result.bossResults === null ? [null, null, null] : result.bossResults.map((result) => result.isDefeated)
    // prisma.result.upsert({
    //   where: { id: result.id },
    //   create: {
    //     id: result.id,
    //     uuid: result.uuid,
    //     playTime: dayjs(result.playTime).toDate(),
    //     bossCounts: result.bossCounts,
    //     bossKillCounts: result.bossKillCounts,
    //     ikuraNum: result.ikuraNum,
    //     goldenIkuraNum: result.goldenIkuraNum,
    //     goldenIkuraAssistNum: result.goldenIkuraAssistNum,
    //     nightLess: result.waveDetails.every((wave) => wave.eventType === 0),
    //     dangerRate: result.dangerRate,
    //     members: members.map((member) => member.nplnUserId),
    //     bronze: result.scale === null ? null : result.scale[0],
    //     silver: result.scale === null ? null : result.scale[1],
    //     gold: result.scale === null ? null : result.scale[2],
    //     isClear: result.jobResult.isClear,
    //     failureWave: result.jobResult.failureWave,
    //     isBossDefeated: result.jobResult.isBossDefeated,
    //     isGiantDefeated: bossResults[0],
    //     isRopeDefeated: bossResults[1],
    //     isJawDefeated: bossResults[2],
    //     scenarioCode: result.scenarioCode
    //   },
    //   update: {}
    // })
    console.log(result)
    prisma.result.create({
      data: {
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
        }
      }
    })
    await prisma.$disconnect()
  }
}
