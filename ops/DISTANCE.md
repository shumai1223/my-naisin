# ops/DISTANCE.md — 収益距離の全ページ算出（2026-08-10）

> **収益距離** ＝ そのページから最も近い「収益面」まで内部リンクを最短で何クリック辿るか。
> 距離1 = そのページ自身に収益CTAがある / 距離∞ = 内部リンクでは到達できない（孤児）。
>
> 一次データ生成器: `scripts/revenue-distance.mjs`（新規作成・`src/lib/internal-link-graph.ts` の
> `walkSourceFiles`/`walkPageFiles`/`pageFileToRoute` を再利用）
> 実行: `NODE_TLS_REJECT_UNAUTHORIZED=0 node_modules/.bin/tsx scripts/revenue-distance.mjs`
> 出力: `ops/raw/revenue-distance.json`（ルート123本 × 4種の距離 + GSC611行の写像 + 記事51本の発リンク）

---

## 0. 結論（先に3行）

| # | 結論 | 根拠 |
|---|---|---|
| 1 | **到達不能な流入量＝0クリック／0表示。∞ページは1枚も無い** | 611行のGSCページ全てが収益CTAへ距離1または2（本文§3） |
| 2 | **収益距離は今のボトルネックではない**。611ページ中530ページ（クリックの99.3%）が既に距離1 | 本文§3 |
| 3 | 本当の詰まりは「距離1の中身」と「実クリックの少なさ」。**28日間で内部refererを伴う実アフィリクリックは43件しかない**（記録された347件の12.4%） | 本番D1実クエリ（本文§4.2） |

→ 距離を1つ縮めて動く円は **施策1本あたり月¥264〜¥1,588（中位）／4本合計でも約¥3,300、係数を全部上限に振っても約¥9,000**（§7.6）。桁を変えるレバーは距離軸には無い。
→ ただし1つだけ**実測で効くと分かっている面**がある: `/hogosha` は検索流入ゼロなのに内部リンク経由だけで実アフィリクリックの37%（16/43件）を出している（§4.2）。最優先は「`/hogosha` への到達距離 3→2」。

---

## 1. 方法と、静的解析でできなかったこと（C1）

### 1.1 手順
| 段 | 内容 | 実装 |
|---|---|---|
| ① | `src/app/**/page.tsx` を列挙しルートテンプレート化（`[param]` は保持、`(group)`除去、`/api`除外） | `scripts/revenue-distance.mjs:37-52`／`walkPageFiles` は `src/lib/internal-link-graph.ts:34-45` を再利用 |
| ② | 各ページの**描画ツリー**＝`page.tsx` と祖先 `layout.tsx` から `@/`・相対 import を推移的に閉包 | 同 `:55-120`。`page-registry.ts`/`sitemap.ts`/`robots.ts` は参照プールから除外（`internal-link-graph.ts:19` と同方針） |
| ③ | ツリー内に収益CTAのJSX使用があるか判定（定義ファイルの誤検出を避けるため `<AffiliateAd` 等の**使用箇所**で判定） | 同 `:122-161` |
| ④ | ツリー内の全 href を抽出 → ルートテンプレートへ写像 | 同 `:164-234` |
| ⑤ | 収益面集合から**逆BFS**、距離 = hops+1 | 同 `:257-271` |
| ⑥ | GSC 611行の URL を `#`/`?` 除去後にルートへ写像 | 同 `:273-277`。**611行全てが写像成功・未写像0件** |

走査規模: ルート **123本**／ソース **1,170ファイル**（スクリプト標準出力・`ops/raw/revenue-distance.json:routeCount, walkSourceFilesCount`）

### 1.2 静的解析できなかったリンク（推測で埋めていない）

| 種別 | 件数（文脈のみ） | 件数（グローバル込み） | 扱い |
|---|---|---|---|
| href 総数 | 8,459 | 14,977 | — |
| リテラル `href="/x"` / `{href:'/x'}` | 2,649 | 8,306 | 解決済み |
| テンプレート `` href={`/${p.code}/naishin`} `` | 139 | 139 | `${...}`→`*` に潰し、動的ルート `[param]` とセグメント一致させて解決 |
| **`href={式}`（識別子・関数呼び出し）＝行き先不明** | **429** | **675** | **未解決として計上。推測で埋めていない** |
| 外部URL / `mailto:` / `tel:` | 2,358 | 2,850 | 対象外 |
| `#`アンカーのみ | 2,884 | 3,007 | 対象外 |

- 未解決429件の内訳（ルート別上位）: `/[prefecture]/naishin` 17、`/` 17、`/hensachi` 12、`/hyotei-heikin` 11、`/[prefecture]/total-score` 11（`ops/raw/revenue-distance.json` の `routes.ctx.*.unresolvedHrefs`）
- 対応する `page.tsx` が見つからなかったリンク先は **10種類のみ**（`/api/naishin/csv` 等のAPIエンドポイント9種 + `/*/*` 1種）。=リンク切れ由来の距離∞は発生していない。
- **限界の帰結**: 未解決429件が実は収益面を指していた場合、距離はさらに短くなる方向にしか動かない（＝§3の「∞ゼロ」という結論は未解決分を埋めても覆らない）。

### 1.3 テンプレート単位で測った箇所（1枚ずつ手作業していない）
| 対象 | GSC露出 | 扱い |
|---|---|---|
| `/pref/[code]/school/[schoolCode]` | 233枚 | 動的ルート1本として測定（§5） |
| `/blog/[slug]` | 163行 | **記事51本を1本ずつ測り直した**（`scripts/revenue-distance.mjs:322-338` → `blogPostLinks`、共通枠は `:341-352` → `blogSharedOut`）。理由は§6.2 |

---

## 2. 収益面集合の確定（この集合を先に固定した）

### 2.1 「収益CTAが直接ある」の判定条件
| 分類 | 検出パターン | 実装 |
|---|---|---|
| アフィリCTA | `<AffiliateAd` / `<ParentLeadCTA` / `<ParentLeadCTAExperiment` / `<ParentLeadCTAPositionSlot` / `<HogoshaLeadCTA` / `<FutoukouLeadCTA` / `<SidebarAd` / `<SponsorSlot` | `scripts/revenue-distance.mjs:122-125` |
| LINE名簿CTA | `lineAddUrl(` | 同 `:126` |

