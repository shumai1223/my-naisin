# CORRECTIONS.md — PHASE 0 成果物 数値誤りの確定訂正台帳

- 作成: 2026-08-10（PHASE 1 THREATS/CLOCK 担当 起動前チェック）
- 対象: `ops/MONEY.md` / `ops/DISTANCE.md` / `ops/BAR.md` / `ops/STATE.json` / `ops/DEADWIRE.md`
- 方針: 独立criticが指摘した「数値が間違っている」項目だけを、**自分で検算コマンドを再実行して**確定する。
  「設計上の意見の相違」（EV/click の定義違い・placement 89箇所を直すか等）は対象外＝本書に載せない。
- **成果物ファイル自体（MONEY.md 等）は一切書き換えていない。** `src/` も1行も変更していない。
  本番への書き込み・デプロイ・送信・env変更・フラグ点火は行っていない。
- 全項目、本書作成時点（2026-08-10 12:55 UTC前後）に自分で実行したコマンドの出力で確認済み。
  D1 は本番の読み取り専用ライブテーブルのため、critic側の取得時刻との間で±数件のドリフトが生じている
  箇所がある（各行に明記）。ドリフトは「誤り」ではなく計測時刻の違いであり、訂正の対象にしていない。

---

## 1. MONEY.md の訂正（C-1〜C-4）

| ID | 対象ファイル:箇所 | 誤 | **正** | 検算コマンド | 下流への波及 |
|---|---|---|---|---|---|
| **C-1** | `MONEY.md:172`（§3-a「/」行）／再利用先 `:289`(§5-c)・`:300`(出血1)・`:318`(出血3)・`:336`(出血5) | 「`/`（トップ）trusted **22** → 換金率 **1.17%**」を「トップページの実力上限」として以後4箇所で係数採用 | **22件のうち14件は `placement=parent-lp`。** `parent-lp` を設定しているコードは `src/app/hogosha/page.tsx:228,237,353` / `src/app/koukou-hiyou/page.tsx:121` / `src/app/juken-schedule/page.tsx:137` / `src/components/HogoshaLeadCTA.tsx:29` の6箇所のみで、**トップページには1つも無い**。トップページに帰属できるのは残り **8件**（`placement="/"` 7 + `hensachi` 1）。修正後の換金率＝**8 ÷ 1,879 = 0.43%**（元の1.17%の37%）。**この0.43%はサイト平均0.455%（39÷8,565・MONEY §0 F1）を下回る**＝「トップページが最良実績面」という前提そのものが崩れる | `node scripts/d1q.mjs "SELECT placement, COUNT(*) n FROM clicks WHERE referer='https://my-naishin.com/' AND date(created_at) BETWEEN '2026-07-10' AND '2026-08-07' GROUP BY 1"` → `parent-lp:14 / "/"​:7 / hensachi:1`（計22・MONEY の22と一致）／`grep -rn 'placement="parent-lp"' src/` → 6箇所すべて hogosha・koukou-hiyou・juken-schedule・HogoshaLeadCTA | **§2の別表で4箇所を再計算**（最大の波及は §5-c の「+¥11,296/月」が**符号反転**すること） |
| **C-2** | `MONEY.md:217`（§4） | 「trusted を生んだページは9枚。**この9枚のGSCクリック合計 5,352** → 窓内クリック8,649のうち **3,297（38.1%）は換金実績ゼロのページ着地**」 | 9枚（`/`・`/hensachi`・`/hyotei-heikin`・`/tokyo/total-score`・`/kanagawa/s-value`・`/reverse`・`/mendan`・`/koukou-hiyou/kokoroze`・`/juku-shindan`）のGSCクリック合計は **5,852**（500件の合算ミス）。よって換金実績ゼロのページ着地は **8,649 − 5,852 = 2,797（32.3%）** | `ops/raw/gsc-pages-28d.json` を python で該当9ページ集計 → `1879+1601+920+908+489+42+13+0+0 = 5852`、`8649-5852=2797`（32.3%） | trustedページのカバー率は当初の思い込みより高い（67.7%が5,852＝trustedページ着地）。「捨てられている流入」は3,297ではなく2,797。以後の円換算・出血ランキングで「38.1%」を引用している箇所は32.3%に差し替える |
| **C-3** | `MONEY.md:201`（§3-b） | 「流入ゼロの面が、サイト全体の人間クリックの **41%(16/39)** を叩き出している」 | **分子（16＝parent-lp trusted）は全期間、分母（39）は28日窓の期間不整合。** 窓を揃えると **14/39 = 35.9%**。全期間で揃えるなら本書実測 **17/75 = 22.7%**（critic原指摘時点は16/72=22.2%。本番D1は生きたテーブルのため実行時刻差で数件ドリフトするが、22%前後という桁は一致） | `node scripts/d1q.mjs "SELECT COUNT(*) FROM clicks WHERE placement='parent-lp' AND referer LIKE 'https://my-naishin.com%' AND date(created_at) BETWEEN '2026-07-10' AND '2026-08-07'"` → 14／同条件で全期間 → 17／`referer LIKE 'https://my-naishin.com%'` 全期間総数 → 75 | `/hogosha` の寄与度は依然として大きい（35.9%）が、「41%」という強調は誇張。以後この数字を引用する箇所は35.9%（窓を揃えた値）を使う |
| **C-4** | `MONEY.md:98`（§2-b） | 「参照は `affiliate-economics.ts:93` と `lead-config.ts:108` のみ（`grep -rn "'moshimo-manecafe'" src` **全出力2件**）」 | 引用符無しで検索すると **全出力5件**（`affiliate-economics.ts:93` / `affiliates.ts:44,424,425` / `lead-config.ts:108`）。**結論（未配置＝在庫死蔵）自体は変わらない**（`affiliates.ts:44`は型定義コメント、`:424-425`はカタログ用オブジェクト定義であり、`PLACEMENT_LEAD_OVERRIDES`・`PLACEMENT_SECONDARY_OFFER`・全`.tsx`コンポーネントからの参照は依然0件）。証拠の書き方を「PLACEMENT_LEAD_OVERRIDES・PLACEMENT_SECONDARY_OFFER・全.tsxから参照0（grep 'moshimo-manecafe' src 全5件はカタログ定義のみ）」に改める | `grep -rn "moshimo-manecafe" src/` → 5件 | 結論不変。出血8の注記の証拠文言のみ訂正 |

