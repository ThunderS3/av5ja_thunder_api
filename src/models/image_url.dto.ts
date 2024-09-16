import { z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

export const ImageURL = z.object({
  image: z.object({
    url: z.string().url()
  })
})

export const RawId = <T extends z.EnumLike>(S: T) =>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  z.preprocess((input: any) => {
    const pattern: RegExp = /-([0-9-]+)$/
    const match: RegExpMatchArray | null = atob(input as string).match(pattern)
    if (match === null) {
      throw new HTTPException(400, { message: 'Base64にデコードできない文字列が含まれています' })
    }
    const value: number = Number.parseInt(match[1], 10)
    console.log(value)
    if (Number.isNaN(value)) {
      throw new HTTPException(400, { message: '数値に変換できる文字列が含まれていません' })
    }
    return value
  }, z.nativeEnum(S))
