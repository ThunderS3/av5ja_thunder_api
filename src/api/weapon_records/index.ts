import { HTTPMethod } from '@/enums/method'
import { CoopRecordModel } from '@/models/coop_record.dto'
import { CoopWeaponRecordModel } from '@/models/coop_weapon_record.dto'
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
        type: 'application/json',
        description: 'アセットURL一覧'
      }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    return c.json(body, 201)
  }
)
