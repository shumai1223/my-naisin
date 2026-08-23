# DEADWIRE.md — 計測と換金の「壊れている配線」だけを狩った結果

- 作成: 2026-08-10 / 担当: 第二の目（MONEY.md 担当とは独立に同じ場所を別の目で見た）
- 方針: **新機能は1つも提案しない。壊れているものだけを挙げる。**
- 前提: `ops/raw/BRIEF.md` の数値は再導出せず引用。本書の新規数値は全て自分で実行したコマンドの出力を添えた。
- リポジトリ実パス: `c:\Users\E24054\my-naisin`

---

## 0. 要旨（3行）

1. **`parent_funnel_events=0` はバグではない。** コードもデプロイもD1も健全で、**7/22以降ただの一度も共有ボタンが押されていない**（GA4も同期間0）。ただし「押されない」の背景に**7/26〜11/14の111日間ダークな期間ゲート**がある。
2. **「D1こそ真値・GA4は下限」という現在の信念は、clicks テーブルに関しては誤り。** 28日のD1 clicks 348件のうち**実人間は多くて20件（5.7%）**。残りはスケジュール実行のボット。**GA4/D1の174倍という乖離は存在しない（実際は約10倍）。**
3. **もっと悪いものが1つある。** `stats_submissions` が同じ理由で汚染され、**汚染された平均値が本番APIから今この瞬間も配信されている**（偏差値の全国平均を **63.16** と公表中。偏差値は定義上平均50）。これは計測事故ではなく **Y-0憲法「捏造ゼロ・信頼の堀」に触れる公開事故**。

---

# 1. ★★★ DW-1: `stats_submissions` が汚染され、汚染された数値が本番から配信されている

**これは今回見つけた中で唯一「今すでにユーザーに嘘をついている」死配線。**

### 症状
`/api/stats/distribution` と `/api/stats/percentile` が、**偏差値の全国平均を 63.16 として公開配信している**。偏差値は定義上、母集団平均が 50。
その結果、**偏差値55のユーザーに「29パーセンタイル（＝下位3割）」と表示している。**

### 証拠

```bash
$ curl -k -A "Mozilla/5.0 (iPhone; ...)" "https://my-naishin.com/api/stats/distribution?metric=hensachi"
{"meta":{...,"minSampleSize":30,"generatedAt":"2026-08-10T10:23:59.764Z"},
 "insufficientData":false,"aggregate":{"count":263,"mean":63.1572325920805,"min":20,"max":85.03333333333333}}

$ curl -k -A "Mozilla/5.0 (iPhone; ...)" "https://my-naishin.com/api/stats/percentile?metric=hensachi&value=55"
{...,"insufficientData":false,"result":{"count":263,"percentile":29},...}
```

汚染の実測（本番D1・2026-08-10 取得）:

| 日 | D1 `stats_submissions` 件数 | 同日のGA4 `calc_complete` | 判定 |
|---|---|---|---|
| 2026-08-01 | **56** | 7 | 送信 > 計算完了。**構造的に不可能**（1送信は1計算結果を要する） |
| 2026-08-06 | 1 | 8 | 正常 |
| 2026-08-07 | **82**（10時台24件・12時台58件 UTC） | 同時刻帯 **0** | **対応するブラウザ活動が存在しない** |
| 2026-08-09 | 1 | 6 | 正常 |

```bash
$ node scripts/d1q.mjs "SELECT substr(created_at,1,13) h, COUNT(*) n, COUNT(DISTINCT value) vals FROM stats_submissions WHERE created_at >= '2026-08-06' GROUP BY h ORDER BY h"
2026-08-06 09 n=1  / 2026-08-07 10 n=24 (distinct値15) / 2026-08-07 12 n=58 (distinct値38) / 2026-08-09 08 n=1
```
GA4（property 540358022・dateHour, eventName）: 2026-08-07 は 15時・17時に `result_view` 1件ずつのみ、`calc_complete` は **0件**。

さらに GA4 の `stats_submit_ok`（サーバ2xx受領時にのみ発火・`src/lib/stats-submit-client.ts:26`）は
**2026-07-26〜08-10 で 0件**（同期間 `stats_optin_view` は150件記録されている＝gtag自体は生きている）。
デプロイ済みバンドルにも当該コードは存在する（本番 `chunks/3494-c9cf9e27cdfd1f35.js` 内に
`t.ok?(0,m.sx)(m.qY.STATS_SUBMIT_OK,...)` を確認）。
→ **169件のD1行に対して、対応するブラウザ発火が1件も無い。**

原因（コード側）:

| 経路 | ボット判定 | file:line |
|---|---|---|
| `/go/[id]` | **あり** | `src/app/go/[id]/route.ts:79` `if (isBotUserAgent(ua))` |
| `/api/parent-funnel` | **あり** | `src/app/api/parent-funnel/route.ts:48` |
| `/api/school-click` | **あり** | `src/app/api/school-click/route.ts:49` |
| **`/api/stats/submit`** | **無し** | `src/app/api/stats/submit/route.ts:55-` （POST冒頭はIPレート制限のみ。`isBotUserAgent` の import すら無い） |

`grep -rn "isBotUserAgent" src/app/api src/app/go` → ヒットは上記3ファイルのみ。`stats/submit` は含まれない。

汚染の規模:

```bash
$ node scripts/d1q.mjs "SELECT metric, COUNT(*) n, ROUND(AVG(value),2) avg, MIN(value) mn, MAX(value) mx, SUM(CASE WHEN value>=80 THEN 1 ELSE 0 END) gte80 FROM stats_submissions GROUP BY metric"
hensachi    n=263 avg=63.16 min=20 max=85.03 (80以上=34件)
naishin     n=8   avg=109.75 min=50 max=290
total-score n=48  avg=508.79 min=24 max=838
```
`hensachi` 263件のうち **138件（52%）が 8/01 と 8/07 の2つのバーストに由来**。
k-匿名性しきい値は `STATS_MIN_SAMPLE_SIZE = 30`（`src/lib/stats-aggregation.ts:11`）なので、
**汚染で母数が30を超えたことにより、かえって「表示してよい」状態になっている。**

同じ値は保護者にも届いている: `src/components/ParentShareBanner.tsx:135` が
「上位 {100 - percentile}%相当」を保護者向けに描画する。

### 影響
- 円: 直接の逸失は無い。**失うのは唯一の堀（＝数字が正しいという信頼）。** 「教育委員会の公表値のみ・独自推定禁止」（Y-0憲法）を掲げているサイトが、**検証不能な第三者POSTから作った平均を「全国統計」として配信している**状態は、被リンク営業（TIER X・.go.jp/Wikipedia）で1度でも指摘されたら回復不能。
- `percentile_view` は 2026-07-26〜08-10 に **58回**発火済み（GA4）＝既に58回表示されている。

### 最小の直し方（3手・いずれも小さい）
1. `src/app/api/stats/submit/route.ts` の POST 冒頭に `/api/parent-funnel/route.ts:48` と同型の3行を入れる（bot UA → 204）。**新規ファイルゼロ・既存関数の再利用のみ。**
2. 汚染2日分（`created_at` が `2026-08-01` と `2026-08-07`）を集計対象から外すか隔離する。**現行スキーマに quarantine 列が無い**（`migrations/0007`）ので、最小手は「集計クエリで除外」ではなく **migration追加 or 該当行DELETE**＝👤ゲート必須。
3. 恒久策は DW-8（監査バッチの自動化）。

### 人間ゲート
- 1（bot判定追加）: コード変更のみ・**loop可**（デプロイは👤）。
- 2（本番D1の行削除/migration）: **👤必須**。
- **暫定の応急処置として「k閾値を上げる」は効かない**（n=263で既に超えている）。むしろ**汚染日を除くと hensachi は125件**で、それでも30を超えるので表示は続く。**平均は 63.16 → 60.52 にしか下がらない**（下記コマンド）。＝**バーストだけが原因ではない。母集団自体が自己選抜で偏っている。** 「全国」という語を外すのが最も安い正直化。
```bash
$ node scripts/d1q.mjs "SELECT metric, COUNT(*) n, ROUND(AVG(value),2) avg FROM stats_submissions WHERE substr(created_at,1,10) NOT IN ('2026-08-01','2026-08-07') GROUP BY metric"
hensachi n=125 avg=60.52
```

