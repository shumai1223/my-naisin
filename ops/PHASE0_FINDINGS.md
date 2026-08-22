# PHASE0_FINDINGS.md — 完全性critic（何が漏れているか）

- 作成: 2026-08-10 / 担当: PHASE 0 完全性critic（成果物の採点はしない。**欠落だけを狩る**）
- 読んだもの: `ops/raw/BRIEF.md` / `ops/MONEY.md` / `ops/DISTANCE.md` / `ops/BAR.md` / `ops/STATE.json` / `ops/DEADWIRE.md`
- 本書のルール: 5成果物に**書かれていない**数値は、自分で取得したコマンド出力を添える。取れなかったものは「取得不可」と書く。
- 本書は調査のみ。`src/` は1行も変更していない。本番への書き込み・デプロイ・送信・env変更・フラグ点火は一切していない。

---

## 0. 本書で新たに実測した値（5成果物のどれにも無い。以後これを引用してよい）

| # | 実測値 | 取得コマンド／出典 |
|---|---|---|
| **M1** | **D1 `clicks` 直近28日の referer 4分類: `null` 301（mobile 12）／`https://my-naishin.com/` ちょうど（root_only）29（**mobile 0**）／内部パス付き 17（mobile 7）／外部 3（mobile 2）＝計350** | `node scripts/d1q.mjs "SELECT CASE WHEN referer IS NULL THEN '1_null' WHEN referer='https://my-naishin.com/' THEN '2_root_only' WHEN referer LIKE 'https://my-naishin.com/%' THEN '3_internal_path' ELSE '4_external' END k, COUNT(*) n, SUM(CASE WHEN user_agent LIKE '%Mobile%' OR ... THEN 1 ELSE 0 END) mob FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY 1"` |
| **M2** | 全期間の**外部referer は4件のみ**（`https://www.google.com/` 3 / `https://websearch.rakuten.co.jp/` 1） | `node scripts/d1q.mjs "SELECT referer, COUNT(*) FROM clicks WHERE referer IS NOT NULL AND referer NOT LIKE 'https://my-naishin.com%' GROUP BY 1"` |
| **M3** | **GA4 `stats_submit_ok` の日次全数（2026-07-13〜08-10）: 7/14=1・7/17=30・7/18=2・7/20=2・7/21=24・7/22=23・7/25=15 ＝ 計97。7/26以降は全日ゼロ** | `mcp__ga4__ga4_run_report(property=540358022, dimensions=[eventName,date], metrics=[eventCount,totalUsers], 2026-07-13..08-10, limit=1000)`（**rowCount 567。limit 400 だと小イベントが切れて share_to_parent=0 等の誤読が出る**） |
| **M4** | **D1 `stats_submissions` を JST(+9h) 日で再集計し GA4 と突合 → 319件中 222件（70%）に対応するブラウザ発火が無い**（内訳は §4-表A） | `node scripts/d1q.mjs "SELECT substr(datetime(created_at,'+9 hours'),1,10) jd, COUNT(*) n FROM stats_submissions GROUP BY 1 ORDER BY 1"` ＋ M3 |
| **M5** | `hensachi` 263件の JST日別平均: 7/15 n=10 avg **45.52** / 7/16 n=16 avg **50.35** / 7/17 n=30 avg 57.55 / 7/22 n=36 avg 61.61 / 7/27 n=25 avg **73.98** / 8/01 n=56 avg 64.02 / 8/07 n=82 avg 66.59 | `node scripts/d1q.mjs "SELECT substr(datetime(created_at,'+9 hours'),1,10) jd, COUNT(*) n, ROUND(AVG(value),2) avg FROM stats_submissions WHERE metric='hensachi' GROUP BY 1"` |
| **M6** | **`stats_submissions` のスキーマに `ip_hash` / `user_agent` 列が存在しない**（`clicks` には両方ある） | `node scripts/d1q.mjs "SELECT sql FROM sqlite_master WHERE name IN ('stats_submissions','leads','clicks')"` |
| **M7** | `STATS_SUBMIT_OK` 計装の初出コミットは **f37f94c（2026-07-13 20:29 JST）** ＝ 7/14以降は計器が生きていた | `git log -S "STATS_SUBMIT_OK" --reverse -- src/lib` ／ `git log -1 --format='%ci'` |
| **M8** | 本番 `/hogosha` `/juku-shindan` `/naishin-oru` は **いずれも `<meta name="robots" content="index, follow"/>`・HTTP 200**（/hogosha 184,822 bytes） | `curl -k -A "<iPhone UA>" https://my-naishin.com/hogosha` 他2本 |
| **M9** | 本番 `sitemap.xml` = **3,481 URL**。`/hogosha` `/juku-shindan` `/naishin-oru` `/hiyou` `/suisen-nyuushi` `/mendan` `/koukou-hiyou` `/reverse` は**全て掲載済み**。学校ページ 3,089 / blog 49 | `curl sitemap.xml` → python で `<loc>` 集計 |
| **M10** | **`/naishin-oru` の内訳（28日）: `/naishin-oru/4` 431表示・順位4.13・クリック0 ／ `/3` 53表示8.70位 ／ `/5` 46表示8.00位 ／ 素 14表示35.86位＝合計544表示・0クリック** | `mcp__gsc__gsc_query(dimensions=[page], pageContains='naishin-oru', 2026-07-10..08-07)` |
| **M11** | **`/naishin-oru/4` が表示されているクエリは「学校名」系**（「八王子実践高校」10表示 **2.7位** 0クリック／「一条高校 内申点」2位／「上溝高校 内申点」3位／「中京大中京 内申点」3位…25クエリ中ほぼ全て学校名） | `mcp__gsc__gsc_query(dimensions=[query], pageContains='naishin-oru')` |
| **M12** | **同一の学校名クエリを汎用ページ4種が奪い合っている**。「八王子実践高校」= `/blog/naishinten-average-score` 7表示2.57位1クリック ＋ `/naishin-oru/4` 10表示2.70位0クリック。「八王子実践 甲子園」= `/tokyo/naishin` 2.0位。**学校ページは1行も出現しない（私立のため学校マスタに存在しない）** | `mcp__gsc__gsc_query(dimensions=[page,query], queryContains='八王子実践')` |
| **M13** | `/blog/naishinten-average-score`（blog第2位・14,103表示）の上位クエリは**裸の学校名**が主体（「北園高校」2.0位／「向丘高校」2.4位／「上溝高校文化祭」2.0位／「二水高校 校則」4.0位／「三田高校 修学旅行」6.0位・いずれも1表示1クリック級） | `mcp__gsc__gsc_query(dimensions=[query], pageContains='naishinten-average-score')` |
| **M14** | `/go/[id]` は**内部refererが無いと302しない**。`renderClickHopHtml()` の JS ホップHTMLを返す。`<noscript>` のフォールバックは「トップへ戻る」のみで**ASPへは到達しない** | `src/app/go/[id]/route.ts:118-128` ／ `src/lib/click-hop.ts:18-31` |
| **M15** | 5成果物に **`click-hop` の言及は0件** | `grep -rn "click-hop\|ClickHop\|ホップ" ops/*.md ops/raw/BRIEF.md` → ヒット0 |
| **M16** | `leads` 6件 = ユニークメール6・ドメイン2種・`unsubscribed` 0・2026-07-14 09:42 〜 2026-08-07 02:40（**重複投稿・退会は無い＝この6件は健全**。PIIは記録しない） | `node scripts/d1q.mjs "SELECT COUNT(*), COUNT(DISTINCT email), COUNT(DISTINCT lower(substr(email,instr(email,'@')+1))), SUM(unsubscribed), MIN(created_at), MAX(created_at) FROM leads"` |
| **M17** | `npm run check:orphans` は **green**（静的ルート107・ソース1,173ファイル・オーファン0）＝ DISTANCE の「∞ページ0枚」を独立系統で追認 | `node scripts/check-orphans.mjs`（exit 0） |