`ParentLeadCTA` は内部で `selectLeadOffer()` を呼び、`<AffiliateAd placement={placement} />` を描画する（`src/components/ParentLeadCTA.tsx:52, :86-92`）。よって `ParentLeadCTA` の存在＝`selectLeadOffer` の存在。

### 2.2 高CPAオファーが実際に返る面（`src/lib/lead-config.ts` を読んで確定）

| 面（placement） | 解決される主オファー | CPA(仮定値) | 副オファー | 定義 |
|---|---|---|---|---|
| `suisen` | `moshimo-minhoken` | **¥17,000** | `sora-juku-text` | `lead-config.ts:187` / `affiliate-economics.ts:94` |
| `parent-lp` | `moshimo-garden-chochiku` | **¥11,500** | `atama-text` | `lead-config.ts:144` / `:92` |
| `hiyou` | `moshimo-garden-gakushi` | **¥11,500** | `sora-juku-text` | `lead-config.ts:175` / `:91` |
| `mendan` | `moshimo-e-live` | ¥5,000 | `moshimo-garden-gakushi` ¥11,500 | `lead-config.ts:180` / `:101` |
| `result` | `sora-juku-text` | ¥10,000 | `moshimo-garden-gakushi` ¥11,500 | `lead-config.ts:138` / `:110` |
| `prefecture` | `moshimo-manabuterasu` ※関東=森塾¥15,000／関西=キャンパス¥15,000 | ¥8,000〜15,000 | `fp-soudan` ¥13,800 | `lead-config.ts:163, 237-253` |
| `naishin-up` | `sora-juku-text` | ¥10,000 | `fp-soudan` ¥13,800 | `lead-config.ts:192` / `:398` |
| `blog` | `sora-juku-text` | ¥10,000 | `fp-soudan` ¥13,800 | `lead-config.ts:211` / `:401` |
| `hensachi` / `hyotei-heikin` | `atama-text` | ¥7,500 | `fp-soudan` ¥13,800 | `lead-config.ts:152,156` / `:395-396` |
| **未指定（placement無し）** | `DEFAULT_LEAD_OFFER` = `zkai-text-request` | **¥800** | **null（副オファーが出ない）** | `lead-config.ts:86-92` / **`:419` `if (!placement) return null;`** |

> ⚠️ CPAとCVRは**すべて未実測の仮定値**である旨がコード自身に明記されている（`src/lib/affiliate-economics.ts:4-7`「実際の確定報酬は ASP 管理画面が正」）。本書の円換算は全てこの仮定の上に乗る。

### 2.3 本書で使う「収益面」3集合

| 記号 | 集合 | 中身 |
|---|---|---|
| **dA** | 収益CTA（アフィリ **or** LINE）を持つページ | 判定は§2.1。走査した123ルートのうち該当するもの（`/hogosha` `/hiyou` `/mendan` `/juku-shindan` `/suisen-nyuushi` はすべて該当） |
| **dAff** | アフィリCTAのみ | LINEだけの面（学校ページ等）を除く |
| **dS** | **高CPA面**＝`/hiyou` `/suisen-nyuushi` `/hogosha` `/mendan` `/juku-shindan` の5面 | 起動プロンプトで指定された5面。CPA¥5,000〜17,000のFP/家庭教師オファーが載る |

補助として **dGlob**（ルート `layout.tsx` の Header/Footer/StickyConvertBar/ExitIntentLineModal を含めた距離）も算出した。

---

## 3. Q1 距離分布 / Q2 中央値 / Q3 ∞ページ

### 3.1 距離分布（GSCにインプレッションがある611行・28日 2026-07-10〜08-07）

**dA（収益CTA＝アフィリ+LINE まで）**
| 距離 | ページ枚数 | GSCクリック | GSC表示 |
|---|---|---|---|
| 1 | **530** | **8,590** | 312,611 |
| 2 | 81 | 59 | 4,394 |
| 3 | 0 | 0 | 0 |
| 4+ | 0 | 0 | 0 |
| **∞** | **0** | **0** | **0** |

**dAff（アフィリCTAまで）**
| 距離 | ページ枚数 | GSCクリック | GSC表示 |
|---|---|---|---|
| 1 | 297 | 8,583 | 312,006 |
| 2 | 314 | 66 | 4,999 |
| **∞** | **0** | **0** | **0** |

**dS（高CPA面5つまで）** ※ブログは記事単位で再計算した値
| 距離 | ページ枚数 | GSCクリック | GSC表示 |
|---|---|---|---|
| 1 | 2 | 13 | 384 |
| 2 | 359 | 7,057 | 115,778 |
| 3 | **250** | **1,579** | **200,843** |
| 4+ | 0 | 0 | 0 |
| **∞** | **0** | **0** | **0** |

**dGlob（ルートlayout込み）**: 611ページ全てが **距離1**。理由＝`ExitIntentLineModal`（LINE登録CTA）が全ページのルートlayoutに常設されているため（`src/app/layout.tsx:114`）。ただしこれは離脱インテント＋スクロール400px＋10日に1回のfrequency capでしか描画されない（`src/components/ExitIntentLineModal.tsx:26-28`・判定関数 `:31-34`）ので、**本書の主指標には採らない**（採ると全ページが自動的に「距離1」になり意味を失う）。

### 3.2 中央値

| 指標 | 非加重中央値 | **クリック加重中央値** |
|---|---|---|
| dA（収益CTA） | **1** | **1** |
| dAff（アフィリのみ） | 2 | **1** |
| dS（高CPA面） | 2 | **2** |

### 3.3 ★Q3: ∞ページと到達不能な流入量

> ## **∞ページ = 0枚／到達不能な流入量 = 0クリック（0表示）**

- dA・dAff・dS のいずれの定義でも、611行のGSCページから収益面へ到達できないものは1枚も無い。
- 最も遠いページでも **dA=2 / dS=3**。
- 「距離2」＝ページ自身に収益CTAが1つも無い面は **30ルート・81枚・59クリック・4,394表示**（28日）。上位は下表。

