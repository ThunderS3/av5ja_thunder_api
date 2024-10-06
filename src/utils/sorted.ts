import { S3URL } from '@/models/common/s3_url.dto'
import { z } from '@hono/zod-openapi'
import _, { concat, isArray, isDate, isObject, isString, reduce, values } from 'lodash'

export const sortedJSON = (object: object): object => {
  return _(object).toPairs().sortBy(0).fromPairs().value()
}