---

## 1. 走らせていない検証モダリティ（取れるのに取っていないもの）

### 1-A. D1 — 未クエリのテーブル・未使用の列

| # | 取っていないもの | なぜ効くか | 実行コスト | 主体 |
|---|---|---|---|---|
| A-1 | **`clicks.prefecture` 列を誰も1度も集計していない** | `lead-config.ts:228-252` は**関東7県/関西6県の県override**（EV¥360/click・全案件中最高）を持つのに、県別のクリック分布が5成果物のどこにも無い。EV最高の配線が実際に何県で発火したか不明のまま | SQL 1本 | loop |
| A-2 | `stats_submissions.prefecture_code` / `grade` / `max_value` 列 | DW-1の核心「母集団が自己選抜で偏っている」を**県分布・学年分布で検証できる**のに、誰も `value` 以外を見ていない。「全国」という語を外す根拠がここで固まる | SQL 1本 | loop |
| A-3 | `leads` の `score` / `target` / `gap` 列（6件） | **保護者/生徒が実際に入力した唯一の一次データ**。ZZ-1/Ω-1（データバンク）の実質nの手掛かり。中身を誰も見ていない | SQL 1本 | loop |
| A-4 | `email_events`（行数すら STATE に無い） | 名簿12ヶ月配信の唯一の計器。G1（名簿velocity・8/31判定・残り21日）の分子側の挙動が完全に不明 | SQL 1本 | loop |
| A-5 | `push_subscriptions` = 0 の書き込み経路検証（U-13） | **冬の再訪チャネル**。`parent_funnel_events` と同じ「実装済みだが0件」パターンで、壊れていれば冬に効かない。DW-2 と同型の検証が未適用 | route.ts 実読 | loop |
| A-6 | `clicks` の `ip_hash` 別分布（表として） | DEADWIRE は「上位IPは4〜8件を3〜4日かけて」と書くが**表を出していない**。スケジュール検知の閾値設計（DW-3の直し方③）に必要 | SQL 1本 | loop |

### 1-B. GSC — 未取得の次元

| # | 取っていないもの | なぜ効くか | 主体 |
|---|---|---|---|
| B-1 | **`page` × `query` の結合次元** | MCP で普通に取れる。**私が3コール回しただけで M10〜M13 の新事実が出た**。「どのページがどのクエリを受けているか」は5成果物のどこにも無く、page次元とquery次元が最後まで接続されていない | loop |
| B-2 | `device` × `page`（面別モバイル比率） | サイト全体は mobile 75.3%（STATE `gsc.devices28d`）だが面別が無い。DW-10（タップ領域44px）の優先順位とCTA改修の順序がこれ無しでは決まらない | loop |
| B-3 | `date` × `page`（面別の日次） | 終業式デー（7/16-17 の 1,075/1,081クリック）に**どの面が跳ねたか**が未分解。12月下旬の収穫日パッケージ（AA-5）の設計に直結 | loop |
| B-4 | **90日窓の `page` 次元** | U-5「学校ページ3,089枚のうち2,856枚がインデックス済みか未登録か」＝STATE自身が「冬の収穫量を左右する最重要の未知数」と書いた項目。**28日で233枚→90日なら何枚か**は loop で取れる唯一の代理測定で、誰もやっていない | loop |
| B-5 | `country` 次元 | 海外bot/AI経由流入の切り分け。DW-3のbot論の独立系統の裏取りになる | loop |
| B-6 | my-shingaku の `page` 次元 | BRIEF §D は my-shingaku の **query次元だけ**で「県名分割は弱い」と結論した。面側は未取得 | loop |
| B-7 | 「ページのインデックス登録」レポート | 現行 gsc MCP に対応ツールが無い（`gsc_sitemaps` はサイトマップ一覧のみ）。**管理画面＝👤** | 👤 |

### 1-C. GA4 — 未取得の次元

| # | 取っていないもの | なぜ効くか |
|---|---|---|
| C-1 | **`pagePath` 次元（面別PV）** | DISTANCE §7.1 は `/hogosha` の `screenPageViews=9` を**1つだけ引用して「分母に使えない」で捨てた**。面別PVを全面で取れば施策A〜Dの分母が全部埋まる。1コール |
| C-2 | `sessionDefaultChannelGroup` / `sessionSource` | `ai_referral` 31件（STATE `ga4.otherNotableEvents`）の実体が未分析。**AI Overview侵食＝PHASE 1 THREATS の本命**なのに手掛かりが1つも解剖されていない |
| C-3 | `deviceCategory` × `eventName` | `rage_click` 61件の端末分布。DW-10 が「円で語れない＝未検証」と正しく降りた項目を、1コールで前進させられる |
| C-4 | `landingPage` × `result_view` | `funnel.calcFunnel`（PV 2,303→calc 714→result 570）は**全サイト合算のみ**。面別のファネルが無いので「どの面で結果まで到達しているか」が不明＝保護者到達率0.35%の分母が面別に割れない |
| C-5 | GA4プロパティの**レポートタイムゾーン** | D1 は UTC、GA4 は不明。**DW-1b は本番D1の138行DELETEを提案しているのに、両系のタイムゾーン整合を誰も確認していない**（§4-表A参照。私は+9h仮定で整合が取れることを実測したが、確定していない） |

### 1-D. 本番HTTP — 未取得

| # | 取っていないもの | なぜ効くか |
|---|---|---|
| D-1 | ✅2026-08-17完了・2026-08-23再確認(`ops/THREATS.md` 脅威6(TH-4)参照)。`npm run check:affiliate-links`(要`NODE_TLS_REJECT_UNAUTHORIZED=0`)で34本中デッドリンク0件・警告3件(sapuri-*のHTTP403・到達自体は確認済み) | プログラム終了・URL失効なら**EVは全部ゼロ**。5成果物の円が全部その上に乗っている。※`/go/[id]` をボットUAで叩いても `route.ts:79-82` でホーム退避するだけで href は見えない。**`affiliates.ts` の href を直接 curl する**のが正しい経路（D1を汚さない） |
| D-2 | ✅2026-08-23完了(`ops/THREATS.md` 脅威7早期警戒指標③参照)。total-score(trusted=0が48件)・naishin(trusted=0が8件)ともtrusted=1がminSampleSize未満のためAPI実測で`insufficientData:true`・非公開を確認。汚染値は公開されていない | DW-1 は **hensachi しか curl していない**。`total-score` は n=48 で k閾値30を超えており、**同じ汚染値が公開されている可能性が未確認** |
| D-3 | `/pref/[code]`（県ハブ）の本番HTML | 学校ページ3,089枚への唯一の一覧経路（`pref/[code]/page.tsx:692`）。MONEY §4-b が「換金コード0ヒット」と判定した面だが、本番の実描画は未確認 |
| D-4 | `robots.txt` / `llms.txt` の実物 | STATE は `robots.ts` のソースを読んだだけ。本番配信物は未取得 |
| D-5 | 競合の `robots.txt` / `sitemap.xml` / Wayback | BAR 差-5「公表当日に更新できる体制」の**競合側の更新頻度が推測**（「年1回のバッチ更新に見える」）。Wayback は memory `[[cowork-division-of-labor]]` で **loop実行可**と明記されているのに未実行 |

