import { describe, expect, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { CoopScheduleQuery } from '@/models/coop_schedule.dto'

describe('CoopScheduleQuery', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      new CoopScheduleQuery(JSON.parse(data))
    }
  })
  test('Equality', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const input: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      // const output: string = readFileSync(path.join(__dirname, 'output', file), { encoding: 'utf8' })
      const input_model: CoopScheduleQuery = new CoopScheduleQuery(JSON.parse(input))
      // console.log(JSON.stringify(input_model, null, 2))
      // expect(input_model.res.assetURLs.length).toEqual(output_model.assetURLs.length)
      // expect(Bun.deepEquals(input_model.res, output_model, true)).toBe(true)
    }
  })
})
