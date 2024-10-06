import { createHash } from 'node:crypto'
import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopEvent } from '@/enums/coop/coop_event'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { Species } from '@/enums/weapon/species'
// import { createHash } from 'node:crypto'
// import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
// import { CoopEvent } from '@/enums/coop/coop_event'
// import { CoopGrade } from '@/enums/coop/coop_grade'
// import { CoopRule } from '@/enums/coop/coop_rule'
// import { CoopWaterLevel } from '@/enums/coop/coop_water_level'
// import { WeaponInfoMain } from '@/enums/weapon/main'
// import { WeaponInfoSpecial } from '@/enums/weapon/special'
// import { Species } from '@/enums/weapon/species'
import { z } from '@hono/zod-openapi'
import { countBy } from 'lodash'
import { getNameOfDeclaration } from 'typescript'
import { CoopData } from './common/coop_data.dto'
import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
import { CoopPlayerId } from './common/coop_player_id.dto'
import { RawId, RawInt } from './common/raw_id.dto'
import { ImageURL } from './common/s3_url.dto'
import { WeaponInfoMainId } from './common/weapon_hash.dto'
// import { has } from 'lodash'
// import { CoopData } from './common/coop_data.dto'
// import { CoopGradeModel } from './common/coop_grade.dto'
// import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
// import { CoopPlayerId } from './common/coop_player_id.dto'
// import { CoopStageModel } from './common/coop_stage.dto'
// import { DateTime } from './common/datetime.dto'
// import { ImageURL } from './common/image_url.dto'
// import { RawId, RawInt } from './common/raw_id.dto'
// import { S3URL } from './common/s3_url.dto'
// import { WeaponInfoMainHash } from './common/weapon_hash.dto'
// import { CoopSchedule } from './coop_schedule.dto'
// import type { ResourceQuery } from './resource.interface'

// const BossResultModel = z.object({
//   hasDefeatBoss: z.boolean(),
//   boss: z
//     .object({
//       id: RawId(CoopBossInfo.Id)
//     })
//     .merge(ImageURL)
// })

// const EnemyModel = z
//   .object({
//     id: RawId(CoopEnemyInfo.Id)
//   })
//   .merge(ImageURL)

// const EnemyResultModel = z.object({
//   defeatCount: z.number().int().min(0),
//   teamDefeatCount: z.number().int().min(0),
//   popCount: z.number().int().min(0),
//   enemy: EnemyModel
// })

// // biome-ignore lint/suspicious/noExplicitAny: <explanation>
// const CoopEventModel = z.preprocess((input: any) => {
//   return input === null ? CoopEvent.Id.WaterLevels : RawId(CoopEvent.Id).parse(input.id)
// }, z.nativeEnum(CoopEvent.Id))

// const WeaponInfoMainSpecialModel = z.object({
//   id: RawId(WeaponInfoSpecial.Id)
// })

// const WaveResultModel = z.object({
//   waveNumber: z.number().int().min(1).max(5),
//   goldenPopCount: z.number().int().min(0),
//   waterLevel: z.number().int().min(0).max(2),
//   deliverNorm: z.number().int().min(0).nullable(),
//   teamDeliverCount: z.number().int().min(0).nullable(),
//   eventWave: CoopEventModel,
//   specialWeapons: z.array(WeaponInfoMainSpecialModel)
// })

// const TextColorModel = z.object({
//   r: z.number().min(0).max(1),
//   g: z.number().min(0).max(1),
//   b: z.number().min(0).max(1),
//   a: z.number().min(0).max(1)
// })

// const BackgroundModel = z.object({
//   id: RawInt,
//   textColor: TextColorModel
// })

// const BadgeModel = z
//   .object({
//     id: RawInt
//   })
//   .merge(ImageURL)
//   .nullable()

// const NameplateModel = z.object({
//   background: BackgroundModel,
//   badges: z.array(BadgeModel)
// })