---

## 2. C-1 の下流再計算（4箇所すべて）

前提：正しいトップページ換金率は **0.43%**（1.17%の約37%）。§5-cで使う「現在ミックス」のEV/click（¥148.2）はC-1の対象外のため据え置く。

> ⚠️ **比較に使っている「サイト平均遷移率 0.455%」は `ops/COEFFICIENTS.md` §2 が不採用とした値**
> （`LIKE 'https://my-naishin.com%'` が root_only を人間に数えるため）。採用値は **0.198%（下限）〜0.537%（上限）**。
> **本節の再計算は「1.17% がどれだけ過大だったか」の対照としてのみ読むこと。絶対額としては使用禁止。**
>
> ### さらに重大な定義上の問題（本訂正作業中に判明・COEFFICIENTS へ差し戻すべき）
> COEFFICIENTS の下限定義 `referer LIKE 'https://my-naishin.com/_%'`（パス2文字以上）は、
> **トップページ由来のクリックを構造的に1件も数えられない**。トップページの referer は
> `https://my-naishin.com/` ちょうど＝ root_only に分類されるため。
> つまり「トップページの人間クリックは0件」は測定結果ではなく**定義の副作用**である。
>
> ### 代わりに使える判別軸（自己矛盾検出・本訂正で新たに実測）
> root_only 33件（全期間）を placement で割ると:
>
> | placement | 件数 | そのページに実在するか | 判定 |
> |---|---|---|---|
> | `parent-lp` | 17 | **✗**（`/hogosha` `/juken-schedule` `/koukou-hiyou` のみ） | **自己矛盾＝bot** |
> | `naishin-up` | 2 | ✗ | **自己矛盾＝bot** |
> | `prefecture` | 1 | ✗ | **自己矛盾＝bot** |
> | `hensachi` | 1 | ✗ | **自己矛盾＝bot** |
> | `/` | 10 | ✓（トップ自身） | 整合＝人間の可能性 |
> | `null` | 2 | 判定不能 | 不明 |
>
> → **「referer のパスと placement が矛盾する行は bot」** という、ヒューリスティックではなく
> **内部整合性に基づく判別軸**が使える。root_only 33件中 **21件（64%）がこれで機械的に bot と確定**する。
> 検算: `node scripts/d1q.mjs "SELECT placement, COUNT(*) n FROM clicks WHERE referer='https://my-naishin.com/' GROUP BY placement"`
> ＋ `grep -rn 'placement="parent-lp"' src/`（トップページに不在であることの確認）
>
> **→ COEFFICIENTS §1 の「17〜46の幅」は、この軸で 27前後（17 + root_onlyの整合分10）まで狭められる可能性がある。
> ただし placement 未付与が96箇所中89箇所（93%）ある現状ではこの軸の適用範囲が限られるため、
> 幅の更新は placement 是正（質問ノート P0-a）の後に行うこと。本書では幅を変更しない。**