### 1-E. 未実行の npm script / 既存ツール（**リポジトリに在るのに誰も動かしていない**）

| # | コマンド | 何が分かるか | なぜ致命的か |
|---|---|---|---|
| E-1 | **`npm test`（全体）** | 全スイートの green/red | DEADWIRE が回したのは **4スイート52テストだけ**。リポジトリ全体が今 green かを**誰も知らない**まま「テストを1本足せ」と提案している |
| E-2 | `npm run typecheck` | `tsc --noEmit` の実exit | 同上。memory `[[feedback-tsc-pipe-exit-code]]` の前科がある項目 |
| E-3 | **`npm run check:links`**（`scripts/check-source-links.mjs`） | 一次ソースURL（公的ドメイン119本）の生存 | **BAR 差-2「1データ点1出典の監査可能性」＝最大の堀の前提**。リンクが死んでいれば堀が消える。専用スクリプトが在るのに未実行 |
| E-4 | `npm run check:freshness` / `check:consistency` / `check:forbidden` | データ鮮度・整合・禁止語 | 冬前の品質ゲート。BAR/DEADWIRE がテスト不在を論じる前に走らせるべきもの |
| E-5 | **`npm run ev:reconcile`**（`scripts/reconcile-affiliate-economics.ts`） | EV表の正準生成 | **MONEY §5-a は EV ランキングを手で組んだ**。正準ツールが在るのに使っていないので、MONEY の EV表と本番ロジックの一致が保証されない |
| E-6 | **`scripts/reconcile-clicks.ts`** | clicks と ASP実績の突合 | **U-4（ASP実績が無い）の受け皿がリポジトリに既に在る**。5成果物のどれもこのファイルの存在に言及していない |
| E-7 | `npm run report:links`（`scripts/link-graph-report.ts`） | 既存のリンクグラフ | DISTANCE は既存資産を「BRIEF §5に在る」と知りながら**新規に `revenue-distance.mjs` を書いた**。既存出力との突合が無く、429件の未解決hrefが既存ツールで解けるかも未確認 |
| E-8 | **`npm run test:e2e`（Playwright）** | 実ブラウザでのDOM/クリック検証 | **U-1 は「loopにブラウザが無い」を理由に Cowork へ回しているが、リポジトリに Playwright がある**（`package.json` `test:e2e`）。「実ブラウザ検証は不可能」という前提そのものが未検証 |
| E-9 | `scripts/backup-d1.ts` | 本番D1のバックアップ | **DW-1b は本番D1の行DELETEを提案しているのに、既存のバックアップ手段に触れていない** |
| E-10 | `npm run kpi:weekly` / `juku-offer-report` / `outreach:followup` | 既存レポート3本 | STATE が手で集計した数字（outreach 17件・返信1件等）を生成する正準ツール。未使用 |

### 1-F. その他のモダリティ

| # | 取っていないもの | 主体 |
|---|---|---|
| F-1 | **Gmail MCP `gmail_search q="in:sent"`** — U-9（接触社数 17 / 20 / 32 の三重矛盾）を解く唯一の手段。MCPは接続済み。未実行 | loop |
| F-2 | **Google Trends の「倍率」月次係数** — BAR V-1 が自ら「loop（Trends取得）」と主体まで書いて未実行。**BAR §5 の全EVがこの代理係数11.7倍に乗っている** | loop |
| F-3 | Cowork への実発注 — BAR V-2/V-3、MONEY B-9、STATE U-1 が全て「Coworkへ」で終わっており、**プロンプトが1本も書かれていない**（memory `[[cowork-division-of-labor]]` は起動条件「loopが不明/保留と書いたもの」を満たしている） | loop（発注文面）→👤 |
| F-4 | `c:\Users\E24054\my-shingaku` — 追加作業ディレクトリに入っているのに、**5成果物のどれもリポジトリを1行も読んでいない**（BRIEF §D の GSC数値のみ） | loop |

---

## 2. 裏取りされていない断定 上位12（file:line 付き）

| # | 断定 | 場所 | なぜ裏取り不足か（実測） |
|---|---|---|---|
| **1** | 「サイト全体の実**遷移率 = 0.455%**」（D1 trusted 39 ÷ GSC 8,565） | `ops/MONEY.md:19`（`:272` で係数化） | **trusted の定義が `referer LIKE 'https://my-naishin.com%'` なので、パスの無い root_only を人間に数えている。** M1: 28日の内訳は root_only **29（mobile 0）** + 内部パス付き **17**。DEADWIRE DW-3 は root_only を「毎日04:1x/11:2x・全desktop のスケジュール実行」と断定済み。**内部パス付きだけなら 17 ÷ 8,565 = 0.199%**（2.3倍の過大） |
| **2** | 「`/`（トップ）trusted 22 → 換金率 **1.17%**」＝「到達可能な上限」 | `ops/MONEY.md:172`, `:289` | 22件の referer は全て root_only（M1の29の一部）。**同文書 `:203-205` が「referer だけではページ帰属できない」と自認**しており、上限値の根拠として使える強度が無い |
| **3** | 「`/hogosha` は内部リンク経由だけで実アフィリクリックの **37%（16/43）** を生んでいる」→ **最優先施策A** | `ops/DISTANCE.md:22`, `:248`, `:481` | 同じ16件を `ops/DEADWIRE.md:259-278` が「スケジュール実行のスクレイパ」と断定。**PHASE 0 内で正面衝突**。DISTANCE の施策優先順位（A→D→B→C）は全てこの上に乗っている |
| **4** | 「実人間は多くて **20件**（5.7%）」 | `ops/DEADWIRE.md:13`, `:332` | M1: 20 = 内部パス付き17 + 外部3。**外部3件（google.com）は自書が採用する `classifyClick`（`bot-filter.ts:70-73`）では human ではなく suspect**。さらに GA4 が確認した affiliate_click は **7/13 と 8/10** の2件で、**8/10 は DEADWIRE の20件表に1行も無い**（D1の8/10は9件すべて null/root referer）。＝20は上限でも下限でもない |
| **5** | 「8/06(1件)・8/09(1件) は**正常**」 | `ops/DEADWIRE.md:43,45` | 比較対象が `calc_complete`。正しい兄弟イベントは `stats_submit_ok` で、**M3 により両日とも 0**。同じ基準では「正常」と言えない |
| **6** | 「汚染2日（8/01・8/07 計138件）」を隔離範囲とする | `ops/DEADWIRE.md:90`, `:674` | M4: JST整合後に GA4 無対応は **222件（70%）**。7/15(13)・7/16(16)・**7/27(25)**・7/30(3)・8/06(1)・8/09(1) が隔離範囲の外に残る |
| **7** | 「3年度以上を保有する県 **47/47**」→「新規データ収集ゼロでバーを超えられる」 | `ops/BAR.md:244`, `:249` | 別criticが 42/47 と実測（hokkaido/nara/niigata/oita/saga は2年度）。**結論（描画だけで超えられる）が5県で成立しない** |
| **8** | 学校ページEVのスケール分母に **3,422**（学校マスタ件数）を使用 | `ops/BAR.md:391` | 実際に生成されるページは **3,089**（`ops/DISTANCE.md:274` ／ STATE `cc4`：ローカルlib実行と本番sitemapの2経路一致・M9で再確認）。**同じPHASE 0内の確定値と不一致で11%過大** |
| **9** | 「転換の真値は D1（**clicks** / leads / stats_submissions …）」 | `ops/STATE.json` `meta.trustOrder.rank1_conversion` | `ops/DEADWIRE.md:663` の運用ルール1「**`clicks` の生カウントを二度と引用しない**」と正面衝突。**STATE は「後続が読む唯一の数値台帳」を自称しているのに、兄弟文書の最大の発見が反映されていない** |
| **10** | 「referer=null は『実ブラウザではない』を意味する」（F2） | `ops/MONEY.md:14`, `:139` | 推論の前提は「same-origin はフルURLを送る」。しかし **root_only 29件はパスが落ちている**＝同じ機序が他行で起きていない証明が無い。同文書 `:392`（B-9）が機序を**未検証**と自認しており、F2 は B-9 の未解決に依存している |
| **11** | 「`placement` 89箇所は直すな／EVほぼゼロ」 | `ops/DEADWIRE.md:467`, `:689` | 同じ対象を `ops/MONEY.md:346`（出血6）は「+¥478/月」、`ops/DISTANCE.md:466`（施策D）は「**¥1,097/月**・A〜Cの前提条件」と評価。**3文書で結論が割れたまま仲裁されていない** |
| **12** | 「G1 の残差 **45人**・必要velocity 13.1人/週・直近8人/週の1.6倍」 | `ops/STATE.json` `gates…requiredWeeklyVelocityToPass` / `line._trend` | 同ファイルの `_criticalRule`（名簿N = LINE + D1 leads の合算 = 61）に従えば残差は **39人**。自己矛盾 |

