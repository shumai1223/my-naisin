# 収益化 実行手順書（ガチ収益化モード）

> 方針：**AdSense（床）＋保護者リード送客（本命）＋トラフィック（規模）**の三段。
> 現在 **AdSense審査待ち**のため、「収益装置は全部組むが、攻めの部分は休眠させ、承認の瞬間に環境変数で全点火する」運用にしている。

---

## 0. 環境変数チートシート（これが全点火スイッチ）

| 変数 | 値 | 効果 | いつ |
|---|---|---|---|
| `NEXT_PUBLIC_ADSENSE_AUDIT` | `1` | `auditHide`付きの広告/CTA（重複配置・結果直後の保護者CTA等）を**隠す**＝審査用のクリーンな見た目 | **審査中はON** |
| `NEXT_PUBLIC_ADSENSE_ENABLED` | `1` | `<AdSlot>`のAdSense広告枠を**描画**する | **承認後にON** |
| `NEXT_PUBLIC_LINE_ADD_URL` | `https://lin.ee/xxxx` | 結果ページ等の `SaveResultCTA` に**LINE友だち追加ボタン**を点灯（堀A＝名簿の本体） | LINE公式アカウント開設後 |
| `LEAD_WEBHOOK_URL` | Discord/Slack Webhook URL | `/api/lead` の登録メールを**運営者に通知**（未設定なら `CONTACT_WEBHOOK_URL` を流用、それも無ければユーザー側でmailtoフォールバック） | リード収集を始めたら |
| `RESEND_API_KEY` | Resend APIキー | 設定で**ESP点火**：登録者へ歓迎メール＋運営者へ通知（`/api/lead`）。本人に1通届く＝「配信できる名簿」化（堀A） | ドメイン認証後 |
| `LEAD_FROM_EMAIL` | `My Naishin <info@my-naishin.com>` | 歓迎メールの差出人（Resendで認証したドメイン）。未設定は noreply 既定 | RESEND設定時 |
| `UNSUB_SECRET` | ランダムな長い文字列 | 配信停止リンクのHMAC署名鍵。設定でメールに署名付き「配信停止」リンクを掲載（`/api/unsubscribe`→D1 unsubscribed=1）。未設定なら返信停止のみ | RESEND設定時に併せて |

- **審査中（今）**：`NEXT_PUBLIC_ADSENSE_AUDIT=1` をセットして再デプロイ。広告密度を絞った状態で審査を受ける。
- **承認後**：`AUDIT` を外す → 休眠CTAが点火。`NEXT_PUBLIC_ADSENSE_ENABLED=1` をセット → AdSense枠が点火。再デプロイ。

---

## 0.5. 承認 → live 1行作業表（★最新・ここだけ見れば回る）

> 2026-06 時点。送客先の差し替えは **`lead-config.ts` の表** と **`affiliates.ts` の1エントリ**に集約済み。コンポーネントは無改修。
> `status: 'pending'` の枠は `AffiliateAd`/`selectLeadOffer` が描画しない＝デッドリンクは出ない。**承認 → 下表の1行 → push（=自動デプロイ）**。

### A. 学費面（最高単価 CPA¥8k–1.5万）｜lead-config `PLACEMENT_LEAD_OVERRIDES.hiyou = fp-soudan`
| 承認・解放 | 作業（1箇所） |
|---|---|
| ✅ 稼働中 | もしも「保険トータルプロフェッショナル」(FP無料相談¥13,800) で `fp-soudan` live。 |
| A8 保険コンパス / マネードクター | EPCが上なら **`affiliates.ts` の `fp-soudan` の `href`/`trackingPixel` を勝者ASPへ差し替え**るだけ（slotは `fp-soudan` 固定）。EPC順=保険コンパス>マネードクター>保険見直し本舗。 |
| 学資保険（ガーデン等） | `affiliates.ts` の `gakushi-hoken`（pending）の `href`/`trackingPixel` を実値にし `status` 行を削除 → `/shougakukin` の送客先に割当。 |

