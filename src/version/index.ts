import { HTTPMethod } from '@/enums/method'
import { Version } from '@/models/version.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['情報'],
    summary: 'バージョン',
    responses: {
      200: {
        content: {
          'application/json': {
            schema: Version
          }
        },
        description: 'バージョン'
      }
    }
  }),
  async (c) => {
    return c.json(Version.parse({ revision: '6.0.0-9f87c815', version: '2.10.0' }))
  }
)
