import { describe, expect, it, test } from 'bun:test'
import { readFileSync, readdirSync, writeFile, writeFileSync } from 'node:fs'
import path from 'node:path'
import { CoopHistoryDetailQuery } from '@/models/coop_history_detail.dto'

describe('CoopHistoryDetailQuery', () => {
  test('Validity', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      expect(() => new CoopHistoryDetailQuery(JSON.parse(data)), undefined).not.toThrow()
    }
  })

  test('Equality', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const input: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      const input_model: CoopHistoryDetailQuery = new CoopHistoryDetailQuery(JSON.parse(input))
      writeFileSync(path.join(__dirname, 'output', file), JSON.stringify(input_model, null, 2))
      console.log(JSON.stringify(input_model, null, 2))
    }
  })
})