// const CoopPlayerModel = z.object({
//   byname: z.string(),
//   nameId: z.string(),
//   id: CoopPlayerId,
//   nameplate: NameplateModel,
//   uniform: z.object({
//     id: RawInt
//   }),
//   species: z.nativeEnum(Species),
//   name: z.string()
// })

// const CoopPlayerResultModel = z.object({
//   player: CoopPlayerModel,
//   goldenAssistCount: z.number().int().min(0),
//   rescuedCount: z.number().int().min(0),
//   goldenDeliverCount: z.number().int().min(0),
//   weapons: z.array(WeaponInfoMainHash),
//   deliverCount: z.number().int().min(0),
//   defeatEnemyCount: z.number().int().min(0),
//   specialWeapon: z.preprocess(
//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     (input: any) => {
//       return input === null
//         ? null
//         : {
//             id: input.weaponId,
//             url: input.image.url
//           }
//     },
//     z.object({
//       url: z.string().url(),
//       id: z.nativeEnum(WeaponInfoSpecial.Id).nullable()
//     })
//   ),
//   rescueCount: z.number().int().min(0)
// })

// const ScaleModel = z
//   .object({
//     gold: z.number().int().min(0),
//     bronze: z.number().int().min(0),
//     silver: z.number().int().min(0)
//   })
//   .nullable()

// const CoopHistoryDetailModel = z.object({
//   afterGrade: CoopGradeModel,
//   afterGradePoint: z.number().int().min(0).max(999).nullable(),
//   bossResult: BossResultModel.nullable(),
//   bossResults: z.array(BossResultModel).nullable(),
//   coopStage: CoopStageModel,
//   dangerRate: z.number().min(0).max(3.33),
//   enemyResults: z.array(EnemyResultModel),
//   id: CoopHistoryDetailId,
//   jobBonus: z.number().int().min(0).max(100).nullable(),
//   jobPoint: z.number().int().min(0).nullable(),
//   jobRate: z.number().min(0).max(3.25).nullable(),
//   jobScore: z.number().int().min(0).max(999).nullable(),
//   memberResults: z.array(CoopPlayerResultModel),
//   myResult: CoopPlayerResultModel,
//   playedTime: DateTime,
//   resultWave: z.number().int().min(-1).max(5),
//   rule: z.nativeEnum(CoopRule),
//   scale: ScaleModel,
//   scenarioCode: z.string().nullable(),
//   smellMeter: z.number().int().min(0).max(5).nullable(),
//   waveResults: z.array(WaveResultModel),
//   weapons: z.array(WeaponInfoMainHash)
// })

// export namespace CoopHistoryDetail {
//   export const Request = CoopData(
//     z.object({
//       coopHistoryDetail: CoopHistoryDetailModel
//     })
//   )

//   export const CoopPlayerResult = z.preprocess(
//     // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//     (input: any) => {
//       if (input === null) {
//         return input
//       }
//       if (typeof input.id === 'string') {
//         return input
//       }
//       input.id = createHash('md5').update(`${input.id.playTime}:${input.id.uuid}:${input.id.nplnUserId}`).digest('hex')
//       return input
//     },
//     z.object({
//       id: z.string(),
//       byname: z.string(),
//       name: z.string(),
//       nameId: z.string(),
//       nameplate: z.object({
//         badges: z.array(z.number().int().nullable()),
//         background: z.object({
//           id: z.number().int(),
//           textColor: z.object({
//             r: z.number().min(0).max(1),
//             g: z.number().min(0).max(1),
//             b: z.number().min(0).max(1),
//             a: z.number().min(0).max(1)
//           })
//         })
//       }),
//       uniform: z.number().int().min(0),
//       species: z.nativeEnum(Species),
//       weaponList: z.array(z.nativeEnum(WeaponInfoMain.Id)),
//       isMyself: z.boolean(),
//       nplnUserId: z.string(),
//       specialId: z.nativeEnum(WeaponInfoSpecial.Id).nullable(),
//       ikuraNum: z.number().int().min(0),
//       goldenIkuraNum: z.number().int().min(0),
//       goldenIkuraAssistNum: z.number().int().min(0),
//       helpCount: z.number().int().min(0),
//       deadCount: z.number().int().min(0),
//       bossKillCounts: z.array(z.number().int().min(0).nullable()).length(14),
//       bossKillCountsTotal: z.number().int().min(0),
//       jobScore: z.number().int().min(0).nullable(),
//       gradeId: z.nativeEnum(CoopGrade.Id).nullable(),
//       kumaPoint: z.number().int().min(0).nullable(),
//       gradePoint: z.number().int().min(0).max(999).nullable(),
//       smellMeter: z.number().int().min(0).max(5).nullable(),
//       specialCounts: z.array(z.number().int().min(0).max(2)),
//       jobBonus: z.number().int().min(0).max(100).nullable(),
//       jobRate: z.number().min(0).max(3.25).nullable()
//     })
//   )

