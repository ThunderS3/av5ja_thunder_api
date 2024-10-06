import { z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

/**
 * Base64エンコードされた文字列をNativaEnumに変換する
 * @param S
 * @returns
 */
export const RawId = <T extends z.EnumLike>(S: T) =>
  z.object({
    id: z
      .string()
      .base64()
      .transform((v) => {
        const pattern: RegExp = /-([0-9-]+)$/
        const match: RegExpMatchArray | null = atob(v).match(pattern)
        if (match === null) {
          throw new HTTPException(400, { message: `Invalid RawValue of ${typeof S}` })
        }
        return z.nativeEnum(S).parse(Number.parseInt(match[1], 10))
      })
  })

/**
 * Base64エンコードされた文字列をIntに変換する
 * @param S
 * @returns
 */
export const RawInt = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  (input: any) => {
    const pattern: RegExp = /-([0-9-]+)$/
    const match: RegExpMatchArray | null = atob(input as string).match(pattern)
    if (match === null) {
      return input
    }
    const value: number = Number.parseInt(match[1], 10)
    if (Number.isNaN(value)) {
      return input
    }
    return value
  },
  z.object({
    id: z.number().int()
  })
)

export type RawInt = z.infer<typeof RawInt>
export type RawId<T extends z.EnumLike> = z.infer<ReturnType<typeof RawId<T>>>
