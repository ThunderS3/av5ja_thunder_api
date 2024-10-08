## Thunder API

スプラトゥーン3におけるイカリング3から取得できるサーモンランのJSONを送信すると, 利用しやすい形式に変換してくれるAPIです.

### エンドポイント

#### `v1/version`

「スプラトゥーン3, Nintendo Switch Online, SplatNet3」のそれぞれの最新のバージョンを返します.

```json
{
    "game": "9.1.0",
    "app": "2.10.1",
    "web": "6.0.0-30a1464a"
}
```

#### `v3/schedules`

サーモンランのスケジュール情報を返します.

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

#### `v1/histories`

`CoopHistoryQuery`のレスポンスを受け取ってフォーマットして返します.

```json
{
  "histories": [
    {
      "schedule": {
        "id": "bd92b39d10208169d2b9e61648e82926",
        "startTime": "2024-03-09T00:00:00.000Z",
        "endTime": "2024-03-11T00:00:00.000Z",
        "mode": "REGULAR",
        "rule": "BIG_RUN",
        "stageId": 106,
        "rareWeapons": [],
        "weaponList": [
          -1,
          -1,
          -1,
          -1
        ]
      },
      "results": [
        {
          "type": "CoopHistoryDetail",
          "nplnUserId": "a7grz65rxkvhfsbwmxmm",
          "playTime": "2024-03-10T15:33:21.000Z",
          "uuid": "6c7f0304-de90-49d2-9cff-d428d9d74acf"
        }
      ]
    }
  ]
}
```

#### `v3/results`

`v1/histories`の`results`に`CoopHistoryDetailQuery`のレスポンスを埋め込んでPOSTするとSplatNet2形式に変換したデータを返します.

```json
{
  "histories": [
    {
      "schedule": {
        "id": "24a943851703ade14563cbbbd17e6e39",
        "startTime": "2024-04-06T16:00:00.000Z",
        "endTime": "2024-04-08T08:00:00.000Z",
        "mode": "REGULAR",
        "rule": "REGULAR",
        "bossId": null,
        "stageId": 9,
        "rareWeapons": [],
        "weaponList": [
          -1,
          -1,
          -1,
          -1
        ]
      },
      "results": [
        // CoopHistoryDetailQuery
      ]
    }
  ]
}
```

得られるレスポンス例は以下のようなフォーマットです.