| 箇所 | 元の記述 | 訂正後 | 計算 |
|---|---|---|---|
| §5-c（`MONEY.md:289`） | 「遷移率をトップページ実測の1.17%まで引き上げると、48.6→**124.8クリック/月**・**¥18,495/月（+¥11,296/月）**」 | **10,667 × 0.43% = 45.4クリック/月**（現状48.6より**減少**）。EV=45.4×¥148.2=**¥6,728/月**＝現状比 **−¥471/月**。**「引き上げ」自体が成立しない**（トップページの実力は平均以下） | `10667*0.0043=45.9`≒45.4（精密には8/1879=0.4258%で計算） |
| 出血1（`MONEY.md:300`、`/blog`） | 「トップページ実測遷移率1.17%が出れば **21.7クリック/月** × EV¥240 = **¥5,208/月**」 | ブログ月間クリック ≈1,853 × 0.43% = **7.9クリック/月** × ¥240 = **約¥1,893/月**（元の36%） | `1853*0.004258*240=1893` |
| 出血3（`MONEY.md:318`、`*/naishin`） | 「トップページ実測遷移率1.17%なら **15.1クリック/月** × EV¥240（そら塾／関東関西¥360）= **¥3,616〜¥5,424/月**」 | naishin月間クリック≈1,287 × 0.43% = **5.5クリック/月** → **¥1,315〜¥1,972/月**（元の36%） | `1287*0.004258=5.48`; `*240=1315`; `*360=1972` |
| 出血5（`MONEY.md:336`、学校ページ） | 「月間 ≈ 8.6クリック × 1.17% × EV¥240 = **¥24/月**」 | **8.6クリック × 0.43% × ¥240 = 約¥9/月**（元の37%。もともと「ほぼゼロ」という結論自体は変わらない） | `8.6*0.004258*240=8.8` |

---

## 3. DISTANCE.md の訂正（C-5）

| ID | 対象ファイル:箇所 | 誤 | **正** | 検算コマンド | 下流への波及 |
|---|---|---|---|---|---|
| **C-5** | `DISTANCE.md:251-253`（§4.2） | 「`/hogosha` への文脈リンクを持つのは **7ルートだけ**」（`/hensachi` `/hyotei-heikin` `/[prefecture]/naishin` `/hensachi/shindan`系3本 `/hiyou`） | 実際は **16ルート**。DISTANCEが見落とした9ルート：`/ask` `/juken-schedule` `/juku-hiyou` `/juku-shindan` `/kyouiku-hi` `/mendan` `/plan` `/shougakukin` `/tools` | `ops/raw/revenue-distance.json` の `routes.ctx` を python で走査し `out` 配列に `'/hogosha'` を含むキーを数える → 16件（一覧は下記） | 追加9ルートは**いずれもBRIEF §2の「お金クラスタ」＝GSC 28日で0〜4クリックの低・ゼロトラフィック面**（`/kyouiku-hi`0・`/shougakukin`0・`/juken-ryou`系18等）。よって**実質的な到達量への影響はほぼ無い**。「7ルートしかない＝到達経路が細い」という危機感の演出は過大だが、「主要3ルート（`/hensachi`・`/hyotei-heikin`・`/[prefecture]/naishin`）に依存している」という施策Aの優先順位判断そのものは変わらない |

**確認した16ルート全リスト**（`ops/raw/revenue-distance.json` `routes.ctx.*.out` に `/hogosha` を含むページ）：
`/[prefecture]/naishin` `/ask` `/hensachi` `/hensachi/shindan` `/hensachi/shindan/[grade]` `/hensachi/shindan/mokuteki/[purpose]` `/hiyou` `/hyotei-heikin` `/juken-schedule` `/juku-hiyou` `/juku-shindan` `/kyouiku-hi` `/mendan` `/plan` `/shougakukin` `/tools`

