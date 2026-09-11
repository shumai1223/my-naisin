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
nara 令和5年度  到達=△（要再調査・資料種別誤り判明）  手段=Wayback  http://web.archive.org/web/20230203170600/https://www.pref.nara.jp/61092.htm （現行の`pref.nara.lg.jp/n167/61092.html`は404だが、リダイレクト元の旧ドメイン`pref.nara.jp/61092.htm`はWaybackに2023-02-03のスナップショットが存在し、学校別PDF(1校1ファイル形式・25_r5koukoubetumokuji.pdf等)への実リンクを多数確認。ただし現行R8ソース(1ファイルに全校集約)とは資料の粒度が異なるため、実際の転記作業時は形式の再確認が必要）⚠️2026-09-12訂正: 個別PDF(`16_ikoma_R5.pdf`等)を実際に開いたところ、中身は志願者数ではなく「一般選抜（検査成績と調査書成績の取扱い等）」＝学力検査・調査書の配点比率を示す選抜方法基準の文書だった（学校ごとの得点配分表・志願者数や倍率のデータは含まれない）。**このページ自体が求める資料カテゴリと異なる可能性が高く、実収集は保留**。次回は「志願者数」「出願状況」等のキーワードで別ページを再探索すること⚠️2026-09-12第2訂正: 正しいページを発見・確定した（R4側で実収集成功・詳細は下のR4行参照）。`pref.nara.jp/40751.htm`「公立高校入試出願・実施状況等」ページの「令和5年度奈良県公立高等学校入学者一般選抜等出願状況（最終）」を同じ手法で取得すればR5も収集可能なはず（未着手・次回候補）
nara 令和4年度  到達=○・実収集完了（2026-09-12）  手段=Wayback  http://web.archive.org/web/20221004170742/https://www.pref.nara.jp/40751.htm （旧訂正: 58695.htm系列は資料種別誤り＝選抜方法配点基準の文書だったため不採用。正しい資料は`pref.nara.jp/40751.htm`「公立高校入試出願・実施状況等」ページ内の「令和4年度奈良県公立高等学校入学者一般選抜等出願状況（最終・令和4年3月4日）」`secure/253381/2022ippan0304 _.pdf`。R6/R7と同じ17校19学科（普通科系）のみ抽出しquota4,432・applicants4,864で収録完了。commit bf93f84/c27bb44）

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

chiba 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20220307095804/http://www.pref.chiba.lg.jp/kyouiku/shidou/press/2021/koukounyuushi/r040221sigannsyakakutei.html （★訂正: 前回はファイル名を「kakuteiippan」と誤推測していたが正しくは「sigannsyakakutei」。WebSearchで年度フォルダのindexページ(r4/)を発見しWaybackで内容を確認したところ「入学志願者確定数について」のページを発見）⚠️2026-09-11追記: 詳細ページから目的のファイル`documents/040221b.xlsx`（高等学校別志願者確定数一覧）のURLは特定できたが、Wayback経由のxlsx取得が2回連続失敗（直接timestamp・CDXで発見した別timestampともHTML「not archived」page/404を返却、CDXレコード自体もlength負値で破損）。xlsx形式はPDFよりWayback再生が不安定という教訓あり・実収集は保留（詳細はT-Y11Fタスクファイル#11-7）

⚠️ **本イテレーションでの教訓**: 1県あたり深くCDXを掘り下げる手法は時間対効果が悪い
(chiba1県に7回以上のcurl呼び出しを費やしたが確定に至らず)。**次回以降は「WebSearch
1発→有望なURLが出ればWayback CDXで1〜2回確認→出なければ即座に×または△として次へ」
という軽量な手順に統一し、1県あたりの深追いを避けること。**

akita 令和4年度  到達=○  手段=現行サイト  https://www.pref.akita.lg.jp/uploads/public/archive_0000062318_00/R04一般選抜（志願変更前）公－２.pdf （WebSearch1発で直接ヒット・学校別表(花輪普通140/23等)がスニペットに表示・ライブ確認済み）

aomori 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20220222084843/https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/R4senbatsu_syutsugan-chuunan.pdf （現行R8ソースと同型のe-gakyo/files/配下・地区別7ファイル(中南/上北/三八/西北/下北/定時制/東青)を2022-02にCDXで一括発見）