```json
{
    "histories": [
        {
            "schedule": {
                "id": "24a943851703ade14563cbbbd17e6e39",
                "startTime": "2024-04-06T16:00:00.000Z",
                "endTime": "2024-04-08T08:00:00.000Z",
                "mode": "REGULAR",
                "rule": "REGULAR",
                "bossId": null,
                "stageId": 9,
                "weaponList": [
                    -1,
                    -1,
                    -1,
                    -1
                ],
                "rareWeapons": []
            },
            "results": [
                {
                    "bossCounts": [
                        3,
                        6,
                        8,
                        4,
                        5,
                        3,
                        8,
                        2,
                        10,
                        3,
                        8,
                        0,
                        0,
                        0
                    ],
                    "bossKillCounts": [
                        3,
                        2,
                        7,
                        4,
                        4,
                        3,
                        8,
                        2,
                        9,
                        3,
                        8,
                        0,
                        0,
                        0
                    ],
                    "bossResults": null,
                    "dangerRate": 2.35,
                    "goldenIkuraAssistNum": 17,
                    "goldenIkuraNum": 112,
                    "id": "a45b3f22a13149f6000218c1811d5767",
                    "ikuraNum": 3932,
                    "jobResult": {
                        "failureWave": null,
                        "isClear": true,
                        "bossId": 24,
                        "isBossDefeated": true
                    },
                    "myResult": {
                        "id": "6dae617855fda353cb4497a125f95849",
                        "name": "XXXXXXXXXXXXXXXX",
                        "byname": "Splatlandian Youth",
                        "nameId": "1012",
                        "nameplate": {
                            "badges": [
                                null,
                                null,
                                null
                            ],
                            "background": {
                                "id": 1,
                                "textColor": {
                                    "r": 1,
                                    "g": 1,
                                    "b": 1,
                                    "a": 1
                                }
                            }
                        },
                        "uniform": 1,
                        "species": "INKLING",
                        "weaponList": [
                            3050,
                            1120,
                            4010,
                            27900
                        ],
                        "nplnUserId": "a7grz65rxkvhfsbwmxmm",
                        "specialId": 20010,
                        "ikuraNum": 867,
                        "goldenIkuraNum": 21,
                        "goldenIkuraAssistNum": 11,
                        "helpCount": 0,
                        "deadCount": 2,
                        "bossKillCountsTotal": 11,
                        "isMyself": true,
                        "smellMeter": 5,
                        "jobRate": 2.5,
                        "jobBonus": 100,
                        "jobScore": 131,
                        "kumaPoint": 427,
                        "gradeId": 8,
                        "gradePoint": 210,
                        "bossKillCounts": [
                            1,
                            1,
                            2,
                            0,
                            0,
                            0,
                            3,
                            0,
                            0,
                            3,
                            1,
                            0,
                            0,
                            0
                        ],
                        "specialCounts": [
                            0,
                            0,
                            0,
                            1
                        ]
                    },
                    "otherResults": [
                        {
                            "id": "3138b358a9a7a07ad7786a33707fcb0d",
                            "name": "XXXXXXXXXXXXXXXX",
                            "byname": "Brand-New Seafood",
                            "nameId": "7069",
                            "nameplate": {
                                "badges": [
                                    null,
                                    6000003,
                                    6000002
                                ],
                                "background": {
                                    "id": 971,
                                    "textColor": {
                                        "r": 0.149019599,
                                        "g": 0.00784313772,
                                        "b": 0.117647097,
                                        "a": 1
                                    }
                                }
                            },
                            "uniform": 16,
                            "species": "INKLING",
                            "weaponList": [
                                7010,
                                2060,
                                60,
                                22900
                            ],
                            "nplnUserId": "xxxxxxxxxxxxxxxxxxxx",
                            "specialId": 20014,
                            "ikuraNum": 938,
                            "goldenIkuraNum": 24,
                            "goldenIkuraAssistNum": 2,
                            "helpCount": 0,
                            "deadCount": 2,
                            "bossKillCountsTotal": 18,
                            "isMyself": false,
                            "smellMeter": null,
                            "jobRate": null,
                            "jobBonus": null,
                            "jobScore": null,
                            "kumaPoint": null,
                            "gradeId": null,
                            "gradePoint": null,
                            "bossKillCounts": [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "specialCounts": [
                                0,
                                0,
                                1,
                                1
                            ]
                        },
                        {
                            "id": "3ba0d24f6be18c85d56f93f89f55eab4",
                            "name": "XXXXXXXXXXXXXXXX",
                            "byname": "Limited-Edition Inkbrush User",
                            "nameId": "4152",
                            "nameplate": {
                                "badges": [
                                    1011010,
                                    1011110,
                                    1011210
                                ],
                                "background": {
                                    "id": 11008,
                                    "textColor": {
                                        "r": 0,
                                        "g": 0,
                                        "b": 0,
                                        "a": 1
                                    }
                                }
                            },
                            "uniform": 8,
                            "species": "INKLING",
                            "weaponList": [
                                20900,
                                4020,
                                25900,
                                2030
                            ],
                            "nplnUserId": "xxxxxxxxxxxxxxxxxxxx",
                            "specialId": 20012,
                            "ikuraNum": 1569,
                            "goldenIkuraNum": 30,
                            "goldenIkuraAssistNum": 2,
                            "helpCount": 2,
                            "deadCount": 2,
                            "bossKillCountsTotal": 12,
                            "isMyself": false,
                            "smellMeter": null,
                            "jobRate": null,
                            "jobBonus": null,
                            "jobScore": null,
                            "kumaPoint": null,
                            "gradeId": null,
                            "gradePoint": null,
                            "bossKillCounts": [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "specialCounts": [
                                1,
                                0,
                                1,
                                1
                            ]
                        },
                        {
                            "id": "f01c934715e86a96df0221fe8f7145a9",
                            "name": "XXXXXXXXXXXXXXXX",
                            "byname": "Big Honkin' Dried Fish",
                            "nameId": "9138",
                            "nameplate": {
                                "badges": [
                                    null,
                                    null,
                                    null
                                ],
                                "background": {
                                    "id": 863,
                                    "textColor": {
                                        "r": 0.0901999995,
                                        "g": 0.0705899969,
                                        "b": 0.0705899969,
                                        "a": 1
                                    }
                                }
                            },
                            "uniform": 14,
                            "species": "INKLING",
                            "weaponList": [
                                30,
                                27900,
                                50,
                                8010
                            ],
                            "nplnUserId": "xxxxxxxxxxxxxxxxxxxx",
                            "specialId": 20017,
                            "ikuraNum": 558,
                            "goldenIkuraNum": 38,
                            "goldenIkuraAssistNum": 2,
                            "helpCount": 4,
                            "deadCount": 0,
                            "bossKillCountsTotal": 12,
                            "isMyself": false,
                            "smellMeter": null,
                            "jobRate": null,
                            "jobBonus": null,
                            "jobScore": null,
                            "kumaPoint": null,
                            "gradeId": null,
                            "gradePoint": null,
                            "bossKillCounts": [
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null,
                                null
                            ],
                            "specialCounts": [
                                0,
                                0,
                                0,
                                1
                            ]
                        }
                    ],
                    "playTime": "2024-04-06T17:57:52.000Z",
                    "scale": [
                        11,
                        2,
                        0
                    ],
                    "scenarioCode": null,
                    "schedule": {
                        "id": "24a943851703ade14563cbbbd17e6e39",
                        "startTime": "2024-04-06T16:00:00.000Z",
                        "endTime": "2024-04-08T08:00:00.000Z",
                        "mode": "REGULAR",
                        "rule": "REGULAR",
                        "bossId": null,
                        "stageId": 9,
                        "weaponList": [
                            -1,
                            -1,
                            -1,
                            -1
                        ],
                        "rareWeapons": []
                    },
                    "uuid": "06b30acf-9729-4bd5-96ad-3191dd266dee",
                    "waveDetails": [
                        {
                            "id": "322f97d371c376f6608523f009190877",
                            "isClear": true,
                            "waveId": 1,
                            "waterLevel": 0,
                            "eventType": 0,
                            "quotaNum": 27,
                            "goldenIkuraPopNum": 66,
                            "goldenIkuraNum": 42
                        },
                        {
                            "id": "fef00683272177d277d0873c10f8c4b2",
                            "isClear": true,
                            "waveId": 2,
                            "waterLevel": 1,
                            "eventType": 0,
                            "quotaNum": 29,
                            "goldenIkuraPopNum": 60,
                            "goldenIkuraNum": 32
                        },
                        {
                            "id": "0978e31c1e3518085537ce75f864181e",
                            "isClear": true,
                            "waveId": 3,
                            "waterLevel": 1,
                            "eventType": 4,
                            "quotaNum": 31,
                            "goldenIkuraPopNum": 49,
                            "goldenIkuraNum": 38
                        },
                        {
                            "id": "203cacf9d982ece13f58f94f25bb071c",
                            "isClear": true,
                            "waveId": 4,
                            "waterLevel": 1,
                            "eventType": 0,
                            "quotaNum": null,
                            "goldenIkuraPopNum": 30,
                            "goldenIkuraNum": null
                        }
                    ]
                }
            ]
        }
    ]
}
```

