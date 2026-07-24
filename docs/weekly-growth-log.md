# 週次成長ログ（ZZ-2c・週次1実験の定常運転）

GSC/GA4実測→仮説→実装→judgeWinner評価→採否を毎週1本記録する。実験ゼロの週を作らない。
¥予測は書かない（実測・CPA・先行指標のみ）。

## 2026-07-24

**きっかけ**: loop-question-note記載のL-4（2026-07-23発見）で「実験ローテーション4件が30日超で未決着」
「GA4側の計測設計に限界がありjudgeWinnerを実行できない」とされていたため、実際にGA4 MCPで
再検証した。

**実行した検証**:
1. `customEvent:variant`がGA4のカスタムディメンションとして登録済みであることを`ga4_metadata`で確認。
2. `customEvent:placement`も登録済みと確認。
3. `ga4_run_report`（dimensions: eventName, customEvent:placement, customEvent:variant／2026-06-16〜today）
   を実行し、cta_view/affiliate_click/lead_submitをvariant別に取得できることを実証した
   （L-4の「セッション結合が必要で不可能」という結論は誤りだった＝実際にはvariantが変換イベント自体に
   直接載る設計(S-6/T-2)のため単純な平坦集計だけで判定可能）。

**発見した本当のボトルネック（L-4の誤診断を訂正）**:
GA4側の制約ではなく、**`experiments.ts`に`status: 'running'`として登録された実験のうち複数本が、
実際のページ実装では`ParentLeadCTAExperiment`（A/B割当ラッパー）ではなく素の`ParentLeadCTA`
（コントロール固定）のまま配線されていなかった**ことが判明した。実測データ（2026-06-16〜今日・
cta_view合計約2,000件）のほぼ全件が`customEvent:variant=(not set)`で、variant付きの行はごく僅か
（parent-lpのurgent=6件・control=1件等）——30日以上「running」のまま実質ゼロデータだった。

具体的な配線漏れ:
- `hiyou-copy-2026`（2026-06-17開始）: `/hiyou/page.tsx`が素の`ParentLeadCTA`のまま
- `result-offer-2026`（2026-06-17開始）: `/plan/page.tsx`・`/reverse/ReverseClient.tsx`が
  素の`ParentLeadCTA`のまま（`/hyouka-kijun/page.tsx`は独自heading/bodyを渡す設計のため
  意図的に対象外と判断＝コピー同一・オファーのみ差し替えという実験設計と矛盾するため）
- `hogosha-cta-text-2026`のみ`/hogosha/page.tsx`で正しく`ParentLeadCTAExperiment`配線済み
  （このため僅かながらurgent/controlのデータが存在した）

**今回の対応**: `hiyou-copy-2026`と`result-offer-2026`を実際に`ParentLeadCTAExperiment`へ配線し直し、
今日から本当にA/B割当が始まるようにした（push予定）。lead-copy-2026は`SaveResultCTA.tsx`側で
最初から正しく配線されていたが、絶対数（lead_submit全体で28日累計2件）が少なすぎて判定不能
（データ不足・打ち切りではなく継続）。

**判定（judgeWinner）**: 実施せず。上記の通りhiyou-copy-2026/result-offer-2026は今回の配線修正
以前のデータが実質ゼロで判定不能・lead-copy-2026は絶対数不足。**配線修正が完了した今日を実質的な
実験開始日として扱い、30日ローテーション判定はここからカウントし直す**のが正しい（バックログの
startedAtは次回のloop-question-note整理時に是正予定）。

**次回以降**: 数週間データを貯めてから、この3実験（+hogosha-cta-text-2026）のjudgeWinnerを
GA4 MCP実測で回す。同時に、他の`running`実験も同様の配線漏れがないか横断監査する価値がある
（今回は時間の都合で4件のみ確認・全件監査は次回以降）。

## 2026-07-24（同日続き・ZZ-5b共有計装）

**やったこと**: 橋②（生徒→保護者）の共有計装を強化。`share_to_parent`（=share_click）の
track呼び出し全4箇所（ParentShareLinkButton/JukuShindanClient/UnlockGate）に`medium`
パラメータ（'native'|'copy'|'line'|'x'）を追加。加えてLINE/X個別共有リンク（LINE it!公式
share URL・X intent URL）を新設し、navigator.share()では判別不能だった送り先を、この2経路
だけは確定させて計測できるようにした。

**副産物で発見したバグ**: `/hogosha`の`generateMetadata`（OGP再生成）がZZ-5aで追加した
percentile/percentileScopeを転記し忘れており、**LINE/X等でリンクとして共有されOGPが
展開される経路でのみ「県内位置」チップが消える**バグを発見・修正した（クライアント側の
`<img>`直接表示は最初から正しく表示されていたため気づきにくい種類の欠落だった）。

**共有率の定義（次回以降のjudge対象）**: 分母=`save_result_cta_view`（ZZ-2d・保護者バトン導線
への到達数）・分子=`share_to_parent`のmedium別合計。`weekly-kpi-report.ts`に`shareClicksByMedium`
を追加済み（`scripts/weekly-kpi-report.ts --share-clicks=native:20,copy:5,line:10,x:5`で
週次レポートに「共有率」として自動表示される）。**今回はまだ実装直後で実測データが無いため、
数値でのjudgeは次回以降**（GA4カスタムディメンション`customEvent:medium`が新規登録扱いになる
可能性があるため、次回はまずga4_metadataで登録済みか確認してから集計すること）。

## 2026-07-24（同日続き・トリップワイヤー定点確認+W-16マイニング）

**実行した検証**: GSC MCP（sc-domain:my-naishin.com・28日=6/23-7/21）とGA4 MCP（28日イベント
集計）でTIER 0策定時に固定した4本のトリップワイヤーを定点確認した。

**GSC実測**: 総計clicks 10,755 / impressions 244,356 / CTR 4.40% / 平均順位6.10。トリップワイヤー
④「内申点 計算」head CTR: clicks 609 / imp 6,085 / CTR 10.0% / pos 3.13——半減の兆候なし・健全。

**GA4実測（イベント別28日累計）**: `ai_referral` 65件 / `session_start` 1,750件 ≈ シェア約3.7%。
トリップワイヤー③の閾値10%に対し大きく余裕あり。`parent_landing_view`は5件（依然として絶対数は
少ないが0ではない）。

**判定**: 4本とも閾値抵触なし（正当なnull）。

**W-16副産物（記録のみ・アクション見送り）**: GSCクエリマイニングで「500点満点中 偏差値 計算」
（imp455/CTR4.6%/pos7.3）が専用ページ`/hensachi/mantenkan`でなく`/hensachi`に着地する検索意図
ミスマッチを発見。`HensachiClusterNav`に既にmantenkanへの誘導文言（「500点・1000点満点など
100点満点以外のテスト・模試に対応」）が実装済みと確認済みのため、追加すべき内部リンクは無い
（ページ構造上は既に正しく連携済み・単純にGoogleがまだ`/hensachi`を優先表示しているだけと判断）。
`/hensachi`は2026-07-17編集済みで次回編集可能日2026-08-07のため、title/meta側の追加改修は
それ以降に再検討する。
