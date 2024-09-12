import { Oatmealdome } from '@/models/schedule.dto'
import { StageSchedule } from '@/schema/schedule.dto'
import { HTTPException } from 'hono/http-exception'
import type { StatusCode } from 'hono/utils/http-status'
import type { Bindings } from '../bindings'

const fetch_schedules = async (ctx: ExecutionContext, env: Bindings): Promise<Oatmealdome.Response> => {
  const url: URL = new URL('/api/v1/three/coop/phases', 'https://splatoon.oatmealdome.me')
  url.searchParams.set('count', '5')
  const response = await fetch(url.href)
  if (!response.ok) {
    throw new HTTPException(response.status as StatusCode, { message: response.statusText })
  }
  return Oatmealdome.Response.parse(await response.json())
}

export const scheduled = async (event: ScheduledController, env: Bindings, ctx: ExecutionContext): Promise<void> => {
  console.log(event.cron)
  switch (event.cron) {
    default:
      try {
        const response = await fetch_schedules(ctx, env)
        console.log(response)
      } catch (error) {
        console.error(error)
      }
  }
}
