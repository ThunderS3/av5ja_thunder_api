import { HTTPMethod } from '@/enums/method'
import { bearerToken } from '@/middleware/bearer_token.middleware'
import { CoopHistoryDetail } from '@/models/coop_history_detail.dto'
import { CoopResult, CoopResultQuery } from '@/models/coop_result.dto'
import { BadRequestResponse } from '@/utils/bad_request.response'
import type { Bindings } from '@/utils/bindings'
import { KV } from '@/utils/kv'
import { resource } from '@/utils/middleware/resource.middleware'
import { Prisma, prisma } from '@/utils/prisma'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import type { Context } from 'hono'
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
            schema: CoopResult.Request.openapi({
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
            schema: CoopResult.Response
          }
        },
        description: 'リザルト一覧詳細'
      },
      ...BadRequestResponse()
    }
  }),
  async (c) => {
    c.req.valid('json')
    const body: CoopResultQuery = new CoopResultQuery(await c.req.json())
    c.executionCtx.waitUntil(Promise.all(body.results.map((result) => KV.RESULT.set(c.env, result))))
    // await Promise.all(body.results.map((result) => Prisma.create(c, result)))
    return c.json(body)
  }
)

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    path: '/',
    tags: ['リザルト'],
    summary: '一覧詳細',
    description: 'リザルト一覧詳細を返します',
    request: {},
    responses: {
      201: {
        content: {
          'application/json': {
            schema: CoopResult.Response
          }
        },
        description: 'リザルト一覧詳細'
      },
      ...BadRequestResponse()
    }
  }),
  async (c) => {
    const prisma = Prisma(c.env.DATABASE_URL)
    console.log(prisma)
    return c.json({})
  }
)
