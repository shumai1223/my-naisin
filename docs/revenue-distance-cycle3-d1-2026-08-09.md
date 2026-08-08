# 掛-5 収益距離 第3周（D1実クリック率調査）— 2026-08-09

第2周の結論（構造的な収益距離レバーはほぼ使い切った・残る問題はCTAが実際にクリックされているか）
を受けて、GA4に頼らずD1一次記録で実クリック率を確認した。

## 調査手順と発見

### 1. `parent_funnel_events`テーブルは全期間で0件

本番D1（`my-naishin-leads`）を`wrangler d1 execute --remote`で直接クエリ（読み取り専用）した結果、
Σ-3が`share_to_parent`/`parent_landing_view`の一次記録用にこのテーブルを稼働開始した
2026-08-02から本日2026-08-09まで、**7日間で1件もイベントが記録されていなかった**
(`SELECT COUNT(*) FROM parent_funnel_events` → `0`)。

### 2. 一見「計測パイプが壊れている」ように見えたが、curlのUser-Agentがbot-filterに引っかかっていただけだった

本番の`/api/parent-funnel`へ診断用のPOSTを送ったところHTTP 204（成功）が返ったにもかかわらず、
D1に行が増えなかった。直接SQLでの`INSERT`は成功したため、テーブル自体は健全と確認できた。

原因を`src/lib/bot-filter.ts`の`isBotUserAgent()`で特定: `BOT_UA_RE`に`curl`が明示的に含まれており、
curlのデフォルトUser-Agent（`curl/x.y.z`）がbot判定され、APIルートが`persistParentFunnelEvent`を
呼ぶ前に204で早期returnしていた（＝計測を汚さないための正しい設計・バグではない）。

実ブラウザのUser-Agent文字列を付けて再送したところ、D1へ正常に書き込まれることを確認した
（診断用の行は確認後すぐに`DELETE`で削除済み・本番データへの汚染なし）。

**結論: D1計測パイプライン自体は正常に動作している。**

### 3. `ParentShareInvite`のコード自体にも隠れたゲートは無い

`UnlockGate`は2026-08-01の設計変更で「ロック機構を撤去」済み（`children`は常に表示・共有UIは
純粋な「お誘い」として下に配置されるのみ）で、`ParentShareInvite`自体にも早期returnや
フラグによる非表示条件は存在しない。hensachi（UnlockGate経由）・hyotei-heikin（HyoteiResultFlow経由）
共に、計算結果を表示した全ユーザーに無条件でこの導線が表示される設計になっている。

### 4. したがって「0件」は計測バグではなく実際の利用実績

GA4ベースの旧診断（`share_to_parent`は`result_view`の0.99%）よりもさらに低い、**実質ゼロに近い
利用率**であることが、GA4に依存しない第一者データで裏付けられた。これはΣの根本診断
（「保護者への橋渡しが唯一のボトルネック」）を強化する証拠であり、悪化はしていない
（母数自体が小さいため統計的に「0件」は7日間では起こりうる範囲だが、真の比率がGA4推定の
0.99%よりもさらに低い可能性を示唆する）。

### 5. その他の実クリック内訳（28日・D1直接集計）

- `clicks`テーブル（既存のアフィリ/CTAクリック全般）: 合計約356クリック。上位placement =
  `prefecture`(114)・`naishin-up`(106)・`(null)`(66)・`parent-lp`(20)・以下少数多数。
- `school_page_clicks`（Λ-2学校ページのCTA）: 合計4クリック（reverse 3・juku-shindan 1・line 0）。
  Λ-2はまだ20/47県のみindex解禁中のため、母数が小さいことと整合する。

## 実施した改善（低リスク・既存導線の計測精度向上のみ）

「保護者向けLINEに登録する」ボタンは従来GA4の`track(EVENTS.LINE_FRIEND_CLICK)`のみで、
D1一次記録が無かった（`share_to_parent`と非対称だった）。掛-5の「新しいCTAを作らない・
既存導線の計測精度を上げる」という第3周の方針に沿って、`line_registration_click`という
新しいイベント種別をD1にも追加した:

- `src/lib/parent-funnel-db.ts`: `ParentFunnelEvent`型に`line_registration_click`を追加
- `src/app/api/parent-funnel/route.ts`: `VALID_EVENTS`に追加
- `src/components/ParentShareInvite.tsx`: `onLineClick`で`beaconParentFunnelEvent`も呼ぶ

これにより次回サイクルでは「共有」だけでなく「LINE登録導線」の実クリック率もGA4非依存で
追えるようになる。

## 次回サイクルへの申し送り

1. 今回追加した`line_registration_click`が数日〜1週間分たまった時点で、`share_to_parent`と
   合わせて実クリック率を再確認する。
2. 「実質ゼロ」という結果を受けて、掛-5の禁止事項（新規CTAを作らない）の範囲内でできる改善は
   **視認性・文言のA/B**（Σ-4で`share-message-frame-2026`実験は既に用意されているが判定は11月）
   に限られる。判定を急がず、母数が貯まるまで待つのが妥当（[[fable5-fullaccel-backlog-2026-07]]の
   「A/Bの判定を夏にしない」原則）。
3. `clicks`テーブルの`prefecture`/`naishin-up`placementが何のCTAかを特定し、なぜこの2つだけ
   相対的に高いクリック数を得ているのかを分析すると、他の低クリックCTAへの示唆が得られる可能性がある。
