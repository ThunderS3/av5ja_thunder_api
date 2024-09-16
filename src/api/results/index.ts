import { HTTPMethod } from '@/enums/method'
import { CoopResultModel } from '@/models/coop_result.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

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
            schema: CoopResultModel
          }
        }
      }
    },
    responses: {
      200: {
        type: 'application/json',
        description: '結果'
      }
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    return c.json(body)
  }
)
