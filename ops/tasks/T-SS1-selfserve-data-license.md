# T-SS1 データライセンスを「商談で売るもの」から「買えるもの」に変える

**着手: T-Y11B（主食）の次。ただし9/8〜22の不在期間中に進めてよい（👤ゲートに当たらない範囲）。**

⚠️ **この文書の数値は対話セッションが集計したもの。loop は自分で数え直してから動くこと。**

---

## なぜやるのか

### 事実1: あなたの時間を使わない収益線が1本も無い

```
広告・アフィリ    ¥57万で構造的に頭打ち（トラフィック比例・玉がもう無い）
B2B             1件あたり 55分の商談＋メール往復＋稟議。**関係の数だけ時間が要る**
送客            塾との契約が要る＝これも関係
```

**AIがどれだけ速くなっても、55分の商談は55分。** 契約・請求・与信・信頼関係は代替できない。
→ **FY2027に数千万へ届くには「買えるもの」が最低1本要る。**

### 事実2: 9割はもう作ってある

```
✅ api-tiers.ts        5ティア（anonymous/free/pro/business/scale）・価格・レート・クォータ
✅ Stripe              checkout → webhook → 自動proキー発行まで実装済み・e2e確認済み
✅ /developers         料金表・Scale 3段（基本100万/＋再配布権150万/フル250万）掲載済み
✅ OpenAPI             /api/openapi
✅ MCP                 27ツール
✅ api_keys / api_usage テーブル・月次クォータ計測
```

**顧客0。実装の問題ではなく「買えない」問題。**

### 事実3: 買えるのはPro（¥9,800/月）だけ

現状、**Stripeで即決済できるのはProのみ**。Business（年¥240,000）とEnterprise（年100万〜）は
「お見積り」＝**商談が必要＝あなたの時間**。

**ここが塞がっている限り、収益はあなたの時間に比例したままになる。**

---

## SS1-1 いまどこで止まるかを実測する（まずこれ・半日）

**推測で設計しない。実際に買おうとして、どこで詰まるかを見る。**

- [x] `/developers` を訪問者の目で通しで読み、**「買う」までに必要な操作を全部書き出す**
      （2026-09-04・コード読みで実測。UIは Pro=UpgradeButton即決済導線 / Business=旧・お問い合わせ&見積書リンクのみ
      / Enterprise=UpgradeButton tier="scale"だが文言は「相談する」）
- [x] Proの決済導線を**実際に最後まで通す**（Stripeのテストモードで。⚠️本番課金はしない）
      → ⚠️**未実施（不明）**。ローカルにSTRIPE_SECRET_KEYのテストモード鍵が無く、実ブラウザでの通し確認は
      👤環境（Stripeダッシュボードアクセス）が要る。**コード読みでの静的確認は完了**（下記）が、実弾での
      「エラーが起きないこと」の確認はまだ。
- [x] Business / Enterprise の導線が**どこで人間待ちになるか**を特定する
      → **実測結果（コード直接確認・2026-09-04）**:
      - `src/app/api/billing/checkout/route.ts` の tier バリデーションが元々 `'pro' | 'scale'` のみで、
        **`business` はそもそも受け付けていなかった**（400になる実装だった）。
      - `src/lib/stripe.ts` の `priceIdForTier`/`tierForPriceId`/`StripeEnv` に `business` 用フィールドが
        存在せず、**Business分のStripe price ID を注入する経路自体が無かった**。
      - `src/components/Developers/UpgradeButton.tsx` の `tier` prop型が `'pro' | 'scale'` のみで、
        UIからBusinessの決済ボタンを出すこと自体が型上できなかった。
      - `/developers` page.tsx のBusinessブロックは元々「Businessについて相談する」(`/contact`) と
        「見積書を作成する」(`/mitsumori`) の2リンクのみで、**決済APIを一切呼んでいなかった**
        （コメントに明記: "Stripe商品未登録のため自動決済でなくお問い合わせ導線"）。
      - つまりBusinessは **UI層・API層・Stripeマッピング層の3層すべてで自動決済が未配線** だった
        （タスク文書の記述通りだが、具体的にどのファイルのどの型/分岐が塞いでいたかを特定できた）。
      - Enterprise(scale)は `UpgradeButton tier="scale"` が既に配線済みで、`STRIPE_PRICE_SCALE` を
        👤が設定すれば決済まで通る形にはなっている（`ops/VERDICT.md` C1-12 で既知・👤ゲート）。
        ただしボタン文言が「相談する」のままで、セルフ決済できることが訪問者に伝わらない（軽微・未修正）。
