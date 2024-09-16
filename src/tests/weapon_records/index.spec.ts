import { describe, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { CoopWeaponRecordModel } from '@/models/coop_weapon_record.dto'

describe('Results', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      CoopWeaponRecordModel.parse(JSON.parse(data))
    }
  })
})
