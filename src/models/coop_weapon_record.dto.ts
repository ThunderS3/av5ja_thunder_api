import { z } from '@hono/zod-openapi'
import { Data } from './coop_record.dto'
import { ImageURL } from './image_url.dto'
import { NodeList } from './schedule.dto'

export namespace CoopWeaponRecordModel {
  export const Req = Data(
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
      get res(): CoopWeaponRecordModel.Res {
        return CoopWeaponRecordModel.Res.parse({
          assetURLs: Array.from(
            new Set(object.data.weaponRecords.nodes.flatMap((node) => [node.specialWeapon.image.url, node.image2d.url]))
          )
        })
      }
    }
  })

  export const Res = z.object({
    assetURLs: z.array(z.string().url()).transform((urls) => Array.from(new Set(urls)))
  })

  export type Req = z.infer<typeof Req>
  export type Res = z.infer<typeof Res>
}

export const ImageURLModel = z.object({
  assetURLs: z.array(z.string().url())
})

export type ImageURLModel = z.infer<typeof ImageURLModel>