---

## 4. BAR.md / STATE.json / DEADWIRE.md の数値誤り（C-6）

> 独立critic（`ops/PHASE0_FINDINGS.md`）が挙げた対立項目のうち、**設計上の意見の相違**（例：「placement 89箇所を直すべきか」＝MONEY「+¥478/月」対DISTANCE「+¥1,097/月」対DEADWIRE「やるな」＝出血8／STATEの`trustOrder`定義とDEADWIREの運用ルール1の対立＝§4 S-3）は対象外。
> 以下は **同一の値が実測と食い違う、または文書内で自己矛盾している** ものだけを載せた。

| ID | 対象ファイル:箇所 | 誤 | **正** | 検算コマンド | 下流への波及 |
|---|---|---|---|---|---|
| **C-6a** | `BAR.md:244`／`:458`（「3年度以上を保有する県」） | **「47 / 47」** | **42 / 47**。`hokkaido`・`nara`・`niigata`・`oita`・`saga` の5県は `sources[]` に令和8・令和7の**2年度分**しか無い（3年度以上の条件を満たさない） | `src/data/competition-rates/*.ts` 47ファイルを python で走査し、各ファイルの `coverage:` 出現前（＝`sources:` 配列内）の `fiscalYear:` 出現数を集計 → 42県が3件以上・5県が2件（一覧：hokkaido/nara/niigata/oita/saga） | BAR §0-1「新規データ収集ゼロでバーを超えられる」は**42県では成立するが、この5県は不成立**（3年度目のデータ収集が必要になる） |
| **C-6b** | `BAR.md:389-393`（§5-2 シナリオ3） | 学校ページEVの理論上限シナリオで **分母に3,422校（学校マスタ総件数）を使用** → 「**¥2,943/月**」 | 実際に生成される学校ページは **3,089枚**（`src/app/pref/[code]/school/[schoolCode]/page.tsx` の `generateStaticParams`。DISTANCE.md:274で既確認、本書で本番sitemapを再取得し独立に再確認）。正しい分母で再計算すると **¥2,656/月**（約10.8%の過大計上） | `grep -ohc '"code":' src/data/schools/*.ts` 合計3,422（学校マスタの生の校数＝正しい）／`curl -k -A "<iPhone UA>" https://my-naishin.com/sitemap.xml` を python で `<loc>` 集計 → `/school/` 含み **3,089**／再計算：`605×(3089/233)=8,021→×11.7=93,843→×(3.752%−1.16%)=2,432→×0.455%×¥240=¥2,656` | BAR §0-5の結論（「バーを超える直接の円は小さい・¥7,199/月比で桁が動かない」）の**方向性は変わらない**（¥2,656でも小さい）。数値のみ訂正 |
| **C-6c** | `DEADWIRE.md:652`（§11 対応表「`stats_submit_ok`」行） | 「28日実測 GA4 = **0**」（D1=169、乖離∞と判定） | GSC期間に揃えた28日窓（2026-07-10〜08-07）で **GA4 stats_submit_ok = 97件**（0ではない）。DW-1本文（`:52-53`）が引用した「2026-07-26〜08-10で0件」という**別の窓**の値を、§11表では誤って「28日実測」列に転記している | `mcp__ga4__ga4_run_report`（property 540358022, dimensions=[date,eventName], eventName=stats_submit_ok, 2026-07-10〜08-07）を自分で再実行 → 7/14=1・7/17=30・7/18=2・7/20=2・7/21=24・7/22=23・7/25=15＝**計97**（`ops/PHASE0_FINDINGS.md` M3 と完全一致） | 「D1もGA4も0でどちらも×」という§11の判定は誤り。正しくは「GA4は97件（7/25以前に集中）・D1は319件（同一28日窓では表4-表B参照）・7/14,7/20,7/21,7/25の4日は完全一致」。DW-1の隔離範囲の議論（C-6e）に直結 |
| **C-6d** | `DEADWIRE.md:653`（§11 対応表「`share_to_parent`」行） | 「28日実測 GA4 = **0**・28日実測 D1 = **0**・**一致**（『2系統一致＝0が真値。断定してよい唯一のゼロ』）」 | 同一28日窓（07-10〜08-07）で **GA4 share_to_parent = 2件**（7/18=1・7/22=1）。**DEADWIRE自身の本文（§2, `:149-156`）も同じ2件を掲載しており、文書内で自己矛盾**している | `mcp__ga4__ga4_run_report`（dimensions=[date,eventName], eventName=share_to_parent, 2026-07-10〜08-07）を自分で再実行 → 7/18=1・7/22=1＝**計2**（BRIEF §4／STATE の「2」と一致） | 「断定してよい唯一のゼロ」という位置づけが崩れる。正しくは「2系統とも2件で一致」。DW-9（「何もしない」の根拠の1つ）自体は影響を受けない（円は依然¥0近傍） |
| **C-6e** | `DEADWIRE.md:90`／`:673-674`（DW-1b） | 「汚染2日（**2026-08-01 / 08-07・計138件**）の扱いを決める」＝隔離提案の範囲 | DEADWIRE自身の手法（D1日次件数 − GA4 `stats_submit_ok` 日次件数の差分）を全期間の全日に適用すると、GA4対応が無いD1行は **222件（70%）**・対象日は **10日超**（7/15・7/16・7/17[部分]・7/18[部分]・7/22[部分]・7/27・7/28・7/30・8/01・8/06・8/07・8/09）。8/01・8/07の2日（138件）だけでは全体の62%しかカバーしない | D1日次（`node scripts/d1q.mjs "SELECT substr(datetime(created_at,'+9 hours'),1,10) jd, COUNT(*) n FROM stats_submissions GROUP BY 1"`、C-6c/C-6dと同じGA4再実行）を日ごとに差分計算 → 合計222（`ops/PHASE0_FINDINGS.md` 表Bと一致） | DW-1の隔離提案（2日/138件）は**過小**。「隔離対象は8/01・8/07だけで十分」という判断だと84件（10日分）が汚染データとして残ったまま配信され続ける。※「`hensachi` 263件中138件（52%）が8/01・8/07由来」という別の記述（`:77`）自体はこの2日の日次件数と整合しており誤りではない――誤っているのは「隔離すべき範囲」の設定のみ |
| **C-6f** | `DEADWIRE.md:42,44`（DW-1冒頭の表） | 「8/06（1件）・8/09（1件）は**正常**」（比較対象＝GA4 `calc_complete` 8件・6件） | DEADWIRE自身が§11で確立した正しい兄弟指標 `stats_submit_ok` で見ると、**8/06・8/09とも0件**で対応するブラウザ発火の証跡が無い。8/01・8/07と同型の未対応日であり、「正常」の判定はDEADWIRE自身の運用ルール（§11・`stats_submissions`は`stats_submit_ok`と対応付ける）と矛盾する | C-6c/C-6dと同じGA4再実行結果（8/06・8/09に`stats_submit_ok`の行が存在しない） | C-6eの「222件・10日超」の一部として再統合される（8/06の1件・8/09の1件も含めて隔離検討対象に入れるべき） |
| **C-6g** | `STATE.json:437`（`_trend`）／`:677,679`（`gapToEffort`/`requiredWeeklyVelocityToPass`） | `_trend`「残差は**45人**／残り24日＝**13.1人/週**」。`gates.evaluations[0].requiredWeeklyVelocityToPass` = **13.1**（`gapToEffort`=39と数値的に整合しない） | STATE自身の`_source`注記（`:681`）が「39人÷(21日/7)=13.0、**08-07起点なら**45人÷(24日/7)=13.1」と両方の計算式を併記している。**本日基準（2026-08-10、残り21日）の正しい残差は39人・必要velocity 13.0人/週**。45人・13.1人/週は8/07時点（24日前）の古い計算がフィールドに取り残されたもの＝自己矛盾 | `STATE.json` 内の自己記載（`gapToEffort:39`, `daysLeft:21` と `_source`注記の式）を突合。`39÷(21/7)=13.0`（`requiredWeeklyVelocityToPass`欄の13.1と不一致） | 実務インパクトは小さい（直近実測8人/週に対し必要倍率は1.6倍で変わらず）。ただし「残差45人」がSTATE `_trend` 経由で以後の文書・memoryに伝播すると数字の混乱を招くため、PHASE 1では**39人・13.0人/週**を正として引用する |