### 確信度
- 「`/api/stats/submit` にボット判定が無い」= **断定**（grep結果）。
- 「8/01・8/07のバーストが実ブラウザ由来でない」= **断定に近い**（GA4に対応活動ゼロ・`stats_submit_ok` 0件・デプロイ済みコードは正常）。残る唯一の反証は「Consent Mode拒否かつadblock有効なユーザーが1人で82回再計算した」だが、その場合 GA4 の `calc_complete`（同一セッションから出るはず）も0でなければならず、8/7の該当時間帯は全イベントが0。
- 「偏差値の母平均は50」= 定義。**このサイトの標本平均63.16が母集団を代表しないこと自体は断定可能。**

---

# 2. ★★★ DW-2: `parent_funnel_events` 全期間ゼロ — 原因を断定する

### 結論: **(b) が主因。(a) が背景条件。(c)(d)(e) は全て否定できる。**

### 仮説ごとの検証結果

| 仮説 | 判定 | 証拠 |
|---|---|---|
| **(a)** コンポーネントが描画されていない | **△ 部分的にYES（ただし全滅ではない）** | 下表参照 |
| **(b)** 描画されているがクリックされていない | **○ これが主因** | GA4も同期間0（下記） |
| **(c)** fetchが失敗（CSP/相対パス/SSR） | **× 否定** | CSPは `frame-ancestors *` のみ（`public/_headers:12` / `src/app/embed/naishin/route.ts:119`）。`connect-src` の指定はリポジトリ全体に存在しない（Grep `Content-Security-Policy\|connect-src` のヒットは embed 3件のみ）。ビーコンは本番バンドルに実在（下記） |
| **(d)** `persistParentFunnelEvent` が例外で握り潰されている | **× 否定** | 本番D1の実スキーマに `hours_since_sent INTEGER` が存在しINSERT列と完全一致（下記）。かつ `school-page-clicks-db.ts` と `getDb()` は**1文字違わぬ同一実装**で、そちらは9件書けている |
| **(e)** `isBotUserAgent` が実ユーザーを弾いている | **× 否定（主因ではない）** | `src/lib/bot-filter.ts:14` の `BOT_UA_RE` に主要ブラウザUAのトークンは無い。かつ**同じ関数を通る `/api/school-click` は9件書けている**（`school_page_clicks` reverse 8 / juku-shindan 1） |

### (c)(d) を潰した証拠

デプロイ済みバンドルにビーコンが実在する（本番から取得した実チャンク）:
```
$ curl -k -A "<iPhone UA>" https://my-naishin.com/hensachi → 200 / 549,580 bytes
$ (HTML中の19本のチャンクを全取得) grep -l "api/parent-funnel" chunks/*
chunks/81-63666e5fec6a1af5.js

# 該当箇所（ParentShareLinkButton・minified）
... (0,c.u4)(c.qY.SHARE_TO_PARENT,{...}),(0,d.B)("share_to_parent",{medium:l,prefectureCode:e.prefectureCode}),b?.() ...
# 該当箇所（ParentShareInvite・chunks/3494-...js）
... (0,o.u4)(o.qY.SHARE_TO_PARENT,{...}),(0,c.B)("share_to_parent",{medium:r,prefectureCode:e.prefectureCode}) ...
```
本番D1の実スキーマ:
```bash
$ node scripts/d1q.mjs "SELECT sql FROM sqlite_master WHERE name='parent_funnel_events'"
CREATE TABLE parent_funnel_events (id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT NOT NULL,
  medium TEXT, prefecture_code TEXT, created_at TEXT NOT NULL, hours_since_sent INTEGER)
```
`src/lib/parent-funnel-db.ts:87` の `INSERT INTO parent_funnel_events (event, medium, prefecture_code, hours_since_sent, created_at)` と列名・列数が完全一致。**列不整合は無い。**

### (b) を断定した証拠 — GA4 も同期間ゼロ

`share_to_parent` は D1ビーコンと**同じ onClick の1〜2行隣**でGA4にも送られる（`ParentShareLinkButton.tsx:121`＋`:128`）。
GA4（property 540358022・date × eventName）を全期間で引いた結果:

| 日 | `share_to_parent` | `parent_landing_view` | `share_image` | `share_qr_reveal` |
|---|---|---|---|---|
| 2026-07-06 | **6** | 0 | 6 | 0 |
| 2026-07-14 | 0 | 1 | 0 | 1 |
| 2026-07-15 | 0 | 1 | 0 | 0 |
| 2026-07-17 | 0 | 1 | 0 | 0 |
| 2026-07-18 | **1** | 0 | 1 | 0 |
| 2026-07-22 | **1** | 2 | 1 | 2 |
| **2026-07-23〜2026-08-10（19日間）** | **0** | **0** | **0** | **0** |

（取得: `ga4_run_report` metrics=eventCount dimensions=[date,eventName] 2026-06-15〜07-24 および 07-25〜08-10）

D1ビーコンの稼働開始は 2026-08-02（`fd7ecb5`）。**その時点で既にGA4側も9日連続ゼロだった。**
→ **「ビーコンが壊れている」のではなく「送信イベント自体が発生していない」。2系統が独立に同じ結論を出している。**

同じ確認をLINE側でも実施: `line_registration_click` ビーコン（`ParentShareInvite.tsx:56`・2026-08-09追加）以降に発生した唯一の `line_friend_click`（2026-08-10・1件）は、GA4のカスタム次元 `source` が **`sticky-bar`**（`StickyConvertBar`）であり `ParentShareInvite` 由来ではない。**ビーコン配線済みの導線は一度も押されていない。**

### (a) — ただしこれが「押されない」の背景条件になっている ★これ自体が発見

`ParentWindowBridge` は期間ゲートで **窓の外では丸ごと `null` を返す**:

```ts
// src/lib/parent-window.ts:25-31
export function activeParentWindow(now: Date = new Date()): ParentWindowId | null {
  const m = now.getUTCMonth() + 1; const d = now.getUTCDate();
  if (m === 7 && d >= 1 && d <= 25) return 'mendan-july';
  if ((m === 11 && d >= 15) || (m === 12 && d <= 25)) return 'winter';
  return null;
}
// src/components/ParentWindowBridge.tsx:65
if (!windowId) return null;
```

`ParentWindowBridge` は **13の結果フローに配線されている唯一の共通コンポーネント**で、その中に
「現在地を保護者に送る（成績カード）」＝`ParentShareLinkButton`（`ParentWindowBridge.tsx:144`）を内包する:

| 配線先 | file:line |
|---|---|
| 47県内申 | `src/components/Calculator/NaishinResultFlow.tsx:60` |
| /hensachi | `src/components/Hensachi/HensachiResultFlow.tsx:115` |
| /hensachi/gyakusan | `src/components/Hensachi/HensachiGyakusanResultFlow.tsx:53` |
| /hensachi/shindan | `src/components/Hensachi/ShindanResultFlow.tsx:31` |
| /hyotei-heikin | `src/components/HyoteiHeikin/HyoteiResultFlow.tsx:83` |
| /hyotei-heikin 逆算 | `src/components/HyoteiHeikin/HyoteiHeikinGyakusanResultFlow.tsx:45` |
| /reverse | `src/app/reverse/ReverseClient.tsx:292` |
| total-score 7県 | `TotalScoreResultFlow.tsx:34` / `TokyoTotalScoreResultFlow.tsx:26` / `SaitamaResultFlow.tsx:21` / `OsakaResultFlow.tsx:25` / `KanagawaResultFlow.tsx:25` / `FukuokaResultFlow.tsx:22` / `ChibaTotalScoreResultFlow.tsx:26` / `AichiTotalScoreResultFlow.tsx:22` / `HokkaidoRankResultFlow.tsx:25` |

**GA4履歴上の `share_to_parent` は 7/06(6) / 7/18(1) / 7/22(1) の計8件で、すべて窓（7/1〜7/25）の内側。窓が閉じた7/26以降は全期間ゼロ。**
`share_image`（`ParentShareLinkButton.tsx:138` にしか存在しない）と `share_qr_reveal`（同 `:211` にしか存在しない）も**完全に同じ日付分布**＝発火源が `ParentShareLinkButton` であることの裏取り。

