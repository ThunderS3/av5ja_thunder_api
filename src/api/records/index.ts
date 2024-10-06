import { HTTPMethod } from '@/enums/method'
import { CoopRecordQuery } from '@/models/coop_record.dto'
import { BadRequestResponse } from '@/utils/bad_request.response'
import type { Bindings } from '@/utils/bindings'
import { resource } from '@/utils/middleware/resource.middleware'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    middleware: [resource],
    path: '/',
    tags: ['記録'],
    summary: 'サーモンラン',
    description: 'ステージ記録、オオモノシャケ、オカシラシャケの記録を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopRecordQuery.CoorRecord.openapi({
              description: 'CoopRecordQuery'
            })
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          // 'application/json': {
          //   schema: CoopRecordQuery.CoorRecord
          // }
        },
        description: 'サーモンラン記録'
      },
      ...BadRequestResponse
    }
  }),
  async (c) => {
    const body = c.req.valid('json')
    return c.json(body)
  }
)
