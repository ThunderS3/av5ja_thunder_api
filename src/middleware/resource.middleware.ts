import { HTTPMethod } from '@/enums/method'
import { S3URL } from '@/models/common/s3_url.dto'
import { KV } from '@/utils/kv'
import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import type { Bindings } from '../utils/bindings'

/**
 * リソースとしてURLを書き込む
 * 有効期限が切れたら削除される
 * @param c
 * @param url
 */
const write_cache = async (c: Context<{ Bindings: Bindings }>, url: S3URL) => {
  const cache: string | null = await c.env.RESOURCES.get(url.key, { type: 'text' })
  // 以下の条件を満たすとき、データを上書きする
  // - キャッシュが存在しない
  // - 新しく書き込もうとしたデータのほうが有効期限が長い
  if (cache === null) {
    console.info('[RESOURCE CREATE]:', null, '-->', url.version, url.key)
    await c.env.RESOURCES.put(url.key, url.raw_value, { expiration: url.expiration })
    return
  }
  const data: S3URL = S3URL.parse(cache)
  if (data.expiration < url.expiration || data.version < url.version) {
    console.info('[RESOURCE UPDATE]:', data.version, '-->', url.version, url.key)
    await c.env.RESOURCES.put(url.key, url.raw_value, { expiration: url.expiration })
    return
  }
}

const update_cache = async (c: Context<{ Bindings: Bindings }>) => {
  const body: string = await c.req.text()
  const pattern: RegExp = /https:\/\/api\.lp1\.av5ja\.srv\.nintendo\.net\/resources\/prod[^\s"]*/g
  const urls: S3URL[] = Array.from(new Set(body.match(pattern) || [])).map((url) => S3URL.parse(url))
  await Promise.all(urls.map((url) => write_cache(c, url)))
}

/**
 * JSONを正規表現で検索してURLを抽出する
 */
export const resource = createMiddleware(async (c, next) => {
  const url: URL = new URL(c.req.url)
  console.log(url.pathname)
  if (c.req.method.toLowerCase() === HTTPMethod.POST) {
    c.executionCtx.waitUntil(update_cache(c))
  }
  switch (url.pathname) {
    case '/v3/results':
      c.executionCtx.waitUntil(KV.HISTORY.set(c.env, await c.req.json()))
      break
    default:
      break
  }
  await next()
})
