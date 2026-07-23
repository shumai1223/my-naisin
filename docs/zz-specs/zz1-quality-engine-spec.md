# ZZ-1 データ品質エンジン 設計仕様書（Fable 5設計・2026-07-23）

ZZ-1a〜1e実装時の**準拠必須**仕様。この基盤の上に載る統計は将来「研究者・媒体が引用する一次データ」（Ω-1）になるため、**品質設計＝資産価値そのもの**。逸脱したい場合はloop-question-noteへ。

## 0. 核心原則

1. **PIIゼロ設計**: 学校名・氏名・自由記述フィールドは**スキーマに存在させない**（入る場所がなければ漏れようがない）。
2. **削除より隔離**: スパム疑いデータはquarantineフラグで除外し、**生データは消さない**。方法論ページに除外件数を公表する（「都合の悪いデータを消せる構造」に見えた瞬間、引用価値が死ぬ）。
3. **閾値・ゲートは単一モジュール**: `src/lib/stats-gates.ts` に全定数を集約し、APIとUIの両方が同じものをimportする。

## 1. スキーマ（migration 0004・本番適用は👤監督）

```sql
CREATE TABLE stat_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  pref_code TEXT NOT NULL,          -- 47県コード（実在チェックはAPI層）
  grade INTEGER NOT NULL,           -- 1|2|3
  scores TEXT NOT NULL,             -- JSON: {"kokugo":5,...} 9教科×1-5固定キー
  total INTEGER NOT NULL,           -- 9教科合計(9-45)・API側で再計算して整合検証
  source TEXT NOT NULL,             -- 投稿元ツール面（'naishin'|'hensachi'|...）
  fp_hash TEXT NOT NULL,            -- クライアントfingerprint(localStorage UUID)のSHA-256
  ip_bucket TEXT NOT NULL,          -- HMAC(secret, ip)先頭12桁。生IPは保存しない
  quarantined INTEGER NOT NULL DEFAULT 0,  -- 1=集計除外(監査で付与・削除はしない)
  quarantine_reason TEXT            -- 'burst'|'dup'|'audit-YYYY-MM-DD' 等
);
CREATE INDEX idx_stat_sub_pref ON stat_submissions(pref_code, quarantined);
CREATE INDEX idx_stat_sub_fp ON stat_submissions(fp_hash, created_at);
```

自由記述カラムを**追加してはならない**。志望校名カラムも**作らない**（Ω-2はn充足後の別設計・別レビュー）。

## 2. API受付時バリデーション（決定論・即時reject）

- pref_code実在（prefectures.tsの47コード）・grade∈{1,2,3}・scoresは9キー完全一致かつ各値integer 1..5・totalはサーバ側で再計算し一致必須。
- **重複排除**: `fp_hash+pref+grade+scoresダイジェスト` が30日以内に存在→200を返すが保存しない（silent dedup。攻撃者に判定ロジックを教えない）。
- **レート制限**: 同一fp_hash 3件/日・同一ip_bucket 10件/日（兄弟・再計算を許容しつつバーストを切る）。超過も**silent**（200返却・非保存）。
- 不正値は400。エラーメッセージに内部判定基準を書かない。

## 3. 統計異常検知（ZZ-1e・週次バッチ・インライン処理にしない）

- **バースト検知**: 時間帯別投稿数を過去4週間の同時間帯ベースラインと比較、z>4で当該時間帯のip_bucket上位をquarantine候補としてworklogに報告（自動quarantineは同一ip_bucketが当該時間帯の50%超を占める場合のみ・他は👤判断待ちリスト）。
- **分布ドリフト検知**: 県別のtotal分布を全期間累積分布とカイ二乗比較（ビンは9-45を5点幅）。p<0.01の急変を検知したら**報告のみ**（自動処理しない——本物の制度変更・季節要因の可能性があるため）。
- **オール5/オール1率の監視**: 実在する層なので除外しない。監視のみ（日次シェアが過去p95超で報告）。
- Benford法則は**使わない**（1-5有界スケールには不適用。誤った統計手法の採用は引用価値を毀損する）。

## 4. n閾値ゲートと表示仕様（ZZ-1b/1d）

`stats-gates.ts` 定数（初期値・変更はテスト差分で可視化）:

- `N_MIN_PUBLISH = 30` … 県別分布の公開最低n。未満は「集計中（現在n=◯件）」表示。
- `N_MIN_BAND = 30`〜`N_MIN_EXACT = 100` … n=30-99は**5分位バンド表示のみ**（「上位25%帯」）。n≥100で正確なパーセンタイル表示を解禁。離散45点スケールは同点が大量に出るため**midpoint rank法**（=(下位数+同点数/2)/n）を使う。
- 表示には**常にnを併記**（「n=142件の匿名投稿に基づく推定」）。これは誠実さであると同時に、nの成長自体がコンテンツ更新になるSEO資産。
- **不変条件テスト（最重要）**: 「n<閾値の県の分布データがAPIレスポンスに含まれる経路が存在しない」ことをテストで証明する。ゲートは**サーバ側**（API層）に置く——UI側ゲートは信頼境界にならない。

## 5. 投稿UX原則（ZZ-1b/1c）

- 計算完了→結果表示→「この結果を匿名で全国統計に追加して、県内での位置を見る」1タップ（**明示オプトイン**。デフォルトONにしない・計算だけの利用を一切妨げない）。
- 投稿の見返り=県内分布グラフ+パーセンタイル帯の即時表示。n不足県は「あなたの県はn=◯件。あと◯件で県別統計が解禁」と正直に表示（それ自体が投稿CTA）。
- track計装: `stat_submit`（投稿）・`percentile_view`（結果閲覧）を追加。既存のtrack.ts流儀に従う。

## 6. 方法論ページ（ZZ-1d・引用価値の生命線）

/stats配下に常設: 収集方法・オプトインである旨・n閾値・quarantine件数（総数のみ）・既知の限界（自己申告バイアス・利用者層の偏り＝「本サイト利用者はn世代の全数調査ではない」）・ライセンス（集計値の引用条件）。**限界を書くほど引用される**（X-29朝森氏の方法論的誠実さの実例に倣う）。

## 7. デプロイ後の👤レッドチーム（[[owner-redteam-verification]]準拠）

実装完了≠完了。デプロイ後に👤へ実弾テストレシピを渡すまで未完了扱い: ①curlで範囲外値/10教科/偽県コード投稿→400 ②同一データ2連投→2回目がstatsに反映されない ③4件/日連投→4件目が反映されない ④n=29の県でAPIレスポンスに分布が含まれない、の4本。

## 8. DoDチェックリスト

- [ ] migration 0004ファイル+ローカル検証（`wr`関数経由）※本番適用は👤監督セッション
- [ ] API+品質エンジンのjest（`@jest-environment node`）全green・不変条件テスト含む
- [ ] 全計算面へのonResultフック接続・track 2イベント追加
- [ ] /stats v2+方法論ページ・page-registry登録・rich-results監査green
- [ ] 週次監査スクリプト（scripts/）+初回実行worklog記録
- [ ] 👤レッドチームレシピをdocs/に設置