⚠️ **注意（過大解釈の禁止）**: 7月は表示も3倍（BRIEF §B: 7月10,667クリック vs 8/1-7で1,088）なので、この分布は「窓のせい」と「季節のせい」を分離できていない。ただし**7/26〜8/10の16日間だけでも GA4 `result_view` は126件あり、そこから共有0**（GA4・07-26〜08-10集計）。7/1〜7/25は `result_view` 858 → 共有8（**0.93%**）。
→ **窓が開いていた期間の共有率0.93%を、閉じた期間の126 result_view に当てると期待値1.17件。実測0件。0件は統計的にありふれた結果で、窓の効果を証明も反証もできない。** これが正直な限界。

### 影響（円）
- 現時点の直接逸失は **ゼロに近い**（共有0・着地0・そこからのクリック0）。**この配線が回復しても、いま動く円は無い。**
- 効くのは**11/15〜12/25の窓**。BRIEF §7 の季節係数（S値2月11.7倍等）と、7/1〜7/25の実測共有率0.93%が唯一の自社実測値。
- **冬の窓に向けて壊れたまま放置すると初めて円が失われる。** 逆に言えば**いま急いで直しても8月の円は動かない。**

### 最小の直し方
1. **やってはいけないこと**: 「共有が出ないからボタンを増やす」。7発火点あって0件なので、**分母（結果到達126/16日）が小さすぎる**のが実態。
2. 本当に直すべきなのは DW-4（ビーコン未配線の3経路）だけ。**期間ゲートは仕様であって不具合ではない**（コメントで意図が明記されている: `parent-window.ts:6-8`）。
3. **ただ1手だけ、断定を100%にする方法がある**（下記）。

### 「これを確かめるこの1手」（唯一残った未検証点）
**「クリックされたら本当にD1に1行入るのか」だけが未実証。**（本番書き込みになるため本タスクでは実行していない）

```bash
# ⚠️本番D1への書き込み。👤の許可が要る。
curl -k --max-time 45 -X POST "https://my-naishin.com/api/parent-funnel" \
  -A "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1" \
  -H "Content-Type: application/json" \
  -d '{"event":"line_registration_click","prefectureCode":"zz-canary"}' -w "\n%{http_code}\n"
# 期待: 204
node scripts/d1q.mjs "SELECT * FROM parent_funnel_events WHERE prefecture_code='zz-canary'"
# 1行あれば書き込み経路は健全＝(b)で100%確定。0行なら(d)が生きている＝最優先バグ。
# 検証後に該当行を削除する必要があるので、DELETE も含めて👤ゲート。
```
`prefectureCode` に `zz-canary` を使えば実データと混ざらず、後で確実に消せる。
（`event` は `VALID_EVENTS`（`route.ts:14`）にある3種のいずれかである必要がある。`line_registration_click` なら
`share_to_parent`/`parent_landing_view` のファネル分子を汚さない。）

### 確信度
- (c)(d)(e) の否定: **断定**。
- (b) が主因: **断定**（GA4という独立系統が同じ0を出しており、かつビーコン導入前から0）。
- (a)（窓ゲート）が「押されない」の説明になっているか: **要追加検証**（上記の統計的限界のとおり）。

---

# 3. ★★★ DW-3: 「D1こそ真値」という前提が `clicks` に関して壊れている

**BRIEF §4 の「GA4 affiliate_click=2 に対し D1 clicks=348（174倍）」は、GA4の欠測ではなく D1 の過大計上。**

### 症状
D1 `clicks` 348件（28日）のうち、実人間のクリックと呼べるのは **多くて20件（5.7%）**。

### 証拠

**① デバイス構成が実ユーザーと真逆**（サイトはモバイル74%＝memory・GSC）:
```bash
$ node scripts/d1q.mjs "SELECT CASE WHEN user_agent LIKE '%Mobile%' OR user_agent LIKE '%iPhone%' OR user_agent LIKE '%Android%' THEN 'mobile' ELSE 'desktop' END dev, COUNT(*) n FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY dev"
desktop 327 / mobile 21     ← モバイル比率 6%
```

**② referer の有無で切ると、referer付きすら大半がボット**:
```bash
$ node scripts/d1q.mjs "SELECT CASE WHEN referer='https://my-naishin.com/' THEN 'root_only' ELSE 'has_path' END k, <device> dev, COUNT(*) n FROM clicks WHERE referer IS NOT NULL AND created_at >= datetime('now','-28 days') GROUP BY k,dev"
root_only  desktop 27      ← referer がサイトのルートちょうど・全てdesktop
has_path   desktop 11
has_path   mobile   9
```
`root_only` 27件の中身（スケジュール実行の指紋）:
```bash
$ node scripts/d1q.mjs "SELECT affiliate_id, referer, substr(user_agent,1,45) ua, created_at FROM clicks WHERE placement='parent-lp' AND referer IS NOT NULL AND created_at >= datetime('now','-28 days') ORDER BY created_at"
moshimo-garden-chochiku  https://my-naishin.com/  Windows NT 10.0  2026-07-28 04:31:25
atama-text               https://my-naishin.com/  Mac OS X 10_15_  2026-07-28 11:41:30
atama-text               https://my-naishin.com/  Windows NT 10.0  2026-07-29 11:50:14
moshimo-garden-chochiku  https://my-naishin.com/  Windows NT 10.0  2026-07-30 04:11:12
atama-text               https://my-naishin.com/  Windows NT 10.0  2026-07-30 11:31:20
moshimo-garden-chochiku  https://my-naishin.com/  Windows NT 10.0  2026-07-31 04:31:33
atama-text               https://my-naishin.com/  Mac OS X 10_15_  2026-07-31 11:30:23
moshimo-garden-chochiku  https://my-naishin.com/  Windows NT 10.0  2026-08-01 04:10:42
atama-text               https://my-naishin.com/  Windows NT 10.0  2026-08-02 08:28:40
atama-text               https://my-naishin.com/  Windows NT 10.0  2026-08-03 11:20:20
atama-text               https://my-naishin.com/  Windows NT 10.0  2026-08-04 11:20:08 ...
```
**毎日ほぼ同時刻（04:1x-04:3x / 11:2x-11:5x UTC）・全てデスクトップ・referer は必ずサイトのルートちょうど。**
`placement=parent-lp` を名乗っているが、`parent-lp` を設定しているページは
`src/app/hogosha/page.tsx:228,237,353` / `src/app/juken-schedule/page.tsx:137` / `src/app/koukou-hiyou/page.tsx:121` /
`src/components/HogoshaLeadCTA.tsx:29` の6箇所で、**トップページ（`/`）には1つも無い**。
→ **referer とクエリを取り違えたスクレイパ／リンクチェッカ。**（BRIEF §2 では `/hogosha` は GSC表示が1回も無い＝オーガニック着地はゼロなので、そもそも人間が /hogosha から16件押すことはない。）

**③ referer=null 側の UA は化石UAが混在**:
```bash
$ node scripts/d1q.mjs "SELECT substr(user_agent,1,80) ua, COUNT(*) n FROM clicks WHERE created_at >= datetime('now','-28 days') AND referer IS NULL GROUP BY ua ORDER BY n DESC LIMIT 15"
Windows NT 10.0; Win64; x64 ... 214
Macintosh; Intel Mac OS X 10_15_7 ... 57
Linux; Android 12; Pixel 6 ... 6
iPad; CPU OS 8_1_3 (2015年) ... 2      ← 化石
Windows NT 6.1 Chrome/44.0 (2015年) ... 2  ← 化石
Opera/9.75 Presto/2.9.178 ... 1        ← 化石
Opera/8.78 Presto ... 1                ← 化石
iPod; CPU iPhone OS 3_0 (2009年) ... 1 ← 化石
MSIE 8.0 / MSIE 6.0 ... 各1            ← 化石
compatible; GoogleOther ... 1          ← BOT_UA_RE をすり抜けたGoogleクローラ
```
`src/lib/bot-filter.ts:14` の `BOT_UA_RE` は `googlebot` は弾くが **`GoogleOther` は弾かない**（`bot` も `crawl` も含まない文字列）。
`FROZEN_UA_RE`（同 `:22`）も `iPhone OS 13_2_3` 一点撃ちなので、上の化石UA群は全て通過する。

**④ 日次で見ると人間の行動になっていない**:
```bash
$ node scripts/d1q.mjs "SELECT substr(created_at,1,10) d, SUM(CASE WHEN referer IS NULL THEN 1 ELSE 0 END) noref, SUM(CASE WHEN referer IS NOT NULL THEN 1 ELSE 0 END) withref FROM clicks WHERE created_at >= datetime('now','-40 days') GROUP BY d ORDER BY d"
2026-08-04  noref=42 withref=2
2026-08-06  noref=50 withref=2
2026-08-07  noref=40 withref=2
```
8/07 の GSC実測は **148クリック/日**（BRIEF §C）。**148人の来訪から50件のアフィリクリックは34%＝ありえない。**

