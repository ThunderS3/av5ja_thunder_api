import { createHash } from 'node:crypto'
import { HTTPMethod } from '@/enums/method'
import { CoopHistoryModel } from '@/models/coop_history.dto'
import { CoopRecordModel } from '@/models/coop_record.dto'
import { CoopScheduleModel } from '@/models/coop_schedule.dto'
import type { Bindings } from '@/utils/bindings'
import { OpenAPIHono as Hono, createRoute, z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { HTTPException } from 'hono/http-exception'

export const app = new Hono<{ Bindings: Bindings }>()

app.openapi(
  createRoute({
    method: HTTPMethod.POST,
    security: [{ AuthorizationApiKey: [] }],
    path: '/',
    tags: ['履歴'],
    summary: '作成',
    description: 'サーモンランの履歴一覧を返します',
    request: {
      body: {
        content: {
          'application/json': {
            schema: CoopHistoryModel.Req
          }
        }
      }
    },
    responses: {
      200: {
        type: 'application/json',
        description: 'アセットURL一覧'
      }
    }
  }),
  async (c) => {
    const body: CoopHistoryModel.Req = c.req.valid('json')
    return c.json(
      body.data.coopResult.historyGroups.nodes.flatMap((node) =>
        CoopScheduleModel.parse({
          id: createHash('md5')
            .update(`${dayjs(node.startTime).toISOString()}:${dayjs(node.endTime).toISOString()}`)
            .digest('hex'),
          startTime: node.startTime,
          endTime: node.endTime,
          mode: node.mode,
          rule: node.rule,
          bossId: null,
          stageId: node.historyDetails.nodes[0].coopStage.id,
          weaponList: [],
          rareWeapons: []
        })
      )
    )
  }
)