#### `/v1/records`

`CoopRecordQuery`のレスポンスを送るとフォーマットして返します.

```json
{
  "enemyRecords": [
    {
      "enemyId": 4,
      "count": 3175
    }
  ],
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
  ]
}
```

#### `/v1/auth/id_token`

Discord OAuth2を利用してユーザー登録を行い, IDトークンを返します.

#### `/v1/auth/access_token`

有効な`GameWebToken`と`nplnUserId`を送信してアクセストークンを返します.

無効あるいは期限切れの`GameWebToken`を送信した場合, エラーが返ります.

このアクセストークンを利用することで自身のデータにアクセスすることができます.

IDトークン及びアクセストークンは以下のフォーマットのJSONのJSON Web Tokenです.

```json
{
  "aud": "6633677291552768",
  "exp": 1729744526,
  "iat": 1727152526,
  "iss": "localhost",
  "jti": "879b8ecf-a66d-438a-a745-dcc7db6f8c15",
  "membership": true,
  "nbf": 1727152526,
  "npln_user_id": "a7grz65rxkvhfsbwmxmm",
  "nsa_id": "3f89c3791c43ea57",
  "typ": "id_token"
}
```

- `aud`
    - APIサービス名で`6633677291552768`が固定値で与えられます.
- `exp`
    - トークンの有効期限を表すUnix時間です.