| GSCクリック | 表示 | 枚 | ルート | dA | dS |
|---|---|---|---|---|---|
| 18 | 2,505 | 1 | `/hensachi/gyakusan/hayamihyou` | 2 | 3 |
| 15 | 706 | 1 | `/total-score/mantenkan` | 2 | 3 |
| 6 | 166 | 35 | `/[prefecture]/naishin-omomi` | 2 | 3 |
| 4 | 110 | 1 | `/heigan-yuugu/tokyo` | 2 | 3 |
| 4 | 98 | 1 | `/koukou-bairitsu` | 2 | 3 |
| 3 | 169 | 1 | `/hensachi/moshi/ichiran` | 2 | 3 |
| 3 | 44 | 1 | `/naishin-kakusa` | 2 | 3 |
| 2 | 20 | 1 | `/about` | 2 | 3 |
| 1 | 145 | 1 | `/heigan-yuugu` | 2 | 2 |
| 1 | 56 | 5 | `/hensachi/kyoka-betsu/[subject]` | 2 | 3 |
| 0 | 76 | 14 | `/report/2026/[prefecture]` | 2 | 3 |
| 0 | 27 | 1 | `/developers` | 2 | 3 |

（出典: `ops/raw/revenue-distance.json` の `routes.ctx` × `gsc`。全30ルートは同JSONで再現可能）

---

## 4. Q4 「流入が多いのに距離が遠い」上位20枚 ＋ 距離1の中身

### 4.1 dS≧3（高CPA面まで2クリック以上）で流入が多いURL 上位20

| # | GSCクリック | 表示 | 順位 | dS | dA | URL |
|---|---|---|---|---|---|---|
| 1 | **648** | 35,180 | 5.1 | 3 | 1 | `/blog/all-3-high-school-options-2026-update` |
| 2 | 120 | 14,103 | 4.4 | 3 | 1 | `/blog/naishinten-average-score` |
| 3 | 106 | 5,270 | 5.9 | 3 | 1 | `/blog/naishinten-30-high-school` |
| 4 | 91 | 3,362 | 6.6 | 3 | 1 | `/blog/hyotei-heikin-4-5-high-school` |
| 5 | 81 | 6,553 | 6.1 | 3 | 1 | `/blog/teiki-test-and-naishinten` |
| 6 | 61 | 3,556 | 6.8 | 3 | 1 | `/blog/naishin-target-grades-by-prefecture` |
| 7 | 58 | 3,319 | 8.7 | 3 | 1 | `/blog/tokyo-naishin-calculation-guide` |
| 8 | 55 | 2,876 | 6.9 | 3 | 1 | `/blog/hyotei-heikin-3-5-high-school` |
| 9 | 44 | 1,991 | 7.3 | 3 | 1 | `/blog/naishinten-27-high-school` |
| 10 | 28 | 2,003 | 8.6 | 3 | 1 | `/blog/hyotei-heikin-4-0-high-school` |
| 11 | 26 | 3,875 | 9.2 | 3 | 1 | `/blog/tokyo-kansan-naishin-guide` |
| 12 | 24 | 1,481 | 8.8 | 3 | 1 | `/blog/toritsu-nyushi-2026-kanzen-guide` |
| 13 | 23 | 1,290 | 6.8 | 3 | 1 | `/blog/understanding-jitsugikyoka-grading-2026` |
| 14 | 21 | 1,384 | 7.8 | 3 | 1 | `/blog/practical-subjects-naishin-strategy` |
| 15 | 19 | 1,043 | 8.5 | 3 | 1 | `/blog/hensachi-koukou-ichiran-2026` |
| 16 | **18** | 2,505 | 6.7 | 3 | **2** | `/hensachi/gyakusan/hayamihyou` |
| 17 | 18 | 840 | 6.5 | 3 | 1 | `/blog/fukukyoka-bairitsu-by-prefecture` |
| 18 | 17 | 460 | 14.7 | 3 | 1 | `/hensachi/kyoka-betsu` |
| 19 | **15** | 706 | 6.2 | 3 | **2** | `/total-score/mantenkan` |
| 20 | 14 | 632 | 7.4 | 3 | 1 | `/blog/chiba-naishin-calculation-guide` |

dS≧3 の合計: **250行 / 1,579クリック / 200,843表示**（＝サイト表示317,005の**63%**）。内訳:

| 内訳 | 行数 | クリック | 表示 |
|---|---|---|---|
| `/blog/[slug]`（実記事37本＋`#`断片125） | **162** | **1,500** | **195,294** |
| 非ブログ（33ルート） | 88 | 79 | 5,549 |

上位20のうち `dA=2`（自ページに収益CTAが1つも無い）は **16位 `/hensachi/gyakusan/hayamihyou` と 19位 `/total-score/mantenkan` の2枚だけ**。残り18枚は**距離1のCTAを持ちながら高CPA面へは2クリック必要**という状態。

### 4.2 ★もっと重要な発見: 「距離1」の中身が面によって桁で違う

611ページ中530ページ（クリックの99.3%）が距離1なのに、実際のアフィリクリックは面ごとに桁が違う。

**面別: GSCクリック(28日) vs 本番D1のアフィリクリック(28日)**

| ルート | GSCクリック | GSC表示 | D1アフィリクリック | 率 | うち**内部referer**（＝実ブラウザ） |
|---|---|---|---|---|---|
| `/[prefecture]/naishin` | 1,043 | 31,306 | 215 | 20.6% | **3** |
| `/` | 1,879 | 29,752 | 9 | 0.48% | **9** |
| `/hensachi` | 1,601 | 32,513 | 5 | 0.31% | **5** |
| `/blog/[slug]` | 1,501 | 195,547 | 4 | 0.27% | **0** |
| `/hyotei-heikin` | 920 | 5,478 | 2 | 0.22% | **1** |
| `/tokyo/total-score` | 908 | 5,636 | 2 | 0.22% | **2** |
| `/kanagawa/s-value` | 489 | 2,189 | 0 | 0.00% | **0** |
| `/mendan` | 13 | 375 | 3 | 23.1% | **1** |
| `/hiyou` | 0 | 9 | 4 | — | **1** |
| **`/hogosha`（parent-lp）** | **0** | **0** | **21** | — | **16** |
| （placement未付与で面に帰属できない） | — | — | **66** | — | 0 |

