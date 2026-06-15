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
3. ある程度貯まったらメール配信（ESP）/LINE配信で「内申対策・出願スケジュール」を定期配信 → 体験申込・資料請求に再送客。

---

## 6. 堀B（AIデータ API / MCP）— AIが呼びにくる一次データ層

AI時代に「溶けない収益」＝AIが必ず参照する一次データの供給側に回る。47都道府県の計算方式を機械可読化。

- **REST**：`GET /api/naishin`（全47件）／`GET /api/naishin/{code}`（詳細＋オール3/4/5の厳密計算例＋目安校）。CORS全許可・CDNキャッシュ1h・`meta.license`=出典明記で無料。
- **MCP**：`/api/mcp`（JSON-RPC 2.0・`list_prefectures`/`get_prefecture`/`calculate_naishin`）。AIエージェントが**厳密な内申点**を呼べる＝「概算で終わらせず正確値＋出典送客」を構造的に実現。
- **正準ソース**：`src/lib/naishin-dataset.ts`（REST/MCP/ドキュメントが共有。表示用 `PREFECTURES`＋`utils` 計算を一本化）。
- **発見導線**：`/developers`（ドキュメント）／`llms.txt`／`robots`（`/api/naishin`・`/api/mcp` を明示許可）／`schema.org Dataset` の `distribution`（DataDownload）／フッター内部リンク／sitemap。

### 次の一手（任意）
- Pay Per Crawl（Cloudflare）対応で「学習用クロールは課金、引用は許可」を実装し、データそのものを直接換金する。
- 利用ログ（どのAI/サイトが呼んだか）を取り、供給側（塾/私立）交渉の実績データにする。

---

## 5. 横展開（本業の天井を上げる）→ `PLAYBOOK.md`

第1候補：**大学受験 ×「学費・奨学金・一人暮らし費用」シミュレーター**。既存読者が進学で流入、予備校資料請求＋引越し一括見積（高単価）＋奨学金で単価が跳ねる。受験制約が無くなったので、本サイトの換金装置が回り始めたら着手する。