//   export const JobResult = z.object({
//     failureWave: z.number().int().min(-1).max(5).nullable(),
//     isClear: z.boolean(),
//     bossId: z.nativeEnum(CoopBossInfo.Id).nullable(),
//     isBossDefeated: z.boolean().nullable()
//   })

//   export const WaveResult = z.object({
//     id: z.string(),
//     waterLevel: z.nativeEnum(CoopWaterLevel.Id),
//     eventType: z.nativeEnum(CoopEvent.Id),
//     quotaNum: z.number().int().min(0).nullable(),
//     goldenIkuraPopNum: z.number().int().min(0),
//     goldenIkuraNum: z.number().int().min(0).nullable(),
//     waveId: z.number().int().min(0),
//     isClear: z.boolean()
//   })

//   export const BossResult = z.object({
//     bossId: z.nativeEnum(CoopBossInfo.Id),
//     isDefeated: z.boolean()
//   })

//   /**
//    * サーモンランのリザルトフォーマット
//    */
//   export const Response = z
//     .preprocess(
//       // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//       (input: any) => {
//         if (input === null) {
//           return input
//         }
//         if (typeof input.id === 'string') {
//           return input
//         }
//         // こちらの時間が正しいので修正する
//         input.playTime = CoopHistoryDetailId.parse(input.id).playTime
//         return input
//       },
//       z.object({
//         // id: CoopHistoryDetailId,
//         uuid: z.string(),
//         schedule: CoopSchedule.Response,
//         scale: z.array(z.number().int().min(0).max(39).nullable()),
//         myResult: CoopHistoryDetail.CoopPlayerResult,
//         otherResults: z.array(CoopHistoryDetail.CoopPlayerResult),
//         jobResult: CoopHistoryDetail.JobResult,
//         bossResults: z.array(BossResult).nullable(),
//         playTime: DateTime,
//         bossCounts: z.array(z.number().int().min(0)).length(14),
//         bossKillCounts: z.array(z.number().int().min(0)).length(14),
//         dangerRate: z.number().min(0).max(3.33),
//         ikuraNum: z.number().int().min(0),
//         goldenIkuraNum: z.number().int().min(0),
//         goldenIkuraAssistNum: z.number().int().min(0),
//         scenarioCode: z.string().nullable(),
//         waveDetails: z.array(CoopHistoryDetail.WaveResult)
//       })
//     )
//     .transform((v) => {
//       return {
//         id: createHash('md5').update(`${v.playTime}:${v.uuid}`).digest('hex'),
//         ...v
//       }
//     })

//   export type BossResult = z.infer<typeof BossResult>
//   export type CoopPlayerResult = z.infer<typeof CoopPlayerResult>
//   export type JobResult = z.infer<typeof JobResult>
//   export type WaveResult = z.infer<typeof WaveResult>
//   export type Request = z.infer<typeof Request>
//   export type Response = z.infer<typeof Response>
// }

// export class CoopHistoryDetailQuery implements ResourceQuery {
//   private readonly request: CoopHistoryDetail.Request
//   private readonly response: CoopHistoryDetail.Response

