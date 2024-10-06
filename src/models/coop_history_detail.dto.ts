import { createHash } from 'node:crypto'
import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopEvent } from '@/enums/coop/coop_event'
import { CoopGrade } from '@/enums/coop/coop_grade'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { Species } from '@/enums/weapon/species'
import { sortedJSON } from '@/utils/sorted'
import { z } from '@hono/zod-openapi'
import { countBy } from 'lodash'
import { CoopData } from './common/coop_data.dto'
import { CoopHistoryDetailId } from './common/coop_history_detail_id.dto'
import { CoopPlayerId } from './common/coop_player_id.dto'
import { RawId, RawInt } from './common/raw_id.dto'
import { ImageURL } from './common/s3_url.dto'
import { WeaponInfoMainId } from './common/weapon_hash.dto'

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
  )
    .transform((v) => v.data.coopHistoryDetail)
    .transform((v) => ({
      id: createHash('md5').update(`${v.id.playTime}:${v.id.uuid}`).digest('hex'),
      uuid: v.id.uuid,
      scale: v.scale,
      myResult: {
        ...v.myResult,
        isMyself: true,
        smellMeter: v.smellMeter,
        jobRate: v.jobRate,
        jobBonus: v.jobBonus,
        jobScore: v.jobScore,
        kumaPoint: v.jobPoint,
        gradeId: v.afterGrade.id,
        gradePoint: v.afterGradePoint,
        bossKillCounts: v.enemyResults.bossKillCounts,
        specialCounts: v.specialCounts.flatMap((count) => countBy(count)[v.myResult.specialId] || 0)
      },
      otherResults: v.memberResults.map((result) => ({
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
        specialCounts: v.specialCounts.flatMap((count) => countBy(count)[result.specialId] || 0)
      })),
      waveDetails: v.waveResults.map((result) => ({
        id: createHash('md5').update(`${v.id.playTime}:${v.id.uuid}:${result.waveId}`).digest('hex'),
        isClear:
          v.bossResult === null
            ? v.resultWave === 0
              ? true
              : result.waveId < v.resultWave
            : result.waveId < v.waveResults.length
              ? true
              : v.bossResult.isBossDefeated,
        waveId: result.waveId,
        waterLevel: result.waterLevel,
        eventType: result.eventType,
        quotaNum: result.quotaNum,
        goldenIkuraPopNum: result.goldenIkuraPopNum,
        goldenIkuraNum: result.goldenIkuraNum
      })),
      bossCounts: v.enemyResults.bossCounts,
      bossKillCounts: v.enemyResults.teamBossKillCounts,
      playTime: v.id.playTime,
      // bossId: v.data.coopHistoryDetail.boss.id,
      goldenIkuraNum: v.goldenIkuraNum,
      goldenIkuraAssistNum: v.goldenIkuraAssistNum,
      ikuraNum: v.ikuraNum,
      dangerRate: v.dangerRate,
      scenarioCode: v.scenarioCode,
      // bossResult: v.data.coopHistoryDetail.bossResult,
      bossResults: v.bossResults,
      jobResult: {
        failureWave: v.resultWave === 0 ? null : v.resultWave,
        isClear: v.resultWave === 0,
        bossId: v.bossResult?.bossId || null,
        isBossDefeated: v.bossResult?.isBossDefeated ?? null
      }
    }))
    .transform((v) => ({
      ...v,
      toJSON: () => sortedJSON(v)
    }))

  export type CoopHistoryDetail = z.infer<typeof CoopHistoryDetail>
}
