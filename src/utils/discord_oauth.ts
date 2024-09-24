import { HTTPMethod } from '@/enums/method'
import { Discord } from '@/models/common/discord_token.dto'
import { User } from '@/models/user.dto'
import type { z } from '@hono/zod-openapi'
import dayjs, { type Dayjs } from 'dayjs'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { jwt, sign } from 'hono/jwt'
import type { StatusCode } from 'hono/utils/http-status'
import { AlgorithmTypes } from 'hono/utils/jwt/jwa'
import type { JWTPayload } from 'hono/utils/jwt/types'
import { v4 as uuidv4 } from 'uuid'
import type { Bindings } from './bindings'
import { KV } from './kv'

export namespace DiscordOAuth {
  export const create_token = async (c: Context<{ Bindings: Bindings }>, code: string): Promise<string> => {
    const token = await get_token(c, code)
    // console.info('[DISCORD TOKEN]:', token)
    const user = await get_user(c, token)
    // console.info('[DISCORD USER]:', user)
    const current_time: Dayjs = dayjs()
    const payload: JWTPayload = {
      aud: c.env.DISCORD_CLIENT_ID,
      exp: current_time.add(12, 'hour').unix(),
      iat: current_time.unix(),
      iss: new URL(c.req.url).hostname,
      jti: uuidv4(),
      nbf: current_time.unix(),
      sub: user.id,
      typ: 'access_token',
      usr: {
        nsa_id: null,
        npln_user_id: null,
        membership: false,
        expires_in: null
      }
    }
    return KV.USER.token(c, await KV.USER.set(c, payload))
  }

  const get_token = async (c: Context<{ Bindings: Bindings }>, code: string): Promise<Discord.Token> => {
    return await request(Discord.Token, c, {
      method: HTTPMethod.POST,
      path: 'oauth2/token',
      body: new URLSearchParams({
        client_id: c.env.DISCORD_CLIENT_ID,
        client_secret: c.env.DISCORD_CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: c.env.DISCORD_REDIRECT_URI
      })
    })
  }

  const get_user = async (c: Context<{ Bindings: Bindings }>, token: Discord.Token): Promise<Discord.User> => {
    return await request(Discord.User, c, {
      method: HTTPMethod.GET,
      headers: {
        Authorization: `Bearer ${token.access_token}`
      },
      path: 'users/@me'
    })
  }

  const request = async (
    S: z.ZodTypeAny,
    c: Context<{ Bindings: Bindings }>,
    options: {
      method: HTTPMethod
      headers?: Record<string, string | number>
      path: string
      body?: URLSearchParams | object | undefined
    }
  ): Promise<z.infer<typeof S>> => {
    const url: URL = new URL(options.path, 'https://discord.com/api/v10/')
    if (options.method === HTTPMethod.GET && options.body !== undefined) {
      throw new HTTPException(400, { message: 'GET method does not support body' })
    }
    const headers: Headers = new Headers({
      ...{
        'Content-Type':
          options.body instanceof URLSearchParams ? 'application/x-www-form-urlencoded' : 'application/json'
      },
      ...options.headers
    })
    const response = await fetch(url.href, {
      method: options.method,
      headers: headers,
      body:
        options.body === undefined
          ? undefined
          : options.body instanceof URLSearchParams
            ? options.body
            : JSON.stringify(options.body)
    })
    if (response.ok) {
      return S.parse(await response.json())
    }
    throw new HTTPException(response.status as StatusCode, { message: response.statusText })
  }
}
