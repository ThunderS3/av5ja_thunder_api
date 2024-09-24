import { HTTPMethod } from '@/enums/method'
import { bearerToken } from '@/middleware/bearer_token.middleware'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    middleware: [bearerToken],
    tags: ['ユーザー'],
    summary: 'ユーザー情報',
    description: 'Thunder3+のユーザー情報を返します',
    responses: {
      200: {
        content: {
          'application/json': {
            // schema: VersionModel
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
