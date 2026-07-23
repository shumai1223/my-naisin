# 内申点・総合得点 計算ロジック検証ガイド（2026年度）

My Naishin（https://my-naishin.com）が使用する内申点・総合得点の計算式を、コード実装と各都道府県
教育委員会の一次ソースとの対応関係を明示する形でまとめた技術文書です。「この計算、本当に正しいの？」
という監査・デューデリジェンスの問いに、実装コードの該当箇所と一次ソースURLを直接示すことで応えます。

[[fable5-fullaccel-backlog-2026-07]] TIER X - X-22 Phase1。個人情報を含まない純粋な計算式部分のみを
対象とします。

## アーキテクチャ

計算ロジックは2階層に分かれています。

### 第1層: 汎用エンジン（`src/lib/total-score/engine.ts`）

「内申・学力をそれぞれ換算満点へ線形換算し、選んだ比率オプションのもとで合算する」という単一モデルで
表現できる県は、共通のエンジン関数（`computeTotalScore` / `computeReportRaw`）で処理します。固定比率
（1つの比率オプションのみ）の県も、選択比率式（高校ごとに複数の比率から選ぶ）の県も、比率オプションの
違いだけで同じコードパスを通ります。

このエンジンで処理されているのは以下の5県です（`src/lib/total-score/registry.ts`の
`TOTAL_SCORE_SYSTEMS`に登録されたallowlist）。

| 県 | 方式 | 内申満点 | 学力満点 | ソース |
|---|---|---|---|---|
| 兵庫県 | 固定1:1（判定資料A:C） | 250点（中3のみ・実技×7.5） | 250点 | [要綱](https://www2.hyogo-c.ed.jp/hpe/koko/nyuushi/senbatsuyoukou_r8/) |
| 京都府（中期選抜） | 固定ほぼ1:1 | 195点（中1〜3・実技×2） | 200点 | [要項](https://www.kyoto-be.ne.jp/koukyou/cms/?p=7836) |
| 栃木県 | 選択比率9:1〜5:5 | 135点→比率換算 | 500点→比率換算 | [お知らせ](https://www.pref.tochigi.lg.jp/m04/r08/r08_kennritukoutougakkounyuugakushasennbatunikannsuruosirase.html) |
| 新潟県 | 選択比率7:3〜3:7 | 135点→1000点換算 | 500点→1000点換算 | [要項PDF](https://www.pref.niigata.lg.jp/uploaded/attachment/472931.pdf) |
| 鳥取県 | 高校別倍率α=2〜4 | 65点×α（130〜260点） | 250点 | [鳥取県教委](https://www.pref.tottori.lg.jp/) |

各県の詳細な計算ステップ・出典の確認日は `src/lib/total-score/registry.ts` 内の該当オブジェクト
（`computeSteps` / `source` フィールド）に、条文の該当箇所まで含めて記述されています。

### 第2層: 個別実装（県固有ファイル）

一部の県は、選択比率モデルでは表現できない固有の構造（型選択制・段階的圧縮変換・複合加点等）を持つため、
専用ファイルで個別に実装しています。

| 県 | ファイル | 固有の構造 |
|---|---|---|
| 東京都 | `src/lib/total-score/tokyo.ts` | 内申300点＋学力700点＋ESAT-J20点＝1020点満点の複合設計 |
| 神奈川県 | `src/lib/total-score/kanagawa.ts` | S値・A値を6段階比率パターンから選択し1000点に変換 |
| 大阪府 | `src/lib/total-score/osaka.ts` | タイプⅠ〜Ⅴの5段階選択制（内申倍率0.6〜1.4） |
| 愛知県 | `src/lib/total-score/aichi.ts` | 評価方法Ⅰ〜Ⅴの5段階選択制 |
| 千葉県 | `src/lib/total-score/chiba.ts` | K値（0.5〜2の連続係数） |
| 埼玉県 | `src/lib/total-score/saitama.ts` | 学年比率が高校ごとに複数パターン＋相関表方式 |
| 福岡県 | `src/lib/total-score/fukuoka.ts` | A群・B群による2段階選抜 |
| 北海道 | `src/lib/total-score/hokkaido.ts` | 内申点を20点刻みでA〜M13段階の「内申ランク」に変換 |

### 未検証県（第2層に未登録）

上記13県（第1層5県＋第2層8県）以外の都道府県は `TOTAL_SCORE_SYSTEMS` に未登録のため、
`/[prefecture]/total-score` の総合得点計算機は404を返します（未検証データを断定的に見せない
「信頼の堀」設計）。ただし、内申点単体の計算（学年別倍率・実技倍率等、`src/lib/prefectures.ts`）は
全47都道府県で提供しています。

## 検証可能性を担保するテスト群

- `src/lib/total-score/__tests__/*.test.ts`（県別）: 各県の計算式が既知の入力に対して期待通りの
  出力を返すことを検証。
- `src/lib/total-score/__tests__/uniqueness.test.ts`: 47都道府県のコンテンツ・計算式が使い回し
  （テンプレートの機械的な複製）になっていないことを検証（scaled-content検出）。
- `src/lib/total-score/__tests__/prefecture-consistency.test.ts`: `prefectures.ts`（内申点単体）と
  `total-score/registry.ts`（総合得点）の間でデータの矛盾がないことを検証。

すべてのテストはリポジトリ内で公開されており、`npx jest src/lib/total-score` で第三者が再現・検証
できます。

## 出典の一次性について

各県の `source.url` は都道府県教育委員会が公式に公表する入学者選抜実施要項・要綱のURLです
（`src/lib/prefectures.ts` の `sourceUrl` / `sourceTitle` / `lastVerified` フィールドに全47県分を
記録）。二次情報（学習塾・報道機関の解説記事等）のみで確認済みの県は、確定するまで総合得点計算機
（第1層・第2層）には掲載しません。

## フィードバック・指摘

計算式・出典の誤りを発見された場合は、[お問い合わせ](https://my-naishin.com/contact)よりご連絡
ください。教育委員会の制度改定に伴う更新は `lastVerified` / `lastChecked` の日付を確認のうえ、
最新の公式要項と照合してください。
