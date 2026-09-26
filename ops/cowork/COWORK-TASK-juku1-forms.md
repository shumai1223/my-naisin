# Cowork指示書 T-JUKU1 塾フォーム営業(索引)

フォーム窓口の塾への営業文面を、Coworkが確認画面の手前まで入力する。**送信は👤。** 便ごとに指示書を分ける。

| 便 | ファイル | 件数 | 状態 |
|---|---|---:|---|
| 第1便 | `ops/cowork/COWORK-TASK-juku1-forms-batch1.md` | 25(全国6・神奈川10・東京9) | 👤が起動待ち(TARGETS.csv=`Cowork第1便に指示済(未送信)`) |
| 第2便 | `ops/cowork/COWORK-TASK-juku1-forms-batch2.md` | 25(神奈川13・東京12) | 👤が起動待ち(第1便のあと) |
| 第3便 | `ops/cowork/COWORK-TASK-juku1-forms-batch3.md` | 24(神奈川11・東京13) | 👤が起動待ち(第2便のあと) |

- 生成: `node scripts/juku1-build-drafts.mjs --kind form --limit 25`(文面) → `node scripts/juku1-build-cowork.mjs <便番号> <id,...>`(指示書)
- 文面の語句は `ops/deliverables/juku1/drafts/phrases.json` に人が書いたものだけを使う
- お名前欄は「My Naishin 運営」を使う(個人名・旧ハンドルを使わない)
- 報告(確認画面まで進めた/未入力で止めた/用途違い/お断り記載あり/証明書エラー)を受けたら TARGETS.csv の状態を更新する(`node scripts/juku1-set-status.mjs "<状態>" id,...`)
