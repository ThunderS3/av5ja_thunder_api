// import { Hash2Id } from '@/enums/weapon/main'
// import { HTTPException } from 'hono/http-exception'
// import { ImageURL } from './image_url.dto'

// export const WeaponInfoMainHash = ImageURL.transform((object) => {
//   const pattern: RegExp = /\/([a-f0-9]{64})_/
//   const match: RegExpMatchArray | null = object.image.url.match(pattern)
//   if (match === null) {
//     throw new HTTPException(400, { message: 'Invalid image URL' })
//   }
//   return {
//     id: Hash2Id(match[1]),
//     url: object.image.url
//   }
// })

import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import { S3URL } from './s3_url.dto'

export const WeaponInfoMainId = z
  .object({
    image: z.object({
      url: S3URL
    })
  })
  .transform((v) => {
    console.log('[WEAPON INFO MAIN]:', v)
    const object: [string, WeaponInfoMain.Hash] | undefined = Object.entries(WeaponInfoMain.Hash).find(
      ([_, value]) => value === v.image.url.key
    )
    if (object === undefined) {
      throw new HTTPException(400, { message: `Invalid WeaponInfoMainId: ${v.image.url.key}` })
    }
    return WeaponInfoMain.Id[object[0] as keyof typeof WeaponInfoMain.Id]
  })