> 出典: GSC列＝`ops/raw/gsc-pages-28d.json` をルート集約。D1列＝
> `node scripts/d1q.mjs "SELECT COALESCE(placement,'(null)') p, COUNT(*) n FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY 1 ORDER BY n DESC"`（本日実行）。
> 内部referer列＝同テーブルを `CASE WHEN referer LIKE '%my-naishin.com%' THEN 'internal' …` で分解（本日実行）。

**この表から確定した3つの事実:**

| # | 事実 | 数値 | 出典 |
|---|---|---|---|
| A | 28日のD1クリック347件のうち、**内部refererを伴うのは43件（12.4%）だけ**。301件はreferer=null | 43 / 301 / 3(外部) | 上記D1クエリ |
| B | `/go` は**内部referer判定より前にD1へ記録する**ので、referer=null行は「怪しいクリック」として記録済み。コード自身が「ブラウザUA偽装の分散スクレイパ（iOS13.2.3・98IP）が実クリックの約9倍計上されていた」と記録 | — | `src/app/go/[id]/route.ts`（記録は `:99-108` の `persistClick`、内部referer判定は `:118` の `if (!isInternalReferer(refererRaw))`。コメントは `:113-117`） |
| C | ⇒ **`/[prefecture]/naishin` の20.6%は人間の転換率ではない**。`prefecture`(114)・`naishin-up`(98)の212件は**内部referer 0件**。実ブラウザ由来は`/kochi/naishin` 3件のみ | 212件中internal=0 | 同D1クエリ |

**内部refererだけで見た28日の実アフィリクリック43件の内訳**
| placement | 件数 | 面 |
|---|---|---|
| `parent-lp` | **16** | `/hogosha` |
| `/`（referer推定） | 9 | トップ |
| `hensachi` | 5 | `/hensachi` |
| `/kochi/naishin` | 3 | 県別内申 |
| `result` | 3 | 結果面 |
| `/tokyo/total-score` | 2 | 都立総合得点 |
| `shindan` | 2 | 診断 |
| `/hyotei-heikin` / `hiyou` / `mendan` | 各1 | — |

> ### ★ 最重要: `/hogosha` は **GSC表示0・GSCクリック0（検索から誰も来ない）** のに、内部リンク経由だけで実アフィリクリックの **37%（16/43）** を生んでいる。
> 高CPA面は「到達させれば効く」ことが実測で示されている。詰まっているのは **/hogosha への到達量**。

`/hogosha` への文脈リンクを持つのは **7ルートだけ**（`ops/raw/revenue-distance.json`）:
`/hensachi` `/hyotei-heikin` `/[prefecture]/naishin`（この3本は `StaticToolEntryLinks`／`src/components/StaticToolEntryLinks.tsx:16` 経由）、
`/hensachi/shindan` 系3本（`src/components/Hensachi/ShindanQuiz.tsx:272,296`）、`/hiyou`（`src/app/hiyou/page.tsx:220`）。

**`/hogosha` 単独への距離分布**
| 距離 | ページ枚数 | GSCクリック | GSC表示 |
|---|---|---|---|
| 2 | 52 | 3,592 | 70,295 |
| **3** | **546** | **5,040** | **245,793** |
| 4 | 13 | 17 | 917 |

主要面の `/hogosha` 距離: `/hensachi`=2、`/hyotei-heikin`=2、`/[prefecture]/naishin`=2 に対し、
**`/`=3、`/tokyo/total-score`=3、`/kanagawa/s-value`=3、`/blog/[slug]`=3、学校ページ=3**。
＝月間クリック上位の `/`(1,879)・`/blog`(1,497)・`/tokyo/total-score`(908)・`/kanagawa/s-value`(489) が全て距離3。

---

## 5. Q5 学校ページ `/pref/*/school/*`

### 5.1 規模（起動プロンプトの「約958枚」は誤り）

| 項目 | 値 | 出典 |
|---|---|---|
| 実際に生成される学校ページ数 | **3,089枚** | `generateStaticParams`（`src/app/pref/[code]/school/[schoolCode]/page.tsx:35-41`）を47県分（`src/lib/school-page-lookup.ts:50-98`・`PILOT_PREFECTURE_CODES = INDEXED_SCHOOL_PAGE_PREFECTURE_CODES`／同 `page.tsx:29`）で実行して計数 |
| GSCにインプレッションのある枚数 | 233枚（3,089枚の **7.5%**） | `ops/raw/gsc-pages-28d.json`（BRIEF §2） |
| 28日のGSC | 7クリック / 605表示 / CTR1.16% | BRIEF §2 |

### 5.2 距離と発リンク

| 指標 | 値 |
|---|---|
| dA（収益CTA＝アフィリ or LINE） | **1**（LINE登録CTAが直下にある） |
| dAff（アフィリCTA） | **2**（`AffiliateAd` も `ParentLeadCTA` も1つも無い） |
| dS（高CPA面5つ） | **2**（`/juku-shindan` へ直リンク） |
| `/hogosha` までの距離 | **3** |
| 発リンク（ルート） | 5本: `/`、`/pref/[code]`、`/pref/[code]/school/[schoolCode]`（近隣校）、`/reverse`、`/juku-shindan` |
| 静的解析できなかったhref | 2件 |
| 描画ツリー | 165ファイル |

### 5.3 学校ページから収益面へ出ているリンク（4本）とラベル — 実ファイル確認

| # | ラベル（実文言） | 行き先 | 種別 | file:line |
|---|---|---|---|---|
| 1 | **必要な当日点を逆算する** | `/reverse?pref={code}` | アフィリ面（`/reverse` は `placement="result"`／`src/app/reverse/ReverseClient.tsx:267`） | `src/components/SchoolPageConvertCTA.tsx:54-60` |
| 2 | **条件に合う塾を無料診断** | `/juku-shindan` | 高CPA面（dS集合） | `src/components/SchoolPageConvertCTA.tsx:62-69` |
| 3 | **受験情報をLINEで受け取る** | `lineAddUrl('student')` | LINE名簿CTA＝**距離1の実体** | `src/components/SchoolPageConvertCTA.tsx:72-79` |
| 4 | **{県名}の内申点を計算する** | `/{code}/naishin` | アフィリ面（ParentLeadCTA×3） | `src/components/SchoolPageNaishinNote.tsx:68-73` |

