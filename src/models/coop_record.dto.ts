import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopStage } from '@/enums/coop/coop_stage'
import { CoopTrophy } from '@/enums/coop/coop_trophy'
import { z } from '@hono/zod-openapi'
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

const DefeatEnemyModel = z.object({
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

export const CoopRecordModel = Data(
  z.object({
    coopRecord: z.object({
      stageHighestRecords: z.array(
        z.object({
          // coopStage: CoopStageModel,
          // grade: z.object({
          //   id: RawId(CoopGrade.Id)
          // }),
          gradePoint: z.number().int().min(0).max(999)
        })
      ),
      bigRunRecord: z.object({
        records: z.object({
          edges: z.array(
            z.object({
              node: z.object({
                startTime: z.string().datetime(),
                endTime: z.string().datetime(),
                trophy: z.nativeEnum(CoopTrophy),
                // coopStage: CoopStageModel,
                // highestGrade: z.object({
                //   id: RawId(CoopGrade.Id)
                // }),
                highestGradePoint: z.number().int().min(0).max(999),
                highestJobScore: z.number().int().min(0).max(999),
                rankPercentile: z.number().int().min(0).max(100).nullable()
              })
            })
          )
        })
      }),
      defeatEnemyRecords: z.array(DefeatEnemyModel),
      defeatBossRecords: z.array(DefeatEnemyModel)
    })
  })
)

export type CoopRecordModel = z.infer<typeof CoopRecordModel>
