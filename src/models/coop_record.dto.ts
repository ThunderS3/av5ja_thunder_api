import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopStage } from '@/enums/coop/coop_stage'
import { CoopTrophy } from '@/enums/coop/coop_trophy'
import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { ImageURL, RawId } from './image_url.dto'

export const Data = <T extends z.AnyZodObject>(S: T) => {
  return z.object({
    data: S
  })
}

const CoopStageModel = z
  .object({
    id: RawId(CoopStage.Id)
  })
  .merge(ImageURL)

const DefeatEnemyModel = z
  .object({
    enemy: z
      .object({
        coopEnemyId: z.number().int().min(3).max(35),
        image: z.object({
          url: z.string().url()
        })
      })
      .merge(ImageURL),
    defeatCount: z.number().int().min(0)
  })
  .transform((object) => {
    return {
      ...object,
      record: {
        count: object.defeatCount,
        enemyId: object.enemy.coopEnemyId
      }
    }
  })

const CoopStageRecordModel = z.object({
  startTime: z.string().datetime().nullable(),
  endTime: z.string().datetime().nullable(),
  goldenIkuraNum: z.number().int().min(0).nullable(),
  grade: z.nativeEnum(CoopGrade.Id).nullable(),
  gradePoint: z.number().int().min(0).max(999).nullable(),
  rank: z.number().int().min(1).max(999).nullable(),
  stageId: z.nativeEnum(CoopStage.Id),
  trophy: z.nativeEnum(CoopTrophy).nullable()
})

export namespace CoopRecordModel {
  export const Req = Data(
    z.object({
      coopRecord: z.object({
        stageHighestRecords: z.array(
          z
            .object({
              coopStage: CoopStageModel,
              grade: z.object({
                id: RawId(CoopGrade.Id)
              }),
              gradePoint: z.number().int().min(0).max(999)
            })
            .transform((object) => {
              return {
                ...object,
                get record(): CoopStageRecordModel {
                  return CoopStageRecordModel.parse({
                    startTime: null,
                    endTime: null,
                    goldenIkuraNum: null,
                    grade: object.grade.id,
                    gradePoint: object.gradePoint,
                    rank: null,
                    stageId: object.coopStage.id,
                    trophy: null
                  })
                }
              }
            })
        ),
        bigRunRecord: z
          .object({
            records: z.object({
              edges: z.array(
                z
                  .object({
                    node: z.object({
                      startTime: z.string().datetime(),
                      endTime: z.string().datetime(),
                      trophy: z.nativeEnum(CoopTrophy),
                      coopStage: CoopStageModel,
                      highestGrade: z.object({
                        id: RawId(CoopGrade.Id)
                      }),
                      highestGradePoint: z.number().int().min(0).max(999),
                      highestJobScore: z.number().int().min(0).max(999),
                      rankPercentile: z.number().int().min(0).max(100).nullable()
                    })
                  })
                  .transform((object) => {
                    return {
                      ...object,
                      get record(): CoopStageRecordModel {
                        return CoopStageRecordModel.parse({
                          startTime: dayjs(object.node.startTime).toISOString(),
                          endTime: dayjs(object.node.endTime).toISOString(),
                          goldenIkuraNum: object.node.highestJobScore,
                          grade: object.node.highestGrade.id,
                          gradePoint: object.node.highestGradePoint,
                          rank: object.node.rankPercentile,
                          stageId: object.node.coopStage.id,
                          trophy: object.node.trophy
                        })
                      }
                    }
                  })
              )
            })
          })
          .transform((object) => {
            return {
              ...object,
              assetURLs: object.records.edges.map((record) => record.node.coopStage.image.url)
            }
          }),
        defeatEnemyRecords: z.array(DefeatEnemyModel),
        defeatBossRecords: z.array(DefeatEnemyModel)
      })
    })
  ).transform((object) => {
    return {
      ...object,
      stageRecords: object.data.coopRecord.stageHighestRecords
        .map((record) => record.record)
        .concat(object.data.coopRecord.bigRunRecord.records.edges.map((edge) => edge.record)),
      enemyRecords: object.data.coopRecord.defeatEnemyRecords
        .map((enemyRecord) => enemyRecord.record)
        .concat(object.data.coopRecord.defeatBossRecords.map((bossRecord) => bossRecord.record)),
      assetURLs: object.data.coopRecord.stageHighestRecords
        .map((record) => record.coopStage.image.url)
        .concat(object.data.coopRecord.bigRunRecord.assetURLs)
        .concat(object.data.coopRecord.defeatEnemyRecords.map((enemyRecord) => enemyRecord.enemy.image.url))
        .concat(object.data.coopRecord.defeatBossRecords.map((bossRecord) => bossRecord.enemy.image.url))
    }
  })

  export const Res = z.object({
    stageRecords: z.array(
      z.object({
        startTime: z.string().datetime().nullable(),
        endTime: z.string().datetime().nullable(),
        goldenIkuraNum: z.number().int().min(0).nullable(),
        grade: z.nativeEnum(CoopGrade.Id).nullable(),
        gradePoint: z.number().int().min(0).max(999).nullable(),
        rank: z.number().int().min(1).max(999).nullable(),
        stageId: z.nativeEnum(CoopStage.Id),
        trophy: z.nativeEnum(CoopTrophy).nullable()
      })
    ),
    enemyRecords: z.array(
      z.object({
        count: z.number().int().min(0),
        enemyId: z.union([z.nativeEnum(CoopEnemyInfo.Id), z.nativeEnum(CoopBossInfo.Id)])
      })
    ),
    assetURLs: z.array(z.string().url())
  })

  type CoopStageRecordModel = z.infer<typeof CoopStageRecordModel>
  export type Req = z.infer<typeof Req>
  export type Res = z.infer<typeof Res>
}