**⑤ IP分散**: 348件が234の異なる ip_hash に分散（`SELECT COUNT(*), COUNT(DISTINCT ip_hash)` → 348 / 234）。
`/go` の同一IPバースト制限は「120秒に6件」（`src/app/go/[id]/route.ts:92`）なので、**日をまたいで薄く撒く分散クローラには一切効かない**。実際、上位IPは「4〜8件を3〜4日かけて」踏んでいる。

### 28日で「人間だった可能性がある」クリックの全リスト（20件）

```bash
$ node scripts/d1q.mjs "SELECT affiliate_id, COALESCE(placement,'(null)') p, substr(referer,22,40) path, <device>, created_at FROM clicks WHERE referer IS NOT NULL AND referer <> 'https://my-naishin.com/' AND created_at >= datetime('now','-28 days') ORDER BY created_at"
```
| 時刻(UTC) | 端末 | affiliate_id | placement | 参照元 |
|---|---|---|---|---|
| 07-14 05:59 | D | atama-banner | `/tokyo/total-score` | /tokyo/total-score |
| 07-14 06:16 | M | atama-text | `hensachi` | /hensachi |
| 07-17 01:12 | D | moshimo-e-live | `mendan` | /mendan |
| 07-17 02:35:48/49/50 | M | atama-text ×3 | `hensachi` | /hensachi?utm_source=line …**1秒間隔の3連打＝1人** |
| 07-17 19:52 | M | atama-banner | `/tokyo/total-score` | /tokyo/total-score |
| 07-20 10:03 | D | atama-text | `/hyotei-heikin` | /hyotei-heikin |
| 07-21 05:21:02/35 | D | morijuku-text ×2 | `result` | /reverse?pref=tokyo …**同一URL2連＝1人** |
| 07-22 06:37 | M | atama-text | `shindan` | /juku-shindan |
| 07-22 06:38 | M | moshimo-e-live | `shindan` | /juku-shindan（上と同一人物の可能性） |
| 08-04 00:13 | D | sora-juku-text | `result` | /reverse?pref=hiroshima |
| 08-06 08:25 | M | morijuku-text | (null) | / |
| 08-07 01:21 | D | atama-banner | (null) | / |
| 08-08 05:40:14/49・05:41:01 | D | shoin-banner ×3 | `/kochi/naishin` | /kochi/naishin **50秒内3連＝1人** |
| 08-08 07:32 | M | atama-text | (null) | / |
| 08-09 22:33 | D | moshimo-garden-gakushi | `hiyou` | /juku-hiyou |

**20件・重複連打を1回に畳むと実質14〜15回の意思決定。**

### これが変える結論（ここが本書の最重要）

| BRIEFに書かれている姿 | 実際の姿 |
|---|---|
| clicks 全期間トップは `sora-juku-text` 135 / **`fp-soudan` 131** | 人間20件の中に **`fp-soudan` は0件**。**「fp-soudanが第2の稼ぎ頭」は完全にボット由来の幻。** |
| 28日 `fp-soudan × naishin-up` 52 / `fp-soudan × prefecture` 50 | 人間20件のうち `naishin-up` 0件・`prefecture` 0件（`prefecture` 114件は**全件 referer=null**） |
| GA4/D1 = 174倍 | **人間ベースで 20 : 2 ＝ 約10倍**（GA4は依然として下限だが、桁は1つ小さい） |
| D1が真値・GA4は参考 | **D1 `leads`/`stats_submissions`/`school_page_clicks` と D1 `clicks` を同列に扱ってはいけない。`clicks` だけが公開GETエンドポイント経由で、誰でも叩ける。** |

### 影響（円 / C5）

現在のアフィリ換金の実力上限:
```
実人間クリック 20件 / 28日
× EPC ¥222/クリック（A8公開値。BRIEF §3 に記載の findit-fp-soudan の公開EPC。
  他案件のEPCは未取得のため代表値として仮置き。根拠: 唯一入手できている外部実測EPC）
= ¥4,440 / 28日
```
一方、D1の見出し数字（348件）で同じ計算をすると **¥77,256/28日**＝**17.4倍の過大評価**。
→ **「アフィリ案件の並び替え」で得られる上積みは月数千円のオーダー。ここを最適化しても桁は動かない。** 動かせるのは分母（実クリック20件）だけ。

### 最小の直し方
1. **ダッシュボード/レポートの既定を `classifyClick()`（`src/lib/bot-filter.ts:70`）の `human` のみに切り替える。** 関数は既に存在し `src/lib/__tests__/click-trust.test.ts` でテスト済み。**新規実装ゼロ・集計側の既定値変更だけ。**
   ただし `human` の定義（内部referer有り）は上記 `root_only` 27件を人間に数えてしまうので、`isInternalReferer`（`bot-filter.ts:49`）を**「パスが `/` 以外」または「pathname が2文字以上」**まで絞るのが最小の改良。
2. `BOT_UA_RE` に `googleother` を1語追加（`bot-filter.ts:14`）。
3. **`/go` のIPバースト窓（120秒/6件）を日次窓にも拡張**（`route.ts:92` の `countRecentClicksByIp(ipHash, 120)` に加えて `(ipHash, 86400) >= 10` を追加）。分散クローラは1IPあたり数日で4〜8件なので、これで大半が落ちる。

### 人間ゲート
- 1〜3すべてコード変更のみ＝**loop可**（デプロイは👤）。
- **過去データの再解釈は👤への報告が必要**（「fp-soudanが2位」という認識を覆すため）。

### 確信度
- 「D1 clicksの94%はボット」= **断定**（デバイス構成・化石UA・スケジュール指紋・34%CTRの不可能性の4系統が一致）。
- 「人間は正確に20件」= **要追加検証**（20は上限。下限は mobile 9件）。

---

# 4. ★★ DW-4: `share_to_parent` の7発火点のうち3点がD1ビーコン未配線

### 症状
`parent_funnel_events` は設計上「GA4の欠測を補うD1一次記録」（`src/lib/parent-funnel-db.ts:4-8`）だが、
**GA4に送る箇所の3/7がD1に送っていない。** 仮に共有が起きても D1 は取りこぼす。

### 証拠（全7発火点の棚卸し）

| # | 発火点 | GA4 | D1ビーコン | file:line |
|---|---|---|---|---|
| 1 | ParentShareLinkButton（ネイティブ/コピー） | ✓ | ✓ | `ParentShareLinkButton.tsx:121` / `:128` |
| 2 | ParentShareLinkButton（LINE） | ✓ | ✓ | 同 `:167` / `:174` |
| 3 | ParentShareLinkButton（X） | ✓ | ✓ | 同 `:184` / `:191` |
| 4 | ParentShareInvite（満点なし指標の素の共有） | ✓ | ✓ | `ParentShareInvite.tsx:65` / `:72` |
| 5 | SchoolPageParentBridge（学校ページ） | ✓ | ✓ | `SchoolPageParentBridge.tsx:39` / `:40` |
| 6 | **GapToTarget（47県結果・source='gap'）** | ✓ | **✗** | `src/components/Result/GapToTarget.tsx:110` |
| 7 | **ResultSection（結果最上部・source='result-top'）** | ✓ | **✗** | `src/components/ResultSection.tsx:186` |
| 8 | **JukuShindanClient（塾診断）** | ✓ | **✗** | `src/components/JukuShindan/JukuShindanClient.tsx:138` |

さらに #6 は `track('share_to_parent', ...)` と**生の文字列リテラル**で呼んでおり `EVENTS` 定数を通していない
（`src/lib/track.ts:67` の `SHARE_TO_PARENT` を使っていない）。命名ゆれを型で防ぐ設計（`track.ts:134`）から外れている唯一の箇所。

### 影響（円）
現時点 **¥0**（そもそも0件）。**冬の窓（11/15〜）で共有が発生し始めた瞬間に、D1側だけが最大3経路ぶん過少になる。**
BRIEF §3 の設計思想「GA4は使えないのでD1で判定する」を、**この3経路が無効化している。**

### 最小の直し方
3ファイルに `import { beaconParentFunnelEvent }` と1行追加（既存の #1〜#5 と同型のコピー）。**新規ファイル・新規関数ゼロ。**

