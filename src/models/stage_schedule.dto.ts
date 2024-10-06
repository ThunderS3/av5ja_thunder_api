import { CoopBossInfo } from '@/enums/coop/coop_enemy'
import { CoopMode } from '@/enums/coop/coop_mode'
import { CoopRule } from '@/enums/coop/coop_rule'
import { CoopStage } from '@/enums/coop/coop_stage'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { z } from '@hono/zod-openapi'
import { DateTime } from './common/datetime.dto'

export namespace CoopScheduleQuery {
  export const Schedule = z.object({
    id: z.string().length(32),
    startTime: DateTime,
    endTime: DateTime,
    mode: z.nativeEnum(CoopMode),
    rule: z.nativeEnum(CoopRule),
    bossId: z.nativeEnum(CoopBossInfo.Id).nullish(),
    stageId: z.nativeEnum(CoopStage.Id),
    weaponList: z.array(z.nativeEnum(WeaponInfoMain.Id)),
    rareWeapons: z.array(z.nativeEnum(CoopBossInfo.Id))
  })

  export type Schedule = z.infer<typeof Schedule>
}
