import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopEvent } from '@/enums/coop/coop_event'
import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { Species } from '@/enums/weapon/species'
import { camelcaseKeys } from '@/utils/camelcase_keys'
import { z } from '@hono/zod-openapi'
import { idText } from 'typescript'
import { CoopData } from './common/coop_data.dto'
import { CoopGradeModel } from './common/coop_grade.dto'
import { CoopStageModel } from './common/coop_stage.dto'
import { DateTime } from './common/datetime.dto'
import { ImageURL } from './common/image_url.dto'
import { RawId } from './common/raw_id.dto'
import { CoopHistoryDetailId } from './coop_history_id.dto'

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

const EnemyModel = z
  .object({
    id: RawId(CoopEnemyInfo.Id)
  })
  .merge(ImageURL)

const EnemyResultModel = z.object({
  defeatCount: z.number().int().min(0),
  teamDefeatCount: z.number().int().min(0),
  popCount: z.number().int().min(0),
  enemy: EnemyModel
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const CoopEventModel = z.preprocess((input: any) => {
  return input === null ? CoopEvent.Id.WaterLevels : RawId(CoopEvent.Id).parse(input.id)
}, z.nativeEnum(CoopEvent.Id))

const WeaponInfoMainSpecialModel = z.object({
  id: RawId(WeaponInfoSpecial.Id)
})

const WaveResultModel = z.object({
  waveNumber: z.number().int().min(1).max(5),
  goldenPopCount: z.number().int().min(0),
  waterLevel: z.number().int().min(0).max(2),
  deliverNorm: z.number().int().min(0).nullable(),
  teamDeliverCount: z.number().int().min(0).nullable(),
  eventWave: CoopEventModel,
  specialWeapons: z.array(WeaponInfoMainSpecialModel)
})

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const WeaponInfoMainModel = z.preprocess((input: any) => {
  return input
}, ImageURL)

const TextColorModel = z.object({
  r: z.number().min(0).max(1),
  g: z.number().min(0).max(1),
  b: z.number().min(0).max(1),
  a: z.number().min(0).max(1)
})

const BackgroundModel = z.object({
  id: z.string(),
  textColor: TextColorModel
})

const BadgeModel = z
  .object({
    id: z.string()
  })
  .merge(ImageURL)
  .nullable()

const NameplateModel = z.object({
  background: BackgroundModel,
  badges: z.array(BadgeModel)
})

const CoopPlayerModel = z.object({
  byname: z.string(),
  nameId: z.string(),
  id: z.string(),
  nameplate: NameplateModel,
  uniform: z.object({
    // id: RawId(CoopUniform.Id)
  }),
  species: z.nativeEnum(Species),
  name: z.string()
})

const CoopPlayerResultModel = z.object({
  player: CoopPlayerModel,
  goldenAssistCount: z.number().int().min(0),
  rescuedCount: z.number().int().min(0),
  goldenDeliverCount: z.number().int().min(0),
  weapons: z.array(WeaponInfoMainModel),
  deliverCount: z.number().int().min(0),
  defeatEnemyCount: z.number().int().min(0),
  specialWeapon: z.object({ weaponId: z.nativeEnum(WeaponInfoSpecial.Id).nullable() }),
  rescueCount: z.number().int().min(0)
})

const ScaleModel = z
  .object({
    gold: z.number().int().min(0),
    bronze: z.number().int().min(0),
    silver: z.number().int().min(0)
  })
  .nullable()

const CoopHistoryDetailModel = z.object({
  afterGrade: CoopGradeModel,
  afterGradePoint: z.number().int().min(0).max(999).nullable(),
  bossResult: BossResultModel,
  bossResults: z.array(BossResultModel).nullable(),
  coopStage: CoopStageModel,
  dangerRate: z.number().min(0).max(3.33),
  enemyResults: z.array(EnemyResultModel),
  id: CoopHistoryDetailId,
  jobPoint: z.number().int().min(0).max(999).nullable(),
  jobRate: z.number().min(0).max(3.25).nullable(),
  jobScore: z.number().int().min(0).max(999).nullable(),
  memberResults: z.array(CoopPlayerResultModel),
  myResult: CoopPlayerResultModel,
  playedTime: DateTime,
  resultWave: z.number().int().min(-1).max(5),
  rule: z.nativeEnum(CoopRule),
  scale: ScaleModel,
  scenarioCode: z.string().nullable(),
  smellMeter: z.number().int().min(0).max(5).nullable(),
  waveResults: z.array(WaveResultModel),
  weapons: z.array(WeaponInfoMainModel)
})

export const Request = CoopData(
  z.object({
    coopHistoryDetail: CoopHistoryDetailModel
  })
)

export const Response = z.object({})

export class CoopHistoryDetailQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({})
  }
}

type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