### 人間ゲート
不要（loop可・デプロイのみ👤）。

### 確信度
**断定**（Grep `share_to_parent|SHARE_TO_PARENT` の全ヒットを列挙した結果）。

---

# 5. ★★ DW-5 / DW-6: `placement` と `referer` の欠損 — null になる経路の全列挙

### 症状（BRIEF §3 の再掲）
`placement` が null: 166件/629件（26%）。`referer` が null: 553件/629件（88%）。
表記ゆれ: `hensachi` と `/hensachi`、`hyotei-heikin` と `/hyotei-heikin` が別値。

### 表記ゆれの2つの発生源（file:line で断定）

| 形 | 発生源 | file:line |
|---|---|---|
| **スラッシュ無し**（`hensachi`, `prefecture`, `naishin-up`, `parent-lp`…） | `AffiliateAd` の `placement`/`viewPlacement` prop が **明示された**とき。`goHref` にそのまま渡る | `src/components/Affiliate/AffiliateAd.tsx:44` `goHref(ad.id, { pref: …, placement: placement ?? viewPlacement })` |
| **スラッシュ付き**（`/hensachi`, `/tokyo/total-score`, `/kochi/naishin`…） | `placement` prop が**未指定**のとき、サーバ側が referer の **pathname をそのまま** placement にする | `src/app/go/[id]/route.ts:104` `clamp(url.searchParams.get('placement'), 40) ?? placementFromReferer(refererRaw)` ／ 実体は同 `:42-52` `const path = u.pathname.replace(/\/+$/, '') || '/'; return path.slice(0, 40)` |

→ **同じ「/hensachi面のクリック」が、リンクごとに `hensachi` か `/hensachi` のどちらかになる。** 集計は必ず二重に割れる。

### `placement = null` になる経路（全経路）

条件は1つだけ: **`?placement=` が付いておらず、かつ内部refererも無い**（`route.ts:104` の `??` が両方 undefined）。
その状態を作る側の実測:

**① 本番HTMLでの実測**（自分で取得）
```bash
$ curl -k -A "<iPhone UA>" https://my-naishin.com/hensachi → /go リンク9本中、placement付きは2本のみ
   3 /go/atama-text            ← placementなし
   2 /go/atama-banner          ← placementなし
   1 /go/atama-text?placement=hensachi
   1 /go/fp-soudan?placement=hensachi
   1 /go/sora-juku-text        ← placementなし
   1 /go/sora-juku-banner      ← placementなし
$ curl -k -A "<iPhone UA>" https://my-naishin.com/blog/all-3-high-school-options-2026-update → 3本中placement付き2本
```

**② コード側の全数**（`<AffiliateAd>` のうち `placement`/`viewPlacement` を1つも渡していない箇所）
```
$ python: regex '<AffiliateAd\b(...)/>' で src/**/*.tsx を全走査
→ 89箇所
```
主な集中箇所（抜粋・全89件は再実行で再現可能）:

| file:line | id |
|---|---|
| `src/components/ResultSection.tsx:349,369,370,390,391,411,412,434,445,454,475,688,689,775` | zkai/sapuri/shoin 系 **14箇所**（結果面の主戦場） |
| `src/app/hensachi/page.tsx:325,328,331,668,670,679,681` | atama/sora **7箇所**（最大流入面） |
| `src/app/hyotei-heikin/page.tsx:278,281,284,530,539,868` | **6箇所**（CTR最高面） |
| `src/app/[prefecture]/naishin/page.tsx:665,674,682,689,691,698,700` | **7箇所**（47県に効く） |
| `src/app/page.tsx:151,152,321,551` / `src/app/HomeClient.tsx:410,412` | トップ **6箇所** |
| 総合得点7県 `aichi/chiba/fukuoka/osaka/saitama/tokyo` の `total-score/page.tsx` 各2箇所 | **12箇所** |

### `referer = null` になる経路

- **`rel="noreferrer"` は原因ではない。** `AffiliateAd` のアンカーは `rel="nofollow sponsored noopener"`（`AffiliateAd.tsx:82` および `:98`）で `noreferrer` を含まない。
  リポジトリ内の `noreferrer` は全て **LINE友だち追加（外部lin.ee）** に付いており `/go` 経由ではない
  （`StickyConvertBar.tsx:104` / `SaveResultCTA.tsx:256,447` / `SchoolPageConvertCTA.tsx:74` / `ExitIntentLineModal.tsx:162` / `ParentWindowBridge.tsx:127` / `ParentShareInvite.tsx:127`）。
- **`/go` は同一オリジンなので実ブラウザは必ず full-URL referer を送る。** 実際、人間らしい20件は全て `https://my-naishin.com/<path>` 形式の referer を持つ（DW-3の表）。
- → **`referer = null` の553件（88%）は、ほぼ全て「実ブラウザではないもの」。** DW-3 と同じ結論。

### 影響（円）
- 面別の効き（どの面がアフィリを生むか）は、**現状 `placement` からは読めない**。
  ただし DW-3 の通り**分母が20件しかない**ので、面別最適化のEVはそもそも月数千円レベル。
- **placement を全部埋める作業のEVは、いま円に換算するとほぼゼロ。**（89箇所を直しても、20件が20件のまま。）
- **本当に効くのは「二重にカウントされている表記ゆれ」の正規化だけ**（意思決定の質の問題）。

### 最小の直し方
**89箇所を直すな。** `placementFromReferer`（`route.ts:42`）が返す値を、先頭スラッシュを剥がして正規化する1行で表記ゆれは消える:
```ts
return path.replace(/^\//, '').slice(0, 40) || 'home';
```
これで `/hensachi` → `hensachi`、`/` → `home` になり、**明示placementと同じ語彙に揃う**。
（過去データの表記ゆれはSQL側で `TRIM(placement,'/')` で吸収できる。）

### 人間ゲート
不要（loop可）。過去データの正規化UPDATEは書き込みなので👤ゲート。

### 確信度
**断定**（本番HTML実測 + コード全数走査）。

---

# 6. ★★ DW-7: 数値の不変条件テストの欠落 —「次の事故の予定地」

> ✅ **2026-08-23 一部対応済み（loopが実施）**: 表内 #4（`competition-rates`横断テスト）と #5（`schools-private`マスタ整合テスト）を追加した。
> `src/data/competition-rates/__tests__/index-invariants.test.ts` と `src/data/schools-private/__tests__/school-master-data.test.ts`
> （commit `1624a9d`・tsc実exit0・jestフルスイート333suites5835tests全green）。
> **残りは #5 のexport名衝突リネーム（`SCHOOL_MASTER_BY_PREFECTURE`等を`PRIVATE_SCHOOL_MASTER_*`へ）と #9/#10（D1実行時データの自動ゲート＝DW-8）が未対応。**
> リネームは import 呼び出し元の全数把握が必要なため今回は見送った（規模次第では次周回で着手可）。

`src/data/` 配下の「数値を持つ型」を全列挙し、不変条件テストの有無を機械的に確認した。