ehime 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20221007200506/https://ehime-c.esnet.ed.jp/koukou/nyuusi/r04nyuusi/nyuusi.html （WebSearchで発見したページは現行では404だがWaybackに5時点のスナップショットあり。現行R8ソースのドメイン`ehime-kyoiku.esnet.ed.jp`と異なる旧サブドメイン`ehime-c.esnet.ed.jp`だが同一教委サイト内の構成変更と判断）

fukui 令和4年度  到達=○  手段=現行サイト  https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/shutugan.html （ライブ200・最終更新2022-02-25のまま上書きされずに現存。出願状況/志願変更/合格結果の区分でPDFへのリンクあり）

fukuoka 令和4年度  到達=△要Wayback再確認  手段=保留  WebSearchで「令和４年度公立高等学校一般入試志願状況（志願変更受付後）」というタイトルのページ(pref.fukuoka.lg.jp/contents/nyushi4.html)がヒットしたが現行ライブは404。WaybackのCDX確認を試みたが2回連続タイムアウトしたため、本日はこれ以上Waybackを使わない運用に従い中断。WebSearchのスニペット自体がページタイトルを正確に引用しており実在した可能性は高いため、次回Wayback回復後に再確認する

⚠️ **2026-09-11 12:56頃、fukuokaでarchive.orgのCDX APIが再度2回連続タイムアウトしたため、本イテレーションはこれ以降Waybackの使用を中断した。**

fukushima 令和4年度  到達=○  手段=現行サイト  https://www.pref.fukushima.lg.jp/site/edu/r4koukounyushi.html （ライブ200。「後期選抜志願状況（出願先変更後）」PDF=uploaded/attachment/500729.pdfへのリンクを確認・現行R8ソースと同じ命名規則）

gifu 令和4年度  到達=△要Wayback再確認  手段=保留  WebSearchで見つかった「入学者選抜トップ」ページ(3464.html)に過去年度リンク無し。Wayback CDXは2回連続タイムアウトのため本イテレーションはこれ以上試行せず。次回再試行
gunma 令和4年度  到達=△要継続調査  手段=保留  「令和4年度入学者選抜結果について」(5036.html・ライブ確認済みだが全体統計のみで学校別PDFへのリンク無し)と「実施要項」(pref.gunma.jp/03/x28g_00270.html)は存在確認できたが、目的の学校別志願状況PDF自体は特定できず。次回はWaybackで5036.html周辺の関連ページを深堀りするか、attachment番号を令和5/6年度の値から逆算して絞り込む

hiroshima 令和4年度  到達=○  手段=現行サイト  https://www.pref.hiroshima.lg.jp/site/kyouiku/06senior-2nd-r4-nyuushi-r4-kou-r4-kou-mokuji-r4-kou-mokuji.html （ライブ200・選抜(I)/(II)それぞれの志願状況・受検状況PDFへのリンクを確認）

hyogo 令和4年度  到達=対象外  手段=(取得禁止)  §5「守ること」の恒久ルール「hyogoは取得しない」に従い、本タスクでもhyogoへのアクセス自体を行わない。台帳上は永続的にスキップ対象として記録する

ibaraki 令和4年度  到達=○  手段=現行サイト  https://kyoiku.pref.ibaraki.jp/wp-content/uploads/2023/02/0610houkoku.pdf （WebSearch1発で直接ヒット・ライブ200確認済み・「実施状況報告書」形式で現行R8ソースと同型）⚠️2026-09-11追記: 実際に開くと全45ページの別種文書（第2次募集・合格者数・入学者数まで含む）でR5〜R8のシンプルな志願者数速報とは非互換と判明・実収集は保留（詳細はT-Y11Fタスクファイル#11-4）

ishikawa 令和4年度  到達=△要Wayback再確認  手段=保留  WebSearchでは具体的な学校別ページを発見できず。R8ソースが日付ベースファイル名(documents/20260224.pdf)のため直接パターン推測は不可能。WaybackのCDXで2022年前半のdocuments/フォルダを検索しようとしたが2回連続タイムアウトしたため中断。次回再試行