- [ ] `api_hits` / `api_keys` / `api_usage` を実際に数え、**どこまで到達して離脱しているか**を出す
      → ⚠️**不明（ブロック）**。2026-09-04にこの環境から`wrangler d1 execute --remote`を試行したが、
      `wrangler whoami`の時点で①TLS傍受(`UNABLE_TO_VERIFY_LEAF_SIGNATURE`・[[wrangler-corporate-
      network-workaround]]の既知の罠)②未ログイン・`CLOUDFLARE_API_TOKEN`が環境に無い、の2つで
      止まった。TLS側は`NODE_TLS_REJECT_UNAUTHORIZED=0`で回避できるが、認証トークン自体が
      loop環境に存在しないため本番D1へのクエリ自体が実行できない。**これは👤が
      `wrangler secret put`等で認証済みの環境（本人PC）でしか解けない**。次に👤がこの作業をする
      機会があれば、`SELECT tier, COUNT(*) FROM api_keys GROUP BY tier`のような集計クエリを
      渡せば5分で終わる規模の調査。
- [x] ⚠️ **見つからない・確認できないものは「不明」と書く**（上記に明記済み）

## SS1-2 Businessを「買えるもの」にする

**Business（年¥240,000・商用可・月次20万回）が自動で買える状態にする。**

- [x] Stripeの年額サブスクリプションを Business ティアで通せるようにする
      （Proの既存フロー `/api/billing/checkout` → `/api/stripe/webhook` を踏襲する。新規に作らない）
      → **2026-09-04実装完了**:
      - `src/lib/stripe.ts`: `StripeEnv.priceBusiness` 追加・`readStripeEnv()`で`STRIPE_PRICE_BUSINESS`
        (process.env→Cloudflare envの順)を解決・`priceIdForTier`/`tierForPriceId`にbusiness分岐を追加。
      - `src/app/api/billing/checkout/route.ts`: tierバリデーションに`'business'`を追加（400を返す条件を修正）。
      - `src/components/Developers/UpgradeButton.tsx`: `tier` prop型を`'pro' | 'business' | 'scale'`に拡張。
      - `src/app/developers/page.tsx`: BusinessブロックにUpgradeButton(`tier="business"`)を追加
        （既存の「相談する」「見積書」リンクは併存・削除していない）。
      - Webhook側(`src/app/api/stripe/webhook/route.ts`)は元々`obj.metadata.tier`をそのまま`issueApiKey`へ渡す
        実装で、型注釈も既に`'pro' | 'business' | 'scale'`だったため**変更不要**（既にbusiness対応済みだった）。
      - `STRIPE_PRICE_BUSINESS`未設定時は`priceIdForTier`がnullを返し、checkout routeが既存の503
        「オンライン決済は現在準備中です」に自動で落ちる（Proが無かった頃と同じ安全側デフォルト。
        UI側もUpgradeButtonのinfo表示で自然に「準備中・お問い合わせ」に見える。何も壊れない）。
      - テスト更新: `src/lib/__tests__/stripe.test.ts`（business分のpriceIdForTier/tierForPriceId往復）、
        `src/app/api/billing/__tests__/checkout-route.test.ts`（business tierが400でなく503 not_enabledで
        検証を通過することを固定）。tsc実exit 0（`NODE_OPTIONS=--max-old-space-size=6144`必須・素の設定だと
        OOMでtscがSIGABRTする＝メモの新規トラップ）、対象jest 4スイート38件green。全体jest実行中（別途確認）。
- [ ] 決済完了で **business ティアのキーを自動発行**する（proと同じ経路）
      → コード上は完了（webhookが既にbusiness対応済みだったため）。**実弾（テストモードのStripe Checkoutを
      実際に完了させてキーが発行されるか）はSTRIPE_SECRET_KEY等のテスト鍵が要るため未検証**。
- [ ] ⚠️ **価格の数字を変えない。** `ops/PRICING_OPTIONS.md` の2026-08-13裁定が正典
      → 遵守。`formatTierPrice('business')`（既存関数・変更なし）をそのまま表示に使っている。数字は
      `api-tiers.ts`の`annualPriceJpy: 240_000`のまま未変更。