---

## 3. 読まれていない一次ソース

| # | 一次ソース | それが無いことで何が空くか | 主体 |
|---|---|---|---|
| **P-1** | **ASP管理画面（A8／もしも／アクセストレード）の発生・承認・確定額** | **5成果物すべての円の唯一の校正点。** `data/affiliate-actuals.json` が存在せず（STATE `affiliates.actualRevenue`）、**「¥0」なのか「未取得」なのかすら確定していない**。`convRateLow`（0.005〜0.06）も `CONFIRM_RATE`（0.6）も全部仮置きのまま4文書が円を出している | 👤 |
| **P-2** | LINE Official Account Manager（8/08〜8/10の3日分） | G1判定（8/31・残り21日）の分子。`data/line-friends.json` は 8/07 で止まっている | 👤 |
| **P-3** | GSC「ページのインデックス登録」レポート | 学校ページ3,089枚中2,856枚の状態（U-5）。STATE 自身が「冬の収穫量を左右する最重要の未知数」と明記 | 👤 |
| **P-4** | **GSC「手動による対策」「セキュリティの問題」ページ** | **誰も1度も確認していない。** ドメイン6か月・BRIEF §B の C8 に該当。THREATS を書く前提の最低ライン | 👤 |
| **P-5** | Google Trends（「高校 倍率」「〇〇高校 倍率」の月次） | BAR §5 の全EVが代理係数11.7倍（S値の係数）に依存。BAR 自身が V-1 で「loop実行可」と書いた | loop |
| **P-6** | 教育委員会の一次PDF | BAR が実物突合したのは **chiba 1県・一宮商業1校のみ**。残り46県は `src/data/competition-rates/*.ts` の**コメントを信じている**。memory `[[feedback-verify-data-via-files-not-lib-comments]]` の再発条件 | loop |
| **P-7** | 競合HTML（minkou/進研ゼミ/高校偏差値.net）を **他校でも** | 4サイト比較は **1校のみ**。「〇〇高校 倍率」300クエリの上位を取れているのが一宮商業1校の構図と同じ保証は無い | loop（curl+iPhone UA。進研ゼミは WebFetch 403） |
| **P-8** | `AFFILIATES` 34本の href（＝ASPの実リンク先） | §1-D D-1。全EVの前提 | loop（✅2026-08-17解消: `npm run check:affiliate-links`新設・初回実行でデッドリンク0件確認。詳細は`ops/THREATS.md`脅威6を参照） |
| **P-9** | my-shingaku リポジトリ | 追加作業ディレクトリに入っているのに未読。PLAYBOOK横展開の判断材料 | loop（本書執筆(2026-08-10)後、複数回のセッションでmy-shingaku側の実修正が発生済み——例: 2026-08-17にGSC構造化データ警告を検知しDataset JSON-LDのlicense欄・/developersページを追加修正（`loop-question-note`参照）。「未読」という前提は解消済みだが、PLAYBOOK横展開そのものの体系的判断材料としての読み込みは別途必要な可能性あり） |

---

## 4. 5成果物の相互矛盾（全数）

### 表A. 最重要 — 「人間のクリックは何件か」が4通りある

| 出典 | 主張 | 定義 | 28日の値 |
|---|---|---|---|
| `ops/MONEY.md:13`（F1）/`:19` | trusted 43（GSC窓39） | referer が `my-naishin.com%` | 43 |
| `ops/DISTANCE.md:232`（事実A） | 内部referer 43件（12.4%） | 同上 | 43 |
| `ops/DEADWIRE.md:13`,`:332` | 実人間 多くて20件 | referer 非null かつ ≠ root、化石UA除く | 20 |
| **本書 M1（実測）** | **内部パス付き 17（mobile 7）／root_only 29（mobile 0）／外部 3** | 4分類 | **17** |

→ **同一のテーブル・同一の窓に対して 43 / 43 / 20 / 17 の4つの値が PHASE 0 内に併存している。** これが下流の円をすべて汚している（§6-1）。

### 表B. `stats_submissions` の汚染範囲（JST整合後の実測。**この表はどこにも無い**）

| JST日 | D1 `stats_submissions` | GA4 `stats_submit_ok` | 差＝未対応 | DEADWIREの判定 |
|---|---:|---:|---:|---|
| 07-14 | 1 | 1 | 0 | — |
| 07-15 | 13 | **0** | **13** | 言及なし |
| 07-16 | 16 | **0** | **16** | 言及なし |
| 07-17 | 38 | 30 | 8 | 言及なし |
| 07-18 | 4 | 2 | 2 | 言及なし |
| 07-20 | 2 | 2 | 0 | — |
| 07-21 | 24 | 24 | 0 | — |
| 07-22 | 37 | 23 | 14 | 言及なし |
| 07-25 | 15 | 15 | 0 | — |
| 07-27 | 25 | **0** | **25** | 言及なし |
| 07-28 | 1 | 0 | 1 | 言及なし |
| 07-30 | 3 | 0 | 3 | 言及なし |
| **08-01** | **56** | **0** | **56** | **汚染（隔離対象）** |
| 08-06 | 1 | 0 | 1 | **「正常」** |
| **08-07** | **82** | **0** | **82** | **汚染（隔離対象）** |
| 08-09 | 1 | 0 | 1 | **「正常」** |
| **計** | **319** | **97** | **222（70%）** | 隔離提案は138（43%）のみ |

