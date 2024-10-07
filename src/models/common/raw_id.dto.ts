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
export const RawInt = z.object({
  id: z
    .string()
    .base64()
    .transform((v) => {
      const pattern: RegExp = /-([0-9-]+)$/
      const match: RegExpMatchArray | null = atob(v).match(pattern)
      if (match === null) {
        throw new HTTPException(400, { message: `Invalid Base64 String ${v}` })
      }
      return z.number().int().parse(Number.parseInt(match[1], 10))
    })
})

export type RawInt = z.infer<typeof RawInt>
export type RawId<T extends z.EnumLike> = z.infer<ReturnType<typeof RawId<T>>>
