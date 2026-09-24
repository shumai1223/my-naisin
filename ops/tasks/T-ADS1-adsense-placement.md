# T-ADS1 AdSense広告を「最も稼げる配置」で置く

**起票: 2026-09-24（👤指示「最も最適な配置で・最も稼ぎやすい配置で」）。T-AD1 完了後すぐ着手。締切 9/30。**
**前提: AdSense は 2026-09-24 に承認済み（pub-7817682248719138・`public/ads.txt` 一致済み）。**

---

## 0. 方針（なぜこの配置か）

- **稼ぐのは「見られている時間が長い画面」と「人数が多い画面」。** GSC 28日（8/24〜9/20）のクリック構成:
  `/hensachi`系 2,875（33%）／学校ページ 2,149（25%）／ブログ 908（11%・表示は全体の約4割）／
  県の計算機（total-score・naishin・s-value）約1,700／トップ 477／評定平均・換算系 約500
- **モバイルが72%。** モバイルで一番稼ぐのは「計算結果の直後」「アンカー（画面上端に張り付く枠）」「ページ遷移時の全画面（Vignette）」
- **SEOがこのサイトの収入源そのもの。** 広告で順位を落としたら元も子もない → **CLS 0（高さ予約）・スクリプトは本文の後で読み込む・1画面に広告を詰めない**
- **保護者リードCTA（ParentLeadCTA等）は動かさない・隠さない・押し下げない。** 広告はCTAの**後ろ**に置く
  （2026-07-04 に審査対応でCTAを隠して自傷した前科。同じことをしない）
- **誤クリックを誘う配置はしない**（AdSenseポリシー違反で口座停止になる）: 入力欄・計算ボタン・結果の数字の**すぐ隣／間に挟まない**。
  広告には必ず小さく「スポンサーリンク」と表示し、上下に余白をとる

## 1. 自動広告と手動広告の分担

| 種類 | 設定する場所 | どうするか | 理由 |
|---|---|---|---|
| **アンカー広告** | AdSense管理画面（👤） | **ON・位置は「上」** | モバイルで最も安定して稼ぐ。⚠️画面下には既に `StickyConvertBar`（LINE導線）があるので**上**にして重ねない |
| **Vignette（遷移時の全画面）** | AdSense管理画面（👤） | **ON** | 収益の大きな割合を占めやすい。表示はページ遷移時のみでGoogleのインタースティシャル基準内 |
| **自動の「ページ内広告」** | AdSense管理画面（👤） | **OFF** | 勝手にCTAや計算機の間に入る・CLSを起こす。本文中は手動で置いた方が稼げて安全 |
| **手動の広告ユニット** | コード（loop） | 下の §3 の位置 | 位置を固定して、ユニットごとに成績を比べられるようにする |

## 2. 広告ユニット（👤がAdSense管理画面で作る・IDを1か所に書く）

**ユニットIDは1ファイルに集める**: `src/lib/ad-units.ts`（新設）。未設定（プレースホルダ）の間は `AdSlot` の既存ガードで**何も描画しない**。

| キー | 管理画面での種類 | 名前（管理画面でこの名前で作る） | 使う場所 |
|---|---|---|---|
| `RESULT_BELOW` | ディスプレイ（レスポンシブ） | `mn-result-below` | 計算機の結果＋CTAの直後 |
| `IN_CONTENT` | ディスプレイ（レスポンシブ） | `mn-in-content` | 解説・表の途中 |
| `IN_ARTICLE` | 記事内広告 | `mn-in-article` | ブログ本文の途中 |
| `PAGE_BOTTOM` | Multiplex（関連コンテンツ型） | `mn-page-bottom` | 各ページの最下部（フッターの前） |

**ユニットを分けるのは、どの位置がいくら稼いだかを管理画面で分けて見るため。**（位置ごとの成績で、2週間後に配置を見直す）

### ✅ 2026-09-24 👤がユニットを作成済み（このIDをそのまま `src/lib/ad-units.ts` に入れる）

| キー | ユニットID（data-ad-slot） | 管理画面の種類 | `<ins>` に必要な属性（管理画面が出したコードどおり） |
|---|---|---|---|
| `RESULT_BELOW` | `1489568761` | ディスプレイ（レスポンシブ） | `data-ad-format="auto"` `data-full-width-responsive="true"` |
| `IN_CONTENT` | `4472981442` | ディスプレイ（レスポンシブ） | `data-ad-format="auto"` `data-full-width-responsive="true"` |
| `IN_ARTICLE` | `5642592886` | 記事内広告 | `data-ad-layout="in-article"` `data-ad-format="fluid"` ＋ `style="text-align:center"` |
| `PAGE_BOTTOM` | `3128110186` | Multiplex | `data-ad-format="autorelaxed"` |