- `iat`
    - トークンの発酵時間を表すUnix時間です.
- `iss`
    - トークンを発行したサーバーの識別子です.
    - 開発環境では`localhost`が返ります.
- `jti`
    - トークンの一意識別子です. UUID形式で与えられます.
- `membership`
    - Nintendo Switch Onlineのメンバーシップが有効であるかどうかの真理値.
- `sub`
    - DiscordのユーザーID
- `cus`
    - StripeのユーザーID
- `nbf`
    - トークンが有効になる時間を表すUnix時間です.
- `npln_user_id`
    - あなたのNPLNサーバーにおけるユーザーIDです.
    - この値はあなたと遊んだすべてのユーザーが確認することができる公開情報です
- `nsa_id`
    - Nintendo Service Account IDです.
    - この値はあなたとフレンドであるすべてのユーザーが確認することができる公開情報です
- `typ`
    - トークンの種類を返します
    - `id_token`または`access_token`が入ります


### ワークフロー

アクセストークンを付与するうえで検討すべき点.

1. ユーザーが自身のユーザーの情報に確実にアクセスできる
2. 他のユーザーの情報にはアクセスできない
3. 他のユーザーが別のユーザーになりすますことはできない
4. なりすまし等は確実に検知することができる
5. アプリ内からStripeへの導線があってはならない(App Storeのポリシー)
6. 認証に使われる`npln_user_id`と`nsa_id`は公開情報である

それを実装するためのワークフロー(仮)は以下の通り.

```mermaid
sequenceDiagram
    box Black Proxy
      participant Stripe
      participant API
    end
    participant Web
    box Thunder
      participant ThunderAPI
      participant ThunderAPP
    end
    participant SplatNet3
    SplatNet3->>ThunderAPP: _gtoken(nsa_id)
    ThunderAPP->>ThunderAPI: _gtoken(nsa_id)
    ThunderAPI->>SplatNet3: get npln_user_id
    SplatNet3->>ThunderAPI: npln_user_id
    ThunderAPI->>ThunderAPP: id_token
    ThunderAPP->>Web: id_token
    Web->>API: get products
    API->>Stripe : get products
    Stripe->>API: products
    API->>Web: products
    Web->>API: get checkout
    API->>Stripe: get checkout
    Stripe->>API: checkout
    API->>Web: checkout
    Web->>Web: checkout completed
    Stripe->>API: webhook
    API->>Web: access_token
    Web->>ThunderAPI: get results
    ThunderAPI->>Web: results
```

前提としてThunderAPPは`_gtoken`から発行される`bullet_token`を使ってSplatNet3からデータを取得してThunderAPIに送信している.
ThunderAPIは全てのリザルトを保存しているため, 本人だけのリザルト取得には認証が必要不可欠となる.
そのためにサーモンランにおけるプレイヤーのIDとなる`npln_user_id`を含むJSON Web Tokenを発行し, その署名を検証することで本人かどうかをチェックするものとする.

1. ThunderAPPはSplatNet3の通信をMITMすることで`_gtoken`を得る
    - `_gtoken`はJSON Web Tokenであるため秘密鍵なしに偽の署名をすることは不可能である上に, 真正であることの検証は公開鍵を使って行える
