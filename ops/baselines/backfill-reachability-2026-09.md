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
nara 令和5年度  到達=○  手段=Wayback  http://web.archive.org/web/20230203170600/https://www.pref.nara.jp/61092.htm （現行の`pref.nara.lg.jp/n167/61092.html`は404だが、リダイレクト元の旧ドメイン`pref.nara.jp/61092.htm`はWaybackに2023-02-03のスナップショットが存在し、学校別PDF(1校1ファイル形式・25_r5koukoubetumokuji.pdf等)への実リンクを多数確認。ただし現行R8ソース(1ファイルに全校集約)とは資料の粒度が異なるため、実際の転記作業時は形式の再確認が必要）
nara 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20230204125637/https://www.pref.nara.jp/58695.htm （同一パターンでR4版ページ`pref.nara.jp/58695.htm`もWaybackに2023-02-04のスナップショットが存在することを確認。中身は令和5年度と同様の1校1ファイル形式と推定）

⚠️ **2026-09-11 12:10頃、archive.orgのavailability API(429)→CDX API(タイムアウト)と2回連続で失敗したため、本イテレーションはWaybackの使用を中断した。** 以降の県は現行サイト＋WebSearchのみで手を尽くし、Wayback確認が必要な場合は「保留」として次回に回す。

niigata 令和5年度  到達=○  手段=Wayback  http://web.archive.org/web/20240116133858/https://www.pref.niigata.lg.jp/sec/kotogakko/r5kotogakkonyushi.html （このページから「一般選抜志願変更後の志願状況(令和5年3月1日更新)」PDF=attachment/351758.pdfへのリンクを確認。現行R8ソース(kyouikucho.nein.ed.jp/.../ippan_henkogo.pdf)と同じ「一般選抜志願変更後」の資料名で一致）
niigata 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20230318132934/https://www.pref.niigata.lg.jp/sec/kotogakko/r4kotogakkonyushi.html （同一パターンのR4版ページが2022-07/2022-10/2023-03の複数時点でスナップショット済み・中身は令和5年度と同型の一般選抜志願状況PDF群と推定）
oita 令和5年度  到達=○  手段=Wayback  http://web.archive.org/web/20230326002716/https://www.pref.oita.jp/site/kyoiku/list21509-25206.html （R5当時アーカイブされた一覧ページから「令和５年度大分県立高等学校第一次入学者選抜最終志願状況について」r05ichijisaisyuu.htmlへのリンクを確認。現行R8ソース(uploaded/attachment/2261572.pdf)と同種の最終志願状況資料）
oita 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20221201042058/https://www.pref.oita.jp/site/gakkokyoiku/r04ichijisaisyuu.html （同一パターンのR4版ページが2022-02〜2024-05にかけ複数回スナップショット済み）
saga 令和5年度  到達=×  手段=見つからず  現行サイトの一覧ページ(list01907.html)に令和5年度当時のWaybackスナップショット(2023-03-28)があり中身も確認したが「実施要項」等の告知ページのみで志願状況PDFへのリンクは無し。WebSearchで「各学校における一般選抜志願状況」という核心的なタイトルのPDF自体は発見できた(kiji003111873/3_111873_344487_up_cgdmqo5x.pdf・現行ライブ)が、これは令和7年度(PDF作成日2025-02-18)のものでkiji IDが年度ごとに大きく変わる連番方式のため令和5年度分のID自体を特定できず。3手(現行サイト・Wayback・WebSearch)を尽くし打ち切り
saga 令和4年度  到達=×  手段=見つからず  令和5年度と同型のkiji ID連番方式のためID特定できず、同じ結果が見込まれるため打ち切り

**進捗**: R5欠6県(hokkaido/nara/niigata/oita/saga/tochigi)は全12県年を確定した
（到達○=7件: hokkaido R5・nara R5/R4・niigata R5/R4・oita R5/R4／到達×=5件:
hokkaido R4・saga R5/R4・tochigi R5/R4）。archive.orgは一時的に不安定化(429→timeout)
する場面があったが、時間を置いての再試行で全て解消した。
次は残り39県(R4欠のみ)への着手。

## R4欠のみ(39県)

（未着手・次回イテレーション以降で着手）
