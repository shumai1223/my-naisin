# MONEY.md — 換金機構の再解剖（2026-08-10）

> 全行に出典（`file:line` / 実クエリ結果 / `ops/raw/*` の集計）を置く。
> 出典の無い主張は「未検証」と明示する（C1）。学校別の偏差値・ボーダー推定は一切書かない（C0）。
> 本ドキュメントは調査のみ。src/ は1行も変更していない。デプロイ・送信・フラグ点火はしていない。

---

## 0. この解剖で最初に確定した3つの事実（以降すべてこれを前提にする）

| # | 事実 | 出典 |
|---|---|---|
| **F1** | **D1 `clicks` の88%は「自サイトからの人間クリック」ではない。** 全629件中 referer を持つのは76件（12.1%）、うち内部referer（`https://my-naishin.com*`）は**72件**。直近28日は347件中 内部referer **43件（12.4%）** | `ops/raw/d1-clicks-crosstab.json` 集計 / `node scripts/d1q.mjs "SELECT COUNT(*),SUM(CASE WHEN referer LIKE 'https://my-naishin.com%' THEN 1 ELSE 0 END) FROM clicks WHERE created_at>=datetime('now','-28 days')"` → `{total:347, trusted:43}` |
| **F2** | 実ブラウザの同一オリジン遷移は **必ず referer を送る**（本番HTTPヘッダに `Referrer-Policy` は設定されていない＝ブラウザ既定 `strict-origin-when-cross-origin`＝same-originはフルURL送出）。よって referer 無しは「自サイト面からのクリックではない」を意味する | `curl -I https://my-naishin.com/hensachi`（UA偽装）→ 返却ヘッダに `Referrer-Policy` **無し**。`public/_headers:5` に `Referrer-Policy: strict-origin-when-cross-origin` があるが **Workers(OpenNext)デプロイでは `_headers` は適用されない**（同レスポンスに `x-opennext: 1` があり、`X-Frame-Options` / `X-Content-Type-Options` も返っていない） |
| **F3** | 直近28日のD1 347件は **233個の異なるIPハッシュ・67個のUA**に分散し、最多UA（Windows NT 10.0 Chrome）237件のうち214件が referer 無し。UA一覧には `MSIE 6.0 / Windows NT 4.0`・`iPad OS 7_1_2`・`iPod iPhone OS 3_0`・`GoogleOther` 等の化石/bot UAが混在 | `node scripts/d1q.mjs "SELECT substr(user_agent,1,70),COUNT(*),COUNT(DISTINCT ip_hash),SUM(referer IS NULL) FROM clicks WHERE created_at>=datetime('now','-28 days') GROUP BY 1 ORDER BY 2 DESC"` |

**帰結：本ドキュメントの「実クリック」は原則 内部referer付き（trusted）で数える。**
GSC期間（2026-07-10〜08-07）に揃えたD1は **376件中 trusted 39件**（`node scripts/d1q.mjs "... WHERE date(created_at) BETWEEN '2026-07-10' AND '2026-08-07'"`）。
→ **サイト全体の実「遷移率」＝ 39 ÷ 8,565（GSC 28日クリック・BRIEF §2） = 0.455%**。これを以降のC5計算の基準係数とする。

---

## 1. 配線の全体図（面 × 案件）

### 1-a. `src/lib/lead-config.ts` の面 × 案件 対応表（全14面・全数）

シーズン外（＝2026-08-11〜10-31）の解決値。`selectLeadOffer()` の合成順は `DEFAULT < 面 < 県 < 県×面`（`src/lib/lead-config.ts:360-365`）。

