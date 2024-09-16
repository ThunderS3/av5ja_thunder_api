import { HTTPMethod } from '@/enums/method'
import { CoopWeaponRecordModel, ImageURLModel } from '@/models/coop_weapon_record.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['記録'],
    summary: 'ブキ記録',
    description: 'アセットのURL一覧を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopWeaponRecordModel
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: ImageURLModel
          }
        },
        description: 'ブキ記録'
      }
    }
  }),
  async (c) => {
    const body: CoopWeaponRecordModel = c.req.valid('json')
    return c.json(ImageURLModel.parse({ assetURLs: body.assetURLs }))
  }
)
