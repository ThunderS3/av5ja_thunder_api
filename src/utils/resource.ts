import { HTTPMethod } from '@/enums/method'
import { S3URL } from '@/models/common/s3_url.dto'
import { CoopHistoryQuery } from '@/models/coop_history.dto'
import { CoopRecordQuery } from '@/models/coop_record.dto'
import { CoopResultQuery } from '@/models/coop_result.dto'
import { StageScheduleQuery } from '@/models/stage_schedule.dto'
import { WeaponRecord, WeaponRecordQuery } from '@/models/weapon_record.dto'
import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import type { Bindings } from './bindings'

/**
 * リソースとしてURLを書き込む
 * 有効期限が切れたら削除される
 * @param c
 * @param url
 */
const write_cache = async (c: Context<{ Bindings: Bindings }>, url: S3URL) => {
  const cache: string | null = await c.env.Resource.get(url.key, { type: 'text' })
  // 以下の条件を満たすとき、データを上書きする
  // - キャッシュが存在しない
  // - 新しく書き込もうとしたデータのほうが有効期限が長い
  if (cache === null) {
    console.info('[RESOURCE CREATE]:', null, '-->', url.version, url.key)
    await c.env.Resource.put(url.key, url.raw_value, { expiration: url.expiration })
  }
  const data: S3URL = S3URL.parse(cache)
  if (data.expiration < url.expiration || data.version < url.version) {
    console.info('[RESOURCE UPDATE]:', data.version, '-->', url.version, url.key)
    await c.env.Resource.put(url.key, url.raw_value, { expiration: url.expiration })
  }
}

export const resource = createMiddleware(async (c, next) => {
  const url: URL = new URL(c.req.url)
  const lastPath: string = url.pathname.split('/').slice(-1)[0]
  if (c.req.method.toLowerCase() === HTTPMethod.POST) {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const body: any = await c.req.json()
    const assetURLs: S3URL[] = (() => {
      switch (lastPath) {
        case 'weapon_records':
          return new WeaponRecordQuery(body).assetURLs
        case 'records':
          return new CoopRecordQuery(body).assetURLs
        case 'results':
          return new CoopResultQuery(body).assetURLs
        case 'histories':
          return new CoopHistoryQuery(body).assetURLs
        case 'schedules':
          return new StageScheduleQuery(body).assetURLs
        default:
          return []
      }
    })()
    console.log(assetURLs)
    c.executionCtx.waitUntil(Promise.all(assetURLs.map((url) => write_cache(c, url))))
  }
  await next()
})