### B. 塾・家庭教師（無料体験 CPA¥3k–1万・本線レバー）
| 枠（pending） | ASP | live化（1エントリ） |
|---|---|---|
| `accesstrade-juku-trial` | アクセストレード | `href`/`text`/`trackingPixel` を実値に → `status` 行削除。県×面の勝者へ `PREFECTURE_PLACEMENT_LEAD_OVERRIDES` で割当。 |
| `afb-juku-trial` | afb | 同上。 |
| `rentracks-juku-trial` | レントラックス | 同上。 |
| `afb-katei-kyoshi` | afb（家庭教師） | 同上。`mendan`/`prefecture` 面と相性良。 |

**昇格の型**：承認案件のEPCが現行（森塾/キャンパス/Z会資料請求）を上回ったら、`PLACEMENT_LEAD_OVERRIDES`（面）か `PREFECTURE_PLACEMENT_LEAD_OVERRIDES`（県×面）に1行追加。note/ctaText は `PROGRAM_PRESET` に1行足せば表記ゆれ防止。

### C. もしも 提携中（審査なし・live済・配置済）
`moshimo-e-live`→mendan ／ `moshimo-studycoach`→dashboard ／ `moshimo-classjapan`+`moshimo-tintoru`→不登校blog(`FutoukouLeadCTA`) ／ `fp-soudan`→hiyou。

### D. AdSense（床）
1. コンソールで広告ユニット作成 → `data-ad-slot` 取得。
2. `src/lib/ad-slots.ts` の `'0000000000'` を取得IDへ差し替え（`AdSlot` は二重ガード：env=1でもID未差し替えなら非描画＝壊れ広告は出ない）。
3. `NEXT_PUBLIC_ADSENSE_ENABLED=1` をセット。`NEXT_PUBLIC_ADSENSE_AUDIT` を削除すると `auditHide` 枠が全復元。

> 旧「2. 保護者リード送客」の出し分け表は初期(そら塾/atama+)世代の記録。**現行の正は上の 0.5 と `lead-config.ts`**（FP/もしも/森塾/キャンパス世代）。

---

## 0.6. 承認 → 即日 live化 SLA手順書（D-3・D-10）

> 目的：承認/契約成立の連絡が来てから**その日のうち**にpush（=Cloudflare自動デプロイ）まで終える。
> 上の0.5表は「どのファイルの何行目を直すか」の**対象一覧**。ここは「新しい案件が来た時に何をするか」の**手順そのもの**（未知の案件・0.5に無い案件にも使える）。

### 手順（目安30分以内でcommitまで）
1. **記録**：承認/契約メールのASP名・案件名・成果地点（無料体験/資料請求/月額スポンサー等）・条件（CPA額 or 月額固定）をメモ。
2. **該当ファイルを1箇所だけ直す**（設計上、複数箇所に散らばらない）：
   - ASPアフィリ（CPA型）→ `src/lib/affiliates.ts` の該当エントリの `href`/`text`/`trackingPixel` を実値にし `status: 'pending'` 行を削除。
   - 送客先の面を決める/変える → `src/lib/lead-config.ts` の `PLACEMENT_LEAD_OVERRIDES`（面）または `PREFECTURE_PLACEMENT_LEAD_OVERRIDES`（県×面）に1行。
   - 直販の掲載枠スポンサー（D-3・月額固定・県×面） → `src/lib/sponsor-slots.ts` の `SPONSOR_SLOTS` に1行追加（キーは `placement` または `${prefectureCode}:${placement}`）。EVランキングやlead-config監査の対象外なので他ファイルは触らない。
   - EV前提（CPA/転換率）が分かれば → `src/lib/affiliate-economics.ts` に反映（無ければ既定値のままでよい。実測が貯まったら `npm run ev:reconcile` で後日突合＝D-6）。
