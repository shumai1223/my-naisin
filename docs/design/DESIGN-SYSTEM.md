# My Naishin デザインシステム「やさしい学習帳」(B案)

2026-10-15 決定（👤が B 案を選択）。**このファイルが UI 改修の唯一の正本。** 迷ったらここへ戻る。
目的: 保護者と中学生が「公的資料をもとに誠実に作られたサイト」だと一目で感じる見た目にする。AIが量産した見た目（グラデーション・絵文字・色違いのカード・光る影・誇張コピー）を無くす。

## 1. 基本方針（5つ）

1. **静かに、読みやすく。** 装飾で目を引かない。文字・罫線・余白で構成する。
2. **色は1色（深緑）＋意味の色だけ。** ブランド色は深緑。注意=琥珀、危険=赤。それ以外の色相（紫・桃・橙・黄・青緑・水色）は使わない。
3. **平らに。** グラデーション・影・ぼかし・光・浮き上がりは使わない。区切りは 1px の罫線。
4. **出典と更新日を前に出す。** データのあるページは、冒頭に「年度・出典・最終確認」を置く。訂正の窓口を見える場所に置く。
5. **誇張しない。** 「爆速」「神」「今、最も検索されている」のような証拠のない強調、感嘆符の連発、ゲーム的な演出は使わない。

## 2. トークン

Tailwind の設定（`tailwind.config.ts`）で定義済み。**クラス名はこの意味で使う。**

### 色
| 用途 | クラス | 値 |
|---|---|---|
| ページ背景 | `bg-paper` / `bg-slate-50` | #f4f7f5 |
| 面（カード） | `bg-white` | #ffffff |
| 本文の文字 | `text-slate-900` (= ink) | #17231d |
| 補助の文字 | `text-slate-600` | #4f6158 |
| 罫線 | `border-slate-200` | #cddad3 |
| 強い罫線・表の見出し線 | `border-slate-900` | #17231d |
| ブランド（リンク・主ボタン・強調） | `brand-700` / `text-brand-700` / `bg-brand-700` | #17543e |
| ブランドの濃い色（hover） | `brand-800` | #123f2f |
| ブランドの薄い面（注釈・選択） | `bg-brand-50` / `bg-brand-100` | #f0f6f3 / #e0ece6 |
| 注意 | `bg-amber-50 text-amber-900 border-amber-200` | 琥珀 |
| 危険・エラー | `bg-red-50 text-red-800 border-red-200` | 赤 |

**使ってはいけない色相**: purple・violet・fuchsia・pink・rose・orange・yellow・teal・cyan・sky・lime。
`blue`・`indigo`・`emerald`・`green` は設定で全てブランド色（深緑）の階調に置き換わる。新しく書くときは `brand-*` を使う。
灰色（slate・gray・zinc・neutral・stone）は全て同じ緑みの灰に置き換わる。新しく書くときは `slate-*`。

### 書体
- 本文・見出し: BIZ UDPゴシック（`font-sans`）。太さは 400 と 700 のみ。**`font-medium` `font-semibold` `font-extrabold` `font-black` は使わない**（`font-bold` に）。
- 数字（点数・倍率・件数）: `tabular-nums`。
- 本文は 16px・行間 1.8。補助文字でも **12px 未満は禁止**（`text-[10px]` `text-[11px]` 禁止。最小は `text-xs`＝12px）。

| 要素 | クラスの目安 |
|---|---|
| h1 | `text-2xl md:text-[28px] font-bold leading-snug` |
| h2 | `text-xl font-bold` ＋ 上に余白 `mt-10`（下罫線は付けてよい） |
| h3 | `text-[17px] font-bold` |
| 本文 | `text-base leading-[1.8] text-slate-900` |
| 補助・注記 | `text-sm text-slate-600` |
| 最小 | `text-xs text-slate-600` |

大文字＋字間の小ラベル（`uppercase tracking-wider text-[10px]` 型）は使わない。ラベルは普通の文字で。