---

## 5. この訂正で結論が変わったもの

| # | 元の結論 | 訂正後 | 変化の大きさ |
|---|---|---|---|
| 1 | MONEY §5-c「遷移率をトップページ実測1.17%まで引き上げれば **+¥11,296/月**（単価ミックス最適化の2.5倍のレバー）」 | **符号が反転。トップページの実力（0.43%）はサイト平均（0.455%）以下であり、引き上げの根拠自体が消滅。同じ計算をすると −¥471/月** | **最大。結論が正から負に反転** |
| 2 | MONEY §3-b「流入ゼロの`/hogosha`が人間クリックの**41%**を稼ぐ」 | 窓を揃えると **35.9%**（方向性は同じだが強度が緩む） | 中 |
| 3 | MONEY §4「trustedページ以外の**38.1%**（3,297クリック）が換金実績ゼロ着地」 | **32.3%**（2,797クリック）。trustedページのカバー率は思ったより高い | 小〜中 |
| 4 | DISTANCE §4.2「`/hogosha`への文脈リンクは**7ルートのみ**＝到達経路が細い」 | 実際は**16ルート**。ただし追加9ルートは低/ゼロトラフィック面のため実質影響は小さい | 危機感の演出のみ縮小。施策優先順位は不変 |
| 5 | BAR §0-1「新規データ収集ゼロで**全47県**がバーを超えられる」 | **42/47県**のみ。hokkaido/nara/niigata/oita/sagaの5県は新規年度データが必要 | 中。5県の扱いが変わる |
| 6 | BAR §5-2「学校ページの理論上限EV = **¥2,943/月**」 | **¥2,656/月**（約10.8%減）。「桁は動かない」という方向性は不変 | 小 |
| 7 | DEADWIRE §11「`stats_submit_ok`は28日でGA4もD1もゼロ（乖離∞）」 | **GA4は97件で非ゼロ**。「両方×」の判定の一部が誤り | 中 |
| 8 | DEADWIRE §11「`share_to_parent`は2系統一致で**ゼロ**＝断定してよい唯一のゼロ」 | **2系統とも2件で一致**。「ゼロ」ではなく「2件」が正しい | 中 |
| 9 | DEADWIRE DW-1b「隔離対象は**8/01・8/07の2日・138件**で十分」 | 実際は**222件（70%）**。8/01・8/07を除く**10日分・84件**が隔離対象から漏れている（内訳: 7/15=13・7/16=16・7/17=8・7/18=2・7/22=14・7/27=25・7/28=1・7/30=3・8/06=1・8/09=1 ＝84） | 中〜大 |<br>※ **この漏れは実装で解消済み**: 隔離を「どの行が汚染か」の個別判定でなく **migration 0019 の `trusted` 列で履歴を一律 `trusted=0`** にする設計にしたため、222件でも84件でも結果は同じ（全319件が集計から外れる）。本番D1へ適用済・319件すべて `trusted=0` を実測確認（2026-08-10）
| 10 | STATE G1「残差**45人**・必要velocity**13.1人/週**」 | 本日基準で残差**39人**・必要velocity**13.0人/週**（自己矛盾の解消） | 小（実務上の倍率は変わらず） |