//   constructor(data: object) {
//     this.request = CoopHistoryDetail.Request.parse(data)
//     this.response = CoopHistoryDetail.Response.parse({
//       id: this.coopHistoryDetail.id,
//       uuid: this.coopHistoryDetail.id.uuid,
//       playTime: this.coopHistoryDetail.id.playTime,
//       scale: this.scale,
//       bossCounts: this.bossCounts,
//       bossKillCounts: this.bossKillCounts,
//       ikuraNum: this.ikuraNum,
//       goldenIkuraNum: this.goldenIkuraNum,
//       goldenIkuraAssistNum: this.goldenIkuraAssistNum,
//       scenarioCode: this.coopHistoryDetail.scenarioCode,
//       dangerRate: this.coopHistoryDetail.dangerRate,
//       myResult: this.myResult,
//       bossResults: this.bossResults,
//       otherResults: this.otherResults,
//       jobResult: this.jobResult,
//       waveDetails: this.waveResults
//     })
//   }

//   toJSON(): CoopHistoryDetail.Response {
//     return this.response
//   }

//   get result(): CoopHistoryDetail.Response {
//     return this.response
//   }

//   get assetURLs(): S3URL[] {
//     /// ここで取得するステージ画像はBanner画像なので無視する
//     return Array.from(
//       new Set(
//         this.memberResults
//           .flatMap((member) => member.weapons.map((weapon) => weapon.url))
//           .concat(this.memberResults.map((member) => member.specialWeapon?.url).filter((url) => url !== null))
//           .concat(this.coopHistoryDetail.enemyResults.map((result) => result.enemy.image.url))
//         // .concat(this.coopHistoryDetail.coopStage.image.url)
//       )
//     ).map((url) => S3URL.parse(url))
//   }

//   private get bossResults(): CoopHistoryDetail.BossResult[] | null {
//     if (this.coopHistoryDetail.bossResults === null) {
//       return null
//     }
//     return z
//       .array(CoopHistoryDetail.BossResult)
//       .nullable()
//       .parse(
//         this.coopHistoryDetail.bossResults.map((result) => ({
//           bossId: result.boss.id,
//           isDefeated: result.hasDefeatBoss
//         }))
//       )
//   }

//   private get waveResults(): CoopHistoryDetail.WaveResult[] {
//     return this.coopHistoryDetail.waveResults.map((result) =>
//       CoopHistoryDetail.WaveResult.parse({
//         id: createHash('md5')
//           .update(`${this.coopHistoryDetail.id.playTime}:${this.coopHistoryDetail.id.uuid}:${result.waveNumber}`)
//           .digest('hex'),
//         waterLevel: result.waterLevel,
//         eventType: result.eventWave,
//         quotaNum: result.deliverNorm,
//         goldenIkuraPopNum: result.goldenPopCount,
//         goldenIkuraNum: result.teamDeliverCount,
//         waveId: result.waveNumber,
//         isClear:
//           this.coopHistoryDetail.bossResult === null
//             ? this.coopHistoryDetail.resultWave === 0
//               ? true
//               : result.waveNumber < this.coopHistoryDetail.resultWave
//             : result.waveNumber < this.coopHistoryDetail.waveResults.length
//               ? true
//               : this.coopHistoryDetail.bossResult.hasDefeatBoss
//       })
//     )
//   }

//   private get jobResult(): CoopHistoryDetail.JobResult {
//     return CoopHistoryDetail.JobResult.parse({
//       failureWave: this.coopHistoryDetail.resultWave === 0 ? null : this.coopHistoryDetail.resultWave,
//       isClear: this.coopHistoryDetail.resultWave === 0,
//       bossId: this.coopHistoryDetail.bossResult?.boss.id || null,
//       isBossDefeated: this.coopHistoryDetail.bossResult?.hasDefeatBoss ?? null
//     })
//   }