3. **検証**（省略しない。redは絶対push禁止）：
   - `npx tsc --noEmit`（OOM時は `NODE_OPTIONS=--max-old-space-size=8192`）
   - `npx jest`
   - `npm run check:all`（データ整合性・禁止ワード）
   - `npm run check:orphans`（新規ページを足した場合のみ）
   - 実exitコードを確認（パイプでの誤読を避ける）。
4. **commit → push**：feat/contentプレフィックス・日本語1行・このタスク由来なら `(D-3)`/`(D-10)` 等のタスクID併記。pushは即Cloudflare自動デプロイ＝これで「live化」完了。
5. **本番確認**：対象ページをWebFetch等で開き、新しい枠/リンクが描画されているか確認（キャッシュがあるため`?cb=<値>`等でURLを変える）。
6. **記録**：`docs/worklog/`に承認内容・commit hash・確認結果を1行。

### 前提として既に自動化済みのもの（この手順を速くしている理由）
- `AffiliateAd`/`SponsorSlot`/`AdSlot` はいずれも「未確定(pending)/未契約は描画0」の二重ガード設計＝焦って直しても壊れたリンクが本番に出ない。
- 送客先の差し替えは表1行で完結する設計（コンポーネント側は無改修）＝レビューの手間がほぼ無い。
- push＝本番反映（手動デプロイ工程が無い）。

---

## 1. AdSense（収益の床）

### 審査を通すチェックリスト
- [x] 独自コンテンツ量（45記事＋47県＋計算ツール）→ 十分
- [x] 運営者情報 `/about/editor-profile`・品質 `/quality`・プライバシー・お問い合わせ → あり
- [x] `ads.txt`・`adsbygoogle.js`（`layout.tsx`）→ あり
- [ ] **審査中は `NEXT_PUBLIC_ADSENSE_AUDIT=1` で広告を絞る**（重要）
- [ ] 審査用に「広告だらけ」に見えないか実機確認

### 承認後にやること（蛇口を開ける）
1. AdSenseコンソールで**広告ユニットを作成** → `data-ad-slot` のIDを取得
2. **`src/lib/ad-slots.ts` の仮ID `'0000000000'` を取得したIDに差し替えるだけ**（設置は配線済み）。
   - 既に `<AdSlot>` はブログ記事末（読了直後の高エンゲージ位置・保護者CTAと非競合）に設置済み。`NEXT_PUBLIC_ADSENSE_ENABLED!=1` の間は null を返すので審査リスクなし。
   - 枠を増やしたい時は `AD_SLOTS` にキーを足し、計算結果の下や一覧の折り返しに `<AdSlot slot={AD_SLOTS.xxx} />` を置く（広告は1〜2枠まで／保護者送客と競合させない）。
3. `NEXT_PUBLIC_ADSENSE_ENABLED=1` を本番にセットして再デプロイ
> 自動広告をコンソールでONにすれば`<ins>`無しでも出るが、UX/送客と競合しやすい。**手動枠（AdSlot）で位置を制御する方が、保護者送客の邪魔をせず収益最大化しやすい。**

---

## 2. 保護者リード送客（収益の本命：AdSenseの約9倍の寄与）

仕組みは実装済み（`src/components/ParentLeadCTA.tsx`）。設置場所：トップ／47都道府県ページ／**計算結果直後（休眠中）**／結果ページのギャップ別CTA。

### 送客先ルーティング（インテント×地理で出し分け｜実装済み）
低単価Z会一律から、**インテントの高い位置を高単価のオンライン個別（全国対応）へ**振り替え済み。森塾・キャンパスは地域限定のため、全国ページ（ホーム/47県/結果）にはオンライン塾（atama+・そら塾）のみを当てる。

