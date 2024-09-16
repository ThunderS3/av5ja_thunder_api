import { camelcaseKeys } from '@/utils/camelcase_keys'
import type { Context, Next } from 'hono'
import { createMiddleware } from 'hono/factory'

export const convert_keys = createMiddleware(async (c: Context, next: Next) => {
  const originalFetch = globalThis.fetch
  globalThis.fetch = async (input: RequestInfo, init?: RequestInit) => {
    const response = await originalFetch(input, init)
    const convert_keys = camelcaseKeys(await response.json())
    if (response.status === 200) {
      return new Response(convert_keys, {
        status: 200,
        statusText: 'OK',
        headers: response.headers
      })
    }
    return response
  }
  await next()
})
