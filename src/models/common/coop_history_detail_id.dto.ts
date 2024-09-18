import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { raw } from 'hono/html'

export const CoopHistoryDetailId = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    if (typeof input !== 'string') {
      return input
    }
    const text: string = atob(input)
    const pattern: RegExp = /^([A-Za-z]+)-([a-z]{1}-[a-z0-9]{20}):([0-9T]{15})_([0-9a-f-]{36})$/
    const match: RegExpMatchArray | null = text.match(pattern)
    if (match === null) {
      return input
    }
    const [, type, nplnUserId, playTime, uuid] = match
    return {
      type: type,
      nplnUserId: nplnUserId,
      playTime: dayjs(playTime, 'YYYYMMDDTHHmmss').toISOString(),
      uuid: uuid,
      rawValue: input
    }
  },
  z.object({
    type: z.string(),
    nplnUserId: z.string(),
    playTime: z.string().datetime(),
    uuid: z.string().uuid(),
    rawValue: z.string()
  })
)

export type CoopHistoryDetailId = z.infer<typeof CoopHistoryDetailId>