| 位置 | 送客先 | 理由 |
|---|---|---|
| ホーム最上位 | そら塾（オンライン個別 無料体験） | 最大トラフィック・全国・低摩擦の高単価 |
| 47都道府県ページ | そら塾 | 全国対応・入試文脈 |
| 結果直後（HomeClient） | atama+（AI個別） | 得点直後＝高インテント |
| 結果ギャップ far（未達） | atama+ | 巻き返し需要 |
| 結果ギャップ close（合否ゾーン） | そら塾 | 最高インテント。旧Z会から格上げ |
| 結果ギャップ met（到達） | /koukou-hiyou（費用ブリッジ） | 橋②縦連結 |
| koukou-hiyou（学費） | Z会（通信教育） | 学費文脈＝低摩擦の通信が整合 |

`ParentLeadCTA` は `affiliateId` / `ctaText`（ボタン文言）/ `note`（補足）/ `heading` / `body` で文脈最適化できる。`ctaText` は塾の素アンカー（「【森塾】」等）を「無料体験を申し込む」等の行動文に上書きするための引数（`AffiliateAd` の `ctaText` に委譲）。

### さらに高単価プログラムを増やす（ASPで申請 → 2手で組み込み）
**個別指導塾の資料請求・無料体験は1件¥1,500〜10,000**。地域密着の対面塾（家庭教師のトライ等）を足すと、地域ページ単位で単価が跳ねる。A8等のASPで以下を探して申請する：

| 区分 | 候補プログラム | 目安単価 |
|---|---|---|
| 個別指導塾（資料請求/体験） | 個別教室のトライ／東京個別指導学院／明光義塾／森塾／個別指導の銀河 | ¥3,000〜10,000 |
| 家庭教師（資料請求/体験） | 家庭教師のトライ／ガンバ／オンライン家庭教師(トウコベ等) | ¥3,000〜8,000 |
| 通信教育（資料請求＝高CVR） | 進研ゼミ中学講座／スマイルゼミ／すらら／天神 | ¥500〜2,000 |
| オンライン塾 | そら塾／オンライン個別各社 | ¥2,000〜 |

> 単価が高いのは「体験・面談」系。ただし保護者の心理ハードルも上がるので、**資料請求（無料・低摩擦）＝当たり数 × 体験（高単価）＝当たり単価** の両建てが理想。

### 組み込み手順（リンク取得後・2手）
1. `src/lib/affiliates.ts`：`AffiliateId` のunionにIDを追加 ＋ `AFFILIATES` にエントリ（href/imgSrc or text/trackingPixel をASPのコードから）を追加。
2. 使う側で送客先を差し替え：`<ParentLeadCTA affiliateId="tryアイ-shiryou" heading="..." />`
   - 文脈で出し分け推奨：低い内申結果→個別塾の体験、偏差値→通信教育、など。

---

## 3. トラフィック（規模）

- 毎週月曜の **GSC週次レポート（Issue）** の「striking distance」上位3〜5件に内部リンク／見出しを当てる（`gsc-weekly.yml`）。
- 旧 all-3 の301を本番反映 → GSCで再インデックス申請（canonical合流）。
- 被リンク：埋め込みウィジェット `/embed/*` の設置先を増やす。

---

## 4. 効果測定

- **AdSense**：コンソールのページRPM。教育系の目安¥150〜400/1000PV。
- **送客**：ASP管理画面の「資料請求/体験 発生数 × 単価」。`ParentLeadCTA`経由のクリック率もトラッキングピクセルで把握。
- **意思決定**：月次で「AdSense ÷ 送客」の比率を見る。送客が伸びるほど学生ニッチの天井を超えていける。
- **週次の儀式（自動化）**：`npm run ga4:weekly` で換金ファネル（result_view→cta_view→affiliate_click→lead_submit）の
  WoW・歩留まり・効いた面（pagePath別 cta_view/affiliate_click）を1コマンド出力（`reports/` に保存）。
