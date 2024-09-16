import { describe, expect, test } from 'bun:test'
import { readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { CoopRecordModel } from '@/models/coop_record.dto'
import { CoopResultModel } from '@/models/coop_result.dto'

describe('Records', () => {
  test('Parse', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const data: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      CoopRecordModel.Req.parse(JSON.parse(data))
    }
  })
  test('Equality', () => {
    const files: string[] = readdirSync(path.join(__dirname, 'input')).filter((file) => file.endsWith('.json'))
    for (const file of files) {
      const input: string = readFileSync(path.join(__dirname, 'input', file), { encoding: 'utf8' })
      const output: string = readFileSync(path.join(__dirname, 'output', file), { encoding: 'utf8' })
      const input_model: CoopRecordModel.Req = CoopRecordModel.Req.parse(JSON.parse(input))
      const output_model: CoopRecordModel.Res = CoopRecordModel.Res.parse(JSON.parse(output))
      expect(input_model.stageRecords).toEqual(output_model.stageRecords)
      expect(input_model.enemyRecords).toEqual(output_model.enemyRecords)
      expect(input_model.assetURLs).toEqual(output_model.assetURLs)
    }
  })
})
