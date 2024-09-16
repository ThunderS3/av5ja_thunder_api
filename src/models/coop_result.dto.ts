import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopEvent } from '@/enums/coop/coop_event'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopWaterLevel } from '@/enums/coop/coop_water_level'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { Species } from '@/enums/weapon/species'
import { z } from '@hono/zod-openapi'
import { Data } from './coop_record.dto'
import { ImageURL, RawId } from './image_url.dto'

const CoopPlayerModel = z.object({
  player: z.object({
    byname: z.string(),
    name: z.string(),
    nameId: z.string(),
    nameplate: z.object({
      badges: z.array(
        z
          .object({
            id: z.string()
          })
          .nullable()
      ),
      background: z.object({
        textColor: z.object({
          a: z.number().min(0).max(1),
          b: z.number().min(0).max(1),
          g: z.number().min(0).max(1),
          r: z.number().min(0).max(1)
        }),
        id: z.string()
      })
    }),
    uniform: z.object({
      id: z.string()
    }),
    id: z.string(),
    species: z.nativeEnum(Species)
  }),
  weapons: z.array(ImageURL),
  specialWeapon: z
    .object({
      weaponId: z.nativeEnum(WeaponInfoSpecial.Id).nullable()
    })
    .merge(ImageURL),
  defeatEnemyCount: z.number().int().min(0),
  deliverCount: z.number().int().min(0),
  goldenAssistCount: z.number().int().min(0),
  goldenDeliverCount: z.number().int().min(0),
  rescueCount: z.number().int().min(0),
  rescuedCount: z.number().int().min(0)
})

const BossResultModel = z
  .object({
    hasDefeatBoss: z.boolean(),
    boss: z
      .object({
        id: RawId(CoopBossInfo.Id)
      })
      .merge(ImageURL)
  })
  .nullable()

const EnemyResultModel = z.object({
  defeatCount: z.number().int().min(0),
  teamDefeatCount: z.number().int().min(0),
  popCount: z.number().int().min(0),
  enemy: z
    .object({
      id: RawId(CoopEnemyInfo.Id)
    })
    .merge(ImageURL)
})

const WaveResultModel = z.object({
  waveNumber: z.number().int().min(1),
  waterLevel: z.nativeEnum(CoopWaterLevel.Id),
  eventWave: z
    .object({
      id: RawId(CoopEvent.Id)
    })
    .nullable(),
  deliverNorm: z.number().int().min(0).nullable(),
  goldenPopCount: z.number().int().min(0),
  teamDeliverCount: z.number().int().min(0).nullable(),
  specialWeapons: z.array(
    z
      .object({
        id: RawId(WeaponInfoSpecial.Id)
      })
      .merge(ImageURL)
  )
})

export const CoopResultDataModel = Data(
  z.object({
    coopHistoryDetail: z.object({
      id: z.string(),
      afterGrade: z.object({
        id: RawId(CoopGrade.Id)
      }),
      myResult: CoopPlayerModel,
      memberResults: z.array(CoopPlayerModel),
      bossResult: BossResultModel,
      bossResults: z.array(BossResultModel).nullable(),
      enemyResults: z.array(EnemyResultModel),
      waveResults: z.array(WaveResultModel)
    })
  })
)

export const CoopResultModel = z.object({
  histories: z.array(
    z.object({
      results: z.array(CoopResultDataModel)
    })
  )
})

export type CoopResultModel = z.infer<typeof CoopResultModel>
