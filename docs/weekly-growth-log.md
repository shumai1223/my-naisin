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