| # | 型 / 場所 | 実ファイル数 | 想定される不変条件 | テスト | 証拠 |
|---|---|---|---|---|---|
| 1 | `PREFECTURE_HIGH_SCHOOL_DATA.avgNaishin`（`src/lib/prefecture-high-school-data.ts:17`） | 47県 | `avgNaishin <= maxScore` / `>= オール3×0.85` / null なら理由必須 | **○（2026-08-08追加）** | `src/lib/__tests__/prefecture-high-school-data.test.ts:26,59,76` |
| 2 | `competition-rate-history`（多年度倍率） | 49 | `applicants/quota ≈ rate`（誤差0.05）/ categories合計=grandTotal | **○** | `src/data/competition-rate-history/__tests__/index-invariants.test.ts:29,41,52` |
| 3 | `src/data/schools`（公立学校マスタ・3,422校） | 47+index | コード重複0 / 47県存在 / source必須 / 総数固定 | **○** | `src/data/schools/__tests__/school-master-data.test.ts:11,19,23,31,37,42,52` |
| 4 | **`src/data/competition-rates`（学校別倍率・本命資産）** | 47+index | **`finalRate ≈ finalApplicants / quota`** | **× 横断テスト無し** | `grep -rln "COMPETITION_RATE_FILES\|COMPETITION_RATE_BY_PREFECTURE" --include="*.test.ts" src` → **ヒット0**。あるのは県ごとに手書きされた `officialSubtotals` 突合47本のみ（`src/data/competition-rates/__tests__/*.test.ts`）＝**新県を追加してテストを書き忘れれば無検査で通る** |
| 5 | **`src/data/schools-private`（私立学校マスタ）** | 47+index | 公立と同じ4条件 | **× テストが1本も無い** | `grep -rn "from '@/data/schools-private'"` --include="*.test.ts" → **ヒット0**。`private-school-detail.test.ts` / `private-school-tuition.test.ts` が参照台帳として名前を使うだけで、**マスタ自体の整合は誰も見ていない**。しかも `src/data/schools-private/index.ts:55,105` は公立と**同名の `SCHOOL_MASTER_BY_PREFECTURE` / `SCHOOL_MASTER_FILES` を export** している（取り違え事故の温床） |
| 6 | `private-school-detail`（私立定員） | 46 | courses合計 = totalCapacity / 台帳と重複欠落なし | **○（46県中45県ぶん明示。全県名がテスト本文に出現）** | `src/lib/__tests__/private-school-detail.test.ts:152,194,214,…` |
| 7 | `private-school-tuition`（私立学費） | 8 | fees非空・amount>0 / 内訳合計＝公表合計 | **○（8/8）** | `src/lib/__tests__/private-school-tuition.test.ts:93,136,186,…` |
| 8 | `exam-score-statistics`（入試平均点） | 41 | 教科合計 ≈ totalAverage | **○（41/41が本文に出現）** | `src/lib/__tests__/exam-score-statistics.test.ts:57,90,129,…` |
| 9 | **`stats_submissions`（D1・実行時データ）** | — | 母平均の妥当域 / 日次バースト / 極値集中 | **× 実行時ゲート無し** | 純関数 `src/lib/stats-audit.ts` とテストは存在するが、**本番データに対して自動では一度も走っていない**（DW-8） |
| 10 | `clicks`（D1・実行時データ） | — | 人間比率・モバイル比率の妥当域 | **×** | `classifyClick`（`bot-filter.ts:70`）は存在するが**アラート/ゲートに繋がっていない** |

テストの現況（自分で実行）:
```bash
$ npx jest src/lib/__tests__/prefecture-high-school-data.test.ts \
           src/data/competition-rate-history/__tests__/index-invariants.test.ts \
           src/data/schools/__tests__/school-master-data.test.ts \
           src/lib/__tests__/stats-aggregation.test.ts --silent
Test Suites: 4 passed, 4 total / Tests: 52 passed, 52 total / Time: 4.718 s
```

### #4 の不在が実際に何を見逃しているか（自分で当てて確認した）

```bash
$ python: src/data/competition-rates/*.ts を正規表現で全走査し |finalApplicants/quota − finalRate| > 0.055 を抽出
files 47 / records_parsed 17,301 / violations 7
  yamaguchi.ts 防府     30/38 → 実測1.267 vs 記載1.2
  yamaguchi.ts 防府商工 55/65 → 1.182 vs 1.1
  yamaguchi.ts 山口     28/33 → 1.179 vs 1.1
  yamaguchi.ts 豊浦    122/142 → 1.164 vs 1.1
  yamaguchi.ts 萩商工   24/13 → 0.542 vs 0.6
  yamanashi.ts 都留興譲館 53/48 → 0.906 vs 0.85
  yamanashi.ts 都留興譲館 48/34 → 0.708 vs 0.65
```
うち山口県の5件は**ファイル冒頭コメントに既知として明記されている**（`src/data/competition-rates/yamaguchi.ts:34` 「丸め桁数の違いによるものであり転記ミスではない」）。
→ **7件は誤りではない可能性が高い。だが「誤りでないと分かるのはコメントを人間が読んだときだけ」で、機械は何も守っていない。** 次に転記ミスが混ざっても同じ場所に紛れる。

### 影響（円）
- 直接の円は無い。**失うのは DW-1 と同じ「信頼」。** BRIEF §A の通り「〇〇高校 倍率」ロングテール300クエリ・43%が3位以内 ＝ **今後の最大の資産がこのテーブル**。ここに1件でも公開後に誤りが見つかれば、冬のピーク（11月〜2月）で被る。
- **ピークフリーズ（11/15〜）に入ると構造変更ができない**（BRIEF §7）。テストを入れるなら**それまで**。

### 最小の直し方
1. `src/data/competition-rates/__tests__/index-invariants.test.ts` を**新規1ファイル**、`competition-rate-history` の同名ファイルをコピーして述語を差し替える（`finalRate ≈ finalApplicants/quota`、許容 0.07、既知7件は名前で allowlist）。
2. `src/data/schools-private/__tests__/school-master-data.test.ts` を**新規1ファイル**、公立版（`src/data/schools/__tests__/school-master-data.test.ts`）をコピーして import 元を変えるだけ。
3. `index.ts` の export 名衝突（#5）は、私立側を `PRIVATE_SCHOOL_MASTER_*` にリネーム。

### 人間ゲート
不要（テスト追加はloop可）。

### 確信度
**断定**（grep / ファイル数カウント / 実測走査すべて再現可能）。

---

# 7. ★★ DW-8: `stats-distribution-audit` が「手動でしか走らない」ことになっているが、その制約は今日消えた

### 症状
DW-1 のバーストを検知する仕組みは**既に実装済み・ユニットテスト済み**なのに、**9日間誰も気づかなかった。**

### 証拠
```
scripts/stats-distribution-audit.ts:20-25
  「wranglerはローカル環境の本人認証が要るため、loop環境からは実行できない既知の制約」
  → 本人が wrangler で reports/stats-export-YYYY-MM-DD.json を作った時だけ動く設計
```
- `package.json` の `scripts` に **登録されていない**（`test` / `check:links` / `check:forbidden` / `check:consistency` / `check:orphans` / `check:freshness` / `check:all` のいずれにも無い）。
- 検知ロジック `src/lib/stats-audit.ts:63` は z>4 のバースト検知・`:108` は極値集中（share 0.5 / minSample 20）。
  8/01(56件)・8/07(82件)は、直前28日の日次平均が5件前後なので **z は明確に4を超える＝発火するはずだった。**
- **今日、オーケストレータが `scripts/d1q.mjs` を作り本番D1の読み取りが loop から可能になった**（BRIEF §0）。
  → **「loop環境からは実行できない」という前提はもう成り立たない。**

### 影響
DW-1 の全て。9日間の露出。

### 最小の直し方
`scripts/stats-distribution-audit.ts` の入力を「ローカルJSONファイル」から
「`scripts/d1q.mjs` と同じ経路で本番D1を読む」に差し替え、`package.json` に `check:stats` として登録。
**検知ロジック（`src/lib/stats-audit.ts`）は1行も触らない。**

### 人間ゲート
不要（読み取りのみ）。**ただし検知後の隔離/削除は👤ゲート**（スクリプト冒頭の設計方針どおり「報告のみ・自動削除しない」を維持すること）。

### 確信度
**断定**。

---

# 8. ★ DW-9: `ParentWindowBridge` は 2026-07-26 〜 2026-11-14 の **111日間ダーク**

（DW-2 の (a) の再掲。独立した「死んでいる期間」として記録する。）

- 窓: 7/1〜7/25 と 11/15〜12/25（`src/lib/parent-window.ts:28-29`）。今日は 8/10 ＝ **外**。
- 影響を受ける面: 上記13の結果フロー全て。**そのうち成績カード付き共有ボタン（`ParentShareLinkButton`）は score+max が揃う面（内申点・総合得点）でのみ点灯**（`ParentWindowBridge.tsx:142` `hasCard`）。
- **これは仕様。** 設計意図が `parent-window.ts:6-8` に明記されている（「C_pが確実に立つのは保護者が必ず関与する短い窓だけ」）。
- **ただし残り2つの導線は生きている**ので「保護者導線が全部消えている」わけではない:
  - `ParentShareInvite`（`/hensachi` は `UnlockGate` 経由 `HensachiResultFlow.tsx:57`、`/hyotei-heikin` は直接 `HyoteiResultFlow.tsx:40`、47県は `NaishinResultFlow.tsx:83`）＝**結果が出た後は常時表示**。
  - `SchoolPageParentBridge`（`src/app/pref/[code]/school/[schoolCode]/page.tsx:143`）＝**無条件・常時表示**。

→ **「夏に保護者導線がゼロ」は誤り。「成績カード付きの最も強い共有ボタンだけがダーク」が正しい。**