加えて保護者共有ボタン（share_to_parent を発火）が `src/components/SchoolPageParentBridge.tsx:40` にある。

### 5.4 ★仮説「`/prefectures` からの導線ラベルが『印刷用資料』1本しかない」→ **誤り。検証の結果、否定された**

| 検証項目 | 結果 | 出典 |
|---|---|---|
| `/prefectures` から学校ページ系への導線の実ラベル | **「高校別の倍率を見る」** | `src/app/prefectures/page.tsx:159-166` |
| そのリンク先 | 学校ページではなく**県ハブ `/pref/{code}`**（学校ページへは県ハブからもう1クリック） | 同 `:160` |
| 「印刷用資料」という文字列 | サイト内に**1箇所のみ**存在し、それは `src/app/juku/dashboard/report/page.tsx:12` の**コメント**。学校ページ導線には一切使われていない | `grep -rn "印刷用" src` |
| `/prefectures` の同カード内の他ラベル | 「内申点計算」（`:145`・リンク先 `/{code}/naishin`）、「攻略ガイド」（`:155`・リンク先 `/{code}`）＝カード内は計3本 | 同 |
| `/pref/{code}` への被リンク元（全部） | 5ファイル: `src/app/for-teachers/page.tsx:20`、`src/app/partner/page.tsx:132`、`src/app/prefectures/page.tsx:160`、`src/components/ResultSection.tsx:300`（ラベル「この点数で狙える高校を見る」）、学校ページのパンくず `.../school/[schoolCode]/page.tsx:98` | `ops/raw/revenue-distance.json` |
| 学校ページ**そのもの**への内部リンク | 2経路のみ: 県ハブの一覧（`src/app/pref/[code]/page.tsx:692`）と近隣校リンク（`.../school/[schoolCode]/page.tsx:226`） | 同 |

→ 仮説は「ラベル名」も「本数」も外れている。ただし**構造的な指摘は当たっている**: 3,089枚の学校ページに到達するには `/prefectures` → `/pref/{code}` → 学校ページ の**3クリック**が必要で、結果画面からでも `ResultSection.tsx:300` → `/pref/{code}` → 学校ページ の**2クリック**。

---

## 6. Q6 `/blog` 165枚 — 1,501クリックはどこへ流れているか

### 6.1 まず165枚の実体を分解する（BRIEF §2の補足）

| 内訳 | 行数 | GSCクリック | GSC表示 | CTR |
|---|---|---|---|---|
| `/blog/[slug]` **実記事URL** | **38** | 1,497 | 94,290 | **1.59%** |
| `/blog/[slug]` **`#`アンカー断片URL** | **125** | **4** | **101,257** | **0.004%** |
| `/blog`（記事一覧） | 1 | 0 | 17 | 0% |
| `/blog/tag/[tag]` | 1 | 0 | 2 | 0% |
| 合計 | 165 | 1,501 | 195,566 | 0.77% |

（検算: 94,290+101,257+17+2 = 195,566 表示 / 1,497+4 = 1,501 クリック ＝ BRIEF §2 と一致）

- **サイト全表示317,005のうち101,257（32%）が「アンカー断片URL」で、そこから来たクリックは28日で4件**。
- GSC 611行は `#`/`?` を除去すると **実ページ486枚**。125行が同一記事のTOCアンカーの重複計上。
- BRIEF §2 の「/blog CTR 0.77%」は、**実記事1.59%** と **断片0.004%** の混合値。記事本体のCTRは倍近い。

### 6.2 記事ページの距離

| 指標 | 値 | 根拠 |
|---|---|---|
| dA（収益CTA） | **1** | `<ParentLeadCTA placement="blog" />`（`src/app/blog/[slug]/page.tsx:349`）＝ `sora-juku-text`(¥10,000) ＋副 `fp-soudan`(¥13,800)。記事冒頭にも素の `<AffiliateAd id="atama-text" hideLabel />`（同 `:245`） |
| dS（高CPA面） | **3**（51記事中50本） | 下記 |
| dS=2 の記事 | **1本のみ**: `education-cost-junior-high-to-high-school` | `ops/raw/revenue-distance.json:blogPostLinks` |
| `/hogosha` までの距離 | **3** | §4.2 |

> **テンプレート単位で測ると誤る点（正直に記録）**: `/blog/[slug]/page.tsx` は `src/lib/blog/index.ts` 経由で51記事全部をimportするため、
> 描画ツリーのhref和集合には `/hiyou` 等が現れ、テンプレート距離は dS=2 と出る。これは1記事あたりの到達先の**過大評価**。
> そこで記事ファイル51本を個別に解析し直した（`scripts/revenue-distance.mjs:322-338`＝記事別 / `:340-352`＝記事本文を除いた共通枠）。以下は記事単位の値。

### 6.3 全記事に必ず載る共通リンク11本 — 高CPA面は **0本**

`src/app/blog/[slug]/page.tsx` の描画ツリーから記事本文ファイルを除いて抽出した「どの記事にも載るリンク」:

| # | リンク先 | そこから高CPA面までのhops |
|---|---|---|
| 1 | `/` | 1 |
| 2 | `/hensachi` | 1 |
| 3 | `/hyotei-heikin` | 1 |
| 4 | `/reverse` | 1 |
| 5 | `/{pref}/naishin` | 1 |
| 6 | `/prefectures` | 2 |
| 7 | `/glossary` | 2 |
| 8 | `/blog` | 1 |
| 9 | `/blog/tag/{tag}` | 1 |
| 10 | `/blog/{slug}`（前後記事リンク） | 1 ※テンプレート和集合由来の値。実際は遷移先の記事が `education-cost-…` の時だけ1 |
| 11 | `/about/editor-profile` | 3 |

- 主な出所は `src/components/BlogRelatedLinks.tsx:33,60,75,90,106,123`（`/{pref}/naishin`・`/hensachi`・`/hyotei-heikin`・`/reverse`・`/glossary`）。
- **`/hiyou` `/hogosha` `/mendan` `/juku-shindan` `/suisen-nyuushi` はこの11本に1本も入っていない** → だから全記事が dS=3。

### 6.4 記事本文（51ファイル）の発リンク実測

