## Thunder API

スプラトゥーン3におけるイカリング3から取得できるサーモンランのJSONを送信すると, 利用しやすい形式に変換してくれるAPIです.

### 機能

- [x] `/v3/schedules`
  - BCATで配信されている最新のスケジュールまでを返します.
- [x] `/v1/weapon_records`
  - `CoopWeaponRecordQuery`のデータを受け取ってフォーマットしたJSONを返します
- [x] `/v1/records`
  - `CoopRecordQuery`のデータを受け取ってフォーマットしたJSONを返します.
- [ ] `/v1/histories`
  - `CoopHistoryQuery`のデータを受け取ってフォーマットしたJSONを返します.
- [ ] `/v3/results`
  - `CoopHistoryDetailQuery`と`CoopHistoryQuery`を組み合わせたデータを受け取ってフォーマットしたJSONを返します.

### フォーマット

返ってくるJSONのフォーマットです.

#### `v3/schedules`

スケジュール情報はGETリクエストのみなので送信するフォーマットはありません.

```json
[
  {
    "id": "0664e978f616079a7a4fa8e1cbc0bb00",
    "startTime": "2024-09-15T16:00:00.000Z",
    "endTime": "2024-09-17T08:00:00.000Z",
    "rareWeapons": [],
    "weaponList": [
      8000,
      230,
      4040,
      6010
    ],
    "bossId": 24,
    "stageId": 9,
    "mode": "REGULAR",
    "rule": "REGULAR"
  },
]
```

#### `/v1/histories`

`CoopHistoryQuery`のレスポンスをそのまま送信すると以下の形式のレスポンスが得られます.

```json
```

#### `/v3/results`

```json
```

#### `/v1/records`

`CoopRecordQuery`のレスポンスをそのまま送信すると以下の形式のレスポンスが得られます.

```json
{
  "stageRecords": [
    {
      "startTime": null,
      "endTime": null,
      "goldenIkuraNum": null,
      "grade": 8,
      "gradePoint": 999,
      "rank": null,
      "stageId": 2,
      "trophy": null
    }
  ],
  "enemyRecords": [
    {
      "count": 3175,
      "enemyId": 4
    },
    {
      "count": 0,
      "enemyId": 30
    }
  ],
  "assetURLs": []
}
```

`enemyRecords`にオオモノシャケとオカシラシャケの両方のデータが含まれます.

#### `/v1/weapon_records`

`CoopWeaponRecordQuery`のレスポンスをそのまま送信すると以下の形式のレスポンスが得られます.

```json
{
  "assetURLs": []
}
```
