import { createHash } from 'node:crypto'
import type { CoopBossInfo } from '@/enums/coop/coop_enemy'
import type { CoopMode } from '@/enums/coop/coop_mode'
import type { CoopRule } from '@/enums/coop/coop_rule'
import type { CoopStage } from '@/enums/coop/coop_stage'
import type { WeaponInfoMain } from '@/enums/weapon/main'
import type { PlayerId, ResultId } from '@/models/common.dto'
import type { CoopSchedule } from '@/models/schedule.dto'
import dayjs from 'dayjs'

export const scheduleHash = (options: {
  startTime: Date | null
  endTime: Date | null
  mode: CoopMode
  rule: CoopRule
  bossId: CoopBossInfo.Id | null
  stageId: CoopStage.Id
  weaponList: WeaponInfoMain.Id[]
  rareWeapons: WeaponInfoMain.Id[]
}): string => {
  return options.startTime === null || options.endTime === null
    ? createHash('md5')
        .update(`${options.mode}-${options.rule}-${options.stageId}-${options.weaponList.join(',')}`)
        .digest('hex')
    : createHash('md5')
        .update(
          `${options.mode}-${options.rule}-${options.stageId}-${dayjs(options.startTime).utc().unix()}-${dayjs(
            options.endTime
          )
            .utc()
            .unix()}-${options.weaponList.join(',')}`
        )
        .digest('hex')
}

export const resultHash = (options: ResultId): string => {
  return createHash('md5')
    .update(`${dayjs(options.playTime).utc().unix()}-${options.uuid.toLowerCase()}`)
    .digest('hex')
}

export const playerHash = (options: PlayerId): string => {
  return createHash('md5')
    .update(`${dayjs(options.playTime).utc().unix()}-${options.uuid.toLowerCase()}-${options.nplnUserId}`)
    .digest('hex')
}

export const waveHash = (options: {
  uuid: string
  playTime: Date
  id: number
}): string => {
  return createHash('md5')
    .update(`${dayjs(options.playTime).unix()}-${options.uuid.toLowerCase()}-${options.id}`)
    .digest('hex')
}

export const md5 = (input: string): string => {
  return createHash('md5').update(input).digest('hex')
}
