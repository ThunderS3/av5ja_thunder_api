import { describe, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { CoopRecordModel } from '@/models/coop_record.dto'
import { CoopResultModel } from '@/models/coop_result.dto'

describe('Records', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      CoopRecordModel.parse(JSON.parse(data))
    }
  })
})
