import { z } from '@hono/zod-openapi'

export const NodeList = <T extends z.ZodTypeAny>(N: T) =>
  z.object({
    nodes: z.array(N)
  })

export type NodeList<T extends z.ZodTypeAny> = z.infer<ReturnType<typeof NodeList<T>>>