---

## 6. 中心的結論の判定 —「ボトルネックは単価ではなく遷移率」は訂正後も成立するか

**判定：定性的な結論の方向性（単価ミックス最適化より遷移率側の構造的欠陥を先に直すべき）はおおむね成立する。ただし、その根拠として使われていた唯一の定量的裏付け（「トップページ実測1.17%まで遷移率を引き上げれば単価最適化の2.5倍の効果」）は完全に崩れ、符号が反転する。**

根拠の整理：

1. **単価ミックス最適化の上限（+¥4,465/月、`MONEY.md:283` 全国対応の`sora-juku-text`へ全寄せ）はC-1の訂正の影響を受けない。** この数字は`convRateLow`の仮置き係数の比較であり、トップページのreferer帰属とは無関係。**この上限は依然として小さいまま**。

2. **一方、「遷移率側にどれだけ伸びしろがあるか」を示す唯一の実測ベンチマークだった「トップページの1.17%」は、C-1により0.43%（サイト平均以下）に訂正された。** これは、**現時点でサイト内に「サイト平均を明確に上回る、実証済みの高遷移率ページ」が1枚も存在しない**ことを意味する。つまり「遷移率を今のどこかの水準まで引き上げれば良い」という具体的な目標値が消えた。

3. **それでも「遷移率側（＝到達・接続の欠陥）が問題である」という主張自体は、1.17%の数字とは独立の複数の実測に支えられている**（いずれも本訂正の対象外・そのまま有効）：
   - `/blog`164枚（GSC 1,501クリック/28日）から内部referer付きアフィリクリックが全期間で**1件**のみ（MONEY 出血1の証拠部分）
   - `placement`無しの`ParentLeadCTA`が22箇所で副オファーを無言に落としている（MONEY §2-a a4）
   - 学校ページ233枚・県まとめ47枚に換金コードが**1行も無い**（MONEY §4-b・grep 0ヒット、この事実はC-1と無関係）
   - D1 clicksの88%（DEADWIREの実測では94%）がbot（MONEY F1／DEADWIRE DW-3、この事実もC-1と無関係）