//   private get myResult(): CoopHistoryDetail.CoopPlayerResult {
//     const result = this.coopHistoryDetail.myResult
//     return CoopHistoryDetail.CoopPlayerResult.parse({
//       id: result.player.id,
//       byname: result.player.byname,
//       name: result.player.name,
//       nameId: result.player.nameId,
//       nameplate: {
//         badges: result.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id)),
//         background: {
//           id: result.player.nameplate.background.id,
//           textColor: result.player.nameplate.background.textColor
//         }
//       },
//       bossKillCounts: this.enemyResults.map((enemy) => enemy?.defeatCount || 0),
//       bossKillCountsTotal: result.defeatEnemyCount,
//       deadCount: result.rescuedCount,
//       goldenIkuraAssistNum: result.goldenAssistCount,
//       goldenIkuraNum: result.goldenDeliverCount,
//       gradeId: this.coopHistoryDetail.afterGrade?.id || null,
//       gradePoint: this.coopHistoryDetail.afterGradePoint,
//       helpCount: result.rescueCount,
//       ikuraNum: result.deliverCount,
//       isMyself: true,
//       jobBonus: this.coopHistoryDetail.jobBonus,
//       jobRate: this.coopHistoryDetail.jobRate,
//       jobScore: this.coopHistoryDetail.jobScore,
//       kumaPoint: this.coopHistoryDetail.jobPoint,
//       nplnUserId: result.player.id.nplnUserId,
//       smellMeter: this.coopHistoryDetail.smellMeter,
//       specialCounts: this.specialCounts.map((counts) => counts.filter((id) => id === result.specialWeapon.id).length),
//       specialId: result.specialWeapon.id,
//       species: result.player.species,
//       uniform: result.player.uniform.id,
//       weaponList: result.weapons.map((weapon) => weapon.id)
//     })
//   }

//   private get specialCounts(): WeaponInfoSpecial.Id[][] {
//     return this.coopHistoryDetail.waveResults.map((result) => result.specialWeapons.map((weapon) => weapon.id))
//   }

//   private get otherResults(): CoopHistoryDetail.CoopPlayerResult[] {
//     return this.coopHistoryDetail.memberResults.map((result) =>
//       CoopHistoryDetail.CoopPlayerResult.parse({
//         id: result.player.id,
//         byname: result.player.byname,
//         name: result.player.name,
//         nameId: result.player.nameId,
//         nameplate: {
//           badges: result.player.nameplate.badges.map((badge) => (badge === null ? null : badge.id)),
//           background: {
//             id: result.player.nameplate.background.id,
//             textColor: result.player.nameplate.background.textColor
//           }
//         },
//         bossKillCounts: Array.from({ length: 14 }, () => null),
//         bossKillCountsTotal: result.defeatEnemyCount,
//         deadCount: result.rescuedCount,
//         goldenIkuraAssistNum: result.goldenAssistCount,
//         goldenIkuraNum: result.goldenDeliverCount,
//         gradeId: null,
//         gradePoint: null,
//         helpCount: result.rescueCount,
//         ikuraNum: result.deliverCount,
//         isMyself: false,
//         jobBonus: null,
//         jobRate: null,
//         jobScore: null,
//         kumaPoint: null,
//         nplnUserId: result.player.id.nplnUserId,
//         smellMeter: null,
//         specialCounts: this.specialCounts.map((counts) => counts.filter((id) => id === result.specialWeapon.id).length),
//         specialId: result.specialWeapon.id,
//         species: result.player.species,
//         uniform: result.player.uniform.id,
//         weaponList: result.weapons.map((weapon) => weapon.id)
//       })
//     )
//   }

//   private get ikuraNum(): number {
//     return this.memberResults.reduce((sum, member) => sum + member.deliverCount, 0)
//   }

//   private get goldenIkuraNum(): number {
//     return this.waveResults.reduce((sum, wave) => sum + (wave.goldenIkuraNum || 0), 0)
//   }

//   private get goldenIkuraAssistNum(): number {
//     return this.memberResults.reduce((sum, member) => sum + member.goldenAssistCount, 0)
//   }

//   private get memberResults(): CoopPlayerResultModel[] {
//     return [this.coopHistoryDetail.myResult, ...this.coopHistoryDetail.memberResults]
//   }