| 発リンク先 | 本文に書いている記事の本数 |
|---|---|
| `/`（トップ） | 39 |
| `/hensachi` | 23 |
| `/blog/{other}` | 12 |
| `/hyotei-heikin` | 12 |
| `/reverse` | 9 |
| `/tokyo/total-score` | 7 |
| `/{pref}/naishin` | 4 |
| `/hiyou` `/koukou-hiyou` `/kyouiku-hi` `/shougakukin` `/juku-hiyou` | **各1**（すべて同じ1記事） |

> **51本中50本が、高CPA面（`/hiyou` `/suisen-nyuushi` `/hogosha` `/mendan` `/juku-shindan`）へ本文リンクを1本も持っていない。**
> 例外は `src/lib/blog/posts/education-cost-junior-high-to-high-school.ts` の1本のみ（`grep -ln` で確認）。

### 6.5 ★1,501クリックの行き先（距離での説明）

| 行き先 | 28日の実測 | 距離での説明 |
|---|---|---|
| **アフィリンク（換金）** | **4件**（D1 `placement='blog'`）。うち**内部referer 0件** | 距離1のCTAは存在するが、`src/app/blog/[slug]/page.tsx:349` ＝記事本文・出典・関連記事より下の**記事末尾**。冒頭の `:245` は素のテキストリンク1本 |
| **サイト内回遊（ツール面）** | 共通リンク11本＋本文リンク（トップ39記事・`/hensachi` 23記事） | 全て「もう一度計算させる」導線で、**保護者のお金の面へは1本も向いていない** |
| **高CPA面** | 到達を示す証跡なし。ブログ共通枠11本に高CPA面が0本、本文リンクも51本中1本だけ（§6.3/6.4）。`/hiyou` の28日D1クリックは4件（内部referer 1件）だが、これがblog由来かは `referer` が88%nullのため**特定できない＝未検証** | dS=3 |
| **LINE名簿** | `shouldShowStickyBar` が `/blog` を**明示的に除外**（`src/lib/sticky-bar.ts:15`）＝常設LINEバーが出ない。残るのは `ExitIntentLineModal`（離脱時・10日1回） | ブログだけ距離1のLINE導線が無い |
| **離脱** | 残り（実測不能） | — |

> **結論**: 1,501クリック（実記事1,497）は、距離1のアフィリCTAを1つ持ちながら28日で4クリックしか換金導線に流していない。
> 原因は「距離」ではなく **①CTAが記事末尾にしかない ②共通リンク11本が全部ツール面でお金面がゼロ ③LINE常設バーが `/blog` で無効**。

---

## 7. Q7 距離を1つ縮めたときに動く円（C5）

### 7.1 使う係数と出典

| 係数 | 値 | 出典 / 仮置きの根拠 |
|---|---|---|
| 自社実測CTR曲線 | 1位55.9% / 2位33.6% / 3位13.3% / 4位8.2% / 5位5.4% / 10位1.8% | BRIEF §6 |
| 発生CVR（保守） | `convRateLow` = **0.015**（FP無料相談系） | `src/lib/affiliate-economics.ts:91,92,94` |
| 承認率 | `CONFIRM_RATE` = **0.6** | `src/lib/affiliate-economics.ts:64` |
| CPA | `moshimo-garden-chochiku` ¥11,500 / `moshimo-garden-gakushi` ¥11,500 / `moshimo-minhoken` ¥17,000 | `src/lib/affiliate-economics.ts:91,92,94` |
| 内部リンクCTR | **仮置き 2.0%** | ★未検証。当サイトに内部リンクCTRの実測が無い。最も近い実測は記事末尾の外部広告CTA `4/1,497 = 0.27%`（D1 28日 `placement='blog'` ÷ GSC実記事クリック）。離脱を伴わない内部回遊はこれより高いのが通例なので約7倍の2.0%を置く |
| `/hogosha` 到達後のアフィリクリック率 | **仮置き 15%** | ★未検証。`/hogosha` は `ParentLeadCTA`×3（`src/app/hogosha/page.tsx:228,234,350`）＋`HogoshaLeadCTA` で密度が最も高く、読者が保護者本人＝権限ズレゼロ。ただし分母（到達数）が取れないため率を実測できない（GA4 property 540358022・2026-07-10〜08-07 の `pagePath=/hogosha` は `screenPageViews=9` だが、D1では同期間に `parent-lp` で21クリック＝PVよりクリックが多く**GA4の分母は使えない**。`[[ga4-undercounts-conversions]]` と整合） |
| 副オファーの追加クリック | **仮置き 主オファーの15%** | ★未検証。`src/components/ParentLeadCTA.tsx:101-118` で副は主CTAの下に小さなテキストリンクとして描画され視認性が主より低い |
| 月換算 | 28日実測 × 30/28 | — |

> ⚠️ CVR・承認率・CPAは**すべてコード側で「未実測の仮定」と明記されている**（`src/lib/affiliate-economics.ts:4-7`）。以下の円は仮定の積であり、確定報酬はASP管理画面のみが正。

### 7.2 施策A: `/hogosha` への距離を 3→2 にする（最有力）

**内容**: 既存コンポーネント `StaticToolEntryLinks`（`/hogosha` + `/juku-shindan` への静的リンク2本組・`src/components/StaticToolEntryLinks.tsx:16`）を、いま設置されていない
`/`（1,879クリック）・`/tokyo/total-score`（908）・`/kanagawa/s-value`（489）・ブログ共通枠（1,497）に足す。新規面は作らない。

- 対象クリック: (1,879+908+489+1,497) = 4,773 / 28日 → **5,114 クリック/月**
- EV = 5,114 × 内部リンクCTR 2.0% × `/hogosha`アフィリCTR 15% × CVR 0.015 × 承認 0.6 × ¥11,500

| ケース | 内部リンクCTR | `/hogosha`CTR | **EV（円/月）** |
|---|---|---|---|
| 下限 | 1.0% | 8% | **¥423** |
| 中位（採用値） | 2.0% | 15% | **¥1,588** |
| 上限 | 5.0% | 20% | **¥5,293** |

**実測との整合チェック**: 中位ケースは `/hogosha` へ月102人を追加送客し、アフィリクリックを月+15件増やす計算。
現状 `/hogosha` の内部refererアフィリクリックは28日で16件なので、**ほぼ倍増**の見積り。桁として過大ではない。