4. **したがって、PHASE 1で引用してよいのは「遷移率側の構造的な欠陥（未接続・ゼロクリックページ・死配線）を先に潰すべき」という定性的な優先順位付けまで。** 「遷移率を上げれば単価最適化の2.5倍・+¥11,296/月」という**具体的な倍率・金額は使用禁止**（本書C-1・§2で反転を確認済み）。**遷移率を実際にどこまで引き上げられるかは、MONEY §7 B-9/B-12（未検証事項）と同様に未検証のまま**であり、新たな実測（例：DEADWIRE DW-3の`isInternalReferer`絞り込み後の面別遷移率を出し直す等）が無い限り、PHASE 1でも「未検証」と明記すること。

---

## 7. 本書で実行した検算コマンド一覧（再現用）

```bash
# C-1
node scripts/d1q.mjs "SELECT placement, COUNT(*) n FROM clicks WHERE referer='https://my-naishin.com/' AND date(created_at) BETWEEN '2026-07-10' AND '2026-08-07' GROUP BY 1 ORDER BY 2 DESC"
grep -rn 'placement="parent-lp"' src/

# C-2（python）
# ops/raw/gsc-pages-28d.json の rows から9ページの clicks を合算 → 5852 / 8649-5852=2797(32.3%)

# C-3
node scripts/d1q.mjs "SELECT COUNT(*) n FROM clicks WHERE placement='parent-lp' AND referer LIKE 'https://my-naishin.com%' AND date(created_at) BETWEEN '2026-07-10' AND '2026-08-07'"
node scripts/d1q.mjs "SELECT COUNT(*) n FROM clicks WHERE placement='parent-lp' AND referer LIKE 'https://my-naishin.com%'"
node scripts/d1q.mjs "SELECT COUNT(*) n FROM clicks WHERE referer LIKE 'https://my-naishin.com%'"

# C-4
grep -rn "moshimo-manecafe" src/

# C-5（python）
# ops/raw/revenue-distance.json の routes.ctx を走査し out 配列に '/hogosha' を含むキーを数える → 16

# C-6a（python）
# src/data/competition-rates/*.ts を走査、coverage: 出現前の fiscalYear: 出現数を集計 → 42/47

# C-6b
grep -ohc '"code":' src/data/schools/*.ts   # 3422（学校マスタ総数・正しい）
curl -k --max-time 60 -A "<iPhone UA>" https://my-naishin.com/sitemap.xml   # python で <loc> 集計 → school 3089

# C-6c/d/e/f（GA4 MCP・property 540358022）
mcp__ga4__ga4_run_report(dimensions=[date,eventName], metrics=[eventCount],
  startDate=2026-07-10, endDate=2026-08-07,
  dimensionFilter={eventName EXACT "stats_submit_ok"})   → 計97
mcp__ga4__ga4_run_report(... dimensionFilter={eventName EXACT "share_to_parent"})  → 7/18=1, 7/22=1, 計2

# C-6e（D1・JST整合）
node scripts/d1q.mjs "SELECT substr(datetime(created_at,'+9 hours'),1,10) jd, COUNT(*) n FROM stats_submissions GROUP BY 1 ORDER BY 1"

# C-6g
# STATE.json 自身の gapToEffort:39 / daysLeft:21 / _source の計算式注記を突合
```

**本書で本番への書き込み・デプロイ・env変更・メール送信・フラグ点火は一切行っていない。`src/` および `ops/MONEY.md` `ops/DISTANCE.md` `ops/BAR.md` `ops/STATE.json` `ops/DEADWIRE.md` は1行も変更していない。**
