import { HTTPMethod } from '@/enums/method'
import { CoopRecordModel } from '@/models/coop_record.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute } from '@hono/zod-openapi'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    path: '/',
    tags: ['記録'],
    summary: 'サーモンラン記録',
    description: 'アセットのURL一覧を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopRecordModel.Req
          }
        }
      }
    },
    responses: {
      200: {
        content: {
          'application/json': {
            schema: CoopRecordModel.Res
          }
        },
        description: 'ブキ記録'
      }
    }
  }),
  async (c) => {
    const body: CoopRecordModel.Req = c.req.valid('json')
    return c.json(
      CoopRecordModel.Res.parse({
        stageRecords: body.stageRecords,
        enemyRecords: body.enemyRecords,
        bossRecords: body.bossRecords,
        assetURLs: body.assetURLs
      }),
      200
    )
  }
)
