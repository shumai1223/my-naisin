# 掛-5 収益距離 第2周（GSC実測突合）— 2026-08-09

GSC(28日・378行・sc-domain:my-naishin.com)の`page`次元データを`revenue-distance-cycle1-2026-08-09.md`の構造距離表と突合。動的ルート(school-page等)は実URLをテンプレート(`/pref/[code]/school/[schoolCode]`等)にマッチさせて集計している。

- 突合できたGSC行: 378/378件（突合不能0件は下記参照）
- クリック配分: 距離1=9055(99.3%) / 距離2=61(0.7%) / 距離3+=0 / ∞=0

## 優先着手リスト（距離降順→クリック数降順・上位30テンプレート）

| 距離 | clicks | impressions | 実URL数 | ルート |
|---|---|---|---|---|
| 2 | 17 | 2372 | 1 | `/hensachi/gyakusan/hayamihyou` |
| 2 | 16 | 849 | 1 | `/total-score/mantenkan` |
| 2 | 6 | 154 | 33 | `/[prefecture]/naishin-omomi` |
| 2 | 5 | 105 | 1 | `/koukou-bairitsu` |
| 2 | 4 | 104 | 1 | `/heigan-yuugu/tokyo` |
| 2 | 3 | 194 | 1 | `/hensachi/moshi/ichiran` |
| 2 | 3 | 41 | 1 | `/naishin-kakusa` |
| 2 | 2 | 20 | 1 | `/about` |
| 2 | 2 | 26 | 1 | `/developers` |
| 2 | 1 | 45 | 1 | `/chousasho/kakikata` |
| 2 | 1 | 166 | 1 | `/heigan-yuugu` |
| 2 | 1 | 61 | 5 | `/hensachi/kyoka-betsu/[subject]` |
| 2 | 0 | 2 | 1 | `/blog/tag/[tag]` |
| 2 | 0 | 15 | 1 | `/chousasho/hyoutei` |
| 2 | 0 | 17 | 1 | `/chousasho/reibun` |
| 2 | 0 | 12 | 1 | `/for-teachers` |
| 2 | 0 | 7 | 1 | `/goukaku-happyo` |
| 2 | 0 | 15 | 1 | `/jikosaiten` |
| 2 | 0 | 8 | 1 | `/juken-toujitsu` |
| 2 | 0 | 4 | 1 | `/koukou-bairitsu/yomikata` |
| 2 | 0 | 7 | 1 | `/naishin-map` |
| 2 | 0 | 14 | 1 | `/naishin-oru` |
| 2 | 0 | 20 | 1 | `/nyushi-seido-henkou` |
| 2 | 0 | 32 | 2 | `/pref/[code]/school/[schoolCode]` |
| 2 | 0 | 4 | 1 | `/press` |
| 2 | 0 | 1 | 1 | `/report/2026` |
| 2 | 0 | 74 | 13 | `/report/2026/[prefecture]` |
| 2 | 0 | 39 | 1 | `/report/2026/en` |
| 2 | 0 | 12 | 1 | `/stats` |
| 2 | 0 | 2 | 1 | `/tarinai-taisaku` |

## 結論（第2周の主要な発見）

**実クリックの99.3%が既に距離1のページに着地しており、距離2は0.7%(61クリック)、距離3以上・∞は0クリック。** 上位2件（`/hensachi/gyakusan/hayamihyou`偏差値↔点数早見表・`/total-score/mantenkan`満点換算計算機）を個別に確認したところ、いずれも早見表・変換ツールという「早期ファネル」の静的参照ページで、リンク先は自分自身の本命計算機（`/hensachi/gyakusan`・`/total-score`＝いずれも距離1でParentLeadCTAを内蔵）に正しく1本ずつ繋がっていた。

**掛-5自身の禁止事項（「1ページに導線を足しすぎない」「足すより重複を減らす方が距離は縮む」）と、Σが確立した設計原則（「生徒はクリックしない＝結果を見せてからCTAを出す」順序を守る）に照らすと、これらのページに追加でCTAを埋め込むのは適切な修正ではない**。早見表・変換ツールは「答えを渡して本命計算機へ橋渡しする」役割が正しく、結果画面ではないページに保護者向けCTAを前倒しで出すのは、むしろΣ-2で確立した順序（①結果→②意味→③次にすべきこと→④費用）を壊すリスクがある。

**結論: 掛-5の「収益距離（グラフ構造上の到達可能性）」というレバーは、この時点でほぼ使い切った。** 残る距離2の61クリックは実害として無視できる規模であり、いずれのページも構造的には正しく設計されている。**第3周以降は「距離を縮める」作業ではなく、「距離1のページ(9,055クリック=99.3%)上のCTA自体が実際にクリックされているか」という掛-5のステップ5(計測)・元のΣ診断（`share_to_parent`0.99%等）に立ち返るべき**。これは`revenue-distance.ts`のグラフ計算では測れず、D1（`parent_funnel_events`・`school-click`等の既存テーブル）の実クリック率を見る必要がある。次回セッションはこの方向（D1実クリック率の県別/ページ別ブレークダウン）に着手すること。
