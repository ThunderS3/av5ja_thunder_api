import { HTTPMethod } from '@/enums/method'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['情報'],
    summary: 'リソース',
    description: 'アセット一覧のURLを返します',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: z.object({})
          }
        },
        description: 'バージョン'
      }
    }
  }),
  async (c) => {
    return c.json({})
  }
)
