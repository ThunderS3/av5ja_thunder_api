import { User } from '@/models/user.dto'
import type { Context } from 'hono'
import { jwt, sign } from 'hono/jwt'
import { AlgorithmTypes } from 'hono/utils/jwt/jwa'
import type { Bindings } from './bindings'

export namespace KV {
  export namespace USER {
    export const get = async (c: Context<{ Bindings: Bindings }>, id: string): Promise<User> => {
      return User.parse(await c.env.USERS.get(id, { type: 'json' }))
    }

    export const set = async (c: Context<{ Bindings: Bindings }>, data: object): Promise<User> => {
      const user: User = User.parse(data)
      await c.env.USERS.put(user.sub, JSON.stringify(user))
      return user
    }

    export const token = (c: Context<{ Bindings: Bindings }>, data: object): Promise<string> => {
      const user: User = User.parse(data)
      return sign(user, c.env.JWT_SECRET_KEY, AlgorithmTypes.HS256)
    }
  }
}
