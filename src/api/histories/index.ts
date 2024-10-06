import { HTTPMethod } from '@/enums/method'
import { CoopHistoryQuery } from '@/models/coop_history.dto'
import { BadRequestResponse } from '@/utils/bad_request.response'
import type { Bindings } from '@/utils/bindings'
import { resource } from '@/utils/middleware/resource.middleware'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    security: [{ AuthorizationApiKey: [] }],
    middleware: [resource],
    path: '/',
    tags: ['リザルト'],
    summary: '一覧',
    description: 'リザルト一覧を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopHistoryQuery.CoopResult.openapi({
              description: 'CoopHistoryQuery'
            })
          }
        }
      }
    },
    responses: {
      // 200: {
      //   content: {
      //     // 'application/json': {
      //     //   schema: CoopHistory.Response
      //     // }
      //   },
      //   description: 'リザルト一覧'
      // },
      // ...BadRequestResponse
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    return c.json(body)
  }
)
