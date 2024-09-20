import { HTTPMethod } from '@/enums/method'
import { CoopHistory, CoopHistoryQuery } from '@/models/coop_history.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    security: [{ AuthorizationApiKey: [] }],
    path: '/',
    tags: ['履歴'],
    summary: '作成',
    description: 'サーモンランの履歴一覧を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopHistory.Request
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: CoopHistory.Response
          }
        },
        description: '履歴一覧'
      }
    }
  }),
  async (c) => {
    c.req.valid('json')
    return c.json(new CoopHistoryQuery(await c.req.json()))
  }
)
