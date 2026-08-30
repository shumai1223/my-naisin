# Google Trends MCP（運用メモ）

`scripts/trends-mcp.mjs` — Google Trends を MCP で使えるようにしたサーバー。ga4 / gsc / gmail と
同じ「node 直起動 + プロジェクトの `.mcp.json`」構成。**認証は不要**（Trends は公開データ）。

## 使い方（Claude 側）

`.mcp.json` に `trends` を登録済み。Claude Code を再起動するか `/mcp` で接続すると 8 ツールが生える。

| ツール | 用途 |
| --- | --- |
| `trends_interest_over_time` | 時系列（0-100の相対指数）。複数キーワードを渡すと**同一スケールでの比較**になる＝市場規模の比率が読める |
| `trends_interest_by_region` | 地域別。`geo:"JP"` + `resolution:"REGION"` で47都道府県 |
| `trends_related_queries` | 関連クエリ top / rising。`rising` の `Breakout` は +5000%超 |
| `trends_related_topics` | ⚠️ 後述（現在Google側が空を返す） |
| `trends_seasonality` | 過去5年の週次から月別平均・ピーク月・季節係数を計算 |
| `trends_trending_now` | 急上昇（Trending now RSS） |
| `trends_suggestions` | トピック候補（同名異義の切り分け） |
| `trends_health` | 疎通・cookie・キャッシュ・リトライ統計の診断 |

## 使い方（CLI・MCPを介さない切り分け用）

```
npm run trends -- health                          # まずこれ。probe込みで疎通確認
npm run trends -- iot 内申点 偏差値 --timeframe "today 12-m"
npm run trends -- region 内申点 --resolution REGION
npm run trends -- related 内申点
npm run trends -- season 内申点                    # 月別平均・ピーク月
npm run trends -- trending --geo JP --limit 20
npm run trends -- clear-cache                     # 形式変更で壊れたときの復旧
npm run test:trends                               # 純関数の単体テスト（node:test・ネットワーク不使用）
```

`--fresh` でキャッシュを無視して取り直す。

## 安定させるためにやっていること

Trends には無料で使える公式APIが無い（2025年発表の公式Trends APIはalpha・要申請）。npm の非公式
ラッパは軒並みメンテが止まっているので、`scripts/lib/trends-client.mjs` で自前実装している。
壊れやすい部分は全部この層に閉じ込めてある。

1. **直列キュー + 最小間隔**（既定1.5秒） — Trends は並列アクセスに極端に弱く即429になる。
   全リクエストを1本の鎖に並べる。実測: 4本同時呼び出し（=8リクエスト）で retry 0 / 429 0。
2. **cookie自動管理** — NIDクッキーが無いと403/429が激増する。`.trends/cookie.json` に保存し、
   期限切れ・429時に自動で取り直す。
3. **指数バックオフ + ジッタ** — 429/5xx/断線は最大4回まで再試行。429のときは cookie を捨ててから。
4. **stale-if-error キャッシュ**（既定6時間） — 取得に失敗しても古い値があれば `_cache:"stale"` と
   `_error` を付けて返す。**Google側が不調でもツールが無応答にならない**＝体感の安定性の本体。
5. **タイムアウト20秒** — AbortSignal で必ず打ち切る。MCPクライアントを待たせない。
6. **会社ネットのTLS傍受対策** — `node --use-system-ca`（他のMCPと同じ）。
7. **stdout汚染ゼロ** — ログは全て stderr。stdio MCP の鉄則。

レスポンスには必ず `_cache`（`hit` / `miss` / `stale`）が付く。**`stale` が出たら値が古い**ので、
判断に使う前に `_ageMinutes` を見ること。

### 調整つまみ（環境変数）

`TRENDS_GEO`(既定JP) / `TRENDS_HL`(ja) / `TRENDS_TZ`(-540) / `TRENDS_MIN_INTERVAL_MS`(1500) /
`TRENDS_TIMEOUT_MS`(20000) / `TRENDS_MAX_RETRIES`(4) / `TRENDS_CACHE_TTL_MIN`(360) /
`TRENDS_COOKIE_TTL_MIN`(240) / `TRENDS_DIR`。

429が出るようになったら `TRENDS_MIN_INTERVAL_MS` を上げる（3000など）のが第一手。

## 既知の制限

- **`trends_related_topics` は現在使えない**（2026-08-30実測）。Google が RELATED_TOPICS ウィジェットに
  対して常に `{"default":{"rankedList":[]}}` を返す。素のキーワード・mid指定・英語語のいずれでも再現。
  「このキーワードに関連トピックが無い」と誤読しないよう `available:false` + `note` を付けて返し、
  空結果はキャッシュしない（復旧したら自動的に `available:true` に戻る）。関連語は
  `trends_related_queries` を使う。
- **値は相対指数（0-100）で、検索ボリュームの実数ではない**。同一リクエスト内でのみ比較可能。
  別々に取った2つの結果の数値を突き合わせても意味がない（比較したいなら1回の呼び出しに並べる）。
- 直近の週は `isPartial: true`（集計途中）。平均計算からは自動で除外している。
- 非公式エンドポイントなので、Googleの仕様変更で壊れうる。壊れたときは
  `npm run trends -- health` → `clear-cache` → `scripts/lib/trends-client.mjs` のレスポンス整形を見る。

## 実測メモ（2026-08-30 初日）

- `内申点` vs `偏差値`（JP・today 12-m）: 平均 1.5 vs 78.7。偏差値クラスタが桁違いに大きいという
  既存の理解（[[google-trends-2026-06]]）と整合。
- `内申点` の県別（today 12-m）: 静岡100 / 愛知96 / 三重77 / 神奈川75 / 兵庫61。
- `内申点` の季節性（5年・月別平均）: ピーク11月(62.1)、次点2月(61.6)、底5月(27.5)、季節係数2.26。
