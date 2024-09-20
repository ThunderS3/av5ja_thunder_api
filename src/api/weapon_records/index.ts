import { HTTPMethod } from '@/enums/method'
import { WeaponRecord } from '@/models/weapon_record.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['記録'],
    summary: 'ブキ記録',
    description: 'アセットのURL一覧を登録します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: WeaponRecord.Request
          }
        }
      }
    },
    responses: {
      204: {
        description: 'ブキ記録'
      }
    }
  }),
  async (c) => {
    const body: WeaponRecord.Request = c.req.valid('json')
    return new Response(null, { status: 204 })
  }
)
