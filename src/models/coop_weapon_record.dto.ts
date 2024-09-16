import { z } from '@hono/zod-openapi'
import { Data } from './coop_record.dto'
import { ImageURL } from './image_url.dto'
import { NodeList } from './schedule.dto'

export const CoopWeaponRecordModel = Data(
  z.object({
    weaponRecords: NodeList(
      z.object({
        subWeapon: ImageURL,
        specialWeapon: ImageURL,
        image2d: z.object({
          url: z.string().url()
        })
      })
    )
  })
).transform((object) => {
  return {
    ...object,
    get assetURLs(): string[] {
      return Array.from(
        new Set(object.data.weaponRecords.nodes.flatMap((node) => [node.specialWeapon.image.url, node.image2d.url]))
      )
    }
  }
})

export const ImageURLModel = z.object({
  assetURLs: z.array(z.string().url())
})

export type ImageURLModel = z.infer<typeof ImageURLModel>
export type CoopWeaponRecordModel = z.infer<typeof CoopWeaponRecordModel>