| 面ID | 主オファー | 主CPA | 副オファー | 副CPA | status | 定義 file:line |
|---|---|---|---|---|---|---|
| `result` | `sora-juku-text` | ¥10,000 | `moshimo-garden-gakushi` | ¥11,500 | live/live | `lead-config.ts:138` / `:394` |
| `hensachi` | `atama-text` | ¥7,500 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:152` / `:395` |
| `hyotei-heikin` | `atama-text` | ¥7,500 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:156` / `:396` |
| `prefecture` | `moshimo-manabuterasu`（34県） | ¥8,000 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:163` / `:397` |
| 〃 関東7県 | `morijuku-text`（県override） | ¥15,000 | 〃 | 〃 | live | `lead-config.ts:232,246-252` |
| 〃 関西6県 | `campus-text`（県override） | ¥15,000 | 〃 | 〃 | live | `lead-config.ts:228,239-244` |
| `parent-lp` | `moshimo-garden-chochiku` | ¥11,500 | `atama-text` | ¥7,500 | live/live | `lead-config.ts:144` / `:408` |
| `blog` | `sora-juku-text` | ¥10,000 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:211` / `:401` |
| `dashboard` | `moshimo-studycoach` | ¥5,000 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:168` / `:400` |
| `hiyou` | `moshimo-garden-gakushi` | ¥11,500 | `sora-juku-text` | ¥10,000 | live/live | `lead-config.ts:175` / `:406` |
| `mendan` | `moshimo-e-live` | ¥5,000 | `moshimo-garden-gakushi` | ¥11,500 | live/live | `lead-config.ts:180` / `:404` |
| `suisen` | `moshimo-minhoken` | ¥17,000 | `sora-juku-text` | ¥10,000 | live/live | `lead-config.ts:187` / `:407` |
| `naishin-up` | `sora-juku-text` | ¥10,000 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:192` / `:398` |
| `jitsugika` | `moshimo-withstudy` | ¥11,500 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:199` / `:399` |
| `futoukou` | `moshimo-tintoru` | ¥5,000 | `moshimo-garden-gakushi` | ¥11,500 | live/live | `lead-config.ts:204` / `:403` |
| `home` | `sora-juku-text` | ¥10,000 | `fp-soudan` | ¥13,800 | live/live | `lead-config.ts:217` / `:402` |
| （未設定面の床） | `zkai-text-request` | ¥800 | — | — | live | `lead-config.ts:86-92`（`DEFAULT_LEAD_OFFER`） |

CPA出典はすべて `src/lib/affiliate-economics.ts:84-156`。status は `src/lib/affiliates.ts:95-534`（`status:'pending'` が付いていないものが live／`isLiveAffiliate` は `affiliates.ts:537`）。

### 1-b. 季節スワップが上書きする面（**最重要の分岐**）

`SEASONAL_PLACEMENTS = {result, prefecture, naishin-up, jitsugika, dashboard}`（`lead-config.ts:311-317`）。
シーズン中は主オファーが `seasonalAffiliate()`（`lead-config.ts:333-339`）で強制置換される：専用枠（`winter/summer/last-minute-koushuu-trial`）は全て **pending**（`affiliates.ts:459-487`）→ 県の地盤塾（関東`morijuku-text`／関西`campus-text`）→ 無ければ `sora-juku-text`。

| シーズン | 期間 | 判定 |
|---|---|---|
| summer | **6/15〜8/10** | `seasonal.ts:82` |
| winter | 11/1〜12/31 | `seasonal.ts:80` |
| last-minute | 1/1〜2/15 | `seasonal.ts:81` |

**年間164日（45%）がシーズン中。D1の観測期間 2026-06-18〜08-10 は本日を含めほぼ全期間が summer。**
→ この期間、`prefecture` の `moshimo-manabuterasu`(¥8,000)、`jitsugika` の `moshimo-withstudy`(¥11,500)、`dashboard` の `moshimo-studycoach`(¥5,000) は **一度も主オファーとして描画されていない**。実測と完全に整合する（次章 2-b）。

### 1-c. `AFFILIATES` の在庫サマリ

| 区分 | 件数 | 出典 |
|---|---|---|
| 定義済み `AffiliateId` 総数 | 47 | `src/lib/affiliates.ts:1-61` |
| うち `status:'pending'`（描画されない先回し枠） | 13 | `affiliates.ts:254,263,272,281,291,300,309,335,346,355,459,468,479` |
| **live（描画可能）** | **34** | 差分 |
| D1 `clicks` に1件でも出現した affiliate_id | **27** | `ops/raw/d1-clicks-crosstab.json` |
| **live なのにD1に1件も出現しない** | **7** | 下表 |

live × D1ゼロの7件：`moshimo-manecafe` / `moshimo-withstudy` / `moshimo-manabuterasu` / `findit-fp-soudan` / `eten-net` / `eten-net-home` / `tenjin-chugaku`

---

## 2. 死配線の摘出（最重要）

### 2-a. 配置されているのに描画されない／効かない配線

| # | 症状 | 証拠 file:line | 判定 |
|---|---|---|---|
| a1 | **`futoukou` 面は世界のどこからも呼ばれていない。** `PLACEMENT_LEAD_OVERRIDES.futoukou`（`moshimo-tintoru` ¥5,000）と `PLACEMENT_SECONDARY_OFFER.futoukou` は完全な死に設定 | `lead-config.ts:204`,`:403` に定義。src全体で `placement="futoukou"` は **0件**（`grep -rn 'placement="[a-z-]*"' src` の全出力に不在）。不登校面は `FutoukouLeadCTA.tsx:36,54` が `placement="blog"` を使い、案件を `AffiliateAd id="moshimo-classjapan"/"moshimo-tintoru"` で直接ハードコード（`FutoukouLeadCTA.tsx:45,63`） | **死配線** |
| a2 | **`home` 面も一度も渡されていない。** トップページの2つのCTAはどちらも `placement` 無しで `affiliateId` 直指定 | `src/app/page.tsx:398-405`（`affiliateId="sora-juku-text"`, placement無し）／`src/app/HomeClient.tsx:643-650`（`affiliateId="atama-text"`, placement無し）。`PLACEMENT_LEAD_OVERRIDES.home` は `lead-config.ts:217` | **死配線**（主は偶然同一IDなので金額影響なし、副は消える→a4） |
| a3 | **`hensachi` / `hyotei-heikin` の主オファー設定は実ページに効かない。** 実ページが `affiliateId="atama-text"` を prop で明示するため常にpropが勝つ（`ParentLeadCTA.tsx:49`） | `HensachiResultFlow.tsx:79-88`／`HyoteiResultFlow.tsx:50-59`。設定側は `lead-config.ts:152,156`（コメント`:150-151`が「ハードコード済」と自認） | 設定は飾り（同一IDのため金額影響なし） |
| a4 | **`placement` を渡さない `ParentLeadCTA` は副オファーが必ず消える。** `selectSecondaryLeadOffer` は `if (!placement) return null`（`lead-config.ts:419`） | `placement` 無しの `ParentLeadCTA` 呼び出し **22箇所**：`page.tsx:398` / `HomeClient.tsx:643` / `[prefecture]/total-score/page.tsx:358` / `TotalScoreExplainerView.tsx:194` / `aichi,chiba,fukuoka,osaka,saitama,tokyo/total-score` 6箇所 / `hokkaido/rank:209` / `kanagawa/s-value:357` / `hensachi/{agekata:214,kyoka-betsu:136,moshi:210,shiboukou:144}` / `hyotei-heikin/suisen-kijun:237` / `katei-kyoshi:122` / `[prefecture]/naishin/layout.tsx:125` / `HensachiGyakusanResultFlow.tsx:30` / `Result/GapToTarget.tsx:218,233` | **死配線**。該当面のGSC 28日クリック合計 **3,425**（`/`1,879＋`*/total-score`1,018＋`/kanagawa/s-value`489＋`/hensachi/*`39）で副オファー（`fp-soudan` EV¥124.2/click）が0回描画 |
| a5 | **`prefecture` 面の主オファー `moshimo-manabuterasu`(¥8,000) は年間45%の期間、描画されない**（季節スワップ） | `lead-config.ts:163` vs `:311-317`,`:368-378`,`seasonal.ts:80-82`。D1実測 **manabuterasu 0件**（§1-c） | 期間限定の死配線 |
| a6 | **`jitsugika` 面の `moshimo-withstudy`(¥11,500) も同様に季節スワップで消える**うえ、`/jitsugika` はGSCインプレッションほぼ皆無 | `lead-config.ts:199` / `:311-317`。D1 `jitsugika` placement は全期間2件（`fp-soudan`1・`sora-juku-text`1）＝主が`withstudy`だった痕跡ゼロ | 死配線 |
| a7 | **`public/_headers` はWorkersデプロイに適用されていない**（＝セキュリティヘッダ4本が本番で欠落） | `public/_headers:1-6` vs 本番 `curl -I` の返却ヘッダ（`X-Frame-Options`/`X-Content-Type-Options`/`Referrer-Policy`/`Permissions-Policy` すべて無し・`x-opennext: 1`） | 死配線（換金外だが要修正） |
| a8 | **県override が面override を常に上書きする**ため、`prefectureCode` を渡す面は関東7県/関西6県で面設計が無効化される | `lead-config.ts:360-365`（`...placementOverride, ...prefOverride` の順）。実害があるのは `HogoshaLeadCTA.tsx:29`（`parent-lp` + 共有元県コード）＝保護者LPのFP相談が塾体験に置換される | 仕様通りだが設計意図と矛盾 |

### 2-b. 承認済み(live)なのに配置されていない案件 ★BRIEF の4件を判定

| affiliate_id | CPA | **コードでの判定** | 根拠 file:line | 結論 |
|---|---|---|---|---|
| **`moshimo-manecafe`** | ¥11,500 | **完全に未配置**。`lead-config.ts` の `PROGRAM_PRESET`（note/ctaText）と `affiliate-economics` に載っているだけで、`PLACEMENT_LEAD_OVERRIDES`・`PLACEMENT_SECONDARY_OFFER`・全コンポーネントのどこからも参照されない | 参照は `affiliate-economics.ts:93` と `lead-config.ts:108` のみ（`grep -rn "'moshimo-manecafe'" src` 全出力2件） | **未配置＝在庫死蔵** |
| **`findit-fp-soudan`** | ¥13,000（A8公開EPC222円） | **A/Bのバリアント側にのみ配置。露出は最大流入2面の副オファーの50%、しかも 2026-08-02 実装＝観測8日** | `HensachiResultFlow.tsx:42-44` / `HyoteiResultFlow.tsx:27-29`（`secondaryVariant==='findit'` のときだけ）。実験定義 `experiments.ts:842-861`（`status:'running'`、判定は2026年11月と明記） | **配置済み・露出極小**（未配置ではない） |
| **`moshimo-withstudy`** | ¥11,500〜18,000 | **`jitsugika` 面にのみ配置。しかも季節スワップで年間45%消える＋`/jitsugika` にGSC流入がほぼ無い** | `lead-config.ts:199` / `:311-317`。GSC 28日 `/jitsugika` は611行の page 次元に出現せず（`ops/raw/gsc-pages-28d.json`） | **配置済みだが到達不能** |
| **`moshimo-manabuterasu`** | ¥8,000 | **`prefecture` 面（＝D1で200クリックの最大面）に配置されているが、観測期間中ずっと summer シーズンで `sora-juku-text` に置換されていた** | `lead-config.ts:163` / `:333-339` / `seasonal.ts:82`（summer=6/15〜8/10）。D1観測期間は2026-06-18〜08-10 | **配置済みだが季節スワップで不出** |
| （追加）`eten-net` / `eten-net-home` / `tenjin-chugaku` | ¥1,905/¥1,905/¥2,000 | **完全に未配置**（`affiliate-economics.ts` にのみ存在） | `grep` 結果：`eten-net`→`affiliate-economics.ts:148` のみ、`eten-net-home`→`:149` のみ、`tenjin-chugaku`→`:152` のみ | 未配置（ただしEVは低く優先度も低い） |

> **結論の分かれ目**：BRIEF の4件のうち「本当に未配置」は `moshimo-manecafe` **1件だけ**。
> 残り3件は「配置済みだが、①A/Bで50%×8日、②季節スワップ、③無流入面 のいずれかで実質ゼロ露出」。
> → 打ち手は「配置する」ではなく **「季節スワップの除外ルール」と「面の選び直し」**。

### 2-c. 描画されているのにD1に正しく記録されない箇所

#### (1) `placement` が付かない経路 — 発生源

`AffiliateAd` は `goHref(ad.id, { pref, placement })` でURLを組む（`AffiliateAd.tsx:44`）。`goHref` は値が無ければクエリを付けない（`go-links.ts:31-39`）。

| 実測 | 数値 | 出典 |
|---|---|---|
| `<AffiliateAd>` 直接呼び出し総数（`AffiliateAd.tsx` 自身を除く） | **96箇所** | src全走査 |
| うち `placement=` も `viewPlacement=` も無い | **89箇所（93%）** | 同上 |
| `placement` 付き | 7箇所 | `juku-hiyou:186` / `tools:638` / `[prefecture]/naishin:481` / `JukuShindanClient:338` / `sougou-gata-senbatsu:155` / `hyotei-heikin:868` / （他1） |

placement 無しCTAの密集地：`ResultSection.tsx` **14箇所**、`hensachi/page.tsx` 7、`[prefecture]/naishin/page.tsx` 7、`hyotei-heikin/page.tsx` 6、`page.tsx` 4。

#### (2) `placement=null` 166件（26%）の発生源

`/go` は `placement` クエリが無いとき **referer のパスで代替**する（`src/app/go/[id]/route.ts` の `placementFromReferer()`）。よって：

```
placement クエリ有り  → placement = クエリ値（例 "hensachi"）
placement クエリ無し + 内部referer有り → placement = referer のパス（例 "/hensachi")   ← ★表記ゆれの発生源
placement クエリ無し + referer 無し   → placement = NULL                              ← ★166件の発生源
```

- **166件の内訳（全期間）**：`zkai-text-middle` 32・`zkai-text-request` 30・`sapuri-banner-300` 12・`shoin-banner` 10・`sora-juku-text` 9・`atama-text` 8・`sapuri-text` 8 … いずれも `ResultSection.tsx` / `page.tsx` / `blog/page.tsx` / `glossary` / `guide` / `prefectures` の **placement無しバナー**。全て referer も無い＝F1の bot 群と一致。
- 出典：`ops/raw/d1-clicks-crosstab.json`（`placement:null, referer:null` の行）

#### (3) `referer=null` 553件（88%）の発生源 — **アプリのバグではない**

- `/go` は `persistClick({ referer: clamp(request.headers.get('referer'),300) })` で受信ヘッダをそのまま保存する（`route.ts` の `persistClick` 呼び出し部）。欠落する加工はしていない。
- 本番は `Referrer-Policy` を返していない（F2）＝ブラウザ既定でsame-originはフルURL送出。
- **したがって referer=null は「/go を直接叩かれた」＝ 自サイト面を経由していないアクセス。**
- 補強証拠：直近28日 347件が **233 IPハッシュ**に分散、最多UAの214件がreferer無し（F3）。`bot-filter.ts` の `classifyClick()` はこれを **`suspect`** に分類する（`bot-filter.ts:83-89`）。
- さらに決定的：`fp-soudan × naishin-up` 64件・`sora-juku-text × naishin-up` 54件・`morijuku-text × naishin-up` 9件・`campus-text × naishin-up` 3件は、**47都道府県の `/{pref}/naishin` ページを1〜2周する巡回**と件数構造が一致（関東7県＝morijuku 9、関西6県＝campus 3）。同期間のGSCで `*/naishin` は1,043クリックあるが、**内部referer付きのアフィリクリックは0件**（GSC期間内。`/aichi/naishin` の1件は7/09、`/kochi/naishin` の3件は8/08で窓外）。
- 出典：`node scripts/d1q.mjs "SELECT date(created_at),affiliate_id,placement,referer FROM clicks WHERE referer LIKE '%naishin.com/%naishin%' ORDER BY created_at"`

#### (4) 表記ゆれ（`hensachi` vs `/hensachi`）の発生源 — file:line で確定

| 記録値 | 書く経路 | file:line | 全期間件数 |
|---|---|---|---|
| `hensachi`（スラッシュ無し） | `HensachiResultFlow` の `ParentLeadCTA placement="hensachi"` → `ParentLeadCTA.tsx:91`（`placement={placement}`）→ `AffiliateAd.tsx:44` `goHref(...,{placement})` → `/go/atama-text?placement=hensachi` | `HensachiResultFlow.tsx:80` | 8 |
| `/hensachi`（スラッシュ付き） | `/hensachi` 本文の **placement無し** `<AffiliateAd>` → クエリ無し → `/go/[id]/route.ts` の `placementFromReferer()` が `new URL(referer).pathname` を書き込む | `src/app/hensachi/page.tsx:325,328,331,668,670,679,681` | 8 |
| `hyotei-heikin` | `HyoteiResultFlow` の `ParentLeadCTA placement="hyotei-heikin"` | `HyoteiResultFlow.tsx:51` | 1 |
| `/hyotei-heikin` | `/hyotei-heikin` 本文の placement無し `<AffiliateAd>` | `src/app/hyotei-heikin/page.tsx:278,281,284,530,539` | 2 |
| 同型の他の例 | `/kochi/naishin` 3・`/tokyo/total-score` 3・`/kanagawa/s-value` 1・`/hensachi/agekata` 1・`/blog/toritsu-nyushi-2026-kanzen-guide` 1・`/` 12 | すべて placement 無し呼び出し | 21 |

> つまり **「スラッシュ付き＝placementを渡し忘れた面」の目印**。`placementFromReferer` は取りこぼし回収として機能しているが、結果として集計キーが2系統に割れ、`getClickSummary`（`clicks-db.ts:161-181`）の `GROUP BY placement` が面を二重計上する。

#### (5) GA4 と D1 の乖離

- GA4 `affiliate_click` = **2件/28日**（BRIEF §4）、D1 = 347件。乖離174倍。
- `AffiliateClickTracker` はルートレイアウトに常設されており計装漏れではない（`src/app/layout.tsx:13,102`）。
- D1 trusted 39件 vs GA4 2件 の差は Consent Mode/広告ブロッカーによる既知の過少計測（[[ga4-undercounts-conversions]]）。**D1 347件 vs GA4 2件の差の大半は「JSを実行していないアクセス」＝F1と同じ結論**。

---

## 3. ページ × 案件 × 実クリック数の帰属表（期間を揃えた比較）

期間：**GSC 2026-07-10〜08-07（28日）／D1 `date(created_at) BETWEEN '2026-07-10' AND '2026-08-07'`（376件・うち trusted 39件）**

### 3-a. 面別 換金率（trusted＝人間クリックのみ）

| ページ／面 | GSC 28日クリック | GSC 28日表示 | D1 trusted クリック | **換金率** | 押された案件 |
|---|---|---|---|---|---|
| `/`（トップ） | 1,879 | 29,752 | **22** | **1.17%** | atama-text 11・moshimo-garden-chochiku 4・sapuri-banner-300 2・zkai-banner 2・zkai-text-request 2・zkai-text-middle 1 |
| `/hensachi` | 1,601 | 32,513 | **5** | **0.31%** | atama-text 5 |
| `/hyotei-heikin` | 920 | 5,478 | **1** | **0.11%** | atama-text 1 |
| `/tokyo/total-score` | 908 | 5,636 | **2** | **0.22%** | atama-banner 2 |
| `/kanagawa/s-value` | 489 | 2,189 | **1** | **0.20%** | morijuku-text 1 |
| `/reverse` | 42 | 839 | **3** | **7.1%** | morijuku-text 2・sora-juku-text 1 |
| `/mendan` | 13 | 375 | **2** | **15.4%** | moshimo-e-live 2 |
| `/koukou-hiyou/kokoroze` | 0（GSC未出現） | 0 | **1** | — | moshimo-garden-gakushi 1 |
| `/juku-shindan` | 0（GSC未出現） | 0 | **2** | — | atama-text 1・moshimo-e-live 1 |
| **`/blog/*`（164枚）** | **1,501** | **195,549** | **0** | **0.00%** | — |
| **`*/naishin`（40枚）** | **1,043** | **31,306** | **0** | **0.00%** | — |
| `*/total-score`（tokyo除く43枚） | 110 | 3,143 | 0 | 0.00% | — |
| `/pref/*/school/*`（233枚） | 7 | 605 | 0 | 0.00% | **換金コードが1行も無い**（下記） |
| `/hensachi/*` クラスタ（13枚） | 39 | 3,210 | 0 | 0.00% | — |
| お金クラスタ（7枚） | 4 | 239 | 0 | 0.00% | — |

出典：GSC＝`ops/raw/gsc-pages-28d.json` を python で page パス集計／D1＝上記 d1q 結果（trusted 39件の内訳、全19行）。

### 3-b. 参考：bot込みD1（全期間629件）の placement × affiliate 上位

| placement | 件数 | 主な案件 | trusted比率 |
|---|---|---|---|
| `prefecture` | 200 | fp-soudan 50・sora-juku-text 44・zkai-banner 35・atama-banner 33・sapuri-banner-300 30 | 0/200 |
| `(null)` | 166 | zkai-text-middle 32・zkai-text-request 30・sapuri-banner-300 12 | 6/166 |
| `naishin-up` | 131 | fp-soudan 64・sora-juku-text 54・morijuku-text 9・campus-text 3 | 1/131 |
| `parent-lp` | 27 | atama-text 16・moshimo-garden-chochiku 8・sora-juku-text 3 | 16/27 |

出典：`ops/raw/d1-clicks-crosstab.json`。
→ **クリック数トップ3面（prefecture/null/naishin-up・計497件＝79%）の trusted は 7件（1.4%）。逆に `parent-lp` は27件中16件（59%）が trusted。**
→ `parent-lp` を出す `/hogosha` は **GSCインプレッション0**（BRIEF §2 収益面の実測）。**流入ゼロの面が、サイト全体の人間クリックの41%(16/39)を叩き出している。**

> ⚠️ 制約の明示：この16件の referer は `https://my-naishin.com/`（パス無し）で記録されており、
> ページの特定は placement 値からの逆引き（`placement="parent-lp"` は `/hogosha` 系＝`hogosha/page.tsx:228,237,353` / `HogoshaLeadCTA.tsx:29` / `koukou-hiyou/page.tsx:121` / `juken-schedule/page.tsx:137`）に依存する。
> **referer だけではページ帰属できない＝placement クエリの付与が必須**、という §2-c の結論を裏付ける。referer がパスを失う機序は**未検証**（検証タスク→§6 B-9）。

---

## 4. 収益ゼロのページ比率 / 上位20%の集中度

| 指標 | 実測 | 出典 |
|---|---|---|
| GSCに出現するページ | **611枚**（clicks合計8,649・impr合計317,005） | `ops/raw/gsc-pages-28d.json` |
| うち **クリック0のページ** | **464枚（76.0%）**・その表示 **92,184** | 同・python集計 |
| うち **D1に1度も現れないページ** | **597枚（97.7%）** | referer付きD1クリックを生んだページは **全期間で14枚のみ**（`/`・`/hensachi`・`/kochi/naishin`・`/tokyo/total-score`・`/hyotei-heikin`・`/reverse`・`/juku-shindan`・`/mendan`・`/kanagawa/s-value`・`/juku-hiyou`・`/koukou-hiyou/kokoroze`・`/aichi/naishin`・`/hensachi/agekata`・`/blog/toritsu-nyushi-2026-kanzen-guide`） |
| **捨てられている流入量** | 14枚に着地したGSCクリックは5,881。**残り 2,768クリック（32.0%）は、1度もアフィリクリックを生んだことのないページに落ちている** | 同 |
| さらに厳密に（GSC28日窓に揃える） | trusted を生んだページは **9枚**。この9枚のGSCクリック合計 5,352 → **窓内クリック 8,649 のうち 3,297（38.1%）は換金実績ゼロのページ着地** | §3-a |
| 上位20%集中度（全611枚中の上位122枚） | **クリックの99.7%** | 同 |
| 上位20%集中度（クリックのある147枚中の上位29枚） | **クリックの93.7%** | 同 |
| 上位12ページ | `/`1,879・`/hensachi`1,601・`/hyotei-heikin`920・`/tokyo/total-score`908・`/blog/all-3-high-school-options-2026-update`648・`/kanagawa/s-value`489・`/hyogo/naishin`264・`/kanagawa/naishin`195・`/osaka/naishin`172・`/blog/naishinten-average-score`120・`/blog/naishinten-30-high-school`106・`/blog/hyotei-heikin-4-5-high-school`91 | 同 |

### 4-b. 換金コードが1行も存在しないページ群

| ページ群 | 枚数 | GSC 28日 表示／クリック | 証拠 |
|---|---|---|---|
| `/pref/[code]/school/[schoolCode]`（学校ページ） | 233 | 605／7 | `grep -n "AffiliateAd\|ParentLeadCTA\|selectLeadOffer\|goHref" "src/app/pref/[code]/school/[schoolCode]/page.tsx"` → **0ヒット** |
| `/pref/[code]`（県別まとめ） | 47（GSC0） | 0／0 | 同ファイル `src/app/pref/[code]/page.tsx` → **0ヒット** |

→ Λ-2で拡張中の学校ページ層は、現時点で **換金機構が存在しない**。冬ピークで倍率クエリが爆発しても1円も受け取れない構造。

---

## 5. 承認済みCPAと、現在の実クリック配分（C5）

### 5-a. live オファーの EV ランキング（サイト自身の物差し）

EV/click ＝ `convRateLow × cpaYen × CONFIRM_RATE(0.6)`（`affiliate-economics.ts:64,194-208`・`ev-engine.ts`）。**すべて未実測の仮置き係数であることは `affiliate-economics.ts:4-8` が自認している。**

| 順位 | 案件 | CPA | convRateLow | **EV/click** | 現在の主な配置面 |
|---|---|---|---|---|---|
| 1 | `morijuku-text` | ¥15,000 | 0.040 | **¥360.0** | 関東7県override |
| 1 | `campus-text` | ¥15,000 | 0.040 | **¥360.0** | 関西6県override |
| 3 | `moshimo-withstudy` | ¥11,500 | 0.040 | ¥276.0 | jitsugika（到達不能） |
| 4 | `morijuku-banner`/`campus-banner` | ¥15,000 | 0.030 | ¥270.0 | `[prefecture]/naishin:691,700` |
| 6 | `sora-juku-text` | ¥10,000 | 0.040 | ¥240.0 | result/blog/home/naishin-up＋季節フォールバック |
| 7 | `moshimo-manabuterasu` | ¥8,000 | 0.040 | ¥192.0 | prefecture（季節で不出） |
| 8 | `moshimo-classjapan` | ¥20,000 | 0.015 | ¥180.0 | FutoukouLeadCTA |
| 8 | `atama-text` | ¥7,500 | 0.040 | ¥180.0 | **hensachi/hyotei-heikin（最大流入2面）** |
| 11 | `moshimo-minhoken` | **¥17,000（最高CPA）** | 0.015 | **¥153.0** | suisen |
| 13 | `fp-soudan` | ¥13,800 | 0.015 | ¥124.2 | 8面の副オファー |
| — | `zkai-text-request` | ¥800 | 0.060 | ¥28.8 | DEFAULT床 |
| — | `sapuri-banner-300` | ¥1,500 | 0.006 | ¥5.4 | ResultSection他 |
| — | `zkai-banner`/`zkai-text-middle` | ¥500 | 0.005 | **¥1.5** | ResultSection他 |

### 5-b. 「高CPA案件に何%のクリックが流れているか」— 1つの数字

| 母集団 | 高CPA（CPA≥¥10,000）へのクリック比率 | 加重平均CPA | 加重EV/click |
|---|---|---|---|
| **D1 trusted 39件（人間・28日）** | **23.1%** | ¥7,272 | **¥148.2** |
| D1 全629件（bot込み・全期間） | 53.3% | ¥8,095 | ¥133.3 |
| 参考：`kind:'paid'`（＝北極星違反の有料成約型）への流出 | 全629件中 **24.8%** | — | — |

**→ 求められた1つの数字：人間クリックの 23.1% しか高CPA案件（≥¥10,000）に流れていない。**

### 5-c. 単価ミックスの損失（円）

C5式：`EV(円/月) = 月間検索クリック × 遷移率 × (発生率 × 承認率 × 単価)`

| 係数 | 値 | 出典／仮置きの根拠 |
|---|---|---|
| 月間GSCクリック | **10,667** | BRIEF §2（2026-07-01〜07-31実測） |
| 遷移率（GSCクリック→アフィリクリック） | **0.455%** | **実測**：D1 trusted 39 ÷ GSC 8,565（同一28日窓） |
| 発生率（convRateLow） | 案件別 0.005〜0.06 | `affiliate-economics.ts:84-156`（**仮置き**。根拠＝同ファイル `:24-42` の業界公開値クロスチェック） |
| 承認率（CONFIRM_RATE） | **0.6** | `affiliate-economics.ts:64`（**仮置き**。根拠＝業界目安70%より保守側） |
| 成功確率 | 1.0（配線変更のみで確実に反映されるため） | 本節は「今のクリックを別案件に付け替える」だけの計算 |

月間アフィリクリック = 10,667 × 0.455% = **48.6 クリック/月**

| シナリオ | EV/click | 月次EV | 現在との差 |
|---|---|---|---|
| **現在のミックス**（trusted 39件の構成） | ¥148.2 | **¥7,199/月** | — |
| **最高CPA案件（`moshimo-minhoken` ¥17,000）に全寄せ** | ¥153.0 | ¥7,431/月 | **+¥232/月** |
| 全国対応の最良案件（`sora-juku-text` ¥10,000）に全寄せ | ¥240.0 | ¥11,664/月 | +¥4,465/月 |
| **最高EV案件（`morijuku-text`/`campus-text` ¥15,000）に全寄せ**（理論上限・地盤13県のみ有効なので実現不能） | ¥360.0 | ¥17,486/月 | **+¥10,287/月** |

> **この計算が示す最重要の含意：**
> **「最高CPA案件に寄せる」は +¥232/月 にしかならない。** サイト自身の `convRateLow` を使うと、CPA¥17,000のFP相談（発生率1.5%）は CPA¥10,000の塾体験（発生率4.0%）に EV で負ける。
> **単価ミックスの損失は最大でも ¥4,465/月（現実的な全国案件基準）であり、ボトルネックは単価ではなく遷移率0.455%の側にある。**
> 参考：遷移率をトップページ実測の **1.17%**（§3-a）までサイト平均で引き上げると、ミックスを一切変えなくても 48.6→124.8クリック/月・**¥18,495/月（+¥11,296/月）**。単価ミックス最適化の2.5倍のレバー。

---

## 6. 出血点ランキング（影響の大きさ順・最大10件）

### 出血1 — `/blog` 164枚（GSC 1,501クリック/28日）が1円も生んでいない
| | |
|---|---|
| **症状** | 全ブログ記事に `ParentLeadCTA placement="blog"`（主`sora-juku-text` EV¥240）が入っているのに、内部referer付きのアフィリクリックは**全期間で1件**（`/blog/toritsu-nyushi-2026-kanzen-guide` の `zkai-text-middle`＝EV¥1.5の最低EV案件） |
| **証拠** | 配線：`src/app/blog/[slug]/page.tsx:349`。実測：`ops/raw/gsc-pages-28d.json`（`/blog/*` 164枚 1,501クリック）／`ops/raw/d1-clicks-crosstab.json`（`placement='blog'` 9件・うち内部referer 0件、referer付きblogクリックは1件） |
| **推定影響** | ブログ月間クリック ≈ 1,853（1,501×10,667/8,649）。トップページ実測遷移率1.17%が出れば 21.7クリック/月 × EV¥240 = **¥5,208/月**。現状ほぼ¥0 → **出血 約¥5,200/月**（仮置き：遷移率は自社実測の最高値を上限とした。同一 `ParentLeadCTA` コンポーネントを使っているため到達可能と判断） |
| **最小の直し方** | ①記事内CTAの位置を本文冒頭直後にも1つ増やす（`blog/[slug]/page.tsx:349` は記事末のみ）②`blog` 面の副オファーは `fp-soudan`（EV¥124）だが記事の8割が「内申点の数字」クエリ→主を `sora-juku-text` のまま、**記事末CTAより上に `AffiliateAd` を1本置くのではなく、まず `cta_view` を計測して到達自体を確認する**（現状 blog面の `cta_view` が分離できていない） |
| **人間ゲート** | 不要（src変更のみ・デプロイは👤） |

### 出血2 — D1 `clicks` の88%がbot由来で、勝者判定が丸ごと汚染されている
| | |
|---|---|
| **症状** | `lead-config.ts` は「GA4/D1の勝者をこの表に反映していく」設計（`lead-config.ts:6-7`）だが、判定材料のD1が88%bot。実際「最大の面」に見える `prefecture`(200件)・`naishin-up`(131件) の trusted はそれぞれ 0件・1件 |
| **証拠** | F1/F3（§0）／`ops/raw/d1-clicks-crosstab.json`／`node scripts/d1q.mjs` の IP・UA分散クエリ。分類ロジックは `src/lib/bot-filter.ts:83-89`（`classifyClick`）が既に存在するのに、`getClickSummary`（`clicks-db.ts:161-181`）の既定は `trustedOnly` **未指定＝全件** |
| **推定影響** | 円換算不能だが最大級。**この汚染データを根拠に面のオファーを差し替えると、EV¥360の案件をEV¥1.5の案件に置き換える誤判断が起きうる**（現に `/kochi/naishin` で発生した唯一の人間クリック3件は `shoin-banner`＝EV¥18の最低EV枠に落ちている：`[prefecture]/naishin/page.tsx:674`） |
| **最小の直し方** | `getClickSummary` / `getClickTrend` / `getRefererSummary` の呼び出し側（`/admin/report`・`generate-sales-report`）を **`trustedOnly:true` 既定**にする。関数は既にオプションを持っている（`clicks-db.ts:146-148`） |
| **人間ゲート** | 不要 |

### 出血3 — `*/naishin` 40枚（GSC 1,043クリック/28日）から人間のアフィリクリックが28日窓でゼロ
| | |
|---|---|
| **症状** | `/{pref}/naishin` は1ページに `ParentLeadCTA`×3（`layout.tsx:125` placement無し・`page.tsx:438` naishin-up・`page.tsx:709` prefecture）＋ `AffiliateAd`×7（`:481,665,674,682,691,700`）＝**10枠**を積んでいるのに、GSC窓内の trusted クリックは0 |
| **証拠** | 配線：上記 file:line。実測：§3-a（GSC 1,043 / trusted 0）／`node scripts/d1q.mjs "... referer LIKE '%naishin.com/%naishin%'"` → 4件のみ（7/09・8/08、いずれも窓外） |
| **推定影響** | 月間クリック ≈ 1,287。トップページ実測遷移率1.17%なら 15.1クリック/月 × EV¥240（そら塾／関東関西は¥360）= **¥3,616〜¥5,424/月**。現状¥0 |
| **最小の直し方** | 広告枠を減らして1枠に集約する（10枠の広告過密はCTAの識別性を潰す仮説）。まず `layout.tsx:125` の placement 無しCTA（`page.tsx:438` と重複）を削除し、`cta_view` の実測を取る |
| **人間ゲート** | 不要 |

### 出血4 — 季節スワップが「年間45%・冬ピーク全域」で高EV案件を締め出す
| | |
|---|---|
| **症状** | `result/prefecture/naishin-up/jitsugika/dashboard` の5面が、summer(6/15-8/10)・winter(11/1-12/31)・last-minute(1/1-2/15) の **合計164日／年** は主オファーを強制的に `sora-juku-text`（または県地盤塾）へ置換。専用の季節枠3件は全て `pending`＝存在しない |
| **証拠** | `lead-config.ts:311-317,320-324,333-339,368-378` ／ `seasonal.ts:77-84` ／ `affiliates.ts:459,468,479`（3件とも `status:'pending'`）。実測：`moshimo-manabuterasu` 0件・`moshimo-withstudy` 0件（§1-c） |
| **推定影響** | `prefecture` 面：置換で `manabuterasu`(EV¥192)→`sora-juku-text`(EV¥240) は+、`jitsugika`：`withstudy`(EV¥276)→`sora-juku`(EV¥240) は−、`dashboard`：`studycoach`(EV¥120)→`sora-juku`(EV¥240) は+。**現時点の純EV影響は小さい（±¥36/click）が、pendingの季節枠が承認された瞬間に EV¥120の未検証案件（`winter-koushuu-trial` CPA¥4,000）へ5面が自動で切り替わり、EV¥240→¥120の半減が無警告で起きる**（`isLiveAffiliate` になった瞬間に `seasonalAffiliate` が最優先で返す：`lead-config.ts:334-335`） |
| **最小の直し方** | `seasonalAffiliate()` に「専用枠のEVが現行フォールバックのEVを下回るなら採用しない」ガードを入れる（`affiliate-economics.confirmedPer1000` で比較可能・`affiliate-economics.ts:206-208`）。CIの不変条件テストを1本追加 |
| **人間ゲート** | 不要（フラグ点火ではない） |

### 出血5 — 学校ページ233枚＋県まとめ47枚に換金コードが1行も無い
| | |
|---|---|
| **症状** | Λ-2で拡張中の面に `AffiliateAd`/`ParentLeadCTA`/`selectLeadOffer`/`goHref` が皆無 |
| **証拠** | `grep -n "AffiliateAd\|ParentLeadCTA\|selectLeadOffer\|goHref" "src/app/pref/[code]/school/[schoolCode]/page.tsx" "src/app/pref/[code]/page.tsx"` → **0ヒット** |
| **推定影響** | 現時点：GSC 605表示/7クリック → 月間 ≈ 8.6クリック × 1.17% × EV¥240 = **¥24/月**（ほぼゼロ）。ただし冬ピーク（2月にS値系11.7倍・BRIEF §7）で「○○高校 倍率」が伸びた場合、この面が最大流入になっても受け皿が無い＝**構造的な機会損失** |
| **最小の直し方** | `prefecture` 面の `ParentLeadCTA prefectureCode={code} placement="prefecture"` を1行入れる（既存エンジンで解決・新規案件不要）。※学校別の偏差値/ボーダーは書かない（C0） |
| **人間ゲート** | 不要。ただし index解禁の県単位ゲートは既存ルール通り👤 |

### 出血6 — 副オファーが 22 の呼び出し箇所で無言に消える（GSC 3,425クリック/28日の面）
| | |
|---|---|
| **症状** | `placement` を渡さない `ParentLeadCTA` は `selectSecondaryLeadOffer` が `null` を返し、副オファー（多くは `fp-soudan` EV¥124.2）が描画されない |
| **証拠** | `lead-config.ts:419`（`if (!placement) return null`）。該当22箇所（§2-a a4に全リスト）。影響面のGSC28日クリック＝`/`1,879＋`*/total-score`1,018＋`/kanagawa/s-value`489＋`/hensachi/*`39 = **3,425** |
| **推定影響** | 月間 ≈ 4,224クリック × 遷移率0.455% = 19.2 主クリック/月。副オファーのクリックは主の何割かが**未実測**（`placement='hensachi'` の `fp-soudan` は0件だが、副が有効化されたのは2026-08-02＝観測8日：`ParentLeadCTA.tsx:55-57`）。仮に副が主の20%（根拠：副は小さいテキストリンク・`ParentLeadCTA.tsx:108-116`）なら 3.8クリック/月 × EV¥124.2 = **¥478/月** |
| **最小の直し方** | 22箇所に `placement="..."` を追記するだけ（既に該当ページは `selectLeadOffer({placement:'prefecture'})` を上で呼んでいる例が多い：`[prefecture]/total-score/page.tsx:95` / `TotalScoreExplainerView.tsx:28`）。**同じ修正で §2-c の placement 欠落・表記ゆれも同時に解消する** |
| **人間ゲート** | 不要 |

### 出血7 — トップページ結果画面がEV¥1.5〜¥7.2の有料型バナーで埋まっている
| | |
|---|---|
| **症状** | `/`（GSC 1,879クリック・サイト最大）の内申点計算結果画面 `ResultSection` に `<AffiliateAd>` が14箇所あり、その中身は `zkai-banner`(EV¥1.5)・`zkai-text-middle`(¥1.5)・`zkai-text-advanced`(¥1.5)・`sapuri-text`(¥7.2)・`sapuri-banner-300`(¥5.4)×3・`shoin-banner`(¥18)×2・`zkai-text-request`(¥28.8)×2。高EVは `HomeClient.tsx:643` の `atama-text`(¥180) 1本のみ |
| **証拠** | `src/components/ResultSection.tsx:349,369,370,390,391,411,412,434,445,454,475,688,689,775`（`HomeClient.tsx:37,587` で結果表示時に描画）。EV出典 `affiliate-economics.ts:128-145`。実測：トップの trusted 22件のうち **7件（32%）が zkai/sapuri 系＝EV¥1.5〜¥28.8** に流出（§3-a） |
| **推定影響** | トップ月間クリック ≈ 2,318 × 0.455% = 10.5 アフィリクリック/月。うち32%（3.4件）が平均EV≒¥8 の枠へ。同数を `sora-juku-text`(¥240) に振り替えると **+¥789/月**。実測ベース（22件中7件・28日）でも同オーダー |
| **最小の直し方** | `ResultSection` の `zkai-banner`/`zkai-text-advanced`/`sapuri-*` を `rankLiveOffersByEV()`（`affiliate-economics.ts:229-243`）の上位に置換。既に `topLiveOfferByEV()`（`:250-254`）という選択関数がある＝IDハードコードを外すだけ |
| **人間ゲート** | 不要 |
| **注意** | [[affiliate-density-cleanup]] の教訓「低EV重複は削除一辺倒でなく別プログラムで2タッチ以上を維持」に従い、削除ではなく**置換**すること |

### 出血8 — `moshimo-manecafe`(CPA¥11,500) が完全に未配置＝在庫死蔵
| | |
|---|---|
| **症状** | live なのに参照が `affiliate-economics.ts:93` と `lead-config.ts:108`（文言プリセット）の2箇所だけ。どの面にも副にも載っていない |
| **証拠** | `grep -rn "'moshimo-manecafe'" src` → 2ヒット（上記のみ） |
| **推定影響** | 単体では EV¥103.5/click＝`fp-soudan`(¥124.2) より低いので、**新規配置の価値は小さい**。真の価値は「FP相談4社（`fp-soudan`/`garden-gakushi`/`garden-chochiku`/`manecafe`/`minhoken`/`findit`）の発生率が全て0.015の仮置きで、実測が1件も無い」ことの露呈。仮に FP勢の実発生率が仮置きの2倍（3%）なら `fp-soudan` EV は¥248→§5の結論が変わる |
| **最小の直し方** | 新規配置ではなく、**FP勢のローテーション実験を1面（`hiyou`）で回して発生率を実測**する。実験基盤は `experiments.ts` に既存 |
| **人間ゲート** | 不要（A/B定義追加はsrc変更） |

### 出血9 — `placement` が93%の `AffiliateAd` に無く、面別集計が二重化している
| | |
|---|---|
| **症状** | 96箇所中89箇所（93%）が `placement` 無し。`/go` の `placementFromReferer()` がパス文字列で代替するため、`hensachi` と `/hensachi`・`hyotei-heikin` と `/hyotei-heikin` が別キーになる |
| **証拠** | src全走査（§2-c(1)）／`/go/[id]/route.ts` の `placementFromReferer()`／`ops/raw/d1-clicks-crosstab.json` の placement 一覧（24種のうち9種がスラッシュ始まり） |
| **推定影響** | 直接の円損失はゼロだが、**`getClickSummary` の `GROUP BY placement`（`clicks-db.ts:168`）が同じ面を2行に割る＝出血1〜3の判断を誤らせる**。実測で `/hensachi`8 + `hensachi`8 が別計上 |
| **最小の直し方** | ①出血6の修正で大半が解消 ②`placementFromReferer` の戻り値を先頭スラッシュ無しに正規化（1行）＋既存行のマイグレーションは不要（集計側で `ltrim(placement,'/')`） |
| **人間ゲート** | 不要 |

### 出血10 — 本番にセキュリティヘッダが1本も出ていない（`public/_headers` がWorkersで無効）
| | |
|---|---|
| **症状** | `X-Frame-Options` / `X-Content-Type-Options` / `Referrer-Policy` / `Permissions-Policy` の4本が本番レスポンスに存在しない |
| **証拠** | `curl -I https://my-naishin.com/hensachi`（ブラウザUA）→ 返却ヘッダに4本とも無し・`x-opennext: 1`。設定は `public/_headers:1-6`（Cloudflare **Pages** の機能） |
| **推定影響** | 換金への直接影響は無い。ただし①クリックジャッキング耐性ゼロ ②`Referrer-Policy` をブラウザ既定に委ねているため、将来ブラウザが既定を厳格化すると **D1の面別帰属（`placementFromReferer`）が丸ごと死ぬ** |
| **最小の直し方** | `next.config.mjs` に `headers()` を追加、または OpenNext のミドルウェアで付与。`/embed/*` の例外（`_headers:9-11`）を移植すること |
| **人間ゲート** | 不要（設定ファイル変更・デプロイは👤） |

---

## 7. 未検証として残したもの（推測を事実として書かないため）

| # | 未検証事項 | 検証方法 |
|---|---|---|
| B-9 | `referer` が `https://my-naishin.com/`（パス無し）で記録される機序。29件中少なくとも16件は placement から `/hogosha` 系と推定されるが確証なし | Coworkで実ブラウザ（iOS Safari / Android Chrome）から `/hogosha?...` → CTAクリックを実行し、D1の referer 実値を確認（loop単独では実ブラウザ検証不可） |
| B-10 | FP相談系6案件の実発生率（`convRateLow=0.015` は全て仮置き・`affiliate-economics.ts:86-94,155`） | ASP管理画面の実績（👤のみ閲覧可）。実測1件も無い |
| B-11 | 静的プリレンダされたページで `resolveSeason()` がいつ評価されるか（本番 `/hensachi` は `x-nextjs-prerender: 1` / `Cache-Control: s-maxage=31536000`）。11/1の冬モード切替がデプロイ無しで反映されるか不明 | 11/1前後にステージングで日付を進めてビルド → HTMLに焼かれた文言を確認 |
| B-12 | 副オファー（テキストリンク）のクリック比率。`placement='hensachi'` の `fp-soudan` が0件なのは、露出開始が2026-08-02（`ParentLeadCTA.tsx:55-57`）で観測8日しかないため。真に押されないのか観測不足かは未分離 | 2026-09末に同クエリを再実行 |
| B-13 | `parent_funnel_events` が全期間0件（BRIEF §3）と、`/hogosha` がGSCインプレッション0であることの因果 | 別ドキュメント（FUNNEL側）の担当範囲 |
