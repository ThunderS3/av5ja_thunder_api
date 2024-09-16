import { HTTPMethod } from '@/enums/method'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.GET,
    security: [{ AuthorizationApiKey: [] }],
    path: '/',
    tags: ['スケジュール'],
    summary: '一覧取得',
    description: 'スケジュール一覧を取得します',
    request: {},
    responses: {
      200: {
        type: 'application/json',
        description: '購読データ'
      }
    }
  }),
  async (c) => {
    const keys: string[] = (await c.env.Schedule.list({ limit: 50 })).keys.map((schedule) => schedule.name)
    const schedules = await Promise.all(keys.map(async (key) => c.env.Schedule.get(key, { type: 'json' })))
    return c.json(schedules)
  }
)

app.openapi(
  createRoute({
    method: HTTPMethod.DELETE,
    path: '/',
    tags: ['スケジュール'],
    summary: '一括削除',
    description: 'スケジュールを一括削除します',
    request: {},
    responses: {
      204: {
        description: '削除成功'
      }
    }
  }),
  async (c) => {
    const keys: string[] = (await c.env.Schedule.list({ limit: 50 })).keys.map((schedule) => schedule.name)
    c.executionCtx.waitUntil(Promise.all(keys.map(async (key) => c.env.Schedule.delete(key))))
    return c.json({})
  }
)
