import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import type { WeaponInfoMain } from '@/enums/weapon/main'
import { z } from '@hono/zod-openapi'
import dayjs from 'dayjs'
import { CoopHistoryDetailId } from './coop_history_id.dto'
import { Data } from './coop_record.dto'
import { RawId } from './image_url.dto'
import { CoopScheduleModel, NodeList } from './schedule.dto'

export namespace CoopHistoryModel {
  const HistoryGroup = z
    .object({
      startTime: z
        .string()
        .datetime()
        .nullable()
        .transform((value) => (value === null ? null : dayjs(value).toISOString())),
      endTime: z
        .string()
        .datetime()
        .nullable()
        .transform((value) => (value === null ? null : dayjs(value).toISOString())),
      mode: z.nativeEnum(CoopMode),
      playCount: z.number().int().min(0).nullable(),
      rule: z.nativeEnum(CoopRule),
      historyDetails: NodeList(
        z.object({
          id: CoopHistoryDetailId,
          weapons: z.array(
            z.object({
              image: z.object({
                url: z.string().url()
              })
            })
          ),
          coopStage: z.object({
            id: RawId(CoopStage.Id)
          })
        })
      )
    })
    .transform((object) => {
      return {
        ...object,
        get weaponList(): WeaponInfoMain.Id[] {
          return []
        },
        get bossId(): CoopStage.Id | null | undefined {
          return object.mode === CoopMode.PRIVATE_SCENARIO || object.mode === CoopMode.PRIVATE_CUSTOM ? null : undefined
        },
        get stageId(): CoopStage.Id {
          return object.historyDetails.nodes[0].coopStage.id
        }
      }
    })

  export const Req = Data(
    z.object({
      coopResult: z.object({
        historyGroups: NodeList(HistoryGroup)
      })
    })
  ).transform((object) => {
    return {
      ...object,
      get res(): CoopHistoryModel.Res {
        return CoopHistoryModel.Res.parse({
          histories: object.data.coopResult.historyGroups.nodes.map((node: HistoryGroup) => {
            return {
              schedule: {
                startTime: node.startTime,
                endTime: node.endTime,
                mode: node.mode,
                rule: node.rule,
                weaponList: node.weaponList,
                stageId: node.stageId,
                rareWeapons: [],
                bossId: node.bossId
              },
              results: node.historyDetails.nodes.map((detail) => detail.id)
            }
          })
        })
      }
    }
  })

  export const Res = z.object({
    histories: z.array(
      z.object({
        schedule: CoopScheduleModel,
        results: z.array(CoopHistoryDetailId)
      })
    )
  })

  type HistoryGroup = z.infer<typeof HistoryGroup>
  export type Req = z.infer<typeof Req>
  export type Res = z.infer<typeof Res>
}
