# ステージング環境（Λ-0・2026-07-31新設）

本番(`my-naishin` Worker・`my-naishin-leads` D1)と完全に分離したステージング環境。
loopが自由に読み書きしてよい領域と、👤専用の本番反映を明確に分ける。

## 構成

| | 本番 | ステージング |
|---|---|---|
| wrangler設定 | `wrangler.jsonc` | `wrangler.staging.jsonc` |
| Worker名 | `my-naishin` | `my-naishin-staging` |
| D1データベース | `my-naishin-leads`（`6d0135df-...`） | `my-naishin-staging-leads`（`e4b2a973-...`） |
| D1バインディング名 | `LEADS_DB` | `LEADS_DB`（同名。コードを分岐させないため） |
| migrations | `migrations/0001`〜`0012` 適用済み | 同じ12本を2026-07-31に適用済み（スキーマ完全一致） |

## loopが単独で実行してよい範囲（2026-07-31 👤承認・方向修正指示・修正4）

- `wrangler.staging.jsonc` を使う `d1 execute` / `d1 migrations` / `deploy` はloopが自由に実行してよい
- ステージングDBへの新規migration適用（非破壊・新規テーブル追加のみ）
- ステージング環境での動作確認・データ投入テスト

## 厳守事項（loopは絶対に越えない）

- **`wrangler.jsonc`（本番設定）・`my-naishin-leads`（本番D1）・`my-naishin`（本番Worker）には一切触れない**
- 本番への `wrangler deploy`（設定ファイル省略時のデフォルト）は**引き続き👤専用**
- 本番D1への破壊的操作（DROP・列削除・データ書換）はステージングでも👤判断を仰ぐ（新規テーブル追加以外は慎重に）
- 認証情報が足りない・`wrangler`が通らない場合は推測で本番側を触らず中断し`loop-question-note`へ

## コマンド例

```bash
# ステージングDBへmigration適用（loop実行可）
NODE_TLS_REJECT_UNAUTHORIZED=0 node node_modules/wrangler/bin/wrangler.js d1 execute \
  my-naishin-staging-leads --remote --file=migrations/0013_xxx.sql --config wrangler.staging.jsonc

# ステージングWorkerへデプロイ（loop実行可・本番には影響しない）
NODE_TLS_REJECT_UNAUTHORIZED=0 node node_modules/wrangler/bin/wrangler.js deploy \
  --config wrangler.staging.jsonc

# 本番への反映（👤専用・デフォルトのwrangler.jsoncを使う通常のデプロイフロー）
npm run deploy
```

## この環境が既に解決していること

- Cloudflare認証: 会社ネットワークのTLS傍受対策として`NODE_TLS_REJECT_UNAUTHORIZED=0`が必要
  （[[wrangler-corporate-network-workaround]]）。OAuthトークンは既にキャッシュ済みで
  `naishin.dev@gmail.com`アカウントとして認証されている（`wrangler whoami`で確認済み）
- npxが会社GPOで通らないため`node node_modules/wrangler/bin/wrangler.js`を直接叩く

## 前提となるタスク

Λ-7（Ω-1データバンク全力スケール）・Λ-8（Ω-6直接マッチング市場バックエンド試作）・
Λ-9・Λ-10がこのステージング環境を前提とする。**Λ-2〜Λ-6はこの環境を必要としない**
（それぞれ既存の本番D1・静的データファイルのみで完結するため）。