- 確信度: **断定**（コードと日付）。
- 直し方: **直すべきでない**（仕様）。11/15に自動点灯するので、**11/15直後に `parent_funnel_events` が入り始めるかを見る**のが正しい検証。それまでは DW-4 の3経路を埋めておくこと。

---

# 9. ★ DW-10: タップ領域 44px未満が依然として大半（過去指摘の再発確認）

### 症状 / 証拠（本番HTMLを取得して実測）
```
$ python: 本番HTMLの <a>/<button> の class から Tailwind の高さを推定
  （min-h-[Npx] > h-N > line-height(text-*) + 2*py-N の優先順で算出）
/hensachi                                   : ボタン様要素 112 / 44px未満 73 (65%)
/blog/all-3-high-school-options-2026-update : ボタン様要素  86 / 44px未満 69 (80%)
（下線付きインラインテキストリンクは WCAG 2.5.8 のインライン例外に当たるため除外済み）
```
最頻の型（実物）:
```html
<a class="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs ...">   → 約28px
<a class="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs ...">   → 約24px
<a class="rounded-md border border-slate-100 bg-slate-50/50 px-2.5 py-1 text-xs ...">      → 約24px
```

### 影響（円）
- **モバイル74%のサイトで、押しづらいのは事実。** ただし GA4 `rage_click` は 7/26〜08-10 で **14件**（同期間 `page_view` 603 ＝ 2.3%）で、**急性の障害ではない**。
- **主要CTAは既に44px以上**（`ParentLeadCTA.tsx:94` の `py-3.5 text-sm` ＝ 48px、`ParentShareInvite.tsx:107` の `py-3 text-sm` ＝ 44px）。**小さいのは補助リンク（関連ツール・パンくず・タグ）。**
- → **換金への影響は小さい。円で語れる根拠は無い＝「未検証」と明記する。**

### 最小の直し方
グローバルCSSに `a, button { min-height: 44px }` を当ててはいけない（インラインリンクのレイアウトを壊す）。
`rounded-full px-3 py-1.5 text-xs` の「タグ／チップ」型に限定して `min-h-[44px]` を足すのが最小。**優先度は低い。**

### 確信度
**要追加検証**（class から推定した静的値であり、実ブラウザのレイアウト実測ではない）。

---

# 10. 過去の死配線の再確認 — 3件のうち2件は既に直っていた

| 過去の指摘 | 現在 | 証拠 |
|---|---|---|
| `.blog-content a` の指定が無く46記事の本文リンクが地の文と同色 | **✅ 修正済み・本番反映も確認** | `src/app/blog/blog.css:258`。本番CSSに実在: `https://my-naishin.com/_next/static/css/f52c3b2d571a27e1.css` 内に `.blog-content a{color:var(--blog-accent);text-decoration:underline;…}` |
| 出典列が横スクロールの外にありモバイル74%に但し書きが届かない | **✅ 修正済み** | `src/components/HighSchoolBorderlineTable.tsx:56-61`。表の直上に独立行で「以下の数値は塾・受験情報サイトの推定です（教育委員会の公表値ではありません）」を常時表示 |
| クリック可能要素の78%がタップ領域40px未満 | **❌ 未修正（DW-10）** | 上記実測 |
| 満点135点の県に `avgNaishin: 425` | **✅ 不変条件テスト追加済み・現在green** | `src/lib/__tests__/prefecture-high-school-data.test.ts:59` / jest実行結果52 passed |

その他の確認（死んでいなかったもの・報告のみ）:
- **A/Bの片腕落ち: 無し。** `hensachi-fp-secondary-2026` の `findit` 腕は `findit-fp-soudan` を指し、これは `status` 未指定＝`live`（`src/lib/affiliates.ts:526`）なので `AffiliateAd` は描画する（`AffiliateAd.tsx:40` の pending ガードに掛からない）。**BRIEF §3 の「findit-fp-soudan は clicks に1件も無い」は、DW-3 の通り「人間クリックが月20件しかない」ことで十分説明がつく**（fp-soudan 側の131件も全てボットだった）。
- **フラグ: `/advisor` 200 / `/juku/dashboard` 200 / `/partner-demo` 404**（本番curl・iPhone UA）。memory の「advisor/juku-saas 両旗点火済み・partner-demo は既定off」と一致。**旗の取り違えは無い。**
- **`parseParentShare` と `buildParentSharePath` は対称**（`src/lib/share.ts:150-166` vs `:249-277`）。`?d=` 圧縮版（`:110-142`）とロングキー版の両方を読む。**着地側のパース不整合は無い。**
- **`unlock_teaser_view` のゾンビ送信は無い。** GA4で 2026-08-01 を最後に停止（20→16→7→7→3→0）。`UnlockGate` のロック撤去（2026-08-01・`UnlockGate.tsx:27`）と一致。

---

# 11. GA4 と D1 の対応表 ——「どの数字を信じてよいか」の地図

**後続の全サイクルはこの表を使うこと。**

| イベント/事象 | GA4 file:line | D1 テーブル / file:line | 28日実測 GA4 | 28日実測 D1 | 乖離 | 信じるべき数字と理由 |
|---|---|---|---|---|---|---|
| `affiliate_click` | `Affiliate/AffiliateClickTracker.tsx:61` | `clicks` ← `src/app/go/[id]/route.ts:100` → `clicks-db.ts` | **2** | **348** | 見かけ174倍 | **どちらも×。真値は「D1のうち内部パス付きreferer＋非化石UA」＝20件**（DW-3）。GA4はさらに consent/adblock で落ちるので下限2 |
| `lead_submit` | `SaveResultCTA.tsx:218` → `track.ts:149` | `leads` ← `leads-db.ts` | **1** | **6** | 6倍 | **D1が真値。** 公開POSTだが本文にメール必須でボットが撃つ動機が薄い。実際6件は7/14〜8/07に散在し人間の分布 |
| `stats_submit_ok` | `stats-submit-client.ts:26` | `stats_submissions` ← `stats-db.ts` | ~~0~~ **訂正: 97**（2026-07-10〜08-07の28日窓・`mcp__ga4__ga4_run_report`で再取得し独立検証済み） | **169（7/26〜）** | 見かけ1.7倍 | **2026-08-15訂正（`ops/CORRECTIONS.md` C-6c）**: 元の「GA4=0」はDW-1本文が引用した別の窓（7/26〜8/10）の値を28日実測列に誤転記したもの。正しい28日窓ではGA4=97件（7/14=1・7/17=30・7/18=2・7/20=2・7/21=24・7/22=23・7/25=15）でD1=169件（同一28日窓は別途§4/表Bを参照）。「D1もGA4も0でどちらも×」という判定は誤り。**汚染2日を除いた125件が上限**という結論自体は別途DW-2で確定済みのため変わらない |
| `share_to_parent` | 8箇所（うち3箇所はD1未送信・DW-4） | `parent_funnel_events` ← `parent-funnel-db.ts:87` | **0** | **0** | 一致 | **2系統一致＝0が真値。** 断定してよい唯一のゼロ |
| `parent_landing_view` | `ParentShareBanner.tsx:47` | 同上 `:54` | **0** | **0** | 一致 | 同上 |
| `line_friend_click` | 8箇所（`ParentWindowBridge.tsx:73` / `ExitIntentLineModal.tsx:123` / `SaveResultCTA` / `StickyConvertBar` / `SchoolPageConvertCTA` ほか） | **無し** | 26 | — | — | **GA4しか無い。** 名簿velocityの唯一の計器なのにD1一次記録が無い |
| `line_registration_click` | **GA4には存在しない名前**（GA4側は `line_friend_click`） | `parent_funnel_events` ← `ParentShareInvite.tsx:56` | — | 0 | — | **イベント名が2系統で違うため突合不能。** 設計上の穴 |
| 学校ページCTAクリック | **無し**（`SchoolPageConvertCTA.tsx:27` の `reportClick` はD1のみ） | `school_page_clicks` ← `school-page-clicks-db.ts:54` | — | **9**（reverse 8 / juku-shindan 1） | — | **D1しか無い。** GA4に一切送っていないので相互検証不能 |
| `school_page_bridge_click` | `ResultSection.tsx:197` | **無し** | 0 | — | — | GA4のみ |
| `cta_view` / `result_view` / `calc_complete` / `experiment_impression` / `percentile_view` / `scroll_depth` / `rage_click` / `unlock_teaser_view` / `stats_optin_*` | `track.ts` 各所 | **無し** | 1,241 / 570 / 714 / — / 58 / — / 60 / 672 / 599 | — | — | **GA4のみ。分母系は全部ここ。** 絶対値は下限だが**比率（result_view→share等）は使える** |
| 匿名投稿の同意 | `StatsOptIn.tsx:80` | — | 1 | — | — | GA4のみ。**同意1件に対しD1169件＝DW-1の最初の異常サイン** |

