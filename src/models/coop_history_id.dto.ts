import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'

export const CoopHistoryDetailId = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    const text: string = atob(input)
    const pattern: RegExp = /^([A-Za-z]+)-([A-Za-z])-([A-Za-z0-9]+):([0-9T]+)_([0-9a-f-]+)$/
    const match: RegExpMatchArray | null = text.match(pattern)
    if (match === null) {
      return input
    }
    const [, type, prefix, nplnUserId, playTime, uuid] = match
    return {
      type: type,
      prefix: prefix,
      nplnUserId: nplnUserId,
      playTime: dayjs(playTime, 'YYYYMMDDTHHmmss').toISOString(),
      uuid: uuid
    }
  },
  z.object({
    type: z.string(),
    prefix: z.string(),
    nplnUserId: z.string(),
    playTime: z.string().datetime(),
    uuid: z.string().uuid()
  })
)
