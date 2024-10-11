import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopStage } from '@/enums/coop/coop_stage'
import { ImageType } from '@/enums/image_type'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { CoopPlayerId } from '@/models/common/coop_player_id.dto'
import type { Discord } from '@/models/common/discord_token.dto'
import { CoopResultQuery } from '@/models/coop_result.dto'
import { CoopSchedule } from '@/models/coop_schedule.dto'
import { Thunder } from '@/models/user.dto'
import dayjs, { type Dayjs } from 'dayjs'
import type { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { jwt, sign } from 'hono/jwt'
import { AlgorithmTypes } from 'hono/utils/jwt/jwa'
import { v4 as uuidv4 } from 'uuid'
import type { Bindings } from '../bindings'
import { DiscordOAuth } from '../discord_oauth'
import dummy from '../handler/dummy.json'

export namespace KV {
  /**
   * ユーザー情報を保存するためのKV
   */
  export namespace USER {
    /**
     * ユーザーデータの読み込み
     * @param c
     * @param id
     * @returns
     */
    const get = async (env: Bindings, id: string): Promise<Thunder.User | null> => {
      const data: unknown | null = await env.USERS.get(id, { type: 'json' })
      if (data === null) {
        return null
      }
      return Thunder.User.parse(data)
    }

    /**
     * ユーザーデータの書き込み
     * @param c
     * @param data
     * @returns
     */
    const set = async (
      env: Bindings,
      data: Discord.User,
      nsa_id: string,
      npln_user_id: string
    ): Promise<Thunder.User> => {
      const user: Thunder.User = Thunder.User.parse({
        ...data,
        nsa_id: nsa_id,
        npln_user_id: npln_user_id
      })
      await env.USERS.put(user.id, JSON.stringify(user))
      return user
    }

    export const token = async (
      c: Context<{ Bindings: Bindings }>,
      data: Discord.User,
      nsa_id: string,
      npln_user_id: string
    ): Promise<DiscordOAuth.Token> => {
      const user: Thunder.User = await set(c.env, data, nsa_id, npln_user_id)
      return DiscordOAuth.Token.parse({
        access_token: await sign_access_token(c, user),
        refresh_token: await sign_refresh_token(c, user)
      })
    }

    /**
     * ユーザーデータからアクセストークンを生成
     * @param c
     * @param data
     * @returns
     */
    const sign_access_token = async (c: Context<{ Bindings: Bindings }>, user: Thunder.User): Promise<string> => {
      const current_time: Dayjs = dayjs()
      const payload: Thunder.Token = Thunder.Token.parse({
        aud: c.env.DISCORD_CLIENT_ID,
        exp: current_time.add(12, 'hours').unix(),
        iat: current_time.unix(),
        iss: new URL(c.req.url).hostname,
        jti: uuidv4(),
        nbf: current_time.unix(),
        sub: user.id,
        typ: 'access_token',
        usr: user
      })
      console.debug('[ACCESS TOKEN]:', payload)
      return sign(payload, c.env.JWT_SECRET_KEY, AlgorithmTypes.HS256)
    }

    /**
     * ユーザーデータからリフレッシュトークンを生成
     * @param env
     * @param url
     * @param data
     */
    const sign_refresh_token = async (c: Context<{ Bindings: Bindings }>, user: Thunder.User): Promise<string> => {
      const current_time: Dayjs = dayjs()
      const payload: Thunder.Token = Thunder.Token.parse({
        aud: c.env.DISCORD_CLIENT_ID,
        exp: current_time.add(90, 'days').unix(),
        iat: current_time.unix(),
        jti: uuidv4(),
        nbf: current_time.unix(),
        sub: user.id,
        typ: 'refresh_token'
      })
      console.debug('[REFRESH TOKEN]:', payload)
      return sign(payload, c.env.JWT_SECRET_KEY, AlgorithmTypes.HS256)
    }
  }

  /**
   * アセットのURLを保存するためのKV
   */
  export namespace RESOURCE {
    const find_hash = (type: ImageType, raw_id: number): string | undefined => {
      switch (type) {
        case ImageType.WeaponInfoMain:
          return WeaponInfoMain.Hash[WeaponInfoMain.Id[raw_id] as keyof typeof WeaponInfoMain.Hash]
        case ImageType.WeaponInfoSpecial:
          return WeaponInfoSpecial.Hash[WeaponInfoSpecial.Id[raw_id] as keyof typeof WeaponInfoSpecial.Hash]
        case ImageType.StageInfo:
          return CoopStage.Hash[CoopStage.Id[raw_id] as keyof typeof CoopStage.Hash]
        case ImageType.EnemyInfo:
          return raw_id >= 20
            ? CoopBossInfo.Hash[CoopBossInfo.Id[raw_id] as keyof typeof CoopBossInfo.Id]
            : CoopEnemyInfo.Hash[CoopEnemyInfo.Id[raw_id] as keyof typeof CoopEnemyInfo.Hash]
        default:
          return ''
      }
    }

    export const get = async (env: Bindings, type: ImageType, raw_id: number): Promise<string> => {
      const hash: string | undefined = find_hash(type, raw_id)
      if (hash === undefined) {
        throw new HTTPException(400, { message: 'Bad Request.' })
      }
      const text: string | null = await env.RESOURCES.get(hash, { type: 'text' })
      if (text === null) {
        throw new HTTPException(404, { message: 'Not Found.' })
      }
      return new URL(text).href
    }

    export const set = async (env: Bindings, path: string, raw_id: number, data: Buffer): Promise<void> => {}
  }

  /**
   * オリジナルのリザルト保存するためのKV
   */
  export namespace HISTORY {
    /**
     * オリジナルのリザルト書き込み
     * waitUntilで実行されることを想定しているためエラーをログとして表示する
     * @param c
     * @param data
     * @returns
     */
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    export const set = async (env: Bindings, data: any): Promise<void> => {
      try {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const myResult: any = data.histories[0].results[0].data.coopHistoryDetail.myResult
        const id: CoopPlayerId = CoopPlayerId.parse(myResult.player.id)
        console.info('[SET HISTORY]:', id.playTime, '-->', id.nplnUserId)
        await env.HISTORIES.put(`${id.nplnUserId}:${id.playTime}`, JSON.stringify(data))
      } catch (error) {
        console.error('[SET HISTORY]:', error)
      }
    }
  }

  /**
   * 変換に成功したリザルトを保存するためのKV
   */
  export namespace RESULT {
    /**
     * 変換後のデータ書き込み
     * waitUntilで実行されることを想定しているためエラーをログとして表示する
     * @param c
     * @param result
     * @returns
     */

    export const set = async (env: Bindings, result: CoopResultQuery.CoopResult): Promise<void> => {
      try {
        console.info('[SET RESULT]:', result.playTime, '-->', result.myResult.nplnUserId)
        await env.RESULTS.put(`${result.myResult.nplnUserId}:${result.playTime}`, JSON.stringify(result))
      } catch (error) {
        console.error('[SET RESULT]:', error)
      }
    }

    export const get = async (env: Bindings, id: string): Promise<CoopResultQuery.CoopResult> => {
      const data: unknown | null = await env.RESULTS.get(id, { type: 'json' })
      if (data === null) {
        throw new HTTPException(404, { message: 'Not Found.' })
      }
      return CoopResultQuery.CoopResult.parse(data)
    }

    export const list = async (
      env: Bindings,
      npln_user_id: string,
      limit: number,
      cursor: string | undefined = undefined
    ): Promise<KVNamespaceListResult<string, string>> => {
      return await env.RESULTS.list({ prefix: npln_user_id, cursor: cursor, limit: limit })
    }
  }

  export namespace SCHEDULE {
    /**
     * スケジュール読み込み
     * @param c
     * @param id
     * @returns
     */
    export const get = async (env: Bindings, id: string): Promise<CoopSchedule.Response> => {
      const data: unknown | null = await env.SCHEDULES.get(id, { type: 'json' })
      if (data === null) {
        throw new HTTPException(404, { message: 'Not Found.' })
      }
      return CoopSchedule.Response.parse(data)
    }

    /**
     * スケジュール書き込み
     * @param c
     * @param data
     * @returns
     */
    export const set = async (env: Bindings, data: object): Promise<CoopSchedule.Response> => {
      const schedule: CoopSchedule.Response = CoopSchedule.Response.parse(data)
      console.info('[SET SCHEDULE]:', schedule.startTime, '-->', schedule.endTime)
      await env.SCHEDULES.put(`${schedule.startTime}:${schedule.endTime}`, JSON.stringify(schedule))
      return schedule
    }
  }

  export namespace CACHE {
    /**
     * スケジュール読み込み
     * @param c
     * @param id
     * @returns
     */
    export const get = async (env: Bindings, id: string): Promise<unknown> => {
      const data: unknown | null = await env.CACHES.get(id, { type: 'json' })
      if (data === null) {
        return dummy
      }
      return data
    }

    /**
     * スケジュール書き込み
     * @param c
     * @param data
     * @returns
     */
    export const set = async (env: Bindings, key: string, data: unknown): Promise<void> => {
      await env.CACHES.put(key, JSON.stringify(data))
      return
    }
  }
}