2. ThunderAPPはThunderAPIに`_gtoken`を送信する
3. ThunderAPIは送られた`_gtoken`の検証をし, ペイロードから`nsa_id`を取得する
4. ThunderAPIは`_gtoken`を使ってSplatNet3からデータを取得し, `npln_user_id`を得る
    - `_gtoken`は有効期限が2.5時間ほどしかない上にThunderAPIは`_gtoken`を保存しない
5. 得られた`npln_user_id`と`nsa_id`を使って`id_token`を発行し, ThunderAPIの秘密鍵を使って署名する
6. Webのフォームから`id_token`を入力する
7. 入力された`id_token`はAPIに送られ, 検証される
    - 検証をパスすれば`id_token`に含まれる`npln_user_id`と`_nsa_id`は正しいことが保証される
8. `npln_user_id`と`nsa_id`を使ってStripeのCheckoutセッションを完了させる
9. セッション後の支払いが成功すればStripeから送られるWebhookを利用して`id_token`とWebhookのペイロードから`access_token`を生成する
    - `access_token`にはサブスクリプションの状態と有効期限が入っている
    - よって`access_token`が有効であればサブスクリプションも有効である
    - 正しい顧客に正しい`nsa_id`, `npln_user_id`が含まれる`access_token`が返る

### 検討事項

- `id_token`と`access_token`はどちらもThunderAPIへのアクセス権限がある
    - 課金している人だけ制限が緩和されている感じ
- `npln_user_id`および`nsa_id`は改竄ができないかどうか
    - これら二つは公開情報であるため, 他人がなりすませないことを厳密にチェックする必要がある
    - なりすませる場合, 他人のリザルトへのアクセス権がある`id_token`および`access_token`を発行してしまうことになる
- `_gtoken`の権限の確認
    - `_gtoken`をThunderAPIに渡すのはセキュリティ上懸念事項にならないかどうか
    - `_gtoken`を本来の持ち主ではないThunderAPIからSplatNet3にリクエストを送るのはセキュリティ上の懸念事項にならないかどうか
- ThunderAPIはサーモンランNWにおけるリクエストを処理するだけのAPI, APIはStripeのProxyとして働き, 個人開発におけるサービス全般の課金情報を扱うAPIとして開発している
    - 本来のサービスから外れた処理をしていないかどうか
- Stripeにおける課金のサイクルはおよそ一ヶ月となっているが, 有効期限が一ヶ月もあるトークンを発行することに問題がないかどうか

### アクセストークン

ユーザーのデータにアクセスするためのトークンです. JSON Web Tokenで与えられ, 以下のデータを含みます.

```json
{
  "aud": "6633677291552768",
  "exp": 1729744526,
  "iat": 1727152526,
  "iss": "localhost",
  "jti": "879b8ecf-a66d-438a-a745-dcc7db6f8c15",
  "membership": true,
  "nbf": 1727152526,
  "npln_user_id": "a7grz65rxkvhfsbwmxmm",
  "nsa_id": "3f89c3791c43ea57",
  "typ": "id_token"
}
```

- `aud`
    - APIサービス名で`6633677291552768`が固定値で与えられます.
- `exp`
    - トークンの有効期限を表すUnix時間です.
- `iat`
    - トークンの発酵時間を表すUnix時間です.
- `iss`
    - トークンを発行したサーバーの識別子です.
    - 開発環境では`localhost`が返ります.
- `jti`
    - トークンの一意識別子です. UUID形式で与えられます.
- `membership`
    - Nintendo Switch Onlineのメンバーシップが有効であるかどうかの真理値.
- `sub`
    - DiscordのユーザーID
- `cus`
    - StripeのユーザーID
- `nbf`
    - トークンが有効になる時間を表すUnix時間です.
- `npln_user_id`
    - あなたのNPLNサーバーにおけるユーザーIDです.
    - この値はあなたと遊んだすべてのユーザーが確認することができる公開情報です
- `nsa_id`
    - Nintendo Service Account IDです.
    - この値はあなたとフレンドであるすべてのユーザーが確認することができる公開情報です
- `typ`
    - トークンの種類を返します
    - `id_token`または`access_token`が入ります