//   private get enemyResults(): (EnemyResultModel | undefined)[] {
//     return Object.values(CoopEnemyInfo.Id)
//       .filter((value) => typeof value === 'number')
//       .map((key) => this.coopHistoryDetail.enemyResults.find((enemy) => enemy.enemy.id === key))
//   }

//   private get bossCounts(): number[] {
//     return this.enemyResults.map((enemy) => enemy?.popCount || 0)
//   }

//   private get bossKillCounts(): number[] {
//     return this.enemyResults.map((enemy) => enemy?.teamDefeatCount || 0)
//   }

//   private get scale(): (number | null)[] {
//     return this.coopHistoryDetail.scale === null
//       ? [null, null, null]
//       : [this.coopHistoryDetail.scale.bronze, this.coopHistoryDetail.scale.silver, this.coopHistoryDetail.scale.gold]
//   }

//   private get coopHistoryDetail(): CoopHistoryDetailModel {
//     return this.request.data.coopHistoryDetail
//   }
// }

// type CoopPlayerResultModel = z.infer<typeof CoopPlayerResultModel>
// type EnemyResultModel = z.infer<typeof EnemyResultModel>
// type CoopHistoryDetailModel = z.infer<typeof CoopHistoryDetailModel>

export namespace CoopHistoryDetailQuery {
  const Nameplate = z
    .object({
      badges: z.array(RawInt.nullable()),
      background: z
        .object({
          textColor: z.object({
            r: z.number().min(0).max(1),
            g: z.number().min(0).max(1),
            b: z.number().min(0).max(1),
            a: z.number().min(0).max(1)
          })
        })
        .merge(RawInt)
    })
    .transform((v) => {
      return {
        badges: v.badges.map((badge) => (badge === null ? null : badge.id)),
        background: {
          id: v.background.id,
          textColor: v.background.textColor
        }
      }
    })

  const PlayerResult = z
    .object({
      byname: z.string(),
      name: z.string(),
      nameId: z.string(),
      nameplate: Nameplate,
      uniform: RawInt,
      species: z.nativeEnum(Species),
      id: CoopPlayerId
    })
    .transform((v) => ({
      ...v,
      nplnUserId: v.id.nplnUserId,
      playTime: v.id.playTime,
      uuid: v.id.uuid,
      id: createHash('md5').update(`${v.id.playTime}:${v.id.uuid}:${v.id.nplnUserId}`).digest('hex')
    }))

  const MemberResult = z
    .object({
      player: PlayerResult,
      weapons: z.array(WeaponInfoMainId),
      specialWeapon: z
        .object({
          weaponId: z.nativeEnum(WeaponInfoSpecial.Id)
        })
        .merge(ImageURL),
      defeatEnemyCount: z.number().int().min(0),
      deliverCount: z.number().int().min(0),
      goldenAssistCount: z.number().int().min(0),
      goldenDeliverCount: z.number().int().min(0),
      rescueCount: z.number().int().min(0),
      rescuedCount: z.number().int().min(0)
    })
    .transform((v) => {
      return {
        id: v.player.id,
        name: v.player.name,
        byname: v.player.byname,
        nameId: v.player.nameId,
        nameplate: v.player.nameplate,
        uniform: v.player.uniform.id,
        species: v.player.species,
        weaponList: v.weapons,
        nplnUserId: v.player.nplnUserId,
        specialId: v.specialWeapon.weaponId,
        ikuraNum: v.deliverCount,
        goldenIkuraNum: v.goldenDeliverCount,
        goldenIkuraAssistNum: v.goldenAssistCount,
        helpCount: v.rescueCount,
        deadCount: v.rescuedCount,
        bossKillCountsTotal: v.defeatEnemyCount
      }
    })

  const BossResult = z
    .object({
      boss: RawId(CoopBossInfo.Id),
      hasDefeatBoss: z.boolean()
    })
    .transform((v) => ({
      bossId: v.boss.id,
      isBossDefeated: v.hasDefeatBoss
    }))

