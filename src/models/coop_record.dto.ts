import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopStage } from '@/enums/coop/coop_stage'
import { CoopTrophy } from '@/enums/coop/coop_trophy'
import { sortedJSON } from '@/utils/sorted'
import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { DateTime } from './common/datetime.dto'
import { RawId } from './common/raw_id.dto'
import { ImageURL } from './common/s3_url.dto'

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
  )
    .transform((v) => v.data.coopRecord)
    .transform((v) => ({
      stageRecords: v.stageHighestRecords
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
          v.bigRunRecord.map((record) =>
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
      enemyRecords: v.defeatEnemyRecords
        .map((record) =>
          EnemyRecord.parse({
            enemyId: record.enemy.id,
            count: record.defeatCount
          })
        )
        .concat(
          v.defeatBossRecords.map((record) =>
            EnemyRecord.parse({
              enemyId: record.enemy.id,
              count: record.defeatCount
            })
          )
        )
    }))
    .transform((v) => ({
      ...v,
      toJSON: () => sortedJSON(v)
    }))

  export type CoorRecord = z.infer<typeof CoorRecord>
}