補足（重要な反証材料も併記する）:
- 4日（7/14・7/20・7/21・7/25）で **D1 と GA4 が完全一致**（1/1・2/2・24/24・15/15）＝ このイベントに関して GA4 は取りこぼしていない。「GA4=0 ⇒ 非ブラウザ」の推論を**強める**証拠。
- ただし M5: 7/15（n=10 avg **45.52**）・7/16（n=16 avg **50.35**）は**偏差値の母平均50に極めて近い＝分布として人間らしい**。「GA4=0 ⇒ bot」を機械的に適用すると人間の投稿を捨てる。**隔離基準は未確立**。
- M7: 計装は 7/13 20:29 JST から生きているので、7/15-16 の GA4=0 は計装漏れでは説明できない。
- M6: **`stats_submissions` に UA も IP も無い**ため、事後の判別材料は「日付 × GA4突合」しか存在しない。＝上表が唯一の法医学的手段であり、それが作られていなかった。
- ⚠️ 上表は GA4 のレポートTZを Asia/Tokyo と仮定（+9h）した整合。**TZ は誰も確認していない（§1-C C-5）。DELETE 提案の前提として要確定。**

### 表C. 同じ数字が違う値で書かれている箇所（全数）

| # | 項目 | 値A | 値B | 値C | 判定 |
|---|---|---|---|---|---|
| C-1 | D1 clicks 28日総数 | BRIEF 348 | MONEY/DISTANCE 347 | STATE 349・本書350 | 時間経過。ただし**窓の終端が明記されていない**ため再現不能 |
| C-2 | `/blog` の D1 クリック | MONEY `:299` 9件（placement='blog'・全期間） | DISTANCE `:215` 4件（28日） | STATE `surfaces.blog.d1ClickCount` 10（全期間2ラベル） | 窓とラベル集合が3通り。**同名で別物** |
| C-3 | `/hensachi` の D1 | MONEY trusted 5 | DISTANCE 5（internal 5） | STATE 17（全期間3ラベル） | 同上 |
| C-4 | 学校ページ枚数 | BRIEF `:278` 約958 | DISTANCE `:274`／STATE 3,089 | BAR `:391` は 3,422 でスケール | **BAR の EV が11%過大** |
| C-5 | CTR曲線 | DISTANCE `:405` は**旧曲線**（1位55.9%…） | BAR `:367`／STATE は新曲線（1位46.4%…） | BRIEF §6 と §H が両方載っている | DISTANCE が stale（ただし DISTANCE は曲線を一度も使っていない＝実害は無いが誤引用の種） |
| C-6 | `stats_submit_ok`（28日） | DEADWIRE `:652` **0** | STATE `ga4.otherNotableEvents` **97** | 本書 M3 **97（全て7/25以前）** | **DEADWIRE §11 の表が窓違いの値を28日列に入れている** |
| C-7 | `share_to_parent`（28日） | BRIEF/STATE **2** | DEADWIRE §11 `:653` **0** | DEADWIRE 本文 `:154-156` は 7/18・7/22 に各1＝**2** | **DEADWIRE 文書内で自己矛盾** |
| C-8 | `percentile_view` | DEADWIRE `:86` 58回（7/26〜） | STATE 58（28日） | 本書 59（**初回 8/01**・8/01〜8/10） | 窓ラベルが3通り。**初回日8/01＝汚染バースト初日と同日**という決定的事実が誰にも無い |
| C-9 | `rage_click` | BRIEF 60（28日） | DEADWIRE 14（7/26〜・page_view 603 の2.3%） | STATE 61・本書61（うち7/26以降14） | 整合するが DW-10 の比率だけ別窓 |
| C-10 | EV/click の基準 | MONEY ¥148.2（加重実測ミックス） | BAR ¥240（sora-juku-text） | DISTANCE ¥103.5（0.015×0.6×¥11,500） | DEADWIRE ¥222（A8公開EPC） | **4種類。文書間の円は比較不能** |
| C-11 | 現在の換金実力（月） | MONEY `:281` ¥7,199/月 | DEADWIRE `:350` ¥4,440/28日（≒¥4,757/月） | — | 同じ対象・相互参照ゼロ |
| C-12 | `placement` 89箇所の是正 | MONEY 出血6/9「直せ・+¥478/月」 | DISTANCE 施策D「¥1,097/月・A〜Cの前提」 | DEADWIRE `:689`「**やるな**」 | 三つ巴 |
| C-13 | `/hogosha` への文脈リンク数 | DISTANCE `:251` 7ルート | 別criticの実測 16ルート | — | 診断の前提が誤り |
| C-14 | 学校ページの収益性評価 | MONEY 出血5「**換金コードが1行も無い**（grep 0ヒット）」 | DISTANCE `:283-284`「**dA=1**（LINE CTAが直下）・dS=2（/juku-shindan へ直リンク）」 | — | **同じページを「換金機構ゼロ」と「収益距離1」で正反対に評価**。どちらも正しい（定義違い）が、PHASE 1 は必ず一方を誤読する |
| C-15 | `surfaces.*` の面別クリック | STATE `surfaces.hensachi.clicks28d`=**1,640**（前方一致合算） | BRIEF §2 収益面 `/hensachi`=**1,601**（実URL） | — | 同名別値（別critic指摘） |
| C-16 | G1 残差 | STATE 45人・13.1人/週 | STATE 自身の `_criticalRule` に従えば 39人・13.0人/週 | — | 自己矛盾 |
| C-17 | 3年度以上保有県 | BAR 47/47 | 別critic実測 42/47 | — | 結論が5県で崩れる |
| C-18 | minkou 更新日 | BAR `:181`,`:339` 2024/4/23 | 別critic実測「更新日表記なし」 | — | 差-5の優位はむしろ強まる方向 |

---

## 5. PHASE 1（CLOCK / THREATS）に進むために空白のまま残っている穴

### 5-A. CLOCK 側

| # | 穴 | なぜ PHASE 1 が書けないか |
|---|---|---|
| CL-1 | **👤本人が 2026年度受験生である**（memory `[[user_role]]`）という制約が **5成果物のどこにも無い** | 冬ピーク（12〜2月・山は2月）は**本人の受験直前期と完全に重なる**。人的リソースの前提が抜けたまま「冬に何をやるか」を設計すると必ず破綻する。CLOCKの最大の欠落 |
| CL-2 | 終業式デーの**具体的な日付が未確定** | 「12月下旬・3月下旬」としか書かれていない（BRIEF §7）。年3回の収穫日（平常比2.6〜2.9倍）を狙う施策は日付が要る。県別の2学期終業式は一次ソースで取れる |
| CL-3 | **ピークフリーズ中の「データ追記」の可否が未裁定**（BAR V-7） | 差-5「公表当日更新」＝BARが挙げた**唯一の時間軸の武器**が、11/15以降に使えるか不明。👤ゲート。裁定が無いと冬の計画が2通りに分岐する |
| CL-4 | **建設終端 8/31 → ユタ出発 9/8 の8日間**の扱いが誰の担当でもない | STATE は「G2判定(9/30)がユタ直後」「実質作業期間は 08-10〜09-07 と 09-23〜09-30」と書いたが、**8/31以降・9/7までの8日に何を置くか**は空白 |
| CL-5 | G1（8/31・残り21日・不足39人）を埋める施策が **5成果物のどこにも無い** | STATE は「この差を埋める施策が無い限り behind で確定し missedAction が発火する」と警告だけして終わっている。**missedAction＝「Aレバー（名簿）縮小」は伸びているチャネルを畳む戦略転換**なので、誤発火の代償が大きい |