- **面×案件の勝者分解**：GA4管理 > カスタム定義 で**イベントスコープのカスタムディメンション**を登録すると、
  週次レポートが placement/program 別の勝者表を自動表示する。登録するパラメータ名（そのままの文字列）：
  `placement`／`program`／`pref`／`depth`。登録は1回・反映24〜48h。これが「勝ち案件×勝ち面」をlead-configへ昇格する根拠データ。

---

## 5. 堀A（名簿化）— 受験期トラフィックを“資産”に変える

受験期(11–2月)に来る数万人を「使い捨て」で終わらせず、**会員（LINE友だち＋メール名簿）**にして毎年再収穫する。北極星の両面プラットフォームの共通燃料。

- **実装**：`src/components/SaveResultCTA.tsx`（LINE友だち追加＋メール受け取りフォーム）。設置＝結果ページ最高インテント点（`GapToTarget` 内・目標確定直後）／`/hensachi`／`/hyotei-heikin`。
- **配信**：`/api/lead` → `LEAD_WEBHOOK_URL`（無ければ `CONTACT_WEBHOOK_URL`）へ通知。未設定でも `lead.ts` の **mailtoフォールバック**で取りこぼさない。個人情報はサーバー保存せず通知転送のみ（本格CRM/ESPは後段）。
- **再訪導線**：`persistence.ts` の `savedGoal`（目標と「あと◯点」を端末保存）→ ホームに「おかえりなさい！前回の続きから」バナー。
- **計測**：`line_friend_click` / `lead_submit` / `lead_submit_success`（GA4 G-VRVSVK1X5Z）。

### 残タスク（ユーザー操作）
1. **LINE公式アカウントを開設**（無料）→ 友だち追加URL（`https://lin.ee/xxxx`）を `NEXT_PUBLIC_LINE_ADD_URL` に設定。これが名簿の本体。
2. リード通知先（Discord/Slack Webhook）を `LEAD_WEBHOOK_URL` に設定（`CONTACT_WEBHOOK_URL` 流用でも可）。
3. **ESP（Resend）で「配信できる名簿」化**＝`RESEND_API_KEY`＋`LEAD_FROM_EMAIL` を設定 → 登録者へ歓迎メール自動送信（`src/lib/esp.ts`／コードは結線済・env待ち）。
4. **D1で配信母数を保存**＝`wrangler d1 create my-naishin-leads` → `wrangler.jsonc` の `LEADS_DB` バインディングのコメントを外し database_id を貼る → `migrations/0001_create_leads.sql` を適用 → 再デプロイ（`src/lib/leads-db.ts`／コードは結線済・バインディング待ち）。
5. 貯まったらステップメール/季節配信で「内申対策・出願スケジュール」を定期配信 → 体験申込・資料請求に再送客。

---

## 6. 堀B（AIデータ API / MCP）— AIが呼びにくる一次データ層

AI時代に「溶けない収益」＝AIが必ず参照する一次データの供給側に回る。47都道府県の計算方式を機械可読化。

- **REST**：`GET /api/naishin`（全47件）／`GET /api/naishin/{code}`（詳細＋オール3/4/5の厳密計算例＋目安校）。CORS全許可・CDNキャッシュ1h・`meta.license`=出典明記で無料。
- **MCP**：`/api/mcp`（JSON-RPC 2.0・`list_prefectures`/`get_prefecture`/`calculate_naishin`）。AIエージェントが**厳密な内申点**を呼べる＝「概算で終わらせず正確値＋出典送客」を構造的に実現。
- **正準ソース**：`src/lib/naishin-dataset.ts`（REST/MCP/ドキュメントが共有。表示用 `PREFECTURES`＋`utils` 計算を一本化）。
- **発見導線**：`/developers`（ドキュメント）／`llms.txt`／`robots`（`/api/naishin`・`/api/mcp` を明示許可）／`schema.org Dataset` の `distribution`（DataDownload）／フッター内部リンク／sitemap。

### 課金ゲート（B2Bの「蛇口」＝不労所得化の核心）— 結線済・点火1コマンド
DDレポート §H「課金実装：ゼロ → まず蛇口が要る」への着手。**外部承認に依存せず自力で進められる数少ない領域**。

