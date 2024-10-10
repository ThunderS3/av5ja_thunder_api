import { HTTPMethod } from '@/enums/method'
import { bearerToken } from '@/middleware/bearer_token.middleware'
import { resource } from '@/middleware/resource.middleware'
import { CoopHistoryDetailQuery } from '@/models/coop_history_detail.dto'
import { CoopResultQuery } from '@/models/coop_result.dto'
import { BadRequestResponse } from '@/utils/bad_request.response'
import type { Bindings } from '@/utils/bindings'
import { KV } from '@/utils/cloudflare/kv'
import { R2 } from '@/utils/cloudflare/r2'
import { Prisma } from '@/utils/prisma'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    middleware: [resource],
    path: '/',
    tags: ['リザルト'],
    summary: '一覧詳細',
    description: 'リザルト一覧詳細を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopResultQuery.CoopHistory(CoopHistoryDetailQuery.CoopHistoryDetail).openapi({
              description: 'CoopHistoryQuery+CoopHistoryDetailQuery'
            })
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: CoopResultQuery.CoopHistory(CoopResultQuery.CoopResult).openapi({})
          }
        },
        description: 'リザルト一覧詳細'
      },
      ...BadRequestResponse
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const results: CoopResultQuery.CoopResult[] = body.histories.flatMap((history) =>
      history.results.map((result) => CoopResultQuery.CoopResult.parse(result))
    )
    c.executionCtx.waitUntil(Promise.all(results.map((result) => KV.RESULT.set(c.env, result))))
    c.executionCtx.waitUntil(Prisma.RESULT.create(c, results))
    return c.json(body)
  }
)

app.openapi(
  createRoute({
    method: HTTPMethod.PATCH,
    path: '/',
    tags: ['リザルト'],
    summary: '一覧詳細',
    description: 'リザルト一覧詳細を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopResultQuery.CoopHistory(CoopResultQuery.CoopResult).openapi({})
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: CoopResultQuery.CoopHistory(CoopResultQuery.CoopResult).openapi({})
          }
        },
        description: 'リザルト一覧詳細'
      },
      ...BadRequestResponse
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    const results = body.histories.flatMap((history) =>
      history.results.map((result) => CoopResultQuery.CoopResult.parse(result))
    )
    c.executionCtx.waitUntil(Promise.all(results.map((result) => KV.RESULT.set(c.env, result))))
    // c.executionCtx.waitUntil(Prisma.RESULT.create(c, body))
    return c.json(body)
  }
)

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['リザルト'],
    middleware: [bearerToken],
    summary: '一覧詳細',
    description: 'リザルト一覧詳細を返します',
    request: {
      query: z.object({
        limit: z.number().int().min(1).max(10).default(5),
        cursor: z.string().optional()
      })
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: CoopResultQuery.CoopResult.openapi({})
          }
        },
        description: 'リザルト一覧詳細'
      },
      ...BadRequestResponse
    }
  }),
  async (c) => {
    const { usr } = c.get('jwtPayload')
    const { limit, cursor } = c.req.valid('query')
    if (usr.membership === false && cursor !== undefined) {
      throw new HTTPException(403, { message: 'Forbidden.' })
    }
    const object: R2Objects = await R2.RESULT.list(c.env, usr.npln_user_id, limit, cursor)
    const histories = await R2.RESULT.get_all(c.env, object)
    // @ts-ignore
    return c.json({ histories, truncated: object.truncated, cursor: object.cursor })
  }
)
