import { createHash } from 'node:crypto'
import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopEvent } from '@/enums/coop/coop_event'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopWaterLevel } from '@/enums/coop/coop_water_level'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { Species } from '@/enums/weapon/species'
import { z } from '@hono/zod-openapi'
import { CoopData } from './common/coop_data.dto'
import { CoopGradeModel } from './common/coop_grade.dto'
import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
import { CoopPlayerId } from './common/coop_player_id.dto'
import { CoopStageModel } from './common/coop_stage.dto'
import { DateTime } from './common/datetime.dto'
import { ImageURL } from './common/image_url.dto'
import { RawId, RawInt } from './common/raw_id.dto'
import { WeaponInfoMainHash } from './common/weapon_hash.dto'
import { Response as CoopScheduleModel } from './coop_schedule.dto'

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

const TextColorModel = z.object({
  r: z.number().min(0).max(1),
  g: z.number().min(0).max(1),
  b: z.number().min(0).max(1),
  a: z.number().min(0).max(1)
})

const BackgroundModel = z.object({
  id: RawInt,
  textColor: TextColorModel
})

const BadgeModel = z
  .object({
    id: RawInt
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
  id: CoopPlayerId,
  nameplate: NameplateModel,
  uniform: z.object({
    id: RawInt
  }),
  species: z.nativeEnum(Species),
  name: z.string()
})

const CoopPlayerResultModel = z.object({
  player: CoopPlayerModel,
  goldenAssistCount: z.number().int().min(0),
  rescuedCount: z.number().int().min(0),
  goldenDeliverCount: z.number().int().min(0),
  weapons: z.array(WeaponInfoMainHash),
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
  jobBonus: z.number().int().min(0).max(100).nullable(),
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
  weapons: z.array(WeaponInfoMainHash)
})

export const Request = CoopData(
  z.object({
    coopHistoryDetail: CoopHistoryDetailModel
  })
)

namespace CoopHistoryDetail {
  export const CoopPlayerResult = z
    .object({
      id: CoopPlayerId,
      byname: z.string(),
      name: z.string(),
      nameId: z.string(),
      nameplate: z.object({
        badges: z.array(z.number().int().nullable()),
        background: z.object({
          id: z.number().int(),
          textColor: z.object({
            r: z.number().min(0).max(1),
            g: z.number().min(0).max(1),
            b: z.number().min(0).max(1),
            a: z.number().min(0).max(1)
          })
        })
      }),
      uniform: z.number().int().min(0),
      species: z.nativeEnum(Species),
      weaponList: z.array(z.nativeEnum(WeaponInfoMain.Id)),
      isMyself: z.boolean(),
      nplnUserId: z.string(),
      specialId: z.nativeEnum(WeaponInfoSpecial.Id).nullable(),
      ikuraNum: z.number().int().min(0),
      goldenIkuraNum: z.number().int().min(0),
      goldenIkuraAssistNum: z.number().int().min(0),
      helpCount: z.number().int().min(0),
      deadCount: z.number().int().min(0),
      bossKillCounts: z.array(z.number().int().min(0).nullable()).length(14),
      bossKillCountsTotal: z.number().int().min(0),
      jobScore: z.number().int().min(0).nullable(),
      gradeId: z.nativeEnum(CoopGrade.Id).nullable(),
      kumaPoint: z.number().int().min(0).nullable(),
      gradePoint: z.number().int().min(0).max(999).nullable(),
      smellMeter: z.number().int().min(0).max(5).nullable(),
      specialCounts: z.array(z.number().int().min(0).max(2)),
      jobBonus: z.number().int().min(0).max(100).nullable(),
      jobRate: z.number().min(0).max(3.25).nullable()
    })
    .transform((data) => {
      return {
        hash: createHash('md5').update(`${data.id.playTime}:${data.id.uuid}:${data.id.nplnUserId}`).digest('hex'),
        ...data
      }
    })

  export const JobResult = z.object({
    failureWave: z.number().int().min(0).max(5).nullable(),
    isClear: z.boolean(),
    bossId: z.nativeEnum(CoopBossInfo.Id).nullable(),
    isBossDefeated: z.boolean().nullable()
  })

  export const WaveResult = z.object({
    hash: z.string(),
    waterLevel: z.nativeEnum(CoopWaterLevel.Id),
    eventType: z.nativeEnum(CoopEvent.Id),
    quotaNum: z.number().int().min(0).nullable(),
    goldenIkuraPopNum: z.number().int().min(0),
    goldenIkuraNum: z.number().int().min(0).nullable(),
    id: z.number().int().min(0),
    isClear: z.boolean()
  })

