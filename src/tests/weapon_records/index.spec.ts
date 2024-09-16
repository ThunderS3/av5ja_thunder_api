import { describe, expect, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { it } from 'node:test'
import { CoopWeaponRecordModel } from '@/models/coop_weapon_record.dto'

describe('Results', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      CoopWeaponRecordModel.parse(JSON.parse(data))
    }
  })
  test('Equality', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const input: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      const output: string = readFileSync(path.join(__dirname, 'output', file), { encoding: 'utf8' })
      const model: CoopWeaponRecordModel = CoopWeaponRecordModel.parse(JSON.parse(input))
      const diff = new Set(JSON.parse(output).assetURLs).difference(new Set(model.assetURLs))
      expect(diff.size).toBe(0)
    }
  })
})