### 5-B. THREATS 側 — **5成果物のどれも「失う可能性」を1行も扱っていない**

| # | 未着手の脅威 | 現時点で手元にある唯一の手掛かり |
|---|---|---|
| TH-1 | **単一記事依存**: `/blog/all-3-high-school-options-2026-update` が断片込みで**サイト全表示の約31%**（BRIEF §2） | この1本が落ちたときの影響が未試算。実クリックは648（サイトの7.6%）だが、表示の集中は構造的リスク |
| TH-2 | **AI Overview / AI検索による計算機クエリの侵食** | GA4 `ai_referral` 31件（STATE）だけ。**分解ゼロ**。「偏差値計算」等の頭語がAIに置換されると `/hensachi`（1,601クリック＝中核）が直撃される |
| TH-3 | **Google の手動対策・コアアップデート** | GSCの該当ページを誰も見ていない（P-4）。ドメイン6か月・大量の自動生成的ページ（学校ページ3,089枚を8/09に47県一括解禁） |
| TH-4 | **ASPプログラムの終了・条件変更** | live 34本の href 生存が未確認（D-1）。特に `sora-juku-text` は季節フォールバック先＝5面の主オファー |
| TH-5 | **公開中の誤った「全国統計」が被リンク営業で指摘されるリスク** | DEADWIRE DW-1 が指摘。**BAR 差-2「一次ソース主義・独自推定禁止」と正面衝突する自傷**。TIER X（.go.jp／Wikipedia）の営業対象に見つかると回復不能、と DEADWIRE 自身が書いている |
| TH-6 | **競合が分子分母（募集人員・出願者数）を足してきた場合** | BAR 差-1 の耐久性が未評価。進研ゼミは育伸社から比率を購入している（`czemi.html`）が、購入契約を変えれば埋まる可能性は排除できない |
| TH-7 | **学校ページ3,089枚が「低品質の大量ページ」と評価されるリスク** | 28日で 233枚だけ露出・605表示・7クリック。残り2,856枚の**インデックス状態が不明**（U-5）。index解禁は県単位👤ゲートで慎重に運用してきたのに、8/09に47/47完走した直後の評価が未観測 |
| TH-8 | Workers / D1 の容量・コスト | 誰も触れていない。3,089ページ＋10MB上限（memory `[[fable5-loop-protocol]]`） |

### 5-C. 構造的な穴（PHASE 1 の作業そのものが壊れる）

| # | 穴 |
|---|---|
| S-1 | **共有係数表が存在しない。** EV/click が4種類（表C-10）、遷移率が2種類（0.455% / 本書0.199%）、学校ページ枚数が3種類。**PHASE 1 はどれを引用しても他の文書と矛盾する。** 先に「1つの係数表」を確定させる必要がある |
| S-2 | **同じ施策に正反対の結論が3件**（表C-12・C-14・表A）。仲裁が誰の担当でもない |
| S-3 | **STATE.json が兄弟文書の最大の発見を取り込んでいない。** 「後続が読む唯一の数値台帳」を自称しながら、`clicks` を rank1 の真値と定義し（DEADWIRE の結論と逆）、U-1/U-2/U-3/U-12 は DEADWIRE・MONEY が既に解いている。**このまま PHASE 1 が STATE だけを読むと、PHASE 0 の最重要の発見を全部失う** |
| S-4 | **窓（期間）の表記規約が無い。** 「28日」「直近28日」「7/26〜」「全期間」が同じ列に混在（表C-6〜C-9）。後続は必ず取り違える |

---

## 6. 出血点ランキング 上位8（5成果物すべてを踏まえて）

> ★ **円が出せないものは無理に円にしていない。出せない理由を書いた。**

### 出血1 — 共有分母（遷移率）が2.3倍過大で、3文書がそれを継承している

| | |
|---|---|
| **症状** | 「サイト全体の遷移率 0.455%」が MONEY で作られ、BAR §5-1（`ops/BAR.md:370` が `ops/MONEY.md:272` を明示引用）と DISTANCE §7.4 に伝播。**しかし trusted の定義が root_only（パス無しreferer）を人間に数えている** |
| **証拠** | `ops/MONEY.md:13,19,272` ／ 反証は M1（28日: 内部パス付き **17**・root_only **29（mobile 0）**・null 301・外部 3）／ root_only を bot と断定しているのは `ops/DEADWIRE.md:259-278`（毎日 04:1x・11:2x UTC・全desktop・`parent-lp` を名乗るが `/` に parent-lp は1つも無い） |
| **影響（円）** | 遷移率 0.455% → **0.199%**。月間アフィリクリック 48.6 → **21.2件/月**（10,667 × 0.199%）。`ops/MONEY.md:281` の「現在のミックス ¥7,199/月」→ **約¥3,140/月**。DEADWIRE の EPC¥222 基準なら **約¥4,700/月**。**さらに MONEY §5-c の「1.17%まで引き上げれば +¥11,296/月」は根拠が消える** |
| **最小の直し方** | SQL 1本で `referer LIKE 'https://my-naishin.com/_%'`（＝パス2文字以上）に絞って再計算し、**係数表を1枚に固定して4文書から参照させる**。`clicks-db.ts:146-148` の `trustedOnly` オプションの定義も同時に絞る（`bot-filter.ts:49` `isInternalReferer`） |
| **人間ゲート(C7)** | 不要（読み取り＋コード変更。デプロイは👤） |
| **確信度** | **高**。M1 の4分類は再現可能。ただし「root_only 29件が100%botか」は未証明（GA4が 8/10 に affiliate_click 1件を記録しており、その日のD1 9件は全て null/root）＝ **17は下限、46は上限** |

### 出血2 — 誤った「全国統計」の配信が続いており、隔離範囲が過小に見積もられている

| | |
|---|---|
| **症状** | `/api/stats/distribution?metric=hensachi` が偏差値の平均を **63.16** として配信中（偏差値の母平均は定義上50）。DEADWIRE は隔離対象を 8/01+8/07 の138件としたが、**JST整合後に GA4 の裏付けが無いのは 222件（70%）** |
| **証拠** | `ops/DEADWIRE.md:29-35`（curl実測）／表B（M3+M4 の突合）／M6（`stats_submissions` に UA/IP 列が無く、日付以外に隔離の鍵が無い）／M7（計装は7/13から生きている）／`percentile_view` の**初回は 8/01**＝汚染バースト初日と同日（本書 M3 の隣接計測） |
| **影響（円）** | **円で語れない。理由: 失うのは信頼であり、逸失収益として計測できる経路が無い。** 代わりに数えられるもの: `percentile_view` 59回（8/01〜8/10・GA4は下限）＝**誤ったパーセンタイルが表示された下限回数**。かつ `ParentShareBanner.tsx:135` により保護者面にも同じ値が届く |
| **最小の直し方** | ①`/api/stats/submit` に `isBotUserAgent` 3行（`parent-funnel/route.ts:48` と同型）＝**将来分のみ**。②**隔離基準を先に定義する**（表Bを基準表にする。「GA4対応が無い日」だけでは7/15-16の人間らしい分布を捨てる）。③最も安く正直なのは**「全国」の語を外す**（DEADWIRE も同結論）。④`total-score`（n=48・k閾値30超）も同じ配信状態か curl で確認（未実施） |
| **人間ゲート(C7)** | ①は不要（デプロイは👤）。②③④のうち**本番D1の行操作と文言変更は👤必須**。加えて `scripts/backup-d1.ts` を先に走らせること（DEADWIRE は言及していない） |
| **確信度** | 「bot判定が無い」= 断定（grep）。「222件が非ブラウザ」= **中**（GA4のTZ未確定＋7/15-16の分布が人間的） |

