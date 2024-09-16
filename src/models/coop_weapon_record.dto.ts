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
)

export type CoopWeaponRecordModel = z.infer<typeof CoopWeaponRecordModel>
