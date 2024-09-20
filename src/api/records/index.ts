import { HTTPMethod } from '@/enums/method'
import { CoopRecord, CoopRecordQuery } from '@/models/coop_record.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['記録'],
    summary: 'サーモンラン',
    description: 'ステージ記録、オオモノシャケ、オカシラシャケの記録を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopRecord.Request.openapi({
              description: 'CoopRecordQuery'
            })
          }
        }
      }
    },
    responses: {
      201: {
        content: {
          'application/json': {
            schema: CoopRecord.Response
          }
        },
        description: 'サーモンラン記録'
      }
    }
  }),
  async (c) => {
    c.req.valid('json')
    const body: CoopRecordQuery = new CoopRecordQuery(await c.req.json())
    console.log('[COOP RECORD]:', body.assetURLs.length)
    return c.json(body)
  }
)
