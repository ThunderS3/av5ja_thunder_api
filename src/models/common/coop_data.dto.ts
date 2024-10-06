import { z } from '@hono/zod-openapi'

export const CoopData = <T extends z.ZodTypeAny>(S: T) =>
  z.object({
    data: S
  })

export type CoopData<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof CoopData<T>>>
