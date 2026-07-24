# D1バックアップ・リストア手順（ZZ-10d・信頼の要塞）

## なぜこの文書があるか

ZZ-1（データフライホイール）でD1（`my-naishin-leads`）が名簿・クリック実績・匿名統計・
APIキー等の**un-copyableな一次データ**の器になった。これは「失ったら二度と戻らない資産」
であるにも関わらず、これまでバックアップ（`scripts/backup-d1.ts`・H-4）はあってもリストア
手段が検証されていなかった＝単一障害点だった（2026-07-23 Fable5指摘）。本文書は
バックアップ・リストア双方の手順と、CI自動化の設定手順をまとめる。

## 対象テーブル（`D1_BACKUP_TABLES`・`src/lib/d1-backup.ts`）

`leads` / `clicks` / `push_subscriptions` / `api_keys` / `api_usage`

## 1. 自動週次バックアップ（CI・`.github/workflows/d1-backup-weekly.yml`）

毎週月曜9:00(JST)に自動実行（`workflow_dispatch`で手動実行も可能）。エクスポート後、
GPG対称鍵暗号化してからCI artifact（保持90日）へ保存する（生JSON＝PIIを平文でartifactに
残さない）。

### 👤が事前に行うこと（1回だけ・GitHub repo設定 → Settings → Secrets and variables → Actions）

| シークレット名 | 値 | 用途 |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | D1:Read権限を持つAPIトークン（Cloudflareダッシュボードで発行） | wrangler非対話認証 |
| `CLOUDFLARE_ACCOUNT_ID` | 対象Cloudflareアカウントのaccount_id | wrangler非対話認証 |
| `D1_BACKUP_ENCRYPTION_KEY` | 任意の強いパスフレーズ（1Password等で保管） | バックアップ暗号化・復号の両方に使う |

**この3つが未設定の間、ワークフローは冒頭のチェックで即座に失敗する**（分かりやすいエラー
メッセージを出すのみで、Cloudflareには一切アクセスしない設計）。3つとも設定済みになって
初めて実際のバックアップが走る。

### CI側の処理（自動）

1. `wrangler d1 execute my-naishin-leads --remote --json --command "SELECT * FROM <table>"` で
   5テーブルをJSONエクスポート
2. `scripts/backup-d1.ts` で件数・サイズを検算しマニフェスト化（`manifest.json`・PII非含有）
3. 各JSONを `gpg --symmetric --cipher-algo AES256` で暗号化 → 平文JSONは削除
4. 暗号化ファイル（`.gpg`）とマニフェストのみをartifactとしてアップロード

## 2. 手動オンデマンドバックアップ（本人のローカル環境）

CIを待たずに今すぐバックアップしたい場合（従来通りのH-4フロー・変更なし）：

```powershell
$day = Get-Date -Format 'yyyy-MM-dd'
New-Item -ItemType Directory -Force "backups/$day" | Out-Null
foreach ($t in @('leads','clicks','push_subscriptions','api_keys','api_usage')) {
  wr d1 execute my-naishin-leads --remote --json --command "SELECT * FROM $t" `
    | Out-File -Encoding utf8 "backups/$day/$t.json"
}
npx tsx scripts/backup-d1.ts --dir="backups/$day"
```

## 3. リストア手順（`scripts/restore-d1.ts`・ZZ-10dで新設）

### 3-1. CI artifactから復元する場合

1. GitHub Actionsの該当run画面からartifact（`d1-backup-<run_id>`）をダウンロード・展開
2. 各 `*.json.gpg` を復号する：
   ```powershell
   gpg --batch --yes --decrypt --passphrase "<D1_BACKUP_ENCRYPTION_KEYの値>" --output leads.json leads.json.gpg
   ```
3. 復号したJSONを `backups/<日付>/` 配下に配置し、以下の「3-3」へ進む

### 3-2. ローカルバックアップから復元する場合

`backups/<日付>/<table>.json` がすでに手元にあるので、そのまま「3-3」へ。

### 3-3. リストアSQLの生成と適用

```powershell
npx tsx scripts/restore-d1.ts --dir="backups/2026-07-07"
# → backups/2026-07-07/restore-leads.sql 等が生成される

# 生成されたSQLを必ず目視確認してから適用する（DELETE文は既定でコメントアウト済み＝
# 追加のみが既定動作。既存データを全消しして差し替えたい場合のみ手動でコメントを外す）
wr d1 execute my-naishin-leads --remote --file="backups/2026-07-07/restore-leads.sql"
```

## 4. 初回リストア演習（2026-07-24実施・合成データによるローカル実証）

実際のCloudflare D1に対するライブなリストア演習（CLOUDFLARE_API_TOKEN発行後の実地確認）は
👤専用タスクとして残っているが、**リストアSQL生成ロジック自体は合成データで実証済み**：

- `src/lib/__tests__/d1-restore.test.ts` の「初回リストア演習」セクションで、
  wrangler `--json` 形式を模した架空の3件（実データは一切使用していない）を
  `extractRowsFromD1Json` → `buildRestoreSqlFile` に通し、以下を機械的に確認した：
  - 全行が欠落なくINSERT文に変換される
  - `NULL` 値・シングルクォートを含む値（SQLインジェクション対策の確認も兼ねる）が
    正しくエスケープされ、生成SQLの構文が壊れない
  - DELETE文が既定でコメントアウトされており、生成SQLをそのまま流しても既存データが
    誤って全消しされない
- `jest`（決定論・CI常駐）でこの契約は今後も回帰しない

**残タスク（👤専用）**: 3つの秘密情報を設定した上で、実際に一度 `workflow_dispatch` で
このワークフローを手動実行し、artifactのダウンロード→復号→`restore-d1.ts`実行までの
一連の流れを本番Cloudflare環境に対して1回通しで確認すること。
