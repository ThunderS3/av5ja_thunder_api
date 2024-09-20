import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { ImageURL } from './common/image_url.dto'
import { NodeList } from './common/node_list.dto'

const WeaponRecordModel = z.object({
  subWeapon: ImageURL,
  specialWeapon: ImageURL,
  image2d: z.object({
    url: z.string().url()
  })
})

export const Request = CoopData(
  z.object({
    weaponRecords: NodeList(WeaponRecordModel)
  })
)

export const Response = z.object({
  assetURLs: z.array(z.string().url())
})

export class WeaponRecordQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({
      assetURLs: Array.from(
        new Set(
          this.request.data.weaponRecords.nodes.flatMap((record) => [
            record.image2d.url,
            record.subWeapon.image.url,
            record.specialWeapon.image.url
          ])
        )
      )
    })
  }

  toJSON(): object {
    return this.response
  }
}

type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