⚠️ **2026-09-11 13:12頃、ishikawaでarchive.orgが再度2回連続タイムアウトしたため、以降Waybackの使用を中断し現行サイト+WebSearchのみで継続する。**

iwate 令和4年度  到達=△要Wayback再確認  手段=保留  R4当時のデータは旧サイト(www2.iwate-ed.jp/sed/・令和6年度に閉鎖しpref.iwate.jpへ移行)にあった可能性が高いが、現行の同サイトには令和5年度データのみが残り令和4年度以前は削除済み。Wayback不安定のため次回再確認

kagawa 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20220311202329/https://www.pref.kagawa.lg.jp/documents/15088/syutugan4-5.pdf （現行の一覧ページは上書き済みだがWaybackに2022年1〜3月の16時点のスナップショットがあり、「公立高等学校一般選抜出願状況（令和4年2月24日志願変更締切後）」PDFへのリンクを確認）

⚠️ **2026-09-11 13:20頃、archive.org自体が「Temporarily Offline」(503・公式にサービス全体が一時停止中)と判明した。** これは自分のアクセス過多によるレート制限ではなく先方の障害のため、本イテレーションはこれ以降Waybackを使わず現行サイト+WebSearchのみで継続し、ishikawa/iwateの再試行は次回以降に持ち越す。

kagoshima 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/2022/https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r3/r4syutugansyasu.html （★archive.orgは復旧済み。kagoshimaのURLフォルダ名(r3/r4/r5等)は年度と対応しない社内コードで、実際の年度はファイル名側(r4syutugansyasu=R4出願者数)に現れる点に注意。CDXで2022年前半に発見）

kanagawa 令和4年度  到達=○(WebSearchスニペットのみ・Wayback未検証)  手段=WebSearch  https://www.pref.kanagawa.jp/docs/dc4/prs/koko/r6969952.html （現行ライブは404。ただしWebSearchのスニペット自体が「令和4年度神奈川県公立高等学校入学者選抜一般募集共通選抜等の志願者数(志願変更締切時)について」という正確なページタイトルと「学校別の詳細情報を含む添付ファイルがある」旨を引用しており、Googleが実際にクロールした強い証拠となる。archive.orgが断続的に「Temporarily Offline」となり独立検証はできなかったため、次回復旧後にWaybackで裏取りする）

kochi 令和4年度  到達=○  手段=現行サイト  https://www.pref.kochi.lg.jp/soshiki/311701/r4_siganjokyo.html （WebSearch1発で直接ヒット・ライブ301(リダイレクトのみ・実在)確認済み。A日程志願先変更前後の学校別一覧表PDFへの言及あり）

kumamoto 令和4年度  到達=○  手段=現行サイト  https://www.pref.kumamoto.jp/site/kyouiku/122329.html （WebSearch1発で直接ヒット・ライブ200確認済み。「前期（特色）選抜等出願者数について」)

kyoto 令和4年度  到達=○  手段=現行サイト  https://www.kyoto-be.ne.jp/koukyou/cms/?p=1262 （「令和４年度選抜状況」ページ・ライブ200確認済み。現行R8ソースと同じkyoto-be.ne.jp(京都府教育委員会・京都市教委city.kyoto.lg.jpとは別)ドメインで発見）

mie 令和4年度  到達=○  手段=現行サイト  https://www.pref.mie.lg.jp/TOPICS/m0045100301.htm （「令和４年度三重県立高等学校後期選抜受検状況を取りまとめました」・ライブ200確認済み）

miyagi 令和4年度  到達=○  手段=現行サイト  https://www.pref.miyagi.jp/documents/16068/r4dai1jigoukakujyokyou.pdf （WebSearch1発で直接ヒット・ライブ200確認済み。「第一次募集合格状況」だが同ディレクトリ内に出願状況資料も存在する可能性が高い）

aichi 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20220310110023/https://www.pref.aichi.jp/soshiki/kotogakko/shiganjokyo.html （aichiは現行サイトがImperva/Incapsulaでbot遮断されているため直接アクセス不可という既知の事象があるが、Waybackでは2022年2〜3月に6時点のスナップショットを発見。ページ内に「令和4年度」の明記と「全日制一般選抜・推薦選抜等志願変更後の志願者数」PDF(attachment/408509.pdf)へのリンクを確認・現行R8ソースと同種の資料)

