import { type CoopSchedule, CoopScheduleQuery } from '@/models/coop_schedule.dto'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'
import type { Bindings } from '../bindings'
import { KV } from '../kv'

const update = async (env: Bindings): Promise<void> => {
  const url: URL = new URL('/api/v1/three/coop/phases', 'https://splatoon.oatmealdome.me')
  url.searchParams.set('count', '5')
  const response = await fetch(url.href)
  if (!response.ok) {
    throw new HTTPException(response.status as StatusCode, { message: response.statusText })
  }
  const schedules = new CoopScheduleQuery(await response.json()).schedules
  await Promise.all(schedules.map(async (schedule) => KV.SCHEDULE.set(env, schedule)))
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