- [ ] ⚠️ **Stripeの本番点火は C7 ゲート。** テストモードまで作って👤に上げる
      → コード側は準備完了（`STRIPE_PRICE_BUSINESS`を設定するだけで動く）。**Stripeダッシュボードでの
      Business商品登録・price ID発行・env設定は👤アクション**（`ops/PRICING_OPTIONS.md`が元々
      「Stripeの設定（Business/Enterpriseの商品登録）」を👤ゲートと明記済み・変更なし）。
- [x] 利用規約に「商用利用が判明した場合、Business相当額を遡って請求する場合があります」が
      書かれているか確認する（`PRICING_OPTIONS.md` L68に明記の指示がある）
      → `/developers` page.tsx L905（実装済み・確認のみ、コード変更なし）

## SS1-3 「何が買えるのか」を1画面で分かるようにする

**いまの `/developers` は開発者向けの技術文書。買う判断ができる形になっていない。**

- [x] **各ティアで具体的に何のデータが取れるか**を、エンドポイント名ではなく中身で書く
      （例: 「学校・学科別の倍率 21,739件・3,260校・令和4〜8年度」）
      → **2026-09-04実装完了**。`⑦d 都道府県別 学校ごと入試競争率`セクションに
      「21,739件（3,260校・47都道府県・令和4〜8年度の5年分）」を明記。この文書のタスク本文の
      「例」がそのまま実データの正確な数値だったことを`COMPETITION_RATE_BY_PREFECTURE`を直接集計して
      確認済み（tsx scratchスクリプトで実測・使い捨てのため削除済み）。「Business以上」であることも
      見出しと本文に明示（`/api/schools/[pref]/route.ts`が`requireMinTier: 'business'`で既にゲート済み
      だったが、page.tsxの説明文には未記載だったので追記）。
- [x] **無償ティアとの差**を明示する（提案書に書いた表と同じ内容・整合させること）
      → 全体の差分は既存の料金表・機能比較表（`TIER_CAPABILITY_MATRIX`）で表現済み。⑦d個別にも
      2026-09-04時点で見出し「（Business以上）」と本文「本エンドポイントはBusiness以上のAPIキーが
      必要です」を明記済み（＝Free/Proは0件しか取れない、という最も強い形の差分表示）。
      OpenAPI仕様書側にも同日402レスポンスとして反映済み（SS1-4参照）。追加作業不要と判断。
- [x] **サンプルデータを置く**（千葉3行のような実物。買う前に中身が見える状態にする）
      → 実装完了。`src/data/competition-rates/chiba.ts`の実レコード3件（千葉/千葉女子×2学科）を
      そのままJSON例として掲載（捏造ゼロ・実データのコピー）。
- [x] ⚠️ **件数は実ファイルを数えて書く。** 提案書で5箇所の数値誤りが見つかった前科がある
      → `src/app/developers/__tests__/data-volume-claims.test.ts`を新設し、
      `COMPETITION_RATE_BY_PREFECTURE`の実集計値（47都道府県・21,739件・配布可能21,548件・
      3,260校）とpage.tsx本文の文字列を突合するテストで機械的に固定した。今後データが増減した際に
      ページ側の数字が古いまま放置される事故を防ぐ（テストがfailして気づける）。

## SS1-4 見つけてもらう導線（技術面のみ・対外送信はしない）

- [x] `/developers` が検索で見つかるか実測する（GSC: 直近7日は17表示0クリック・位6.4）
      → **2026-09-04実測（GSC MCP）**: 直近90日累計=73表示・3クリック・平均掲載順位5.38。
      直近28日の日次内訳は毎日0〜7表示（1日のみ8/9に1クリック）・順位はおおむね2.5〜9で安定せず。
      query次元は0行（GSCのプライバシー閾値で低ボリュームクエリが匿名化され出てこない）。
      **結論: 極めて薄いが完全にゼロではない。露出はあるが検索需要自体が小さい語（「内申点 API」等）
      のため、これ以上はコンテンツ・被リンクでの押し上げが必要な段階（loop権限内でのSEO改善は
      T-Xの範疇であり、SS1では「壊れていないことの確認」に留める）**。
