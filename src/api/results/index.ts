import { HTTPMethod } from '@/enums/method'
import { CoopResult, CoopResultQuery } from '@/models/coop_result.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['リザルト'],
    summary: '作成',
    description: 'リザルトを作成します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopResult.Request
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: CoopResult.Response
          }
        },
        description: '結果'
      }
    }
  }),
  async (c) => {
    c.req.valid('json')
    return c.json(new CoopResultQuery(await c.req.json()))
  }
)
