import { HTTPMethod } from '@/enums/method'
import { CoopRecord, CoopRecordQuery } from '@/models/coop_record.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['記録'],
    summary: 'サーモンラン記録',
    description: 'アセットのURL一覧を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopRecord.Request
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: CoopRecord.Response
          }
        },
        description: 'サーモンラン記録'
      }
    }
  }),
  async (c) => {
    c.req.valid('json')
    return c.json(new CoopRecordQuery(await c.req.json()))
  }
)