- **ティア表（正準）**：`src/lib/api-tiers.ts` … `anonymous`（キー無し・30req/分・出典必須・CDNキャッシュ維持＝後方互換）／`free`（登録キー・120req/分・月1万）／`pro`（600req/分・月20万・**¥9,800/月**＝価値ベース）／`scale`（個別・年額データライセンス ¥300,000〜/年）。最初の1社は創業割引で landing、定価は下げない。
- **ゲート**：`src/lib/api-auth.ts` の `gateApiRequest()` を `/api/naishin`・`/{code}`・`/compare`・`/csv` の先頭で施行。有効キー＝ティア昇格＋月次クォータ＋利用計測、無効/未接続＝匿名へフォールバック（**可用性最優先・401にしない**）。レスポンスに `X-Api-Tier`/`X-RateLimit-*`/`X-Quota-*`。
- **キー発行**：`POST /api/keys`（無料キー自己発行・平文は一度だけ）／`GET /api/keys`（有効性確認）。`/developers` に料金表＋発行UI（`ApiKeyIssuer`）。平文は保存せず **SHA-256 ハッシュのみ** D1 保存。
- **データ層**：`src/lib/api-keys.ts`（D1: `api_keys`/`api_usage`）。`getApiKeyStats()` で「誰がどれだけ使うか＝堀の証拠」を可視化可能。

- **機能の線引き（フリーミアムの罠回避）**：`TIER_CAPABILITY_MATRIX`（api-tiers.ts）が「金を払う理由」を機械可読化。
  per-query API と スナップショットDLは全ティア開放（＝GEO/被引用の燃料は止めない）が、**高レート・大量クォータ・出典明記なし商用・SLA・データ再配布ライセンス**は有料側のみ。`/developers` に機能比較表で表示。

**点火①（無料キー・1コマンド）**：既存の `LEADS_DB`（bound 済）に課金テーブルを作るだけ。
```
wrangler d1 execute my-naishin-leads --remote --file=migrations/0005_create_api_keys.sql
```
適用後 `POST /api/keys` が実キーを発行（未適用なら 503「準備中」＝匿名ティアでそのまま使える）。

### Stripe決済ループ（本丸＝「蛇口に水を流す」）— 結線済・env点火
DDレポートの辛口指摘「決済→自動proキー発行のループが無い」への回答。**クレカ決済 → Webhook → 自動proキー発行＆メール送付 → 解約で自動失効**まで閉じている（SDK不要・raw fetch + Web Crypto署名検証）。

- **入口**：`POST /api/billing/checkout { tier }` → Stripe Checkout URL を返す（`/developers` の「Proにアップグレード」ボタン＝`UpgradeButton`）。
- **出口**：`POST /api/stripe/webhook` … `checkout.session.completed`→`issueApiKey({tier})`＋`sendApiKeyEmail()`（平文一度きり）／`customer.subscription.deleted`→`revokeApiKeysBySubscription()`で自動失効。
- **lib**：`src/lib/stripe.ts`（checkout作成・HMAC-SHA256署名検証・price↔tier）。未設定なら全休眠（checkout 503・Webhook 503）。

**点火②（決済・env＋migration＋Webhook登録）**：
```
wrangler d1 execute my-naishin-leads --remote --file=migrations/0006_api_keys_stripe.sql   # 購読↔キーの紐付け列
wrangler secret put STRIPE_SECRET_KEY          # sk_live_...
wrangler secret put STRIPE_WEBHOOK_SECRET      # whsec_...（Webhook作成後に取得）
wrangler secret put STRIPE_PRICE_PRO           # price_...（Pro定期課金のprice ID）
# 任意: STRIPE_PRICE_SCALE（Scaleもセルフ決済にする場合）
```
Stripeダッシュボードで Webhook エンドポイントに `https://my-naishin.com/api/stripe/webhook` を登録（イベント: `checkout.session.completed` / `customer.subscription.deleted`）。RESEND_API_KEY 設定済なら購入者へキーが自動メール。