  const WaveResult = z
    .object({
      waveNumber: z.number().int().min(1).max(5),
      goldenPopCount: z.number().int().min(0),
      waterLevel: z.number().int().min(0).max(2),
      deliverNorm: z.number().int().min(0).nullable(),
      teamDeliverCount: z.number().int().min(0).nullable(),
      eventWave: RawId(CoopEvent.Id).nullable(),
      specialWeapons: z.array(RawId(WeaponInfoSpecial.Id))
    })
    .transform((v) => ({
      waveId: v.waveNumber,
      waterLevel: v.waterLevel,
      eventType: v.eventWave === null ? CoopEvent.Id.WaterLevels : v.eventWave.id,
      quotaNum: v.deliverNorm,
      goldenIkuraNum: v.teamDeliverCount,
      goldenIkuraPopNum: v.goldenPopCount,
      specialCounts: v.specialWeapons.map((weapon) => weapon.id)
    }))

  const EnemyResult = z.object({
    defeatCount: z.number().int().min(0),
    teamDefeatCount: z.number().int().min(0),
    popCount: z.number().int().min(0),
    enemy: RawId(CoopEnemyInfo.Id).merge(ImageURL)
  })

  const EnemyResults = z
    .array(EnemyResult)
    .transform((v) =>
      Object.values(CoopEnemyInfo.Id)
        .filter((value) => typeof value === 'number')
        .map((id) => v.find((enemy) => enemy.enemy.id === id))
        .map((enemy) => ({
          count: enemy?.popCount || 0,
          killCount: enemy?.defeatCount || 0,
          teamKillCount: enemy?.teamDefeatCount || 0,
          id: enemy?.enemy.id || 0,
          url: enemy?.enemy.image.url || null
        }))
    )
    .transform((v) => ({
      bossCounts: v.map((enemy) => enemy.count),
      bossKillCounts: v.map((enemy) => enemy.killCount),
      teamBossKillCounts: v.map((enemy) => enemy.teamKillCount)
    }))

  const Scale = z
    .object({
      gold: z.number().int().min(0),
      silver: z.number().int().min(0),
      bronze: z.number().int().min(0)
    })
    .nullable()
    .transform((v) => [v?.bronze ?? null, v?.silver ?? null, v?.gold ?? null])