### 7.3 施策B: ブログ共通枠にお金クラスタリンク1本（dS 3→2・38記事）

- 対象: ブログ実記事 1,497クリック/28日 → **1,604 クリック/月**
- EV = 1,604 × 2.0% × `/hiyou`アフィリCTR（仮置き10%）× 0.015 × 0.6 × ¥11,500 = **¥332/月**
- 感度: 内部リンクCTR 1%→¥166 / 5%→¥830。`/hiyou`CTR 20%→¥664。両方上限（5%×20%）で **¥1,660/月**

### 7.4 施策C: 距離2の30ルート（81枚・59クリック/28日）に収益CTAを載せて 2→1

- 対象: 59クリック/28日 → **63 クリック/月**
- EV = 63 × アフィリCTR × 0.015 × 0.6 × ¥11,500

| アフィリCTR | 根拠 | **EV（円/月）** |
|---|---|---|
| 0.50% | サイト全体の実測（内部referer 43件 ÷ GSC 8,565クリック） | **¥33** |
| 4.05% | D1記録ベース（347÷8,565・怪しいクリック込み） | **¥264** |
| 15% | `/hogosha` 相当の高密度面にした場合 | **¥978** |

### 7.5 施策D（距離ではないが同工数）: `placement` 未付与22箇所の是正

`ParentLeadCTA` 系を `placement` プロップ無しで置いている箇所が **22件**（`src/**/*.tsx` を `<ParentLeadCTA(Experiment|PositionSlot)?…>` で走査し `placement="…"` が無いものを数えた。ルート別の同データは `ops/raw/revenue-distance.json` の `routes.ctx.*.parentLeadCtaInstances`。※同フィールドには `src/lib/affiliates.ts:94` のJSDocコメント内の記述例が1件混入する＝実描画ではないので除外して数えている）。代表:

| file:line | 面 | 28日GSCクリック |
|---|---|---|
| `src/app/tokyo/total-score/page.tsx:443` | `/tokyo/total-score` | 908 |
| `src/app/kanagawa/s-value/page.tsx:357` | `/kanagawa/s-value` | 489 |
| `src/app/HomeClient.tsx:643` / `src/app/page.tsx:398` | `/` | 1,879 |
| `src/app/[prefecture]/naishin/layout.tsx:125` | 県別内申47面 | 1,043 |
| `src/app/hokkaido/rank/page.tsx:209`・`saitama/total-score/page.tsx:238`・`osaka/total-score/page.tsx:293` | 道府県別ツール | 26 / 24 / 13 |
| `src/app/hensachi/kyoka-betsu/page.tsx:136`・`agekata/page.tsx:214`・`moshi/page.tsx:210`・`shiboukou/page.tsx:144`・`hyotei-heikin/suisen-kijun/page.tsx:237` | hensachi/hyoteiクラスタ | 17 / 0 / 0 / 0 / 5 |
| `src/app/[prefecture]/total-score/page.tsx:358`・`src/app/katei-kyoshi/page.tsx:122`・`src/components/TotalScore/TotalScoreExplainerView.tsx:194` | **`affiliateId` も無い＝`zkai-text-request` ¥800（最低EV）に落ちる** | 67 / 0 / 1 |

- 損失①: `selectSecondaryLeadOffer` は placement 未指定で **null を返す**（`src/lib/lead-config.ts:419`）＝**副オファー（FP相談 ¥11,500〜13,800）が1つも描画されない**
- 損失②: `goHref` に placement が渡らず（`src/components/ParentLeadCTA.tsx:91` → `src/components/Affiliate/AffiliateAd.tsx:44`）、referer も88%が null なので **D1で面に帰属できない＝28日66件（19%）が測定不能**
- EV（副オファー復活分）= 66件/28日 → 70.7件/月 × 追加率15% × 0.015 × 0.6 × ¥11,500 = **¥1,097/月**
- ＋ 帰属が戻ることで、以後の全施策が面別に測定可能になる（円換算不能だが施策A〜Cの前提条件）

### 7.6 まとめ: 距離軸で買える円の上限

| 施策 | 距離の変化 | EV（中位） | EV（上限） |
|---|---|---|---|
| A `/hogosha` 到達 3→2 | `/`・total-score系・blog | **¥1,588/月** | ¥5,293/月 |
| B blog→お金クラスタ 3→2 | 38記事 | ¥332/月 | ¥1,660/月 |
| C 距離2→1（30ルート） | 81枚 | ¥264/月 | ¥978/月 |
| D placement是正（距離外） | — | ¥1,097/月 | — |
| **合計** | | **約¥3,300/月** | 約¥9,000/月 |

> **距離を1つ縮めても月¥3,000〜9,000規模**。桁を変えるレバーは距離軸には無い。
> 理由は分母の細さで、**28日で内部refererを伴う実アフィリクリックが43件しかない**（§4.2 事実A）。
> 施策の優先順位は A → D → B → C。Aだけが「実測で効くと分かっている面（/hogosha）」へ流量を足す施策。

---

## 8. ★自己点検: 距離を縮める改修は保護者到達（share_to_parent）を押し下げないか

### 8.1 現状の保護者到達（実測）

| 指標 | 値 | 出典 |
|---|---|---|
| `parent_funnel_events`（D1・全期間） | **0件** | BRIEF §3 |
| GA4 `share_to_parent`（28日） | 2件（users 2）＝`result_view` 570 の **0.35%** | BRIEF §4 |
| GA4 `parent_landing_view`（28日） | 5件（users 3） | BRIEF §4 |
| D1 `school_page_clicks` | 9件（reverse 8 / juku-shindan 1・2026-08-07以降） | BRIEF §3 |

### 8.2 距離解析で新たに分かった「D1が0件である構造的な理由」（★仮説・要検証）