  export type CoopPlayerResult = z.infer<typeof CoopPlayerResult>
  export type JobResult = z.infer<typeof JobResult>
  export type WaveResult = z.infer<typeof WaveResult>
}

/**
 * サーモンランのリザルトフォーマット
 */
export const Response = z
  .object({
    id: CoopHistoryDetailId,
    uuid: z.string(),
    schedule: CoopScheduleModel.optional(),
    scale: z.array(z.number().int().min(0).max(39).nullable()),
    myResult: CoopHistoryDetail.CoopPlayerResult,
    otherResults: z.array(CoopHistoryDetail.CoopPlayerResult),
    jobResult: CoopHistoryDetail.JobResult,
    playTime: DateTime,
    bossCounts: z.array(z.number().int().min(0)).length(14),
    bossKillCounts: z.array(z.number().int().min(0)).length(14),
    dangerRate: z.number().min(0).max(3.33),
    ikuraNum: z.number().int().min(0),
    goldenIkuraNum: z.number().int().min(0),
    goldenIkuraAssistNum: z.number().int().min(0),
    scenarioCode: z.string().nullable(),
    waveDetails: z.array(CoopHistoryDetail.WaveResult)
  })
  .transform((data) => {
    return {
      hash: createHash('md5').update(`${data.playTime}:${data.uuid}`).digest('hex'),
      ...data
    }
  })

export class CoopHistoryDetailQuery {
  private readonly request: Request
  private readonly response: Response

  constructor(data: object) {
    this.request = Request.parse(data)
    this.response = Response.parse({
      id: this.coopHistoryDetail.id,
      uuid: this.coopHistoryDetail.id.uuid,
      playTime: this.coopHistoryDetail.id.playTime,
      scale: this.scale,
      bossCounts: this.bossCounts,
      bossKillCounts: this.bossKillCounts,
      ikuraNum: this.ikuraNum,
      goldenIkuraNum: this.goldenIkuraNum,
      goldenIkuraAssistNum: this.goldenIkuraAssistNum,
      scenarioCode: this.coopHistoryDetail.scenarioCode,
      dangerRate: this.coopHistoryDetail.dangerRate,
      myResult: this.myResult,
      otherResults: this.otherResults,
      jobResult: this.jobResult,
      waveDetails: this.waveResults
    })
  }

  get result(): Response {
    return this.response
  }

  toJSON(): object {
    return this.response
  }

  private get waveResults(): CoopHistoryDetail.WaveResult[] {
    return this.coopHistoryDetail.waveResults.map((result) =>
      CoopHistoryDetail.WaveResult.parse({
        hash: createHash('md5')
          .update(`${this.coopHistoryDetail.id.playTime}:${this.coopHistoryDetail.id.uuid}:${result.waveNumber}`)
          .digest('hex'),
        waterLevel: result.waterLevel,
        eventType: result.eventWave,
        quotaNum: result.deliverNorm,
        goldenIkuraPopNum: result.goldenPopCount,
        goldenIkuraNum: result.teamDeliverCount,
        id: result.waveNumber,
        isClear:
          this.coopHistoryDetail.bossResult === null
            ? this.coopHistoryDetail.resultWave === 0
              ? true
              : result.waveNumber < this.coopHistoryDetail.resultWave
            : result.waveNumber < this.coopHistoryDetail.waveResults.length
              ? true
              : this.coopHistoryDetail.bossResult.hasDefeatBoss
      })
    )
  }

  private get jobResult(): CoopHistoryDetail.JobResult {
    return CoopHistoryDetail.JobResult.parse({
      failureWave: this.coopHistoryDetail.resultWave === 0 ? null : this.coopHistoryDetail.resultWave,
      isClear: this.coopHistoryDetail.resultWave === 0,
      bossId: this.coopHistoryDetail.bossResult?.boss.id || null,
      isBossDefeated: this.coopHistoryDetail.bossResult?.hasDefeatBoss || null
    })
  }

