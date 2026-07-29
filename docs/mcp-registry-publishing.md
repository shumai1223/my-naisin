# MCP公開レジストリ登録（Λ-11・2026-07-29）

**このドキュメントの位置づけ**: 登録用メタデータ・README・動作保証テスト・バージョン運用方針の整備までがloopのスコープ。**実際のレジストリへの登録実行（GitHub OAuth認証を伴う`mcp-publisher`コマンド実行）は👤が行う**（loopが対話的なOAuthログインフローを完結できないため。DNS設定・Cloudflare設定の変更禁止と同じ理由でインフラ寄りの認証操作は👤専用）。

## ① 登録先の調査結果

公式MCPレジストリ（`registry.modelcontextprotocol.io`）は、Anthropic・GitHub・PulseMCP・Microsoft等が支える「MCPサーバのApp Store」に相当する中央集権的メタデータリポジトリ。登録には以下が必要と判明した：

1. リポジトリ直下に`server.json`マニフェストを配置（**整備済み・本ドキュメントの③参照**）。
2. `mcp-publisher` CLIで`login github`を実行し、GitHub OAuth認証でnamespace（`io.github.<username>/...`形式）の所有権を証明。
3. `mcp-publisher publish`で`server.json`をレジストリへ送信。

DNSベースの独自ドメインnamespace（`com.my-naishin/...`形式）も選択肢としてあり得るが、その場合はDNS TXTレコードの追加が必要（Cloudflare設定変更＝loop禁止事項）。**GitHubベースのnamespaceの方がインフラ変更を伴わず、リポジトリが既に公開・運営者のGitHubアカウント(shumai1223)所有下にあるため今回はこちらを採用した**。

## ② 運営者の本名を出さない設計の確認

- `server.json`の`name`は`io.github.shumai1223/my-naishin`（GitHubハンドル・既に本リポジトリの公開情報）であり、本名は含まない。
- `description`・`repository`にも本名は登場しない。
- MCPサーバ自体（`/api/mcp`のGETディスカバリ応答・`serverInfo`）も既存実装の時点で`name: 'my-naishin-data'`とサイト名義になっており、本名露出は無い（2026-07-29確認・修正不要）。

## ③ 登録用メタデータ（server.json・整備済み）

リポジトリ直下`server.json`に配置済み。内容：

```json
{
  "$schema": "https://static.modelcontextprotocol.io/schemas/2025-12-11/server.schema.json",
  "name": "io.github.shumai1223/my-naishin",
  "description": "日本全国47都道府県の高校入試・内申点（調査書点）計算方式データと厳密な計算ツールを提供するMCPサーバ。教育委員会の一次資料に基づく機械可読データセット。",
  "version": "2026.1",
  "repository": { "url": "https://github.com/shumai1223/my-naishin", "source": "github" },
  "remotes": [ { "type": "streamable-http", "url": "https://my-naishin.com/api/mcp" } ]
}
```

`version`は`src/lib/naishin-dataset.ts`の`DATASET_META.version`（唯一の正準ソース）と一致させる設計（回帰テストで自動検知・下記④参照）。

## ④ 動作保証テスト（整備済み）

- `src/lib/__tests__/mcp-server-json.test.ts`（新設）: `server.json`が①有効なJSON ②必須フィールド完備 ③本名非露出（許可済み識別子のみ許容） ④エンドポイントURLが実際のMCPルートと一致 ⑤versionが`DATASET_META.version`と一致、を機械的に検証。`server.json`の更新漏れ（実装とのドリフト）を回帰テストで検知する。
- `src/app/api/__tests__/mcp-route.test.ts`（既存・425行）: JSON-RPC 2.0契約（initialize/tools/resources/prompts/エラー）・レート制限・全25ツールの性能回帰スイートを既にカバー済み。追加整備は不要と判断した。

## ⑤ バージョン運用方針

- `server.json`の`version`は`DATASET_META.version`（例: `2026.1`）と常に一致させる。**データセットの年度更新（例: 2027年度入試データへの切替）や、MCPツールの破壊的変更（既存ツールの引数・戻り値スキーマ変更）があった場合にバージョンを上げる**。
- バージョン形式は`{年度}.{その年度内の改訂連番}`（例: `2026.1`→`2026.2`）とし、semver（`x.y.z`）は採用しない（教育系データセットは「年度」が最も意味のある単位のため）。
- バージョンを上げた場合、`DATASET_META.version`を更新すれば`server.json`側は上記テストが不一致を検知するため、**手動でserver.jsonも同時に更新することを忘れないためのゲート**として機能する。

## 👤へのアクションアイテム（実行手順）

1. `mcp-publisher` CLIをインストールし、`mcp-publisher login github`でGitHub OAuth認証を行う（対話的ログインのため👤専用）。
2. `mcp-publisher publish`でリポジトリ直下の`server.json`をレジストリへ送信する。
3. 登録完了後、レジストリ掲載ページのURLを確認し、必要であれば`/developers`ページ等からリンクを貼る（任意）。