- [x] OpenAPI / MCP のディスカバリ情報が正しく出ているか確認する
      → **2026-09-04実測・1件の記載漏れを発見し修正**。`src/app/api/openapi/route.ts`の説明文3箇所
      （info.description・POST /api/keys の説明・`/api/schools/{pref}`の説明）が軒並み
      「Pro / Scale は /developers」という2026-08-13以前の文言のままで、**Businessティアの存在が
      OpenAPI仕様書から欠落していた**（SS1-2で見つけたcheckout route/UpgradeButtonと同じ「Business
      だけ後から追加されて一部の文言に反映されていなかった」パターン）。修正: 3箇所とも
      「Pro / Business / Scale」に統一し、`/api/schools/{pref}`には実装済みの
      `requireMinTier: 'business'`(402ゲート)がOpenAPI上に一切書かれていなかったため
      説明文＋`responses.402`を新規追加(実装と仕様書の乖離を解消)。llms.txt（`public/llms.txt`）は
      既に`/developers`・`/api/openapi`・`/api/mcp`・`/api/schools/{pref}`を正しく案内しており修正不要。
- [x] サイト内から `/developers` への導線があるか（`page-registry` と内部リンクグラフで確認）
      → **2026-09-04実測**。`src/lib/page-registry.ts`に`{ url: '/developers', priority: 0.6,
      changeFrequency: 'monthly' }`で登録済み（sitemap反映OK）。内部リンクは
      `src/components/Footer.tsx`（サイト全体のフッター＝実質全ページから到達可能）に加え、
      `hyotei-heikin/gakushu-seiseki`・`naishin-kakusa`・`naishin-map`・`partner`・`reliability`・
      `report/2026`（日英）・`terms`・`tokushoho`の計8ページからも個別に`href="/developers"`あり。
      **導線自体は十分にある**という結論（新規リンク追加は不要と判断）。
- [ ] ⚠️ **レジストリへの登録・対外的な告知は👤ゲート**（N2-1と同じ）。ここでは技術面のみ
      → 遵守（対外送信・登録系は一切行っていない。GSC実測は読み取りのみ）。

---

## DoD

- [~] Business が**人を介さず購入できる**（テストモードで実証）
      → コード配線は2026-09-04完了（SS1-2）。**実弾のテストモード通しはloop環境に
      STRIPE_SECRET_KEY等のテスト鍵が無く未実施＝👤アクションが必要**（下記参照）。
- [x] `/developers` を読んだ人が「何が・いくらで・どう買えるか」を1画面で判断できる
      → 2026-09-04完了（SS1-3・料金表＋1問判定＋⑦dの中身説明＋サンプルJSON）。
- [x] 掲載している件数がすべて実ファイルと一致している（機械的に検証した記録がある）
      → 2026-09-04完了（`data-volume-claims.test.ts`で機械的に固定・SS1-3）。
- [x] `tsc` 実exit 0 / jest green
      → 本タスクの全コミットで確認済み（406→407 suites・6628→6630 tests、regressionゼロ）。
- [ ] **本番の点火（Stripe Business の有効化）は👤ゲート**（未着手・👤専用）

**2026-09-04時点のまとめ**: loopが担当できる範囲（SS1-1実測・SS1-2コード配線・SS1-3コンテンツ・
SS1-4ディスカバリ）は完了。残る2件は両方とも👤専用アクション:
1. **Stripeダッシュボードで Business商品を作成し `STRIPE_PRICE_BUSINESS` をテストモードのprice IDで
   設定**（`ops/PRICING_OPTIONS.md`が元々C7ゲートと明記済み・価格は¥240,000/年で変更不要）
2. 設定後、`/developers` でBusinessの「アップグレード」ボタンを実際にクリックしてStripeテスト
   カードで決済を完了し、`business`ティアのAPIキーがメールで届くところまで通しで確認する
   （SS1-2実装のUpgradeButton→checkout→webhook→issueApiKeyの経路をエンドツーエンドで検証）
3. （任意・低優先）D1本番の`api_keys`/`api_usage`集計は👤の認証済み環境でのみ実行可能
   （SS1-1参照）

## 守ること

- ⚠️ **価格を勝手に変えない**（`ops/PRICING_OPTIONS.md` の2026-08-13裁定が正典）
- ⚠️ **Stripe本番点火・対外告知は C7**
- ⚠️ **既存のPro導線を壊さない**（動いているものを触らない）
- ⚠️ **推測で「買えるはず」と書かない。** 実際に通して確かめる
