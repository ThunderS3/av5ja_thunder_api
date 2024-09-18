import { describe, expect, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { CoopHistoryModel } from '@/models/coop_history.dto'

describe('Histories', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      CoopHistoryModel.Req.parse(JSON.parse(data))
    }
  })
  test('Equality', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const input: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      const output: string = readFileSync(path.join(__dirname, 'output', file), { encoding: 'utf8' })
      const input_model: CoopHistoryModel.Req = CoopHistoryModel.Req.parse(JSON.parse(input))
      const output_model: CoopHistoryModel.Res = CoopHistoryModel.Res.parse(JSON.parse(output))
      console.log(input_model.res.histories.map((history) => history.results))
      console.log(output_model.histories.map((history) => history.results))
      // expect(Bun.deepEquals(JSON.parse(JSON.stringify(model)), JSON.parse(output))).toBe(true)
    }
  })
})