  private get myResult(): CoopHistoryDetail.CoopPlayerResult {
    const result = this.coopHistoryDetail.myResult
    return CoopHistoryDetail.CoopPlayerResult.parse({
      id: result.player.id,
      byname: result.player.byname,
      name: result.player.name,
      nameId: result.player.nameId,
      nameplate: {
        badges: result.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id)),
        background: {
          id: result.player.nameplate.background.id,
          textColor: result.player.nameplate.background.textColor
        }
      },
      bossKillCounts: this.enemyResults.map((enemy) => enemy?.defeatCount || 0),
      bossKillCountsTotal: result.defeatEnemyCount,
      deadCount: result.rescuedCount,
      goldenIkuraAssistNum: result.goldenAssistCount,
      goldenIkuraNum: result.goldenDeliverCount,
      gradeId: this.coopHistoryDetail.afterGrade?.id || null,
      gradePoint: this.coopHistoryDetail.afterGradePoint,
      helpCount: result.rescueCount,
      ikuraNum: result.deliverCount,
      isMyself: true,
      jobBonus: this.coopHistoryDetail.jobBonus,
      jobRate: this.coopHistoryDetail.jobRate,
      jobScore: this.coopHistoryDetail.jobScore,
      kumaPoint: this.coopHistoryDetail.jobPoint,
      nplnUserId: result.player.id.nplnUserId,
      smellMeter: this.coopHistoryDetail.smellMeter,
      specialCounts: this.specialCounts.map(
        (counts) => counts.filter((id) => id === result.specialWeapon.weaponId).length
      ),
      specialId: result.specialWeapon.weaponId,
      species: result.player.species,
      uniform: result.player.uniform.id,
      weaponList: result.weapons
    })
  }

  private get specialCounts(): WeaponInfoSpecial.Id[][] {
    return this.coopHistoryDetail.waveResults.map((result) => result.specialWeapons.map((weapon) => weapon.id))
  }

  private get otherResults(): CoopHistoryDetail.CoopPlayerResult[] {
    return this.coopHistoryDetail.memberResults.map((result) =>
      CoopHistoryDetail.CoopPlayerResult.parse({
        id: result.player.id,
        byname: result.player.byname,
        name: result.player.name,
        nameId: result.player.nameId,
        nameplate: {
          badges: result.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id)),
          background: {
            id: result.player.nameplate.background.id,
            textColor: result.player.nameplate.background.textColor
          }
        },
        bossKillCounts: Array.from({ length: 14 }, () => null),
        bossKillCountsTotal: result.defeatEnemyCount,
        deadCount: result.rescuedCount,
        goldenIkuraAssistNum: result.goldenAssistCount,
        goldenIkuraNum: result.goldenDeliverCount,
        gradeId: null,
        gradePoint: null,
        helpCount: result.rescueCount,
        ikuraNum: result.deliverCount,
        isMyself: false,
        jobBonus: null,
        jobRate: null,
        jobScore: null,
        kumaPoint: null,
        nplnUserId: result.player.id.nplnUserId,
        smellMeter: null,
        specialCounts: this.specialCounts.map(
          (counts) => counts.filter((id) => id === result.specialWeapon.weaponId).length
        ),
        specialId: result.specialWeapon.weaponId,
        species: result.player.species,
        uniform: result.player.uniform.id,
        weaponList: result.weapons
      })
    )
  }

  private get ikuraNum(): number {
    return this.memberResults.reduce((sum, member) => sum + member.deliverCount, 0)
  }

  private get goldenIkuraNum(): number {
    return this.waveResults.reduce((sum, wave) => sum + (wave.goldenIkuraNum || 0), 0)
  }

  private get goldenIkuraAssistNum(): number {
    return this.memberResults.reduce((sum, member) => sum + member.goldenAssistCount, 0)
  }

  private get memberResults(): CoopPlayerResultModel[] {
    return [this.coopHistoryDetail.myResult, ...this.coopHistoryDetail.memberResults]
  }

  private get enemyResults(): (EnemyResultModel | undefined)[] {
    return Object.values(CoopEnemyInfo.Id)
      .filter((value) => typeof value === 'number')
      .map((key) => this.coopHistoryDetail.enemyResults.find((enemy) => enemy.enemy.id === key))
  }

  private get bossCounts(): number[] {
    return this.enemyResults.map((enemy) => enemy?.popCount || 0)
  }

  private get bossKillCounts(): number[] {
    return this.enemyResults.map((enemy) => enemy?.teamDefeatCount || 0)
  }

  private get scale(): (number | null)[] {
    return this.coopHistoryDetail.scale === null
      ? [null, null, null]
      : [this.coopHistoryDetail.scale.bronze, this.coopHistoryDetail.scale.silver, this.coopHistoryDetail.scale.gold]
  }

  private get coopHistoryDetail(): CoopHistoryDetailModel {
    return this.request.data.coopHistoryDetail
  }
}

type CoopPlayerResultModel = z.infer<typeof CoopPlayerResultModel>
type EnemyResultModel = z.infer<typeof EnemyResultModel>
type CoopHistoryDetailModel = z.infer<typeof CoopHistoryDetailModel>
type Request = z.infer<typeof Request>
type Response = z.infer<typeof Response>