### 形・影・動き
- 角丸: `rounded`（6px）= 入力・ボタン・タグ。`rounded-lg`（8px）= カード・表の外枠。**`rounded-xl` `rounded-2xl` `rounded-3xl` は使わない**（設定上は全て 8px に丸めてあるが、新規に書かない）。`rounded-full` は点・アバター・スイッチ・進捗バーだけ。**文字入りの丸薬（ピル）形は使わない**（タグは `rounded` の四角）。
- 影: 使わない。区切りは `border border-slate-200`。モーダル・ドロップダウン・固定バーだけ `shadow-overlay`。
- グラデーション・ぼかし・光・点滅・浮遊・拡大縮小の演出: **使わない**。許可する動き: スピナー（`animate-spin`）、50〜150msの色の変化、`prefers-reduced-motion` を守ったフェードイン。
- 余白: 8の倍数を基本（`p-4` `p-6` `gap-4` `gap-6`）。セクション間 `mt-10`〜`mt-14`。

## 3. 部品の型

### ページの頭（ヒーロー・バナーは作らない）
```
パンくず（text-sm text-slate-600）
h1
メタ行（text-sm text-slate-600）: 令和○年度入試 ／ 出典：○○ ／ 最終確認 ○年○月
結論の1段落（text-base leading-[1.8]）: 太字で答え → 補足
```
データ系ページはメタ行に出典名とリンクを必ず含める（既存の出典情報があるものを移す。新しい数字は作らない）。

### カード（面）
`rounded-lg border border-slate-200 bg-white p-5`（影なし・hover で浮かせない）。
カードの中にカードを入れない。カードを並べるときは同じ見た目（色違いにしない）。

### 数値の並び（統計ブロック）
色つきの箱を並べない。`dl` を使い、罫線で区切る:
`grid grid-cols-3 border-y border-slate-200 divide-x divide-slate-200` ／ 項目名 `text-xs text-slate-600` ／ 値 `text-2xl font-bold tabular-nums`。

### 注釈（コールアウト）
`rounded-lg border border-slate-200 bg-brand-50 p-4` ＋ 先頭に太字のラベル（「ポイント」「注意」「出典」）。
注意は `bg-amber-50 border-amber-200`、危険は `bg-red-50 border-red-200`。**左に色の太線を付けない。**

### ボタン
- 主: `rounded bg-brand-700 px-5 py-3 text-base font-bold text-white hover:bg-brand-800`
- 副: `rounded border border-brand-700 bg-white px-5 py-3 font-bold text-brand-700 hover:bg-brand-50`
- 文字リンク: `text-brand-700 underline underline-offset-2 hover:text-brand-800`
- 最小の押す面は 44px 四方。

### タグ・バッジ
`inline-flex items-center rounded border border-slate-200 bg-white px-2 py-0.5 text-xs text-slate-700`。色違いにしない。意味が要るときだけ 注意/危険の色。

### 表
外枠 `rounded-lg border border-slate-200 bg-white`・見出し行 `border-b border-slate-900 text-xs text-slate-600`・行 `border-b border-slate-200`・数字は右揃え `tabular-nums`。スマホは外側を `overflow-x-auto`。

### 手順（ステップ）
本当に順序がある内容だけ番号を付ける。番号は文字（`1.` `2.`）か、枠線だけの四角（`border border-slate-300 rounded`）。グラデーションの丸は使わない。

### 入力
`rounded border border-slate-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-brand-700`。スライダーのつまみは単色。

### アイコン（Phosphor・regular）
- `@/components/icons` から読む（lucide-react は使わない）。サイズは `h-4 w-4`〜`h-5 w-5`、文字と同じ色（`currentColor`）。
- **色つきの箱・丸の中に入れない。** 見出しの横か文の頭に、単色で置く。意味が重複するアイコン（見出しと同じ意味）は置かない。
- 装飾は `aria-hidden`。

### 絵文字・記号
**使わない**（UIに出る文字列のすべて）。`✓` `⚠` `★` `☆` `✅` `❌` も不可。
- 状態は **文字＋Phosphorアイコン** で表す（「注意」＋`Warning`、「確認済み」＋`Check`）。
- 飾りの絵文字は削る。

