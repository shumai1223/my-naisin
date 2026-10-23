# AI向けの構造の点検(T-AI1 I-2・2026-10-24)

本番(https://my-naishin.com)を実際に取得して確認した。直したのは**古い記述だけ**(文言のみ・挙動は変えない)。

## 本番の応答
| 対象 | 結果 |
|---|---|
| /llms.txt | 200 text/plain・12,614バイト。**リポジトリの `public/llms.txt` とバイト一致**(デプロイ済み) |
| /robots.txt | 200。AI検索・ユーザー取得系(OAI-SearchBot・ChatGPT-User・Claude-User・Claude-SearchBot・PerplexityBot 等)は Allow: / 、学習専用(GPTBot・ClaudeBot・Google-Extended・CCBot 等)は Disallow: /。**方針は変更なし** |
| /sitemap.xml | 200・約640KB |
| /api/mcp | 200。`tools/list` が **27ツール**(llms.txtの「27ツール」と一致) |
| /api/openapi | 200 application/json |
| /api/status | 200(データセット version 2026.1・47都道府県・総合得点計算機5) |
| /api/naishin ・ /api/naishin/csv | 200 |
| /api/competition-rates ・ /api/competition-rates/akita | 200(掲載許諾済み12県・5,697件) |
| /api/competition-rates/wakayama | **404**(掲載拒否県が出ない=意図どおり) |
| /api/stats/distribution | 400(パラメータ必須。異常ではない) |
| /llms-full.txt ・ /.well-known/mcp.json | 404(存在しない。必須ではないので作らない) |

## 見つかった古い記述と対応
| # | 場所 | 内容 | 対応 |
|---|---|---|---|
| 1 | `public/llms.txt` 13行目 | 倍率計算の説明に「**学校別実数は非掲載**」とあった。実際は学校ページで学校別の募集人員・応募者数・倍率を掲載しており、同じファイルの55〜56行目(学校別競争率API)とも矛盾していた | 「学校ごとの募集人員・応募者数・倍率は教委の公表資料を出典明記で転記して学校ページに掲載(計算で作らない・最新の正式な発表は各教委が最優先)。学校別の合格ライン(ボーダー)は一次情報が無いため非掲載」に修正 |
| 2 | `public/llms.txt` 55行目 | 学校別競争率APIが「全47都道府県」。和歌山県は県の意向で非掲載(2026-10-12)のため46 | 「掲載対象の46都道府県＝和歌山県は県の意向により非掲載」に修正 |
| 3 | `src/app/api/openapi/route.ts` 348・369行目 | 「全47都道府県版」(同じ理由) | 「掲載対象の全都道府県版(和歌山県は県の意向により非掲載)」に修正 |
- 影響: 文言のみ。openapi の route テスト(2件)は緑。次のデプロイ(pushは1日1回の枠)で本番に反映される。**このコミットは push していない**。
- 未確認で触っていないもの: 「Q&A 259件」の件数文言(数えていない)。
- 確認して問題なしだったもの: MCPのツール数(27)・「47都道府県の内申点計算方式」(内申点の方式は47県全てで正しい。和歌山の件は倍率データのみ)・Dataset メタ(`naishin-dataset.ts`・内申点の方式のデータセットなので47県で正しい)・「学校別の合格基準は非掲載」(今も事実)。

## 直さずに報告するもの(判断が要る)
1. **robots.txt の `*` グループで `/api/competition-rates` が許可されていない。** `Allow` 一覧に無く、`Disallow: /api/` に含まれる。llms.txtは無料のCSV/JSONとして案内しているのに、`*` を守る一般のクローラーには禁止になっている(AI検索系のUAは `Allow: /` なので影響は小さい)。さらに `Disallow: /*?*` により `?target=` や `?fiscalYear=` 付きのURLも `*` には禁止。→ `Allow: /api/competition-rates` の1行追加は低リスクだが、robotsの変更は方針に関わるので👤の判断(10/31以降)。
2. **llms.txt に学校ページ(`/pref/{県}/school/{コード}`)の説明が無い。** AI経由の着地は今はツール中心(ベースライン参照)だが、倍率の山(2月)に向けて、学校ページの存在・出典・更新の仕方を1行足す価値がある。追加は「古い記述を直す」の範囲外なので、I-3の点検のあとで判断。
3. 年度表記: /api/status の `fiscalYear` は「2026年度入試(令和8年度入学者選抜)」。令和9年度の数字を載せる時期(2月)と、12月の年号更新(P-8)に合わせて見直す対象(今は正しい)。
