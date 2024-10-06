import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopStage } from '@/enums/coop/coop_stage'
import { CoopTrophy } from '@/enums/coop/coop_trophy'
import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { CoopGradeModel } from './common/coop_grade.dto'
import { CoopStageModel } from './common/coop_stage.dto'
import { DateTime } from './common/datetime.dto'
import { RawId } from './common/raw_id.dto'
import { ImageURL, S3URL } from './common/s3_url.dto'

// const DefeatEnemyModel = z.object({
//   enemy: z
//     .object({
//       coopEnemyId: z.number().int().min(3).max(35)
//     })
//     .merge(ImageURL),
//   defeatCount: z.number().int().min(0)
// })

// const EnemyRecordModel = z.object({
//   count: z.number().int().min(0),
//   enemyId: z.nativeEnum(CoopEnemyInfo.Id).or(z.nativeEnum(CoopBossInfo.Id))
// })

// const CoopStageRecordModel = z.object({
//   startTime: DateTime,
//   endTime: DateTime,
//   goldenIkuraNum: z.number().int().min(0).nullable(),
//   grade: z.nativeEnum(CoopGrade.Id).nullable(),
//   gradePoint: z.number().int().min(0).max(999).nullable(),
//   rank: z.number().int().min(1).max(999).nullable(),
//   stageId: z.nativeEnum(CoopStage.Id),
//   trophy: z.nativeEnum(CoopTrophy).nullable()
// })

// const RegularRecordModel = z.object({
//   coopStage: CoopStageModel,
//   grade: CoopGradeModel,
//   gradePoint: z.number().int().min(0).max(999)
// })

// const BigRunRecordModel = z.object({
//   startTime: z.string().datetime(),
//   endTime: z.string().datetime(),
//   trophy: z.nativeEnum(CoopTrophy),
//   coopStage: CoopStageModel,
//   highestGrade: CoopGradeModel,
//   highestGradePoint: z.number().int().min(0).max(999),
//   highestJobScore: z.number().int().min(0).max(999),
//   rankPercentile: z.number().int().min(0).max(100).nullable()
// })

// const CoopRecordModel = z.object({
//   stageHighestRecords: z.array(RegularRecordModel),
//   bigRunRecord: z.object({
//     records: z.object({
//       edges: z.array(
//         z.object({
//           node: BigRunRecordModel
//         })
//       )
//     })
//   }),
//   defeatEnemyRecords: z.array(DefeatEnemyModel),
//   defeatBossRecords: z.array(DefeatEnemyModel)
// })

// export namespace CoopRecord {
//   export const Request = CoopData(
//     z.object({
//       coopRecord: CoopRecordModel
//     })
//   )

//   export const Response = z.object({
//     stageRecords: z.array(CoopStageRecordModel),
//     enemyRecords: z.array(EnemyRecordModel)
//   })

//   export type Request = z.infer<typeof Request>
//   export type Response = z.infer<typeof Response>
// }

// export class CoopRecordQuery implements ResourceQuery {
//   private readonly request: CoopRecord.Request
//   private readonly response: CoopRecord.Response

//   constructor(data: object) {
//     this.request = CoopRecord.Request.parse(data)
//     this.response = CoopRecord.Response.parse({
//       stageRecords: this.stageRecords,
//       enemyRecords: this.enemyRecords
//     })
//   }

//   toJSON(): CoopRecord.Response {
//     return this.response
//   }

//   get assetURLs(): S3URL[] {
//     return this.coopRecord.stageHighestRecords
//       .map((record) => record.coopStage.image.url)
//       .concat(this.coopRecord.bigRunRecord.records.edges.map((edge) => edge.node.coopStage.image.url))
//       .concat(this.coopRecord.defeatEnemyRecords.flatMap((record) => record.enemy.image.url))
//       .concat(this.coopRecord.defeatBossRecords.flatMap((record) => record.enemy.image.url))
//       .map((url) => S3URL.parse(url))
//   }

//   private get coopRecord(): CoopRecordModel {
//     return this.request.data.coopRecord
//   }

//   private get enemyRecords(): EnemyRecordModel[] {
//     return this.coopRecord.defeatEnemyRecords
//       .map((record) =>
//         EnemyRecordModel.parse({
//           count: record.defeatCount,
//           enemyId: record.enemy.coopEnemyId
//         })
//       )
//       .concat(
//         this.coopRecord.defeatBossRecords.map((record) =>
//           EnemyRecordModel.parse({
//             count: record.defeatCount,
//             enemyId: record.enemy.coopEnemyId
//           })
//         )
//       )
//   }

//   private get stageRecords(): CoopStageRecordModel[] {
//     return [...this.stageHighestRecords, ...this.bigRunRecords]
//   }

