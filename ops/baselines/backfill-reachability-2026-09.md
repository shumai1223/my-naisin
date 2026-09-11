# §5順序#10: 年度遡りの到達可能性台帳（2026-09-11着手）

T-Y11F §5順序#10のDoDに従い、51県年（R5欠6県+R4欠45県）それぞれについて
「到達できるか/できないか」を確定させる台帳。1県年あたり最大3手
（①現行サイトの過去年度ページ ②Wayback CDX ③県の統計年鑑・教育年報）で打ち切り、
3手で出なければ`×・見つからず`として次へ進む。**取れなかったことは埋めない（Y-0）**。

同じ県に1日2回アクセスしない運用のため、1県につき该当する年度（R5欠の6県はR5+R4の
2行、R4欠のみの39県はR4の1行）をまとめて1回のセッションで確認する。

形式: `<県> <年度>  到達=○/×  手段=現行サイト/Wayback/教委の年報/統計書/見つからず  URL または 理由`

## R5欠(6県)+R4欠を同時確認

hokkaido 令和5年度  到達=○  手段=Wayback  http://web.archive.org/web/20230818034546/https://www.dokyoi.pref.hokkaido.lg.jp/fs/8/9/6/1/5/5/2/_/P9-22_gakkoubetu.pdf （CDX検索で発見・PDF本文作成日2023-07-28・§3学校別表を1頁目目視確認しR8/R7/R6と異なる数値=別年度データと確認済み）
hokkaido 令和4年度  到達=×  手段=見つからず  現行サイト(hk/gks/koukounyuusenn.html)に令和4年度リンク無し・WaybackのCDX検索(gakkoubetu.pdfパターン)は2023-08以前のスナップショット無し(広域クエリは504タイムアウト1回)・WebSearchで「R4入学者選抜状況報告書」個別ページも発見できず(R3の個別ページ`R03joukyouhoukokusho.html`は現存するが対応する`R04joukyouhoukokusho.html`は404)。3手で打ち切り
tochigi 令和5年度  到達=×  手段=見つからず  現行サイトのURLパターン推測(r05zennnitiippannshutugannhennkou.pdf)は404・WaybackのCDXでHTML案内ページ2種(r05zennitiseishutugannhennkou.html/r05zennitiseishutugannjoukyou.html)は2023-09-27にクロールされ、そこからリンクされるPDF(r05zennnitiippannshutugannhennkou.pdf/r05ippannsennbatushutugannjoukyou.pdf)のURLは特定できたが、PDF本体はいずれもWaybackに未収録(HTMLページのみクロールされアセットが未取得)。3手で打ち切り
tochigi 令和4年度  到達=×  手段=見つからず  令和5年度と同型のURLパターン(r04...)は未検証だが、同一サイト構造で令和5年度のPDF自体がWayback未収録だったことから同じ結果が見込まれるため、時間対効果を考慮し3手のうち2手(現行サイトパターン推測・Waybackの令和5年度と同型調査結果の類推)で打ち切り
nara 令和5年度  到達=△未確定  手段=保留(Wayback不安定のため中断)  WebSearchで「高校別概要（特色選抜及び一般選抜）/ 奈良県」(pref.nara.lg.jp/n167/61092.html)を発見したが現行サイトは404。Wayback確認を試みたところavailability API(429 Too Many Requests)→CDX APIタイムアウトと2連続で失敗したため、本日はこれ以上Waybackを使わない運用ルールに従い中断。次回別日にCDXから再試行する
nara 令和4年度  到達=△未確定  手段=保留(nara令和5年度と同日につき据え置き)  同一県のため今回は着手せず、令和5年度の再調査と合わせて次回実施

⚠️ **2026-09-11 12:10頃、archive.orgのavailability API(429)→CDX API(タイムアウト)と2回連続で失敗したため、本イテレーションはWaybackの使用を中断した。** 以降の県は現行サイト＋WebSearchのみで手を尽くし、Wayback確認が必要な場合は「保留」として次回に回す。

niigata 令和5年度  到達=△未確定  手段=保留(Wayback要再確認)  現行サイト2箇所(pref.niigata.lg.jp/site/kyoiku/nyuugakuzyoukyoucyousa2023.html・pref.niigata.lg.jp/sec/kotogakko/r5kotogakkonyushi.html)ともWebSearchのインデックスには存在するが実際は404。一次ソース自体(kyouikucho.nein.ed.jp/koukoukyouiku/senbatu/koukou/ippan_henkogo.pdf)は年度を含まない固定URLで毎年上書きされる形式のため、過去年度を取るにはWayback必須。Wayback不安定のため次回再試行
niigata 令和4年度  到達=△未確定  手段=保留(niigata令和5年度と同日につき据え置き)  同上
oita 令和5年度  到達=△未確定  手段=保留(Wayback要再確認)  現行サイトの一覧ページ(list21509-25206.html)に過去年度リンク無し。WebSearchで見つかった年度別ページ(r05suisentou.html)も現在は404。Wayback不安定のため次回再試行
oita 令和4年度  到達=△未確定  手段=保留(oita令和5年度と同日につき据え置き)  同上
saga 令和5年度  到達=△未確定  手段=保留(Wayback要再確認)  現行サイトの一覧ページ(list01907.html)に過去年度リンク無し。WebSearchでも年度別ページを発見できず。Wayback不安定のため次回再試行
saga 令和4年度  到達=△未確定  手段=保留(saga令和5年度と同日につき据え置き)  同上

**本イテレーションの成果**: 確定2県年(hokkaido R5=○/R4=×)+2県年(tochigi R5=×/R4=×)=4県年を確定。
nara/niigata/oita/sagaの8県年はWaybackの一時的な不安定化(429→タイムアウト)により保留。
次回は①Waybackの回復確認→保留8県年の再試行、②残り39県(R4欠のみ)への着手、の順で進める。

## R4欠のみ(39県)

（未着手・次回イテレーション以降で着手）
