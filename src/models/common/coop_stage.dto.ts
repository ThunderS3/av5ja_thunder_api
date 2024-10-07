import { CoopStage } from '@/enums/coop/coop_stage'
import { z } from '@hono/zod-openapi'
import { RawId } from './raw_id.dto'
import { ImageURL } from './s3_url.dto'

export const CoopStageModel = z
  .object({
    id: RawId(CoopStage.Id)
  })
  .merge(ImageURL)

export type CoopStageModel = z.infer<typeof CoopStageModel>