### 出血3 — 学校名エンティティのクエリを、汎用ページが2〜4位で受けて0%で捨てている

| | |
|---|---|
| **症状** | 学校名（短縮形）クエリは **8,326クエリ / 32,528表示 / 1,064クリック**（`ops/BAR.md:450`）。うち学校ページ `/pref/*/school/*` が受けているのは **605表示 / 7クリック（1.9%）**。残りは `/naishin-oru/4`・`/blog/naishinten-average-score`・`/tokyo/naishin` 等の汎用ページが**2〜4位で**受け、CTRはほぼ0 |
| **証拠** | M10（`/naishin-oru/4` 431表示・4.13位・**0クリック**）／M11（表示クエリは「一条高校 内申点」2位・「上溝高校 内申点」3位・「中京大中京 内申点」3位…）／M12（「八王子実践高校」＝ blog 2.57位1クリック ＋ naishin-oru/4 2.70位0クリック・**学校ページは1行も出ない＝私立は学校マスタ3,422校＝公立のみ**）／M13（裸の学校名「北園高校」2.0位・「向丘高校」2.4位、および「校則」「文化祭」「修学旅行」意図） |
| **影響（円）** | **円は出せない。理由3つ: (a) 学校名クエリのうち何%がエンティティページで代替可能かの推定根拠が無い (b) 私立には受け皿ページが存在せず順位も未知 (c) タイトルにエンティティ名を入れたときのCTRデルタの自社実測がゼロ。** 代わりに数えられるもの: **32,528表示/28日 ＝ 実URL表示215,748の15.1%** が対象。うち学校ページ経由は 1.9% |
| **最小の直し方** | まず**測る**: `gsc_query(dimensions=[page,query])` を学校名クエリ全体に回し「どのページが受けているか」の表を作る（本書は3コールで着手しただけ）。次に BAR の V-6（1県だけ title/h1 に短縮形併記→4週追跡）を実行。**私立への拡張は Y-0憲法の範囲内でのみ**（公表値のみ・偏差値/ボーダーの独自推定は禁止） |
| **人間ゲート(C7)** | 不要（測定と1県実験）。index 拡張を伴うなら既存の県単位👤ゲート |
| **確信度** | 「汎用ページが学校名クエリを2〜4位で受けている」= **断定**（M11/M12/M13）。「エンティティページ化で回収できる」= **未検証** |

### 出血4 — BRIEF が名指しした唯一の実行可能面 `/naishin-oru` を5成果物とも放置した

| | |
|---|---|
| **症状** | BRIEF §F は「追う価値があるのは `/naishin-oru`（407表示・クリック0）のような“表示はあるがCTR 0”の面だけ」と結論した。**MONEY / DISTANCE / BAR / DEADWIRE / STATE のどれも着手していない**（STATE は U-11 として未知数に積んだだけ） |
| **証拠** | `ops/raw/BRIEF.md:312-313` ／ STATE `unknowns.U-11` ／ 本書 M10・M11（**GSC 2コール・約30秒で原因の所在まで判明**） |
| **影響（円）** | `/naishin-oru/4` 431表示・4.13位。canonical曲線の4位=7.8%（BRIEF §H）なら **期待 33.6クリック/28日 ＝ 実測0**。円換算は **¥17/月**（36クリック/月 × 遷移率0.199% × EV¥240）＝**桁として無視できる**。**価値は円ではなく、出血3と同じ欠陥の最小再現ケースであること**（順位は取れているのにエンティティ名がタイトルに無い） |
| **最小の直し方** | `/naishin-oru/[n]` の title を「オール4の内申点」から**クエリ側の言語（学校名×内申点）に寄せるか、逆にこの面を学校名クエリから外す**かを決める。どちらにせよ**先に決めるべきは「この面を学校名クエリの受け皿にするのか」**という設計判断 |
| **人間ゲート(C7)** | 不要 |
| **確信度** | 実測は断定。施策効果は未検証 |

### 出血5 — 全ての円の校正点（ASP実績）が1件も存在しない

| | |
|---|---|
| **症状** | `data/affiliate-actuals.json` が存在せず（テンプレートのみ）、発生・承認・確定が**0なのか未取得なのかすら確定していない** |
| **証拠** | STATE `affiliates.actualRevenue`（`ls -la data/affiliate-actuals*`）／ `src/lib/affiliate-economics.ts:4-8` がコード自身で「未実測の仮定」と自認／ **受け皿スクリプト `scripts/reconcile-clicks.ts` と `npm run ev:reconcile` がリポジトリに在るのに5成果物のどれも言及していない**（本書 E-5/E-6） |
| **影響（円）** | **円で語れない。それが出血の内容そのもの。** 4文書が出した ¥7,199 / ¥4,440 / ¥3,300 / ¥2,943 は全て `convRateLow`（0.005〜0.06・仮置き）と `CONFIRM_RATE`（0.6・仮置き）の積で、**実測1件で全部が書き換わる**。特に FP相談系6案件は `convRateLow=0.015` が全部同じ仮置きで、実績ゼロ（`ops/MONEY.md:393` B-10） |
| **最小の直し方** | 👤が3ASPの管理画面から**発生件数だけ**を転記して `data/affiliate-actuals.json` を作る（金額は後でよい）。**発生0件でも情報価値は最大**（629クリックで0件なら convRate の上限が機械的に決まる） |
| **人間ゲート(C7)** | **必須**（👤のみ閲覧可） |
| **確信度** | 断定（ファイル不在の実測） |

### 出血6 — ASPへの最後の1ホップ（click-hop）が誰にも見られていない

| | |
|---|---|
| **症状** | `/go/[id]` は内部refererが無いと **302せず JSホップHTMLを返す**。JSを実行しない訪問者はASPに到達しない。**5成果物に言及ゼロ** |
| **証拠** | M14（`route.ts:118-128` ／ `click-hop.ts:18-31`：`<noscript>` は「トップへ戻る」のみ）／M15（grepヒット0）／ 該当経路の28日通過数は **null 301 + 外部 3 = 304件**（M1） |
| **影響（円）** | **円は出せない。理由: 304件のうち人間が何件かが未確定（出血1と同じ未知数）で、かつホップページの通過率が計測されていない（GA4にもD1にもホップ通過イベントが無い）。** 数えられるもの: **304件/28日がこの経路を通っている**。加えて **live 34本の href 生存が未確認**＝リンク切れなら到達率0 |
| **最小の直し方** | ①`affiliates.ts` の href 34本を直接 curl して生存確認（`/go` を叩かない＝D1を汚さない）。②ホップページに1イベント（D1 or GA4）を足して通過率を測る。③外部referer（google.com 3件・rakuten 1件）が**なぜ /go に付くのか**を確認 |
| **人間ゲート(C7)** | 不要（①は読み取り。②はコード変更・デプロイは👤） |
| **確信度** | 経路の存在は**断定**（コード）。損失量は**未検証** |

