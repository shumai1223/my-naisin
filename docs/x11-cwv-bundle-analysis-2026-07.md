# X-11: Core Web Vitals本格改善 Phase1 — バンドル内訳の実地調査（2026-07-23）

[[fable5-fullaccel-backlog-2026-07]] TIER X - X-11。W-18②で「単一犯人不在のため無人loop向けでない」と
見送られた案件の再調査。webpack-bundle-analyzerは未導入のため、`.next/static/chunks/`配下の実ファイル
サイズ＋文字列grepによる手動特定で代替した（後述の環境的制約により正式なbundle analyzer導入は次フェーズ）。

## 環境メモ: ローカルbuildの新しい知見

[[fable5-loop-protocol]]には「Windows環境では`npm run build`が実行不可（`NODE_OPTIONS=...`がcmd.exe経由で
解釈できず失敗）」と記録されているが、**`npx next build`をBashツールから直接呼び出す（`npm run build`を
経由しない）とcompileフェーズ自体は成功することを確認した**（1回目: compile 2.0分、2回目: compile 64秒）。
ただし、2回のうち両方とも静的ページ生成の途中（406/542ページ、および型チェック直後）で外部要因により
プロセスが強制終了（killed/exit143）した。**ScheduleWakeupでターン境界をまたぐbackground bashコマンドは
この環境で安定して生き残らない可能性がある**（1回目はcompleted通知が届いたが実際には打ち切られていた／
2回目はkilled通知）。フルの`next build`完走（542ページ全生成）はこの環境では現時点で未達成。ただし
compileフェーズで`.next/static/chunks/`にJSチャンクは書き出されるため、バンドルサイズの調査自体は
この部分的な成果物で十分に遂行できた。

## 実測: 主要チャンクの内訳

`.next/static/chunks/`をサイズ降順でソートし、上位チャンクの中身をgrepで特定した。

| チャンク | サイズ | 中身 | 対象ページ数(app-build-manifest調べ) |
|---|---|---|---|
| `ad2866b8...js` | 198KB | **html2canvas**（グレード共有カード画像生成用） | **0ページ**（`await import('html2canvas')`で動的import済み・良好） |
| `framework-...js` | 190KB | Next.js/Reactフレームワーク本体 | 全ページ共通（フレームワーク非依存化は不可） |
| `4bd1b696-...js` | 173KB | react-dom | 全ページ共通（削減不可） |
| `1255-...js` | 173KB | **Next.js App Router クライアントランタイム**（PrefetchKind/flightRouterState等） | 全ページ共通（App Router採用に伴う不可避コスト） |
| `176-...js` | 127KB | **`src/lib/prefectures.ts`の`PREFECTURES`配列全体**（47都道府県分のdescription/sourceUrl/variants/reverseCalc設定を含む生データ） | **`/`（ホーム）と`/ask`の2ページのみ** |
| `main-...js` | 122KB | Next.jsメインランタイム | 全ページ共通（削減不可） |
| `polyfills-...js` | 113KB | ブラウザpolyfill | 全ページ共通（対象ブラウザを絞らない限り削減不可） |
| `778-...js` | 111KB | **framer-motion**（`this.projectionDelta`/`this.layoutBox`等のlayout projection engine特有の内部プロパティ名で識別） | **`/`（ホーム）のみ** |

## 発見①: html2canvas（198KB）は既に最適化済み・対応不要

`ShareModal.tsx`のコードコメント自体に「html2canvas は約150KB+」と明記された上で、クリックハンドラ内で
`await import('html2canvas')`と動的importされている。app-build-manifestで対象0ページ（＝初期バンドルには
一切含まれず、実際にモーダルを開いた時だけ読み込まれる）と実測確認できた。**追加対応不要**。

## 発見②: `PREFECTURES`全件（127KB）はホーム/ask限定だが「無駄」ではなく「設計上の制約」

ホームページの`HomeClient.tsx`（'use client'）は47都道府県対応の計算機本体として
`getPrefectureByCode`/`resolvePrefectureConfig`等を正当な理由で使用しており、これ自体がホームページの
中核機能そのもの。`HomeLearnSection.tsx`も同じく`PREFECTURES`全体をimportしているが、実際に使っているのは
`pref.name`の1フィールドのみ（91行目）——ただし`HomeClient.tsx`が既に同一モジュールをimport済みのため、
バンドラーの重複排除により**HomeLearnSection側の修正だけでは転送バイト数は減らない**（同一チャンクを
2箇所が参照しているだけで、チャンク自体は1つ）。

**真に効果のある改善レバー**（未実装・次フェーズ提案）: ホームの計算機が47都道府県**全部**の
`gradeMultipliers`/`reverseCalc`設定等を初期バンドルに含めている設計そのものを見直し、**選択された
都道府県の設定だけを動的に読み込む**（例: 都道府県選択時に`import(`@/lib/prefectures/data/${code}`)`する、
または軽量なAPI route経由で取得する）方式に変えれば、実際に使うのはユーザーごとに1〜2県分のみのため
127KBの大半を削減できる可能性がある。**ただし**これは計算機の中核データフローに触れる設計変更であり、
①このloop環境ではPlaywright/next build完走による実地検証ができない②誤ると全ツール面の黄金導線
（内申点計算そのもの）を壊すリスクがあるため、**無人loopでの実装は見送り、監督付きセッションでの
実装を推奨する**。

## 発見③: framer-motion（111KB）はホーム限定だが17ファイルに深く組み込み済み

grepで`this.latestValues`/`this.projectionDelta`/`this.layoutBox`等のlayout projection engine特有の
内部プロパティ名を検出し、framer-motionの内蔵コードと特定した。`grep -rl "framer-motion" src/`で
17ファイル（LiveScorePreview/PrefectureSelector/Result配下の各種カード群/Button/Switch等）がヒットし、
**アニメーション/インタラクションのデザインシステムに深く組み込まれている**ことを確認した。単一箇所の
置き換えでは済まず、UIの見た目・触感が変わるリスクを伴う大規模なリファクタリングになるため、
**今回は現状維持を推奨**。軽量な代替（CSS transitionやより小さいアニメーションライブラリ）への
置き換えは、実際にブラウザで触感を確認できる監督付きセッションでのみ検討すべき。

## 結論・次フェーズへの申し送り

- W-18②の「単一犯人不在」という結論は本調査でも概ね妥当と再確認したが、**唯一の具体的で測定可能な
  改善レバーとして「ホームの計算機が47都道府県全件のconfigを初期バンドルに含めている」点**を新たに
  特定できた（127KBの大半が対象）
- html2canvasは対応不要（既に最適）、framer-motionは17ファイルに深く組み込まれており低リスクな
  単発修正では削減不可
- 次フェーズ候補: ①都道府県別configの遅延読み込み化（監督付きセッション推奨・黄金導線を壊すリスクの
  ため） ②webpack-bundle-analyzerの正式導入（`next build`が完走できる環境＝CI(ubuntu-latest)側で
  実行し、レポートをartifactとして保存する運用の検討）
- 環境の罠として`npx next build`直接呼び出しでcompileフェーズ自体は動く（`npm run build`のcmd.exe
  問題を回避）ことを新たに確認したが、静的ページ生成の完走はこのloop環境では未達成（原因未特定、
  ターン境界をまたぐbackground処理の不安定さの可能性）。この知見は[[fable5-loop-protocol]]に追記する。
