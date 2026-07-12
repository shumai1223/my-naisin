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

### B2B営業ターゲットリスト・文面・デモ（E-1・T-3で表形式の下地に整備）

> 「最初の1社」に送り込む先の候補。実在する日本国内の企業・サービスをカテゴリ別に整理（WebSearchで実在確認済み・2026-07時点）。
> 送信は👤（本人）。🤖はリスト作成とデモ資料までを担当し、実際の連絡先確認・送信文の宛名調整は本人が行う。
> 30社の目標に対し、下記20社はWebSearchで実在・事業内容を確認済み（✅）。残り10枠（D=地場塾5・I=進路指導支援2・J=紹介経由3）は👤の土地勘（取引実績・知人経由の紹介等）で埋めるのが実効性が高いと判断し、無人ループでの未確認企業の追加は見送り（捏造回避）。空欄行はそのまま埋めて使える下地（社名・カテゴリ・問い合わせURL・ステータス）。

| # | 社名 | カテゴリ | 問い合わせURL | ステータス |
| --- | --- | --- | --- | --- |
| 1 | Comiru（株式会社POPER） | A. 塾SaaS（校務/生徒管理） | [comiru.co/contact](https://comiru.co/contact/) | ✅確認済（学習塾特化型SaaS、導入3,000教室超） |
| 2 | スクパス | A. 塾SaaS | [schpass.jp](https://schpass.jp/)（専用フォーム未特定・TEL 0120-411-951） | ✅確認済（学習塾・スクール向け管理システム、導入2,400施設超） |
| 3 | Grow | A. 塾SaaS | [mplanning-info.com](https://www.mplanning-info.com/)（専用フォーム未特定・TEL 03-3519-6951） | ✅確認済（学習塾トータル管理システム） |
| 4 | E-Space | A. 塾SaaS | [e-space.club/contact](https://e-space.club/contact/) | ✅確認済（小〜中規模スクール向けスケジュール管理SaaS） |
| 5 | コエテコマネージャー（GMOメディア株式会社） | A. 塾SaaS | [reserve.coeteco.jp/contact](https://reserve.coeteco.jp/contact)（担当: coeteco-support@gmo.media） | ✅確認済（スクール管理システム） |
| 6 | スタディサプリ（株式会社リクルート） | B. 受験・学習アプリ | [teachers.studysapuri.jp](https://teachers.studysapuri.jp/)（学校向けサービス窓口・専用フォーム未特定） | ✅確認済 |
| 7 | Studyplus（Studyplus株式会社） | B. 受験・学習アプリ | [for-school.studyplus.co.jp](https://for-school.studyplus.co.jp/)（担当: forschool-gakko.info@studyplus.jp） | ✅確認済 |
| 8 | atama+（atama plus株式会社） | B. 受験・学習アプリ | [corp.atama.plus](https://corp.atama.plus/)（専用フォーム未特定・コーポレートサイト経由） | ✅確認済 |
| 9 | インターエデュ・ドットコム | C. 教育メディア | [inter-edu.com/form/ad.php](https://www.inter-edu.com/form/ad.php)（広告掲載窓口） | ✅確認済 |
| 10 | リセマム（イード） | C. 教育メディア | 担当: media-biz@iid.co.jp | ✅確認済 |
| 11 | ONETES／首都圏模試センター | C. 教育メディア | [syutoken-mosi.co.jp/inquiry/media/nyushi](https://www.syutoken-mosi.co.jp/inquiry/media/nyushi/)（メディア向け窓口） | ✅確認済 |
| 12 | | D. 地場塾（D-1/D-2直接契約） | | 👤埋め |
| 13 | | D. 地場塾 | | 👤埋め |
| 14 | | D. 地場塾 | | 👤埋め |
| 15 | | D. 地場塾 | | 👤埋め |
| 16 | | D. 地場塾 | | 👤埋め |
| 17 | 家庭教師のトライ（株式会社トライグループ） | E. 家庭教師サービス | [trygroup.co.jp/company](https://www.trygroup.co.jp/company/)（専用フォーム未特定・電話9:00-23:00） | ✅確認済（個別指導・家庭教師の全国最大手、オンライン家庭教師も展開） |
| 18 | オンライン家庭教師WAM（株式会社エイチ・エム・グループ） | E. 家庭教師サービス | [wam.onl/contact](https://wam.onl/contact/) | ✅確認済（個別指導塾を全国展開する同社が運営するオンライン家庭教師サービス） |
| 19 | スタディコーチ（株式会社Builds） | E. 家庭教師サービス | 担当: studycoach@builds.ventures（TEL 03-6721-1160） | ✅確認済（東大・早慶生コーチによる難関大学・難関高校向け個別指導） |
| 20 | みんなの高校情報（株式会社イトクロ） | F. 教育メディア/受験情報サイト（追加候補） | [itokuro.jp/inquiry/top.php](https://www.itokuro.jp/inquiry/top.php)（一般窓口・広告専用フォーム未特定） | ✅確認済（全国の高校の偏差値・口コミ・入試情報サイト。塾ナビ等も運営） |
| 21 | 大学受験パスナビ（株式会社旺文社） | F. 教育メディア（追加候補） | [passnavi.obunsha.co.jp/faq/3/5](https://passnavi.obunsha.co.jp/faq/3/5/)（広告掲出窓口） | ✅確認済（大学受験情報・過去問・合格体験記を扱う旺文社運営サイト） |
| 22 | FLENS School Manager（FLENS株式会社） | G. 塾SaaS（追加候補） | [flens.jp/contact_corporate](https://www.flens.jp/contact_corporate) | ✅確認済（塾・スクール向け保護者コミュニケーション/校務プラットフォーム、利用者12万人超） |
| 23 | BitCampusEX（株式会社ティエラコム） | G. 塾SaaS（追加候補） | [bitcampus.net](https://www.bitcampus.net/)（専用フォーム未特定） | ✅確認済（学習塾向け生徒管理・入退室・請求管理システム、10万人超が利用） |
| 24 | 進研ゼミ（株式会社ベネッセコーポレーション） | H. 通信教育・映像授業 | [benesse.co.jp/contact](https://www.benesse.co.jp/contact/)（法人向けカテゴリを選択） | ✅確認済（国内最大手の通信教育、中高一貫コースあり） |
| 25 | Z会（株式会社Z会／増進会ホールディングス） | H. 通信教育・映像授業 | 担当: press@zkai.co.jp（TEL 055-976-5568） | ✅確認済（通信教育・映像授業・個別指導を展開、大学受験に強い） |
| 26 | | I. 進路指導支援（学校/自治体向け） | | 👤埋め |
| 27 | | I. 進路指導支援 | | 👤埋め |
| 28 | | J. その他（紹介経由） | | 👤埋め |
| 29 | | J. その他（紹介経由） | | 👤埋め |
| 30 | | J. その他（紹介経由） | | 👤埋め |

> カテゴリD/E（地場塾・家庭教師サービス）は直接送客契約（D-1/D-2）向け、A/B/C/F/G/Hは主にAPI/MCPデータ連携（E-1）向け、Iは自治体・学校向け一次データ提供の将来候補。空欄行は問い合わせURL確認まで🤖が担当してよい（社名が👤から与えられた後）。

**アウトリーチ文面（叩き台・2026-07-12改訂＝Pro自己申込みを主導線に・オンライン相談は興味喚起後の任意ステップへ）**
```
件名：内申点計算データAPI/MCPのご案内（My Naishin）

はじめまして。中学生向け内申点・偏差値計算サイト「My Naishin」を運営しております、しゅうまいと申します。

全国47都道府県の公立高校入試における内申点（調査書点）の計算方式を機械可読データ化し、
REST API / MCP（AIエージェント向け）として無料〜有償で提供しています。
https://my-naishin.com/developers

貴社サービスで「都道府県ごとに異なる内申点の計算方式」を扱われる場面がございましたら、
このデータ層を組み込むことで実装・保守の負担を減らせるのではと思いご連絡いたしました。
（都道府県ごとの入試制度変更の追従はこちらで一次情報から継続的に更新しています）

Pro（月額¥9,800〜・高レート/大量クォータ/出典明記なしでの商用利用/SLA付き）は上記ページから
お打ち合わせなしでその場でお申し込みいただけます。まずは触っていただくだけでも歓迎です。
より大きな規模（データライセンス・専用SLA等）にご興味があれば、その際は一度オンラインで
15分ほどお話しできればと思います。

引き続きよろしくお願いいたします。

しゅうまい
My Naishin 運営
naishin.dev@gmail.com
https://my-naishin.com
```

**デモ資料**：[docs/api-demo.md](./docs/api-demo.md)（curl 3行 + MCP JSON-RPC の実行例・実際にAPIから返る値で作成）。

**媒体資料（自動生成・T-3）**：`npm run media-kit -- --out=media-kit-YYYY-MM.md`（サイト規模・カバレッジ・API/MCPツール数をコードの実データから自動集計。トラフィック実測は`--clicks=`/`--sessions=`で任意指定・未指定なら「非公開」表示で捏造しない）。上記のAPI/B2Bアウトリーチ文面に添付する一枚もの。

**社名別パーソナライズ差し込み文（U-2・2026-07-12追加）**

> 汎用文面（上記）の第3段落「貴社サービスで『都道府県ごとに異なる内申点の計算方式』を扱われる場面がございましたら〜」を、送付先の事業内容に合わせて下表の1文に差し替える運用。件名・冒頭挨拶・デモ資料URL・結びは共通のまま。各社の事業内容はWebSearchで確認済みの公開情報のみに基づく（未確認の内部事情は書かない）。D/E（地場塾・家庭教師の直接契約向け）は下の直接契約提案メール側でパーソナライズするためここでは対象外。

| # | 社名 | 差し込み文（第3段落差し替え案） |
| --- | --- | --- |
| 1 | Comiru（POPER） | 貴社の塾向け校務・保護者連絡システムに内申点・偏差値の自動計算機能を組み込むことで、保護者への成績説明画面をより充実させられるのではと思いご連絡いたしました。 |
| 2 | スクパス | 貴社のスクール管理システムをご利用の学習塾・スクール様向けに、内申点・偏差値計算をカリキュラム管理画面へ組み込む形でご提案できればと考えております。 |
| 3 | Grow | 貴社の学習塾トータル管理システムの生徒カルテ機能に都道府県ごとに異なる内申点計算ロジックを組み込むことで、保護者面談資料の作成負担を減らせるのではと思いご連絡いたしました。 |
| 4 | E-Space | 貴社のスケジュール管理SaaSをご利用の学習塾様向けに、内申点・偏差値計算を追加機能としてご提案できればと考えております。 |
| 5 | コエテコマネージャー（GMOメディア） | 貴社のスクール管理システムをご利用のプログラミング教室・学習塾様向けに、進路指導で使う内申点・偏差値計算機能を組み込みオプションとしてご提案できればと考えております。 |
| 6 | スタディサプリ（リクルート） | 貴社の学習アプリにおける進捗・成績管理機能と合わせて、都道府県ごとに異なる内申点・偏差値の計算をAPIで提供することで、ユーザーの進路検討をより具体的に支援できるのではと思いご連絡いたしました。 |
| 7 | Studyplus | 貴社の学習記録アプリのユーザー向けに、内申点・偏差値の計算機能をAPI連携で追加することで、日々の学習記録と進路目標を結びつける機能をご提案できればと考えております。 |
| 8 | atama+（atama plus） | 貴社のAI教材による個別最適化学習と合わせて、都道府県ごとに異なる内申点計算の一次データをAPIで提供することで、生徒・保護者への進路提案をより具体的にできるのではと思いご連絡いたしました。 |
| 9 | インターエデュ・ドットコム | 貴媒体の中学受験コミュニティ記事において、内申点・偏差値計算の一次データ・ツールを引用元としてご活用いただけるのではと思いご連絡いたしました。 |
| 10 | リセマム（イード） | 貴媒体の教育ニュース記事において、都道府県別の入試制度・内申点計算方式を一次データとして引用いただける形でAPI/データ連携をご提案できればと考えております。 |
| 11 | ONETES／首都圏模試センター | 貴社の模試事業と合わせて、内申点計算の都道府県別一次データをAPI連携することで、模試結果と内申点を組み合わせた進路指導支援ができるのではと思いご連絡いたしました。 |
| 17 | 家庭教師のトライ | 貴社の家庭教師・個別指導サービスにおける保護者面談時に、内申点・偏差値をその場で正確に算出できるAPIをご活用いただけるのではと思いご連絡いたしました。 |
| 18 | オンライン家庭教師WAM | 貴社のオンライン家庭教師サービスにおいて、都道府県ごとに異なる内申点計算方式をAPIで組み込むことで、初回面談での進路提案の精度を上げられるのではと思いご連絡いたしました。 |
| 19 | スタディコーチ | 貴社の難関大学・難関高校向け個別指導において、内申点・偏差値計算の一次データをAPIで組み込み、コーチングの進路提案資料作成を効率化できるのではと思いご連絡いたしました。 |
| 20 | みんなの高校情報（イトクロ） | 貴サイトの高校情報ページにおいて、都道府県別の内申点計算ツールをAPI／埋め込みでご提供できればと考えております。 |
| 21 | 大学受験パスナビ（旺文社） | 貴サイトの大学受験情報コンテンツと合わせて、高校入試における都道府県別内申点計算の一次データをAPI連携でご提供できればと考えております。 |
| 22 | FLENS School Manager | 貴社の塾向け保護者コミュニケーションアプリに内申点・偏差値計算機能を組み込むことで、保護者への成績説明のやり取りをより充実させられるのではと思いご連絡いたしました。 |
| 23 | BitCampusEX（ティエラコム） | 貴社の塾経営管理システムの生徒管理機能に都道府県別の内申点計算ロジックを組み込むことで、面談準備の負担を減らせるのではと思いご連絡いたしました。 |
| 24 | 進研ゼミ（ベネッセ） | 貴社の通信教育教材において、都道府県ごとに異なる公立高校入試の内申点計算方式を一次データとしてAPI連携できないかご相談させていただきたく存じます。 |
| 25 | Z会（増進会HD） | 貴社の通信教育・映像授業コンテンツにおいて、都道府県別の入試制度・内申点計算の一次データをAPI連携でご提供できればと考えております。 |

**直接契約提案メール（叩き台・D-1/D-2向け・地場塾/家庭教師サービス宛）**

> カテゴリD/E（地場塾・家庭教師サービス）向け。上記のAPI/B2B文面（データ連携の提案）とは対象読者が異なり、
> こちらは「保護者向け送客の直接契約」を持ちかける文面。送信は必ず親名義（👤）で。

```
件名：内申点・偏差値の計算サイトから、貴校への送客のご相談（My Naishin）

はじめまして。中学生向け内申点・偏差値計算サイト「My Naishin」を運営しております。

内申点や偏差値を計算した直後の保護者の方・受験生に向けて、学習塾・家庭教師サービスの
資料請求／無料体験の情報をご案内しております。

現在はASP（アフィリエイト仲介）経由で複数の学習系サービスへの送客を行っておりますが、
実績が見えてきた面では、仲介手数料の無い直接契約のご相談をさせていただければと思い
ご連絡いたしました。

- 送客導線：内申点・偏差値の計算結果直後（保護者の関心が最も高いタイミング）
- 対応地域：全国47都道府県（都道府県別に計算ツールを提供しているため、地域を絞った送客も可能です）
- 実績：月次の送客実績レポートを共有可能です

もしご興味があれば、一度オンラインで15分ほどお時間をいただけますと幸いです。

引き続きよろしくお願いいたします。
```

> 送客実績を添える場合は [scripts/generate-sales-report.ts](../scripts/generate-sales-report.ts) の出力を同封する。

---

## 5. 横展開（本業の天井を上げる）→ `PLAYBOOK.md`

第1候補：**大学受験 ×「学費・奨学金・一人暮らし費用」シミュレーター**。既存読者が進学で流入、予備校資料請求＋引越し一括見積（高単価）＋奨学金で単価が跳ねる。受験制約が無くなったので、本サイトの換金装置が回り始めたら着手する。
