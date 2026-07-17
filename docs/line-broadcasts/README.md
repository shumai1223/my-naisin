# LINE/メール配信への紹介導線ブロック（W-7・2026-07-17）

[[fable5-fullaccel-backlog-2026-07]] W-7。T-1紹介・解放機構（`src/components/UnlockGate.tsx`）は結果画面には
既に実装済みだが、配信（LINE/メール）の本文自体には紹介の呼びかけが入っていなかった。ここでは配信文の
末尾に付け足せる標準ブロックを用意する。**このブロックの実際の付与・配信送信自体は👤が判断・実行する**
（このドキュメントとコードは「使えるものを用意する」だけで、無人ループが配信を実行することはない）。

## 使い方

`src/lib/broadcast-templates.ts` に以下を追加済み：

- `REFERRAL_BLOCK`（student/parent別の紹介導線ブロック文言）
- `withReferralBlock(message, audience)` — 既存の `AudienceMessage` の本文末尾にブロックを付け足した新しいメッセージを返す純関数
- `isReferralBlockPeakMonth(month)` — その月が名簿velocityのピーク月（8/11/12/2月・`MONTHLY_CALENDAR`の`priority==='peak'`と同一基準）かどうかの判定

配信スクリプト（`scripts/newsletter.ts`）側で月次配信を組み立てる際、ピーク月であれば
`withReferralBlock(getMonthlyMessage(month, audience), audience)` のように包んで使うことを想定している
（今回のタスクではスクリプト側の自動適用までは行っていない。実際にどの配信に付けるかは配信の都度、
👤が判断する運用を優先した＝配信文面を勝手に変えるリスクを避けるため）。

## 文言の設計方針

- 断定的な特典内容・期限は書かない（UnlockGateの解放条件をそのまま言い換えるだけ）
- 「送る」か「LINE登録」のどちらでも解放される、という既存UIの事実と一致させる
- ¥表記・PII（本名・学校名等）は含めない

## 効果測定

紹介導線ブロックの効果は、`scripts/weekly-kpi-report.ts`の「新規ファネルイベント」セクション
（`unlock_teaser_view`/`unlock_granted`・解放率）で既に計測可能（V-6で実装済み）。配信にブロックを
付けた週とそうでない週で`unlock_granted`の増減を比較すれば、配信起点の解放がどれだけ増えたか分かる。
