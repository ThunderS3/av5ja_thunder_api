import { CoopSchedule, CoopScheduleQuery } from '@/models/coop_schedule.dto'
import { z } from '@hono/zod-openapi'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'
import type { Bindings } from '../bindings'
import { KV } from '../kv'

/**
 * Oatmealdome氏が公開しているデータを取得して書き込む
 * @param env
 */
const update = async (env: Bindings): Promise<void> => {
  const url: URL = new URL('/api/v1/three/coop/phases', 'https://splatoon.oatmealdome.me')
  url.searchParams.set('count', '5')
  const response = await fetch(url.href)
  if (!response.ok) {
    throw new HTTPException(response.status as StatusCode, { message: response.statusText })
  }
  const schedules = new CoopScheduleQuery(await response.json()).schedules
  /// スケジュールとして個別にバックアップする
  await Promise.all(schedules.map(async (schedule) => KV.SCHEDULE.set(env, schedule)))
  const cache: CoopSchedule.Response[] = z
    .object({
      schedules: z.array(CoopSchedule.Response)
    })
    .parse(await KV.CACHE.get(env, 'api.splatnet3.com/v3/schedules')).schedules
  const update_cache: CoopSchedule.Response[] = Array.from(
    new Map([...cache, ...schedules].map((obj) => [obj.id, obj])).values()
  )
  await KV.CACHE.set(env, 'api.splatnet3.com/v3/schedules', { schedules: update_cache })
}

export const scheduled = async (event: ScheduledController, env: Bindings, ctx: ExecutionContext): Promise<void> => {
  switch (event.cron) {
    case '*/30 * * * *':
      ctx.waitUntil(update(env))
      break
    default:
      break
  }
}
