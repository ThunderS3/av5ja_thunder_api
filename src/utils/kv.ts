import { CoopBossInfo, CoopEnemyInfo } from '@/enums/coop/coop_enemy'
import { CoopStage } from '@/enums/coop/coop_stage'
import { ImageType } from '@/enums/image_type'
import { WeaponInfoMain } from '@/enums/weapon/main'
import { WeaponInfoSpecial } from '@/enums/weapon/special'
import { CoopPlayerId } from '@/models/common/coop_player_id.dto'
import { CoopSchedule } from '@/models/coop_schedule.dto'
import { Thunder } from '@/models/user.dto'
import dayjs, { type Dayjs } from 'dayjs'
import { HTTPException } from 'hono/http-exception'
import { jwt, sign } from 'hono/jwt'
import { AlgorithmTypes } from 'hono/utils/jwt/jwa'
import { v4 as uuidv4 } from 'uuid'
import type { Bindings } from './bindings'
import dummy from './handler/dummy.json'

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
    export const get = async (env: Bindings, id: string): Promise<Thunder.User | null> => {
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
    export const set = async (env: Bindings, data: object): Promise<Thunder.User> => {
      console.info('[SET USER]:', data)
      const user: Thunder.User = Thunder.User.parse(data)
      await env.USERS.put(user.id, JSON.stringify(user))
      return user
    }

    /**
     * ユーザーデータからトークンを生成
     * @param c
     * @param data
     * @returns
     */
    export const token = (env: Bindings, url: URL, data: object): Promise<string> => {
      const user: Thunder.User = Thunder.User.parse(data)
      const current_time: Dayjs = dayjs()
      const token: Thunder.Token = Thunder.Token.parse({
        aud: env.DISCORD_CLIENT_ID,
        exp: current_time.add(12, 'hour').unix(),
        iat: current_time.unix(),
        iss: url.hostname,
        jti: uuidv4(),
        nbf: current_time.unix(),
        sub: user.id,
        typ: 'access_token',
        usr: user
      })
      return sign(token, env.JWT_SECRET_KEY, AlgorithmTypes.HS256)
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

    export const set = async (env: Bindings, result: CoopResultQuery.CoopHistory): Promise<void> => {
      const results = result.histories.flatMap((history) => history.results)
      // Promise.all(results.map((result) => env.RESULTS.put(`${result}:${result.playTime}`, JSON.stringify(result)))
      // try {
      //   console.info('[SET RESULT]:', result.playTime, '-->', result.myResult.nplnUserId)
      //   await env.RESULTS.put(`${result.myResult.nplnUserId}:${result.playTime}`, JSON.stringify(result))
      // } catch (error) {
      //   console.error('[SET RESULT]:', error)
      // }
    }

    export const get = async (env: Bindings, id: string): Promise<CoopHistoryDetail.Response> => {
      const data: unknown | null = await env.RESULTS.get(id, { type: 'json' })
      if (data === null) {
        throw new HTTPException(404, { message: 'Not Found.' })
      }
      return CoopHistoryDetail.Response.parse(data)
    }

    export const list = async (
      env: Bindings,
      npln_user_id: string,
      cursor: string | undefined,
      limit: number
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