- ⚠️ **いまの `AdSlot` は `data-ad-layout` を出せない。** `layout?: string` を足し、`IN_ARTICLE` だけ `in-article`＋`fluid` にする。
  記事内とMultiplexは `data-full-width-responsive` を付けない（管理画面のコードに無い）
- ⚠️ 管理画面のコードに付いている `<script async src=".../adsbygoogle.js">` は**ページごとに貼らない**（`layout.tsx` で1回読み込み済み・c123f10）
- インフィード広告は作らない（👤確認済み。一覧画面向けで、このサイトの主要な面に合わない）
- ユニットIDは本物になったが、手動ユニットの描画は **`NEXT_PUBLIC_ADSENSE_ENABLED=1`（👤がCloudflareで設定）** まで出ない。これは既存の二重ガードどおり

## 3. 手動ユニットを置く場所（面ごと）

**モバイルで1ページ最大3枠。枠と枠の間は最低1画面分あける。**

| 面 | 枠1 | 枠2 | 枠3 |
|---|---|---|---|
| **`/hensachi` と配下の計算機**（最大の面） | `RESULT_BELOW`: 結果表示＋保護者CTAの**後** | `IN_CONTENT`: 解説セクションの最初の見出しの前 | `PAGE_BOTTOM` |
| **学校ページ `/pref/[code]/school/[schoolCode]`**（3,400枚） | `IN_CONTENT`: 「今季の入試倍率」セクションの**後** | `IN_CONTENT`: 多年度推移の**後** | `PAGE_BOTTOM` |
| **ブログ `/blog/[slug]`**（既に `AdSlot` あり→置き直す） | `IN_ARTICLE`: 導入文の後・最初の見出しの前 | `IN_ARTICLE`: 本文の中ほど（見出し3つ目の前。短い記事は省略） | `PAGE_BOTTOM` |
| **県の計算機**（`/[prefecture]/naishin`・`/total-score`・`/kanagawa/s-value` 等） | `RESULT_BELOW`: 結果＋CTAの後 | `IN_CONTENT`: 解説の途中 | `PAGE_BOTTOM` |
| **トップ `/`** | `RESULT_BELOW`: メインの計算機の後 | — | `PAGE_BOTTOM` |
| **換算・早見・評定平均**（`/total-score/mantenkan`・`/hensachi/gyakusan/hayamihyou`・`/hyotei-heikin`系） | `RESULT_BELOW`: **答え（表・換算結果）の直後**。この面の訪問者は答えを見てすぐ離れるので、早い位置が一番見られる | — | `PAGE_BOTTOM` |

### 置かない場所（必ず除外）

- `/embed/*`（他サイトに埋め込まれる計算機。他人のサイトに広告を出すことになる）
- `noindex` の面・`/nendomatsu-pack`・`/developers`・API系
- 法務・運営ページ（`/privacy` `/terms` `/tokushoho` `/quality` `/reliability` 等）
- 印刷表示（`print:hidden`）
- 保護者リードのフォーム画面（入力中の画面に広告を出さない）

## 4. 実装（loop）

- [x] `src/lib/ad-units.ts`: 4キーのユニットIDを1か所に（**§2の本物のID**を入れる）
- [x] `src/app/layout.tsx` の `adsbygoogle.js` 読み込み → **対話セッションが実施済み（c123f10・自動広告用に常時読み込み）。触らない**
- [x] ⚠️ **点火スイッチの効き方を先に確かめる。** `AdSlot` は `'use client'` なので `process.env.NEXT_PUBLIC_ADSENSE_ENABLED` は
      **ビルド時に埋め込まれる**。このリポジトリの他の旗（`NEXT_PUBLIC_ADVISOR_ENABLED` 等）は `wrangler.jsonc` の `vars`（実行時）で点火しており、
      それらはサーバーコンポーネントで読んでいるから効いている。**`vars` に入れても client の `AdSlot` には届かない可能性が高い。**
      → サーバー側（ページ/レイアウト）で旗を読み、`AdSlot` に `enabled` を props で渡す形に直すか、Workers Builds のビルド変数で渡す必要があるかを確認し、
      **👤がやる操作を1つに絞って**質問ノートに書く（「wrangler.jsonc の vars に1行足して push」で済む形が望ましい。envの変更自体は👤）
