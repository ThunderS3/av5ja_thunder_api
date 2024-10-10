import { HTTPMethod } from '@/enums/method'
import { bearerToken } from '@/middleware/bearer_token.middleware'
import { Thunder } from '@/models/user.dto'
import type { Bindings } from '@/utils/bindings'
import { KV } from '@/utils/cloudflare/kv'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

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
            schema: Thunder.User
          }
        },
        description: 'バージョン'
      }
    }
  }),
  async (c) => {
    const { sub } = c.get('jwtPayload')
    const user: Thunder.User | null = await KV.USER.get(c.env, sub)
    if (user === null) {
      throw new HTTPException(404, { message: 'Not Found.' })
    }
    return c.json(user)
  }
)