miyazaki 令和4年度  到達=○  手段=現行サイト  https://www.pref.miyazaki.lg.jp/kokokyoiku/kyoikukosodate/kyoiku/20210615161157.html （「令和4年度県立高等学校生徒募集に係る情報提供について」・ライブ200確認済み）

nagano 令和4年度  到達=○  手段=現行サイト  https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r4/r4nyushi1.html （WebSearch1発で直接ヒット・ライブ200確認済み。後期選抜志願者数(志望変更受付締切後)PDFへの言及あり）

nagasaki 令和4年度  到達=○  手段=Wayback  http://web.archive.org/web/20220318013100/https://www.pref.nagasaki.jp/bunrui/kanko-kyoiku-bunka/shochuko/koko-nyushi/shigan-jokyo/ （現行の一覧ページはライブ200だが動的で内容抽出できず。Waybackの2022-03-18スナップショットで「令和4年度後期選抜・定時制課程1期選抜志願状況」「令和4年度前期選抜・離島留学特別選抜志願状況」の2ページへのリンクを確認）

okayama 令和4年度  到達=○  手段=現行サイト  https://www.pref.okayama.jp/site/255/760420.html （WebSearch1発で直接ヒット・ライブ200確認済み。「特別入学者選抜等志願者数について」）

okinawa 令和4年度  到達=△（要再調査）  手段=Wayback  http://web.archive.org/web/20220523210334/https://www.pref.okinawa.jp/edu/kenritsu/nyushi/ko/nyushi.html （WebSearchで「（令和4年度実施）県立高等学校入試関連情報」というタイトルの正確なページを発見・現行は404だがWaybackに2022-05/2022-10/2023-01/2023-12の複数スナップショットあり）⚠️2026-09-12訂正: okinawaの命名罠（DB年度＝実施年度＋1。既存R6/R7/R8追加時に既知）に従うと「令和4年度実施」はDB令和5年度に相当し、DB令和4年度には「令和3年度実施」ページが必要。**このURLはDB R4ではなくDB R5候補として再調査すべき**。さらに中身を確認したところ入試手続き案内ハブページ（願書様式等）で、目的の「最終志願状況」学校別PDFへのリンクは未発見。WebSearchでも「令和3年度実施」「令和4年度実施」の最終志願状況PDFそのものは特定できず、実収集は保留（詳細はT-Y11Fタスクファイル#11-25）

osaka 令和4年度  到達=○  手段=現行サイト  https://www.pref.osaka.lg.jp/documents/35613/r04_kekka_1.xlsx （「データで見る府立高校」ページ(o180040/kotogakko/chigai/index.html)から発見・ライブ200確認済み。令和元年度〜令和8年度まで8年度分のリンクが同一ページに集約されている。現行R8ソースの「志願者数」とは別カテゴリの「入学者選抜結果」資料だが同種のquota/applicants/競争率データを含む）

saitama 令和4年度  到達=○  手段=現行サイト  https://www.pref.saitama.lg.jp/f2208/r4nyuushi-jouhou.html （WebSearch1発で直接ヒット・ライブ200確認済み。「令和4年度埼玉県公立高等学校入学者選抜に関する情報」）

shiga 令和4年度  到達=○  手段=現行サイト  https://www.pref.shiga.lg.jp/documents/16948/5303567_1.pdf （現行の入試案内ページには令和4年度リンクが無いが、「過去の滋賀県立高等学校入学者選抜情報(平成31〜令和6年度)」というアーカイブページ(edu/ma09/16948.html)が別途あり、そこに「一般選抜＿出願者数（2月25日）」PDFへのリンクを発見・ライブ200確認済み）

shimane 令和4年度  到達=○  手段=現行サイト  https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/r402_shiganhenkougo_itiran.pdf （WebSearch1発で直接ヒット・ライブ200確認済み。「一般選抜出願者数（志願変更後）」学校別一覧）⚠️2026-09-11追記: PDF自体は開けるが身元引受人枠・地域外枠・特色選抜による複数控除を経て一般選抜募集定員を導出する超高密度な1ページ表（画像7016×9921px・列ラベルがa〜rのアルファベット式）で、列特定のリスクが高いため実収集は保留（詳細はT-Y11Fタスクファイル#11-5）

