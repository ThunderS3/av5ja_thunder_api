import { z } from '@hono/zod-openapi'

export const NodeList = <T extends z.ZodEffects<z.AnyZodObject> | z.AnyZodObject>(N: T) =>
  z.object({
    nodes: z.array(N)
  })

export type NodeList<T extends z.ZodEffects<z.AnyZodObject> | z.AnyZodObject> = z.infer<ReturnType<typeof NodeList<T>>>
