# AI経由の流入ベースライン(T-AI1 I-1・2026-10-24)

実測のみ。**GA4は同意した人だけを数える下限値**(全体の約1割という粗い推定・`ga4-undercounts-conversions`)。見込み¥は書かない。公開面で「AIに引用された」とは書かない。
期間: 2026-09-22〜2026-10-22(31日)。GA4プロパティ 540358022。取得日 2026-10-24。

## 1. 流入元(セッション)
| 流入元 / メディア | セッション | ユーザー | エンゲージ | PV |
|---|---|---|---|---|
| openai / organic | 42 | 41 | 38 | 76 |
| chatgpt.com / ai-assistant | 5 | 5 | 4 | 10 |
| openai / (not set) | 3 | 3 | 3 | 5 |
| copilot / (not set) | 2 | 2 | 0 | 0 |
| **AI系の合計** | **52** | 51 | 45 | 91 |
| 参考: google / organic | 510 | 401 | 448 | 957 |
| 参考: yahoo / organic | 119 | 102 | 107 | 208 |
| 参考: 全流入元の合計 | 908 | | | |

- **AI系はセッション全体の約5.7%**(52/908)。GA4が数えられた範囲での比率。
- 「openai / organic」が大半(42)。これはChatGPT(検索)経由と読めるが、GA4側の流入元の振り分けで、`chatgpt.com / ai-assistant`と別行に分かれている。**合算して見る**。
- 他のAI(perplexity・gemini・claude)は、この期間は0行(出ていない)。
- copilotはエンゲージ0・PV0(2セッション)=すぐ離脱。

## 2. カスタムイベント `ai_referral`(サイトのコードが送る・1セッション1回)
- 31日で**67件**(日別の値あり・26日で発生)。日別の最大は10/22の7件・10/9と10/20の5件。
- 検出ロジック: `src/lib/track.ts` の `AI_REFERRER_PATTERNS`(referrerまたはutm_sourceがchatgpt.com・chat.openai.com・openai.com・perplexity.ai・copilot等)。セッションごとに1回(`sessionStorage`)。
- 流入元の行(52セッション)とイベント(67件)は定義が違うので一致しない(イベントはutm付きの他経路も拾う・同意の有無・計測タイミング)。**どちらも下限値**。

## 3. 週次の推移(AI系セッション・GA4の週番号)
| 週 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43(10/19〜22の4日間のみ) |
|---|---|---|---|---|---|---|---|---|
| セッション | 2 | 1 | 2 | 4 | 10 | 15 | 8 | 15 |
- 9月末から増え始め、10月は週8〜15。**週43は4日間で15**(最近ほど速い)。ただし件数が小さい。

## 4. 着地ページ(AI系・31日・セッション)
- /hensachi 7 · / 6 · /hyotei-heikin 3 · /kanagawa/s-value 3 · /total-score 2 · /hensachi/gyakusan/hayamihyou 2 · /hokkaido/rank 2 · 県別/naishin(aichi・kagawa 各2、gifu・gunma・hiroshima・hokkaido・okinawa・osaka 各1) · 学校ページ(/pref/{県}/school/…)5県で各1(fukuoka・hyogo・okinawa・saitama・tokyo) · ブログ4本(各1) · /aichi・/chiba・/saitama・/shizuoka(各1)。
- **ツールと入口(偏差値・内申・評定平均・総合得点・s値)に集中**。学校ページ・倍率系は各1で、まだ弱い。
- エンゲージ率は高い(エンゲージ45/52=約87%・Googleのorganicは448/510=約88%と同程度)。

## 5. 読み方・次の確認点
- AI経由は件数としては小さい(GA4下限で週10〜15セッション)が、増加傾向。判断を変える規模ではない。**量産の根拠にしない**(T-AI1の制約)。
- 次: 週次(T-WK1)に「AI系セッション」「ai_referralイベント」を2行足して、この表の続きを取る(I-4のCloudflare全数は未取得)。
- 注意: 着地の多い /hensachi・/ ・/hyotei-heikin は、構造点検(I-3)の対象にする。

## 6. 別件の発見(測定の質): サイト内リンクのutm_sourceが流入元を汚している可能性
- 同じ期間のセッションに、流入元が **prefecture(43)・home(14)・hensachi(10)・gap-target(9)・hyotei-heikin(7)・hensachi-gyakusan(1)・hensachi-shiboukou(1)** という、**自サイトの内部名**の行がある(合計85セッション=約9%・メディアは(not set))。外部の流入元ではなく、サイト内リンクに付けたutm_sourceが新しいセッションを作り、元の流入元(Google等)の帰属を隠していると読める(未確認・コードで該当リンクを特定していない)。
- 影響: ①流入元別の比較でGoogle等が過小に見える ②AI経由の割合(5.7%)の分母は変わらないが、AI経由の着地後の内部移動がここに埋もれうる。
- 対応: 本タスクでは直さない(UIは変えない・10/30まで変更を重ねない)。10/31以降に、内部リンクのutm付与箇所(utm_source=prefecture 等)を洗い出して、	rackのイベントパラメータに置き換えるかを判断する(要👤)。