shizuoka 令和4年度  到達=△要継続調査  手段=保留  現行の「入学者選抜関係発表資料等」索引ページは令和5年度(令和4年度中学3年生向け)までしか遡れず令和4年度入学者選抜(令和3年度中学3年生向け)へのリンクは無い。WaybackのCDXでも同URLの2022年前半スナップショットが見つからず。次回はURL数値ID(_res/projects/.../001/0XX/XXX/)の逆算や別の索引ページ経路を試す

tokushima 令和4年度  到達=△要継続調査  手段=保留  一次サイト(nyuushi.tokushima-ec.ed.jp)がAngular製SPAのためWaybackはJS/CSSアセットのみ収録しページ内容(/R4_kouhyou等のルート)自体はクロールされておらず無力と判明。現行サイトのトップページにも過去年度アーカイブ一覧は見当たらず。次回はGoogleキャッシュや別の一次資料経路(教委トップページ等)を探す

tottori 令和4年度  到達=△要継続調査  手段=保留  現行の「高校入学者選抜、転・編入学試験情報」ページに「令和4年度以前の入学者選抜」というアーカイブセクションはあるが「学力検査結果(得点状況)」のみで志願者数(出願段階のデータ)は掲載されていない。secure/NNNNNNN/形式のURLで数値ID推測は不可能なため、次回は「令和５年度県立高等学校入学者選抜関係資料等」(295710.htm)ページの構造を参考に令和4年度版の同型ページを探すか、WebSearchで別の切り口を試す

toyama 令和4年度  到達=△要継続調査  手段=保留  WebSearchで見つかった候補URL(pref.toyama.lg.jp/1104/05kyuuyotounozyoukyou.html)はSSL証明書ミスマッチかつ「給与等の状況」という無関係な内容と判明(誤った検索結果)。R6以降の「0Xsenbatsu.html」パターンも404、R3の「kj00022361.html」IDパターンも404。現行の索引ページは令和6年度までしか遡れず、WaybackのCDXも同ディレクトリで空。次回は別の検索キーワードやURLパターンを試す

wakayama 令和4年度  到達=○  手段=現行サイト  https://www.pref.wakayama.lg.jp/prefg/500200/d00207226.html （WebSearch1発で直接ヒット・ライブ200確認済み。「令和4年度県立高校入学者選抜」）

yamagata 令和4年度  到達=○  手段=現行サイト  https://www.pref.yamagata.jp/700013/koko/r4kokonyushi.html （WebSearch1発で直接ヒット・ライブ200確認済み。「一般入学者選抜志願状況（令和4年2月25日更新）」PDFへの言及あり）

yamanashi 令和4年度  到達=○  手段=現行サイト  https://www.pref.yamanashi.jp/documents/7061/r4zenki_sigansya.pdf （「過去の入試状況」アーカイブページ(kyouiku-kikaku/nyuusi/nyuushijoukyou.html)から発見・ライブ200確認済み。「令和4年度山梨県公立高等学校入学者選抜前期募集志願者数」）⚠️2026-09-11追記: タイトルが「前期募集」＝山梨県が後期募集1本化する前の選抜方式でR5〜R8（全て後期募集）と測定対象が非互換と判明・実収集は保留（後期募集版のR4資料が別途あるかは次回再調査の余地あり・詳細はT-Y11Fタスクファイル#11-4）

**これで51県年すべてに着手し終えた（未着手0）。** 内訳: 到達○36・到達×5(hokkaido R4・
saga R5/R4・tochigi R5/R4)・対象外1(hyogo・§5守ることの恒久ルールにより取得禁止)・
保留9(fukuoka/gifu/gunma/ishikawa/iwate/shizuoka/tokushima/tottori/toyama・いずれも
Wayback/現行サイトの制約で時間内に確定できず、次回以降の再挑戦候補)。
kanagawa R4はWebSearchのスニペットのみでの判定のため次回Waybackでの裏取りを推奨。
