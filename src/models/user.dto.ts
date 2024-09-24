import { z } from '@hono/zod-openapi'

export const User = z.object({
  aud: z.string(),
  exp: z.number().min(0),
  iat: z.number().min(0),
  iss: z.string(),
  jti: z.string().uuid(),
  nbf: z.number().min(0),
  sub: z.string(),
  typ: z.enum(['access_token']),
  usr: z.object({
    nsa_id: z.string().nullable(),
    npln_user_id: z.string().nullable(),
    membership: z.boolean(),
    expires_in: z.number().nullable()
  })
})

export type User = z.infer<typeof User>