### この表から出る運用ルール（3つ）
1. **`clicks` の生カウントを二度と引用しない。** 必ず `classifyClick`（`bot-filter.ts:70`）で絞る。BRIEF §3 の affiliate_id ランキングは**ボットのランキング**。
2. **`leads` / `school_page_clicks` は D1 を信じてよい**（公開GETではないか、または動機が薄い）。**`clicks` と `stats_submissions` は信じてはいけない**（誰でも叩ける公開エンドポイントで、かつボット判定が無い or 甘い）。
3. **GA4は「比率」に使い「実数」に使わない。** 逆に D1 は「実数」に使えるがテーブルごとに信頼度が3段階に分かれる。

---

# 12. 今すぐ直すべき順

| 順 | ID | 何を | なぜこの順か | 工数 | 人間ゲート | 確信度 |
|---|---|---|---|---|---|---|
| **1** | **DW-1a** | `/api/stats/submit` に `isBotUserAgent` を3行追加（`parent-funnel/route.ts:48` と同型） | **今この瞬間もユーザーと保護者に誤った「全国統計」を配信している唯一の項目。** 唯一の堀（信頼）に直接触れる。しかも直しは3行 | 10分 | コードは不要・**デプロイは👤** | 断定 |
| **2** | **DW-1b** | 汚染2日（2026-08-01 / 08-07・計138件）の扱いを決める。**併せて「全国」という表現を「協力者n=◯人の分布」に正直化** | 1をしても既に入った138件は残り、平均63.16は変わらない。**表現の正直化のほうが本質**（除外しても平均60.52で偏差値50から遠い） | 30分 | **👤必須**（本番D1書き込み／文言変更） | 断定 |
| **3** | **DW-3** | ダッシュボード/レポートの clicks 既定を `human` のみに。`isInternalReferer` を「pathnameが `/` 以外」まで絞る。`BOT_UA_RE` に `googleother` 追加 | **全ての換金判断がボットのランキングの上で行われている。** これを直さないと後続サイクルが全部間違った案件に投資する | 1時間 | 不要（デプロイのみ👤）。**過去の認識訂正の報告は必要** | 断定 |
| **4** | **DW-8** | `stats-distribution-audit` の入力を `scripts/d1q.mjs` 経由に差し替え `package.json` に `check:stats` 登録 | 1〜2を再発させないための唯一の恒久策。**今日 d1q.mjs ができたことで制約が消えた** | 1時間 | 不要（読み取りのみ） | 断定 |
| **5** | **DW-7a** | `src/data/competition-rates/__tests__/index-invariants.test.ts` 新規1本（history版のコピー） | **冬の本命資産（「〇〇高校 倍率」300クエリ・43%が3位以内）を守る唯一の機械的ゲート。ピークフリーズ11/15までに入れる必要がある** | 1時間 | 不要 | 断定 |
| **6** | **DW-5** | `placementFromReferer` の返り値から先頭スラッシュを剥がす1行（`go/[id]/route.ts:48`） | 表記ゆれが消え、集計が二重に割れなくなる。**89箇所を直すより先にこれ** | 5分 | 不要 | 断定 |
| **7** | **DW-4** | `GapToTarget.tsx:110` / `ResultSection.tsx:186` / `JukuShindanClient.tsx:138` に `beaconParentFunnelEvent` を1行ずつ追加 | 今は円ゼロだが、**11/15の窓が開くまでに埋めないと冬の実測が3経路ぶん欠ける** | 20分 | 不要 | 断定 |
| **8** | **DW-7b** | `src/data/schools-private/__tests__/school-master-data.test.ts` 新規1本（公立版のコピー）＋ export名の衝突解消 | 私立マスタ47ファイルが完全に無検査。事故は起きていないが**次の事故の予定地** | 1時間 | 不要 | 断定 |
| **9** | **DW-2 の1手** | canary POST → D1確認 → 行削除で、`parent_funnel_events` の書き込み経路を100%確定 | 現時点で(b)と断定できているので**緊急ではない**。冬前に一度は潰しておく確認 | 10分 | **👤必須**（本番書き込み＋削除） | — |
| **10** | **DW-10** | チップ型リンクにのみ `min-h-[44px]` | **円で語れる根拠が無い（未検証）。** rage_click 2.3% は急性障害ではない。主要CTAは既に44px以上 | 2時間 | 不要 | 要追加検証 |
| — | **DW-9** | **何もしない** | 期間ゲートは仕様。11/15に自動点灯する。**触ると設計思想（保護者の窓）を壊す** | — | — | 断定 |
| — | **DW-5の89箇所** | **やらない** | 実クリックが月20件しかない以上、面別最適化のEVは月数千円。**#6の1行で表記ゆれだけ潰せば十分** | — | — | 断定 |

### 本書で「やるな」と結論したもの（重要）
- **アフィリ案件の並び替え / 面別最適化**: 分母が20件/28日。EPC¥222（A8公開値・仮置き）で計算すると換金の実力上限は **¥4,440/28日**。**案件を入れ替えても桁は動かない。**
- **共有CTAを増やす**: 既に7発火点あって0件。**分母（結果到達126件/16日）が小さいことが原因**であって、ボタンの数ではない。
- **`placement` を89箇所に手で書く**: 上記のとおりEVがほぼゼロ。
- **`ParentWindowBridge` の期間ゲートを外す**: 仕様であり、外すと設計思想（保護者が関与する窓に絞る）が壊れる。

---

## 付録: 本書で自分が実行した検証コマンド一覧（再現用）

```bash
# 本番D1（読み取り専用）
node scripts/d1q.mjs "SELECT sql FROM sqlite_master WHERE name IN ('parent_funnel_events','school_page_clicks','clicks')"
node scripts/d1q.mjs "SELECT <device>, COUNT(*) FROM clicks WHERE created_at >= datetime('now','-28 days') GROUP BY 1"
node scripts/d1q.mjs "SELECT CASE WHEN referer='https://my-naishin.com/' THEN 'root_only' ELSE 'has_path' END, ... "
node scripts/d1q.mjs "SELECT substr(user_agent,1,80), COUNT(*) FROM clicks WHERE referer IS NULL AND created_at>=datetime('now','-28 days') GROUP BY 1 ORDER BY 2 DESC"
node scripts/d1q.mjs "SELECT substr(created_at,1,13), COUNT(*) FROM stats_submissions WHERE created_at>='2026-08-06' GROUP BY 1"
node scripts/d1q.mjs "SELECT metric, COUNT(*), ROUND(AVG(value),2), MIN(value), MAX(value) FROM stats_submissions GROUP BY metric"

# 本番HTTP（iPhone UA 必須）
curl -k --max-time 45 -A "<iPhone UA>" https://my-naishin.com/hensachi
curl -k --max-time 45 -A "<iPhone UA>" "https://my-naishin.com/api/stats/distribution?metric=hensachi"
curl -k --max-time 45 -A "<iPhone UA>" "https://my-naishin.com/api/stats/percentile?metric=hensachi&value=55"
# ↑チャンク19本を全DLして grep -l "api/parent-funnel" → chunks/81-....js にヒット

# GA4 MCP（property 540358022）
ga4_run_report metrics=[eventCount] dimensions=[date,eventName] 2026-06-15〜07-24 / 07-25〜08-10
ga4_run_report metrics=[eventCount] dimensions=[eventName]      2026-07-01〜07-25 / 07-26〜08-10
ga4_run_report metrics=[eventCount] dimensions=[dateHour,eventName] 2026-08-07〜08-09
ga4_run_report metrics=[eventCount] dimensions=[date,customEvent:source] filter eventName=line_friend_click

# テスト
npx jest src/lib/__tests__/prefecture-high-school-data.test.ts \
         src/data/competition-rate-history/__tests__/index-invariants.test.ts \
         src/data/schools/__tests__/school-master-data.test.ts \
         src/lib/__tests__/stats-aggregation.test.ts --silent
# → 4 suites / 52 tests passed
```

**本書で本番への書き込み・デプロイ・env変更・メール送信は一切行っていない。**
