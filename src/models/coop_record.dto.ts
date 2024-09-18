import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopStage } from '@/enums/coop/coop_stage'
import { CoopTrophy } from '@/enums/coop/coop_trophy'
import { CoopRecord } from '@/schema/coop_record.dto'
import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { CoopData } from './common/coop_data.dto'
import { CoopGradeModel } from './common/coop_grade.dto'
import { CoopStageModel } from './common/coop_stage.dto'
import { ImageURL } from './common/image_url.dto'
import { RawId } from './common/raw_id.dto'

const DefeatEnemyModel = z.object({
  enemy: z
    .object({
      coopEnemyId: z.number().int().min(3).max(35)
    })
    .merge(ImageURL),
  defeatCount: z.number().int().min(0)
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

const RegularRecordModel = z.object({
  coopStage: CoopStageModel,
  grade: CoopGradeModel,
  gradePoint: z.number().int().min(0).max(999)
})

const BigRunRecordModel = z.object({
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  trophy: z.nativeEnum(CoopTrophy),
  coopStage: CoopStageModel,
  highestGrade: CoopGradeModel,
  highestGradePoint: z.number().int().min(0).max(999),
  highestJobScore: z.number().int().min(0).max(999),
  rankPercentile: z.number().int().min(0).max(100).nullable()
})

const CoopRecordModel = z.object({
  stageHighestRecords: z.array(RegularRecordModel),
  bigRunRecord: z.object({
    records: z.object({
      edges: z.array(
        z.object({
          node: BigRunRecordModel
        })
      )
    })
  }),
  defeatEnemyRecords: z.array(DefeatEnemyModel),
  defeatBossRecords: z.array(DefeatEnemyModel)
})

export const Request = CoopData(
  z.object({
    coopRecord: CoopRecordModel
  })
)

export const Response = z.object({})

export class CoopRecordQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({})
  }
}

type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
