import type { CoopResultQuery } from '@/models/coop_result.dto'
import { HTTPException } from 'hono/http-exception'
import type { Bindings } from '../bindings'

export namespace R2 {
  export namespace RESULT {
    export const get = async (env: Bindings, id: string): Promise<R2Object> => {
      const object: R2ObjectBody | null = await env.BACKUPS.get(id)
      if (object === null) {
        throw new HTTPException(404, { message: 'Not Found.' })
      }
      return object.json()
    }

    export const list = async (
      env: Bindings,
      npln_user_id: string,
      limit: number,
      cursor: string | undefined = undefined
    ): Promise<R2Objects> => {
      return await env.BACKUPS.list({ prefix: npln_user_id, limit, cursor })
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    export const get_all = async (env: Bindings, object: R2Objects): Promise<any> => {
      return (await Promise.all(object.objects.map((object) => get(env, object.key)))).flatMap(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (result: any) => result.histories
      )
    }
  }
}
