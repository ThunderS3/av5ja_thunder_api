import { z } from '@hono/zod-openapi'

export const Version = z.object({
  version: z.string().openapi({ description: 'バージョン', example: '2.10.0' }),
  revision: z.string().openapi({ description: 'リビジョン', example: '6.0.0-9f87c815' })
})