### 出血7 — G1（8/31・残り21日）を動かす施策が PHASE 0 のどこにも書かれていない

| | |
|---|---|
| **症状** | 名簿N=61（LINE 55 + leads 6）、努力軌道100、**不足39人・必要13.0人/週に対し直近実測8人/週**。5成果物は現状を記述するだけで、**velocityを上げる施策を1つも出していない**（MONEY/DISTANCE/BAR/DEADWIRE は全てアフィリ換金の話） |
| **証拠** | STATE `gates.evaluations[0]`（`evaluateRoadmapGates` を now=2026-09-01 で実行して behind を確認）／`line.velocity._trend`（19→13→9→8 の単調減少）／LINE鮮度は 8/07 止まり（3日遅れ） |
| **影響（円）** | **円で語れない。** ただし missedAction は「**Aレバー（名簿）縮小・B（直接契約）へ重心移動**」という戦略転換であり、`roadmap-gates.ts:26-33` 自身が「D1だけで判定すると誤発火する」と警告している項目。**誤発火の代償は「伸びているチャネルを畳む」こと** |
| **最小の直し方** | ①LINE友だち数の3日分を👤が転記（判定日直前に必須）。②判定日に `g1Confirmed` 相当の実測を渡さないと `unmeasured` で確定する設計なので、**8/31の朝に何を渡すかを今決める**。③施策側は PHASE 1 の担当範囲だが、**PHASE 0 が「名簿の分子を増やす面」を1つも同定しなかった**こと自体が欠落（`line_friend_click` 27件/28日の発火源は GA4 の `source` 次元で分解可能・未実行） |
| **人間ゲート(C7)** | ①②は👤。③の測定は不要 |
| **確信度** | 断定（STATE の実行結果＋本書の GA4 再取得） |

### 出血8 — 同一対象に正反対の結論が並び、仲裁者がいない

| | |
|---|---|
| **症状** | (a) `placement` 89箇所: MONEY「直せ +¥478/月」／DISTANCE「¥1,097/月・A〜Cの前提」／DEADWIRE「**やるな**」。(b) `/hogosha`: DISTANCE「最優先施策A」／DEADWIRE「スクレイパ」。(c) 学校ページ: MONEY「換金コード0行」／DISTANCE「dA=1・dS=2」。(d) STATE の trustOrder rank1（clicks を真値）vs DEADWIRE 運用ルール1（clicks を二度と引用するな） |
| **証拠** | 表C-12 / 表A / 表C-14 / §5-C S-3 |
| **影響（円）** | **円で語れない（意思決定の質の問題）。** ただし影響量は測れる: 対立する施策の合計EVは **月¥478〜¥1,097**（placement）と **月¥1,588**（施策A）＝**PHASE 1 がどちらを採っても月¥3,000未満の話で1サイクルを消費する**。**これ自体が最大の機会損失** |
| **最小の直し方** | PHASE 1 の最初の1時間で**係数表を1枚に固定する**（遷移率・EV/click・学校ページ枚数・CTR曲線・窓の定義）。次に対立3件を「どちらの定義が正しいか」ではなく「**どちらでも結論が変わらないか**」で潰す（3件とも月¥3,000未満なので**両方やらない**が最も安い答えになりうる） |
| **人間ゲート(C7)** | 不要 |
| **確信度** | 断定（各文書の記述） |

---

## 7. 付録 — 本書で実行した検証コマンド（再現用）

```bash
# 本番D1（読み取り専用）
node scripts/d1q.mjs "SELECT CASE WHEN referer IS NULL THEN '1_null' WHEN referer='https://my-naishin.com/' THEN '2_root_only' WHEN referer LIKE 'https://my-naishin.com/%' THEN '3_internal_path' ELSE '4_external' END k, COUNT(*) n, SUM(CASE WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%iPhone%' OR user_agent LIKE '%Android%' THEN 1 ELSE 0 END) mob FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY 1 ORDER BY 1"
node scripts/d1q.mjs "SELECT referer, COUNT(*) n FROM clicks WHERE referer IS NOT NULL AND referer NOT LIKE 'https://my-naishin.com%' GROUP BY 1 ORDER BY 2 DESC"
node scripts/d1q.mjs "SELECT created_at, affiliate_id, COALESCE(placement,'(null)') p, COALESCE(referer,'(null)') r, substr(user_agent,1,45) ua FROM clicks WHERE date(created_at) IN ('2026-07-13','2026-08-10') ORDER BY created_at"
node scripts/d1q.mjs "SELECT substr(datetime(created_at,'+9 hours'),1,10) jd, COUNT(*) n FROM stats_submissions GROUP BY 1 ORDER BY 1"
node scripts/d1q.mjs "SELECT substr(datetime(created_at,'+9 hours'),1,10) jd, COUNT(*) n, ROUND(AVG(value),2) avg FROM stats_submissions WHERE metric='hensachi' GROUP BY 1 ORDER BY 1"
node scripts/d1q.mjs "SELECT sql FROM sqlite_master WHERE name IN ('stats_submissions','leads','clicks')"
node scripts/d1q.mjs "SELECT COUNT(*) n, COUNT(DISTINCT email) uniq_email, COUNT(DISTINCT lower(substr(email, instr(email,'@')+1))) uniq_domain, SUM(CASE WHEN unsubscribed=1 THEN 1 ELSE 0 END) unsub, MIN(created_at), MAX(created_at) FROM leads"

# GA4 MCP（property 540358022）★ limit は 1000 にすること（rowCount 567・400だと小イベントが切れる）
mcp__ga4__ga4_run_report(dimensions=[eventName,date], metrics=[eventCount,totalUsers], 2026-07-13..2026-08-10, limit=1000)

# GSC MCP（sc-domain:my-naishin.com）★ page×query 結合はこの3本
mcp__gsc__gsc_query(dimensions=[page],        pageContains='naishin-oru',              2026-07-10..2026-08-07)
mcp__gsc__gsc_query(dimensions=[query],       pageContains='naishin-oru',              2026-07-10..2026-08-07, rowLimit=25)
mcp__gsc__gsc_query(dimensions=[page,query],  queryContains='八王子実践',              2026-07-10..2026-08-07, rowLimit=30)
mcp__gsc__gsc_query(dimensions=[query],       pageContains='naishinten-average-score', 2026-07-10..2026-08-07, rowLimit=20)

# 本番HTTP（iPhone UA 必須）
curl -k --max-time 45 -A "<iPhone UA>" https://my-naishin.com/hogosha        # 200 / robots: index, follow
curl -k --max-time 45 -A "<iPhone UA>" https://my-naishin.com/juku-shindan   # 200 / robots: index, follow
curl -k --max-time 45 -A "<iPhone UA>" https://my-naishin.com/naishin-oru    # 200 / robots: index, follow
curl -k --max-time 60 -A "<iPhone UA>" https://my-naishin.com/sitemap.xml    # 3,481 URL / school 3,089 / blog 49

# ローカル
node scripts/check-orphans.mjs        # exit 0・オーファン0
git log -S "STATS_SUBMIT_OK" --reverse -- src/lib   # f37f94c 2026-07-13 20:29 JST
grep -rn "click-hop\|ClickHop\|ホップ" ops/*.md ops/raw/BRIEF.md   # ヒット0
```

**本書で本番への書き込み・デプロイ・env変更・メール送信・フラグ点火は一切行っていない。`src/` は1行も変更していない。**