  export const CoopHistoryDetail = CoopData(
    z.object({
      coopHistoryDetail: z
        .object({
          jobBonus: z.number().int().min(0).max(100).nullable(),
          afterGrade: RawId(CoopGrade.Id),
          myResult: MemberResult,
          memberResults: z.array(MemberResult),
          scenarioCode: z.string().nullable(),
          resultWave: z.number().int().min(-1).max(5),
          smellMeter: z.number().int().min(0).max(5).nullable(),
          weapons: z.array(WeaponInfoMainId),
          boss: RawId(CoopBossInfo.Id),
          afterGradePoint: z.number().int().min(0).max(999).nullable(),
          jobScore: z.number().int().min(0).max(999).nullable(),
          jobPoint: z.number().int().min(0).nullable(),
          id: CoopHistoryDetailId,
          bossResult: BossResult.nullable(),
          bossResults: z.array(BossResult).nullable(),
          waveResults: z.array(WaveResult),
          scale: Scale,
          enemyResults: EnemyResults,
          rule: z.nativeEnum(CoopRule),
          coopStage: RawId(CoopStage.Id),
          jobRate: z.number().min(0).max(3.25).nullable(),
          dangerRate: z.number().min(0).max(3.33)
        })
        .transform((v) => ({
          ...v,
          ikuraNum: [v.myResult, ...v.memberResults].reduce((sum, member) => sum + member.ikuraNum, 0),
          goldenIkuraNum: v.waveResults.reduce((sum, wave) => sum + (wave.goldenIkuraNum || 0), 0),
          goldenIkuraAssistNum: [v.myResult, ...v.memberResults].reduce(
            (sum, member) => sum + member.goldenIkuraAssistNum,
            0
          ),
          specialCounts: v.waveResults.map((result) => result.specialCounts)
        }))
    })
  ).transform((v) => {
    return {
      toJSON: () => ({
        id: createHash('md5')
          .update(`${v.data.coopHistoryDetail.id.playTime}:${v.data.coopHistoryDetail.id.uuid}`)
          .digest('hex'),
        uuid: v.data.coopHistoryDetail.id.uuid,
        scale: v.data.coopHistoryDetail.scale,
        myResult: {
          ...v.data.coopHistoryDetail.myResult,
          isMyself: true,
          smellMeter: v.data.coopHistoryDetail.smellMeter,
          jobRate: v.data.coopHistoryDetail.jobRate,
          jobBonus: v.data.coopHistoryDetail.jobBonus,
          jobScore: v.data.coopHistoryDetail.jobScore,
          kumaPoint: v.data.coopHistoryDetail.jobPoint,
          gradeId: v.data.coopHistoryDetail.afterGrade.id,
          gradePoint: v.data.coopHistoryDetail.afterGradePoint,
          bossKillCounts: v.data.coopHistoryDetail.enemyResults.bossKillCounts,
          specialCounts: v.data.coopHistoryDetail.specialCounts.flatMap(
            (count) => countBy(count)[v.data.coopHistoryDetail.myResult.specialId] || 0
          )
        },
        otherResults: v.data.coopHistoryDetail.memberResults.map((result) => ({
          ...result,
          isMyself: false,
          smellMeter: null,
          jobRate: null,
          jobBonus: null,
          jobScore: null,
          kumaPoint: null,
          gradeId: null,
          gradePoint: null,
          bossKillCounts: Array.from({ length: 14 }, () => null),
          specialCounts: v.data.coopHistoryDetail.specialCounts.flatMap(
            (count) => countBy(count)[result.specialId] || 0
          )
        })),
        waveDetails: v.data.coopHistoryDetail.waveResults.map((result) => ({
          id: createHash('md5')
            .update(`${v.data.coopHistoryDetail.id.playTime}:${v.data.coopHistoryDetail.id.uuid}:${result.waveId}`)
            .digest('hex'),
          isClear:
            v.data.coopHistoryDetail.bossResult === null
              ? v.data.coopHistoryDetail.resultWave === 0
                ? true
                : result.waveId < v.data.coopHistoryDetail.resultWave
              : result.waveId < v.data.coopHistoryDetail.waveResults.length
                ? true
                : v.data.coopHistoryDetail.bossResult.isBossDefeated,
          waveId: result.waveId,
          waterLevel: result.waterLevel,
          eventType: result.eventType,
          quotaNum: result.quotaNum,
          goldenIkuraPopNum: result.goldenIkuraPopNum,
          goldenIkuraNum: result.goldenIkuraNum
        })),
        bossCounts: v.data.coopHistoryDetail.enemyResults.bossCounts,
        bossKillCounts: v.data.coopHistoryDetail.enemyResults.teamBossKillCounts,
        playTime: v.data.coopHistoryDetail.id.playTime,
        // bossId: v.data.coopHistoryDetail.boss.id,
        goldenIkuraNum: v.data.coopHistoryDetail.goldenIkuraNum,
        goldenIkuraAssistNum: v.data.coopHistoryDetail.goldenIkuraAssistNum,
        ikuraNum: v.data.coopHistoryDetail.ikuraNum,
        dangerRate: v.data.coopHistoryDetail.dangerRate,
        scenarioCode: v.data.coopHistoryDetail.scenarioCode,
        // bossResult: v.data.coopHistoryDetail.bossResult,
        bossResults: v.data.coopHistoryDetail.bossResults,
        jobResult: {
          failureWave: v.data.coopHistoryDetail.resultWave === 0 ? null : v.data.coopHistoryDetail.resultWave,
          isClear: v.data.coopHistoryDetail.resultWave === 0,
          bossId: v.data.coopHistoryDetail.bossResult?.bossId || null,
          isBossDefeated: v.data.coopHistoryDetail.bossResult?.isBossDefeated ?? null
        }
      })
    }
  })
}
