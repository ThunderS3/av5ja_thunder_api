import { describe, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { CoopHistoryModel } from '@/models/coop_history.dto'

describe('Histories', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      CoopHistoryModel.parse(JSON.parse(data))
    }
  })
})