| # | 事実 | 出典 |
|---|---|---|
| 1 | 最大の保護者導線 `ParentWindowBridge`（`/mendan`リンク＋保護者用LINE＋`ParentShareLinkButton`）は **7/1〜7/25 と 11/15〜12/25 しか点灯しない** | `src/lib/parent-window.ts:25-31`、`src/components/ParentWindowBridge.tsx:115,144` |
| 2 | 本日 2026-08-10 は**消灯中**。次の点灯は **11/15**（97日後） | 同上 |
| 3 | parent-funnelビーコンの実装コミットは 2026-08-02 / 08-03 ＝ **7月の窓が閉じた（7/25）後** | BRIEF §3 |
| 4 | ⇒ **`ParentWindowBridge` 経由の `share_to_parent` は、計装後に一度も点灯機会が無かった**。D1が0件なのは必ずしもバグではない | ①②③から |
| 5 | ただし窓に依存しない共有UI（`ParentShareInvite`／`UnlockGate` 内）は稼働しているはずだが、これは `{has && ...}` ＝**計算完了後にしか描画されない**（`src/components/Hensachi/HensachiResultFlow.tsx:55-65`）。GA4で2件出ているのはこちら | コード＋BRIEF §4 |

→ **検証タスク**: (a) `/hensachi` で実際に計算完了→共有ボタンを押し、D1 `parent_funnel_events` に行が入るかを本人が実弾テストする（`[[owner-redteam-verification]]` の型）。(b) 11/15の窓点灯後に再確認。**この2つが終わるまで「ビーコンが壊れている」とも「壊れていない」とも書かない。**

### 8.3 施策A〜Dの保護者到達への影響（1件ずつ点検）

| 施策 | 保護者到達への影響 | 判定 |
|---|---|---|
| **A** `/hogosha` へのリンクを増やす | `/hogosha` は `ParentShareBanner` を描画する面（`src/app/hogosha/page.tsx:209`）＝**到達を増やすことが保護者到達そのものを増やす**。利益相反なし | ✅ 推奨 |
| **B** blog共通枠にお金クラスタリンク | ブログには保護者共有UIが元々無い（`ParentShareInvite`/`ParentShareLinkButton` は `blog/[slug]/page.tsx` の描画ツリーに存在しない）。押し下げる対象が無い | ✅ 安全 |
| **C** 距離2の30ルートに収益CTAを載せる | 対象30ルート（`/hensachi/gyakusan/hayamihyou`・`/total-score/mantenkan` 等）は `ParentShare*`／`UnlockGate`／`ParentWindowBridge` を1つも描画していない（各 `page.tsx` を `grep` で確認）＝押し下げる対象が無い | ✅ 安全 |
| **D** `placement` 是正 | 表示位置を1mmも変えない（propを足すだけ） | ✅ 安全 |
| **✗ やってはいけない改修** | 結果画面（`ResultSection`）で「お金の面」への導線を上に差し込むこと | ❌ 禁止 |

**禁止の根拠（プロジェクト自身の規約）**: `src/components/ResultSection.tsx:294-297` に
「⚠️保護者共有導線（橋①GapToTarget・橋②送るボタン・ParentCostBridge）より必ず下に置くこと（収益の主導線を押し下げない）」
と明記されている。施策A で `/` や total-score 系に `StaticToolEntryLinks` を足す際も、**結果直下の共有ボタン群より上には置かない**こと。

### 8.4 もう1つの副作用チェック: ブログのLINE導線
`shouldShowStickyBar` は `/blog` を除外している（`src/lib/sticky-bar.ts:15`）。施策Bでブログにお金クラスタリンクを足しても、
LINE常設バーは元々出ていないので名簿velocityを削らない。逆に「ブログにも常設LINEバーを出す」判断は**本書の範囲外**（ブログ除外は
AdSense/侵入性の設計判断として意図的に入っている・`src/components/StickyConvertBar.tsx:22-26`）。変更するなら👤ゲート。

---

## 9. 未検証事項と検証タスク（推測を事実として書かないための一覧）

| # | 未検証事項 | 検証方法 |
|---|---|---|
| 1 | **内部リンクCTR（§7の全EVの土台）**。当サイトに実測ゼロ | `/hogosha` へのリンクに `?src=home` 等を付け、`/api/school-click` と同型のD1一次記録を取る |
| 2 | **`/hogosha` 到達後のアフィリクリック率**。分母（到達数）が取れない | `cta_view`（`CtaViewTracker`・`src/components/ParentLeadCTA.tsx:73`）の `placement='parent-lp'` 分をGA4で分離し、D1 `parent-lp` 21件と突き合わせる |
| 3 | **referer=null 301件（87%）の実体**。スクレイパか、ブラウザのreferrer-policyか | `clicks.user_agent` の分布を集計。`AffiliateAd` の `<a>` は `rel="nofollow sponsored noopener"` のみで `referrerPolicy` 未指定（`AffiliateAd.tsx:82`）＝実ブラウザなら referer は送られるはず |
| 4 | `parent_funnel_events` が0件である理由（§8.2） | (a) 本人による実弾テスト (b) 11/15の窓点灯後に再確認 |
| 5 | 学校ページ3,089枚のうちGSC露出が233枚（7.5%）にとどまる理由 | index状況の確認（クロール済みか未クロールか）。距離解析の範囲外 |
| 6 | `#`アンカー断片125URL・101,257表示の扱い | 断片URLがGSCで別ページ計上されCTR0.004%。距離では解決できない（正規化かTOCのリンク構造の問題） |
| 7 | 未解決href 429件（§1.2） | `href={式}` の実体を個別に読む。ただし埋めても「∞ゼロ」の結論は変わらない |

---

## 10. 再現手順

```bash
# 距離データの再生成（ops/raw/revenue-distance.json を上書き）
NODE_TLS_REJECT_UNAUTHORIZED=0 node_modules/.bin/tsx scripts/revenue-distance.mjs

# 本書のD1実測の再取得（読み取り専用）
node scripts/d1q.mjs "SELECT COALESCE(placement,'(null)') p, COUNT(*) n FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY 1 ORDER BY n DESC"
node scripts/d1q.mjs "SELECT CASE WHEN referer IS NULL THEN 'referer_null' WHEN referer LIKE '%my-naishin.com%' THEN 'internal' ELSE 'external' END AS ref, COALESCE(placement,'(null)') p, COUNT(*) n FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY 1,2 ORDER BY n DESC"
```

本書は **調査のみ**。`src/` は1行も変更していない（新規追加は `scripts/revenue-distance.mjs` と `ops/` 配下のみ）。