### 広告枠
`AdUnit` / `AdSlot` は **動作を変えない**。枠の外側に小さな「広告」の見出し（`text-xs text-slate-500`）がある現状を保つ。ヘッダー内・計算ツールの入力部分の中には置かない。

## 4. 文章（コピー）のルール

- です・ます調。感嘆符「！」は原則使わない（注意喚起を除く）。
- 証拠のない最上級・順位・熱量の表現（「今、最も検索されている」「爆速」「神」「絶対」「完璧」）は **削る／事実の表現に直す**。直したら `contentChanges` に記録する。
- ゲーム的な演出（バッジ獲得・マイルストーン達成！・連続日数の称賛・紙吹雪）は、機能は残して **文言と見た目を静かにする**（例: 「3日連続で記録しています」）。機能そのものの削除はしない。
- 数値・出典・制度の説明文は **一字も変えない**（絵文字の除去を除く）。

## 5. 触ってはいけないもの

ロジック（hooks・state・handlers）、props の型、`href`、`id`、`name`、`aria-*` の意味、`data-*` 属性、計測（`track*`・`gtag`）、構造化データ（`*Schema`）、`metadata`、広告・Cookie同意・フォームの動作、API・データの import、ルート、feature flag。
**クラス名・JSXの構造・アイコン・絵文字・装飾用の要素だけを直す。**

## 6. 変換表（既存パターン → 新パターン）

| 既存 | 新 |
|---|---|
| `bg-gradient-to-* from-A via-B to-C` | `bg-A`（コードモッドで一括変換済み） |
| `rounded-2xl` `rounded-3xl` `rounded-xl` | `rounded-lg`（カード）/ `rounded`（入力・ボタン） |
| `shadow-md` `shadow-lg` `shadow-xl` `shadow-2xl` `shadow-glow` | 削除（罫線で区切る）。オーバーレイのみ `shadow-overlay` |
| `animate-pulse` `animate-bounce` `animate-ping` `float` `glow-pulse` | 削除 |
| `backdrop-blur-*` `glass-card` | 削除（白い面＋罫線） |
| `font-black` `font-extrabold` `font-semibold` `font-medium` | `font-bold`（強調）／指定なし（通常） |
| `text-[9px]` `text-[10px]` `text-[11px]` | `text-xs` |
| `uppercase tracking-wider text-[10px]` の小ラベル | 普通の文字・`text-xs text-slate-600` |
| 色つきの角丸の箱に入ったアイコン | 箱を外し、単色アイコンのみ（または削除） |
| 紫・桃・橙・黄・青緑・水色の面 | `bg-white border-slate-200`（強調が要る面だけ `bg-brand-50`） |
| 「🔥 急上昇」のような絵文字つきラベル | 絵文字を削除。誇張の語は事実の表現へ |
| ステップの丸（グラデーション） | 文字の番号 or 枠線の四角 |
| `lucide-react` の import | `@/components/icons`（名前は同じ） |

## 7. 確認

- `node scripts/ui/ui-lint.mjs <files>` が **error 0**（警告は理由を `notes` に書く）。
- `node scripts/ui/ui-guard.mjs <files>` の差分（文言・コンポーネント・リンク）が **意図したものだけ**。
- 390px 幅と 1280px 幅で、はみ出し・重なり・小さすぎる文字が無い。
- 色のコントラスト: 本文は 4.5:1 以上（`text-slate-600` までOK。`text-slate-400` 以下は本文に使わない）。

### 例外（設計担当の判断・2026-10-16・👤の確認待ち）
- **LINEボタン**（「LINEで受け取る」「友だち追加」など LINE へ誘導するボタン）だけは、LINE公式の緑 `#06C755` を使ってよい（ブランド認知のため）。ほかの用途には使わない。形は主ボタンと同じ（`rounded`・影なし・拡大縮小なし・押す面44px以上）。
- 矢印（← → ↔ ↑ ↓）と © ® ™ は絵文字ではない。そのまま使ってよい。
- 見出しの階層を保つために、共通部品（保護者CTAなど）の見出しレベルが固定のときは、`headingLevel` のようなプロップ（既定は今の値）を足して、呼び出し側が選べるようにしてよい。