### 次の一手（任意）
- 価格変更（アップ/ダウングレード）の `customer.subscription.updated` でのティア付け替え（現状はログのみ）。
- **年額データライセンス**（CSV/JSON定期更新フィード）＝`scale` を塾チェーン/EdTechへ。年次の制度更新という労働集約点を収益源に転換（§H Phase3）。
- Pay Per Crawl（Cloudflare）対応で「学習用クロールは課金、引用は許可」を実装し、データそのものを直接換金する。
- 最初の1社を取る営業（B2B需要の創出）＝技術ではなく送り込み。/developers のB2B価値提案＋実績ログ（/admin/report）を営業資料に。

### B2B営業ターゲットリスト・文面・デモ（E-1）

> 「最初の1社」に送り込む先の候補。実在する日本国内の企業・サービスをカテゴリ別に整理（WebSearchで実在確認済み・2026-07時点）。
> 送信は👤（本人）。🤖はリスト作成とデモ資料までを担当し、実際の連絡先確認・送信文の宛名調整は本人が行う。

**A. 塾・スクール向けSaaS（校務/生徒管理。API連携で「入試方式が変わっても内申点計算だけは自動で正しい」を提供できる）**
- Comiru（株式会社POPER）— 学習塾特化型SaaS、導入3,000教室超
- スクパス — 学習塾・スクール向け管理システム、導入2,400施設超
- Grow — 学習塾トータル管理システム
- E-Space — 小〜中規模スクール向けスケジュール管理SaaS
- コエテコマネージャー（GMOメディア株式会社）— スクール管理システム

**B. 受験・学習アプリ（進路データ/内申点計算をAPI/MCPで補完できる相手）**
- スタディサプリ（株式会社リクルート）
- Studyplus（Studyplus株式会社）
- atama+（atama plus株式会社）

**C. 教育メディア・受験情報サイト（一次データ引用先・埋め込みウィジェット先）**
- インターエデュ・ドットコム
- リセマム（イード）
- ONETES／首都圏模試センター

> 30社の目標に対し、上記11社はWebSearchで実在・事業内容を確認済み。残りは👤の土地勘（取引実績・知人経由の紹介等）で埋めるのが実効性が高いと判断し、無人ループでの未確認企業の追加は見送り（捏造回避）。

**アウトリーチ文面（叩き台）**
```
件名：内申点計算データAPI/MCPのご案内（My Naishin）

はじめまして。中学生向け内申点・偏差値計算サイト「My Naishin」を運営しております。

全国47都道府県の公立高校入試における内申点（調査書点）の計算方式を機械可読データ化し、
REST API / MCP（AIエージェント向け）として無料〜有償で提供しています。
https://my-naishin.com/developers

貴社サービスで「都道府県ごとに異なる内申点の計算方式」を扱われる場面がございましたら、
このデータ層を組み込むことで実装・保守の負担を減らせるのではと思いご連絡いたしました。
（都道府県ごとの入試制度変更の追従はこちらで一次情報から継続的に更新しています）

もしご興味があれば、一度オンラインで15分ほどお時間をいただけますと幸いです。

引き続きよろしくお願いいたします。
```

**デモ資料**：[docs/api-demo.md](./docs/api-demo.md)（curl 3行 + MCP JSON-RPC の実行例・実際にAPIから返る値で作成）。

---

## 5. 横展開（本業の天井を上げる）→ `PLAYBOOK.md`

第1候補：**大学受験 ×「学費・奨学金・一人暮らし費用」シミュレーター**。既存読者が進学で流入、予備校資料請求＋引越し一括見積（高単価）＋奨学金で単価が跳ねる。受験制約が無くなったので、本サイトの換金装置が回り始めたら着手する。