- [x] `AdSlot` に小さな「スポンサーリンク」ラベルと上下余白を足す（ラベルは枠ごとに1つ。テキストは本文色でなく控えめな色）
- [x] §3 の表どおりに配置。**各面で ParentLeadCTA・StickyConvertBar・計算ボタン・入力欄との位置関係をテストで固定**
      （広告がCTAより前に来ない／入力欄の隣にない）
- [x] §3「置かない場所」を**不変条件テスト**に: 除外ルートのソースに `<AdSlot` が無いこと
- [x] 1ページあたりの手動枠が3以下であることをテストで固定
- [x] CLS: 全枠で `minHeight` 予約（既定250。`PAGE_BOTTOM` の Multiplex は実寸に合わせる）
- [x] env は**触らない**（`NEXT_PUBLIC_ADSENSE_ENABLED` の点火は👤・C7）
- [x] `tsc` 実exit0（パイプ禁止）／jest フルスイート green（`--maxWorkers=2` 可）
- [ ] push は1日1回ルールどおり（保留は2026-09-24に解除済み）

## 5. 点火の手順（👤向け・質問ノートに番号つきで書くこと）

1. ~~4ユニット作成~~ ✅ 2026-09-24 済み（§2）
2. ~~自動広告の設定~~ ✅ 2026-09-24 済み（アンカー・全画面広告〈頻度5分〉ON／ページ内〈バナー・Multiplex〉OFF）
3. ~~本人確認の提出~~ ✅ 2026-09-24 提出済み（住所確認PINは収益$10到達で届く）
4. 手動ユニットの点火（§4で確かめた1つの操作）
5. push（＝デプロイ）

## 6. 2週間後の見直し（`ops/baselines/ads-placement-review-2026-10.md` に書く手順を残す）

- AdSense の「広告ユニット別」レポートで、4ユニットの表示回数・RPM・クリック率を比べる
- **SEOが落ちていないか**: `scripts/w9-weighted-rank.mjs` の前週比と、Search Console の Core Web Vitals（CLS）を確認。
  上位20クエリの加重順位が +0.5位以上悪化、または CLS が「不良」になったら、`IN_CONTENT` から外して様子を見る
- 保護者CTAのクリック（D1の `/go` ログ）が広告開始前の2週間より明らかに減っていたら、`RESULT_BELOW` を1段下げる

---

## 実施記録（2026-09-24 22:xx・loop）

- 実装済み: `ad-units.ts`（旧 `ad-slots.ts` は削除）／`AdSlot`（`layout` prop・スポンサーリンクラベル・`AdUnit`）／
  ブログ（`blog-ad-insert.ts` で本文の見出し位置に IN_ARTICLE を最大2枠自動挿入＋PAGE_BOTTOM。旧 `<!-- AD_PLACEHOLDER -->` 方式は廃止＝どの記事にもマーカーは無かった）／
  学校ページ（IN_CONTENT×2＋PAGE_BOTTOM）／結果連動フロー13本（RESULT_BELOW・結果が出た後だけ）／
  /hensachi・/hyotei-heikin・県の計算機9面・トップ・換算早見4面。
- ⚠️ **仕様表からの意図的なずれ**（保護者CTAを押し下げない＝§0の原則を優先した）:
  学校ページの1枠目は「今季の入試倍率の後」ではなく **保護者CTA・リードフォームの後**／県計算機3面（Osaka/Tokyo/[prefecture]）のIN_CONTENTはCTAの後／
  換算・早見面のRESULT_BELOWは計算機の入力欄に隣接させず、解説セクションの後（hayamihyouは対応表の後・CTAの後）。
- 点火の効き方の結論: client の `AdSlot` は `process.env.NEXT_PUBLIC_ADSENSE_ENABLED` を**ビルド時に埋め込む**。`wrangler.jsonc` の `vars`（実行時）には**効かない**
  （OpenNext はビルド時に wrangler vars を読まず、`.env*` ファイルだけを読む＝`extract-project-env-vars.js`）。学校ページ・ブログはSSGなので実行時に読む道も無い。
  → 点火の操作は質問ノート参照（Workers Builds のビルド変数 or `.env.production`）。
- 検証: tsc実exit0・jestフル553suites/8392tests green（`ad-placement.test.ts` 39本を新設）。push保留（本日分は対話セッションが使用済み）。
- 2週間後の見直し手順: `ops/baselines/ads-placement-review-2026-10.md`
