import { z } from '@hono/zod-openapi'

export const CoopResultModel = z.object({})

export type CoopResultModel = z.infer<typeof CoopResultModel>
