import { describe, expect, it, test } from 'bun:test'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { CoopResultQuery } from '@/models/coop_result.dto'
import { diff } from 'deep-diff'

describe('CoopResultQuery', () => {
  test('Validity', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      expect(() => CoopResultQuery.CoopHistory.parse(JSON.parse(data))).not.toThrow()
    }
  })
  test('Equality', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const input: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      const output: string = readFileSync(path.join(__dirname, 'output', file), { encoding: 'utf8' })
      const input_model = CoopResultQuery.CoopHistory.parse(JSON.parse(input))
      const difference = diff(JSON.parse(JSON.stringify(input_model)), JSON.parse(output))
      if (difference !== undefined) {
        console.error(JSON.stringify(CoopResultQuery.CoopHistory.parse(JSON.parse(input)), null, 2))
        console.error(file, difference)
      }
      expect(Bun.deepEquals(JSON.parse(JSON.stringify(input_model)), JSON.parse(output))).toBe(true)
    }
  })
})