//   private get bigRunRecords(): CoopStageRecordModel[] {
//     return this.coopRecord.bigRunRecord.records.edges.map((edge) =>
//       CoopStageRecordModel.parse({
//         startTime: edge.node.startTime,
//         endTime: edge.node.endTime,
//         goldenIkuraNum: edge.node.highestJobScore,
//         grade: edge.node.highestGrade?.id,
//         gradePoint: edge.node.highestGradePoint,
//         rank: edge.node.rankPercentile,
//         stageId: edge.node.coopStage.id,
//         trophy: edge.node.trophy
//       })
//     )
//   }

//   private get stageHighestRecords(): CoopStageRecordModel[] {
//     return this.coopRecord.stageHighestRecords.map((record) =>
//       CoopStageRecordModel.parse({
//         startTime: null,
//         endTime: null,
//         goldenIkuraNum: null,
//         grade: record.grade?.id,
//         gradePoint: record.gradePoint,
//         rank: null,
//         stageId: record.coopStage.id,
//         trophy: null
//       })
//     )
//   }
// }

// type CoopRecordModel = z.infer<typeof CoopRecordModel>
// type EnemyRecordModel = z.infer<typeof EnemyRecordModel>
// type CoopStageRecordModel = z.infer<typeof CoopStageRecordModel>

export namespace CoopRecordQuery {
  const StageHighestRecord = z.object({
    coopStage: RawId(CoopStage.Id).merge(ImageURL),
    grade: RawId(CoopGrade.Id),
    gradePoint: z.number().int().min(0).max(999)
  })

  const BigRunRecord = z
    .object({
      records: z.object({
        edges: z.array(
          z
            .object({
              node: z.object({
                startTime: DateTime,
                endTime: DateTime,
                trophy: z.nativeEnum(CoopTrophy),
                coopStage: RawId(CoopStage.Id).merge(ImageURL),
                highestGrade: RawId(CoopGrade.Id),
                highestGradePoint: z.number().int().min(0).max(999),
                highestJobScore: z.number().int().min(0).max(999),
                rankPercentile: z.number().int().min(0).max(100).nullable()
              })
            })
            .transform((v) => ({
              startTime: v.node.startTime,
              endTime: v.node.endTime,
              trophy: v.node.trophy,
              coopStage: v.node.coopStage,
              highestGrade: v.node.highestGrade,
              highestGradePoint: v.node.highestGradePoint,
              highestJobScore: v.node.highestJobScore,
              rankPercentile: v.node.rankPercentile
            }))
        )
      })
    })
    .transform((v) => v.records.edges.map((edge) => edge))

  const TeamContestRecord = z.object({})

  const DefeatEnemyRecord = <T extends z.EnumLike>(S: T) =>
    z.object({
      enemy: RawId(S).merge(ImageURL),
      defeatCount: z.number().int().min(0)
    })

  const StageRecord = z.object({
    startTime: DateTime,
    endTime: DateTime,
    goldenIkuraNum: z.number().int().min(0).nullable(),
    grade: z.nativeEnum(CoopGrade.Id).nullable(),
    gradePoint: z.number().int().min(0).max(999).nullable(),
    rank: z.number().int().min(1).max(999).nullable(),
    stageId: z.nativeEnum(CoopStage.Id),
    trophy: z.nativeEnum(CoopTrophy).nullable()
  })

  const EnemyRecord = z.object({
    enemyId: z.nativeEnum(CoopEnemyInfo.Id).or(z.nativeEnum(CoopBossInfo.Id)),
    count: z.number().int().min(0)
  })

  export const CoorRecord = CoopData(
    z.object({
      coopRecord: z.object({
        stageHighestRecords: z.array(StageHighestRecord),
        bigRunRecord: BigRunRecord,
        // teamContestRecord:
        defeatEnemyRecords: z.array(DefeatEnemyRecord(CoopEnemyInfo.Id)),
        defeatBossRecords: z.array(DefeatEnemyRecord(CoopBossInfo.Id))
      })
    })
  ).transform((v) => {
    return {
      toJSON: () => ({
        stageRecords: v.data.coopRecord.stageHighestRecords
          .map((record) =>
            StageRecord.parse({
              startTime: null,
              endTime: null,
              goldenIkuraNum: null,
              grade: record.grade.id,
              gradePoint: record.gradePoint,
              rank: null,
              stageId: record.coopStage.id,
              trophy: null
            })
          )
          .concat(
            v.data.coopRecord.bigRunRecord.map((record) =>
              StageRecord.parse({
                startTime: record.startTime,
                endTime: record.endTime,
                goldenIkuraNum: record.highestJobScore,
                grade: record.highestGrade.id,
                gradePoint: record.highestGradePoint,
                rank: record.rankPercentile,
                stageId: record.coopStage.id,
                trophy: record.trophy
              })
            )
          ),
        enemyRecords: v.data.coopRecord.defeatEnemyRecords
          .map((record) =>
            EnemyRecord.parse({
              enemyId: record.enemy.id,
              count: record.defeatCount
            })
          )
          .concat(
            v.data.coopRecord.defeatBossRecords.map((record) =>
              EnemyRecord.parse({
                enemyId: record.enemy.id,
                count: record.defeatCount
              })
            )
          )
      })
    }
  })
}
