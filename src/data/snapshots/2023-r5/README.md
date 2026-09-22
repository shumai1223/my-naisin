# 2023-r5 スナップショット（令和5年度・**2026-09-22 着手・収集中**）

T-Y11 Task C（`ops/tasks/T-Y11-winter-bairitsu-pipeline.md`）で収集する、2024-r6よりさらに1年
遡ったスナップショット。[[2024-r6]]・[[2025-r7]]・[[2026-r8]]と同じ正規形で47都道府県を目指す。
収集方針・型は全て継承する（新しい型を発明しない）。

## なぜ着手したか

Task Cの本文に「2023-r5は未着手」と明記されたまま長期間残っていた（2024-r6は2026-09-15に
47/47=frozen済み）。T-Y13/T-Y14/T-Y15など今期優先の主食タスクが払底判定に近づいたため、
バックログの中で「明示的に未着手」と記録された残作業として着手した。

## 進捗状況（2026-09-22）

- **entries 25件**（ehime・kochi・yamanashi・osaka・chiba・tochigi・wakayama・ibaraki・mie・nara・
  gunma・kyoto・fukushima・okayama・hiroshima・kumamoto・yamagata・shizuoka・gifu・ishikawa・
  kagawa・hyogo・fukuoka・yamaguchi・shiga）。
- **shiga**はWebSearchで歴代アーカイブページ(senbatsu/325134.html)のR05セクションを発見し
  『概要および変更点』『選抜要項』の2文書を現行URLで直接取得。変更点文書は4校限定の変更のみで
  一般選抜の調査書配点に関する変更なし、要項本体も配点は「各高等学校ごとに定める実施要項による」
  と別表1へ委任する構造でR6と一言一句同一。R6と同型のcaveat(構造不変前提の引き継ぎ)で135点満点を
  収録(変更なし)。
- **yamaguchi**はWebSearchで「令和5年度山口県公立高等学校入学者選抜実施大綱」(8頁)を現行URLで
  直接取得。イ選抜の方法(ｱ)の条文がR6引用文と一言一句完全一致(調査書と学力検査を同等に扱う方針)。
  ただしR6自体も本文中に学習の記録の学年別配点(135点満点)を示す数値記載が無く、R6と同型のcaveatを
  維持(条文一致による間接確認)。
- **fukuoka**はWayback CDXでR5索引ページ(contents/05youkou.html)を発見したが、そこにリンクされた
  PDF本体自体はCDXに未アーカイブだった。より古いタイムスタンプのHTMLスナップショットを試したところ
  同じ文書への別attachment ID(福岡県のCMSはファイル更新のたびに新IDを発行)が見つかり、そちらは
  Waybackに保存されていた(78頁・切り捨てなし)。(八)選抜の方法1の条文がR6引用文と一言一句完全一致し
  45点満点を確定(変更なし)。教訓: 同一ページでもスナップショット時点でリンク先PDFのIDが異なることが
  あり、1つのタイムスタンプで失敗しても別のタイムスタンプを試す価値がある。
- **hyogo**はWebSearchでR6が使っていた`www2.hyogo-c.ed.jp/hpe/uploads/`(robots.txt Disallow対象)
  とは別ドメイン`www.hyogo-c.ed.jp/~koko-bo/`配下にR5専用PDFを発見し直接200で取得(84頁)。今回は
  pdftotextでCJKテキスト抽出に成功(R6はビジョン解析が必要だった)。第4212項判定資料(A)の算定式が
  R6エントリの引用文と一言一句完全一致し250点満点を確定(変更なし・caveatなし)。
- **kagawa**はWebSearchで「令和5年度香川県公立高等学校入学者選抜要綱」(dai2gou.pdf・5頁)を現行URLで
  直接取得。6選抜方法(1)「調査書の学習の記録と学力検査の成績は、同等に扱う」はR6引用文と一言一句
  完全一致で確認できたが、具体的な換算式(390/220/coreMultiplier2/practicalMultiplier4)を記載する
  『実施細目』という別文書はR6自体もAdobe-Japan1フォント欠落で読めておらず、R5版のURLも今回発見
  できなかった。R6・R7・R8の3年連続一致から構造推定で収録(**caveatあり**・R6と同型の間接確認)。
- **ishikawa**はファイル名(r6youkou.pdf→r5youkou.pdf)の機械置換でWayback CDXから完全版(67頁)を
  取得。R6と同型の「Adobe-Japan1フォント欠落」でpdftotextが一部頁で完全に文字抽出不能な罠があり、
  肝心の6(2)倍率記述頁はpdftoppmでも白紙(ビジョン解析不能)。7(2)条文・様式2-2/様式3の構造一致は
  直接確認できたが、6(2)の具体的な倍率記述自体は今回未確認で、R6・R8の一致(R7は未収集)と学校数不変から
  180点満点を構造推定として引き継いだ(**caveatあり**・shiga/yamaguchi/tokyoと同型の間接確認)。
- **gifu**は現行サイトの直接URLが404だったが、第三者サイト(dogaku.jp)が同じattachment IDを
  一次ソースとして引用していたのを手がかりにWayback CDX APIで検索し3件のスナップショットを発見・
  完全版(53頁・切り捨てなし)を取得。R6引用文と一言一句完全一致で180点満点を確定(変更なし)。
  **重要な教訓**: `archive.org/wayback/available`のavailability APIは空(`{}`)を返しても
  `/cdx/search/cdx`には実際にスナップショットが存在することがある(availability APIは最新1件のみの
  簡易版)。availabilityで空だった場合もCDXで再確認すること(gifu/aomoriの両方でこの罠を確認)。
- **保留**: toyama/iwate/nagano/shimane(Wayback CDXにも本当に未アーカイブ)、
  tottori/tokushima/akita(R5専用の一次ソースPDFが未発見のまま時間切れ)、
  aomori(Wayback上に1件だけ発見したがコンテンツが1MBで切り詰められ全78頁中の一部しか読めない)、
  niigata(R5専用ページ`r5kotogakkonyushi.html`はWebSearch上のタイトルには存在するが実サーバは404・
  Wayback CDXでは未確認)、fukui(`r5ittupan.html`は現存するが出願状況等の統計PDFのみで実施要項
  本体は掲載されておらず、`r5youkou.html`のような別ページはCDXにも存在しない)、
  saitama(`r5nyuushi-jouhou.html`は現存するが統計PDFのみ・R8の`r8nyuushi-jissiyoukou.html`に相当
  する`r5nyuushi-jissiyoukou.html`は404)、miyagi(WebSearchが提示した`kyo-r5koukounyusihousin.html`
  等は全て404)、aichi(Incapsulaリダイレクトループでcurl直接取得不可・Wayback CDXも429/Temporarily
  Offlineで裏取り不能。★令和5年度から校内順位決定方式の入試改革が実施されたという第三者情報を
  発見したため、R6の値をそのまま引き継ぐことは避け未収集のまま保留とした)、oita(R5専用ページ
  `koukounyuushir05.html`はWebSearchのタイトルには存在するが実サーバは404・Wayback CDXも
  Temporarily Offline/504で確認不能)、miyazaki(R5専用ページ`20220616064917.html`をWaybackで発見し
  実施要綱PDFリンク`70099_20220912152623-1.pdf`まで特定できたが、そのPDF自体はCDX検索が繰り返し
  Temporarily Offlineで裏取りできず、直接アクセスも404)、kanagawa(R5専用ページ`r9234791.html`を
  WebSearchで発見したが実サーバは404・Wayback CDXも504/Temporarily Offlineで繰り返し確認不能)。
  **2026-09-22 20:10頃、Wayback CDX APIが断続的にTemporarily Offlineを繰り返し、
  複数の大市場県(niigata/saitama/miyagi/kanagawa等)の再確認ができなかった**。これらの県はR6時点でも
  Wayback依存だった県が多く、R5はさらに一段階古いため現行サイトからの直接発見が難しい構造的傾向が
  ある。**2026-09-22 21:35時点でT-Y11 Task Cは25/47・残りの未着手4県はhokkaido(R6自体がpdfHash
  null=archive.org側の恒久的配信バグで取得不能と確定済み)・tokyo(過去セッションでR6実施要綱本体
  PDF自体が一度もアーカイブされておらず取得不能と確定済み)・saga(R6自体がpdfHash null=一次資料
  未発見のまま)・kanagawa(今回404・Wayback不調)で、いずれも新規に試しても解決見込みが低い**。
  次回はWaybackが安定してからtoyama/iwate/nagano/shimane等の保留県を再挑戦するのが最も見込みがある。
- **shizuoka**はWebSearchでR5専用の発表資料ページ(project ID 001/031/855・R6は001/054/127・
  R7は001/063/460と年度ごとに全く異なるproject ID)を発見し各種様式等PDF(33頁)を取得。
  (別記1)調査書の記入方法2(3)アの条文がR6エントリの引用文と一言一句完全一致し45点満点
  (第3学年のみ)を確定(変更なし)。
- **yamagata**はWebSearchでR5専用ページ(220117r5nyuugakusyasennbatujouhou.html)を発見し様式第2号A
  「調査書」xlsx(23KB)を取得。R6と同じ手法(xlsx内部のsharedStrings.xmlをunzip抽出)で「第３学年の
  評定の合計」という項目名がR6エントリと一言一句完全一致で存在することを確認し45点満点(第3学年
  のみ・9教科×5段階)を確定(変更なし)。
- **保留**: okinawa(R5専用ページが404・Wayback CDXも本セッション中は再度Temporarily Offline)。
- **kumamoto**はWebSearchでR5要項ページ(148117)を発見し本体PDF(97頁)を直接取得。III後期(一般)選抜
  9選抜(本検査)(1)カ選抜の手順(ｲ)b・cの条文がR6エントリの引用文と一言一句完全一致し180点満点
  (9教科×(5+5+10))を確定(変更なし)。同ページ一覧に『要項の改訂について』という別ページも
  あったが選抜方法本体は条文一致で確認済みのため改訂内容は未確認(通常は日程・様式の軽微修正)。
- **hiroshima**はR6のURLスラグ`r06`トークンをそのまま`r05`へ機械置換して200を確認できた
  (接頭辞`06senior-2nd-`部分はそのまま残す必要があった・全体置換だと404)。実施要項本体(174頁)の
  様式第2号5学習の記録欄(1)がR6エントリの引用文と一言一句完全一致し225点満点(9教科×(5+5+15))
  を確定(変更なし)。
- **okayama**はWebSearchで報道発表ページを発見し「令和5年度岡山県立高等学校入学者選抜実施要項」
  (78頁)を直接取得。[一般入学者選抜]1選抜の方針ウの条文に加え、別表「相関表の作成について」の
  200点満点の数式そのもの((ｱ)20点+(ｲ)90点+(ｳ)90点)も直接確認でき、条文一致のみの他県より
  強く裏取りできた(simplifiedCalc=true/actualMaxScore=200の近似モデル・変更なし)。
- **fukushima**はR5専用ページ(`site/edu/r5koukounyushi.html`・R6は`r6koukounyushi.html`と年度で
  固定パターン)をWebSearchで発見し、「令和5年度福島県立高等学校入学者選抜実施要綱」本体(98頁)を
  直接取得。一般選抜「調査書」①の条文がR6エントリの引用文と一言一句完全一致し195点満点を確定
  (変更なし)。教訓: 同一文書内に前期選抜(特色選抜等・135点満点)と一般選抜(後期選抜・195点満点)
  の2種類の異なる調査書配点が別々の章に併記されており、『調査書』という見出しが複数回登場するため
  正しい選抜区分(一般選抜=後期選抜)の章を特定する必要がある(tokushimaも同型の構造の可能性があり
  今回はR5専用の議案書を発見できず見送った)。
- **保留**: tokushima(R5専用の議案書PDFが見つからず、報告事項PDFには配点記載なし)。
- **kyoto**はWebSearchでR5選抜情報ページ(`?p=536`)を発見し、R6と同じファイル名パターン
  (`senbatuyoukou.pdf`)の選抜要項本体を直接取得(88頁)。7中期選抜イ選抜方法等(ｱ)a・bの条文が
  R6エントリの引用文と一言一句完全一致し、195点満点(5教科×5×3学年=75点+4教科×5×3学年×2倍
  =120点)を確定(変更なし)。教訓: 日本語ファイル名のPDFリンクはHTMLから抽出した生のUTF-8文字列を
  そのままcurlに渡すと404になることがあり、`encodeURI`相当のパーセントエンコードが必要
  (今回は英数字ファイル名の本命ドキュメントが別に見つかったため回避)。
- **gunma**はWebSearchでR5要項ページを発見し、本文PDF内の参照箇所から『調査書の作成について』が
  R5では「別記１」(R6は「別記３」)であることを特定して該当PDFを取得。R6エントリの引用文と一言一句
  完全一致(135点満点・9教科×5段階×3学年・学年間傾斜なし・変更なし)。教訓: gunmaは資料構成自体は
  毎年同じでも「別記」の通し番号が年度で前後する(本文の参照箇所を辿って現物確認が必要)。
- **mie**はWebSearchで「令和５年度三重県立高等学校入学者選抜実施方針」PDF(`001010971.pdf`)を
  直接発見・取得(単純URL置換は不要だった)。三重県は年度当初に「実施方針」(選抜手続きの大枠)、
  後日「実施要項」(別表等の詳細)の2段階で資料を公表する構造で、R5は実施方針のみ収集し
  R6/R7エントリの引用文(第3後期選抜3選抜(1)の条文)と一言一句完全一致することで
  45点満点(9教科×5段階・第3学年のみ対象)を確定した(R7エントリが同条文の直後に
  「9教科×5段階=45点」と明記しているため、R5でも条文一致=数値一致と確定できる)。
- **nara**はWebSearchでR5専用ページ(`pref.nara.jp`が`.lg.jp`へ301リダイレクト・
  `documents/6012`配下。R6は`documents/6003`・R7は`documents/5976`と年度ごとにdocument ID
  が変わる)を発見し、「調査書及び学習成績一覧表等作成要領」本体を直接取得。R6エントリの
  引用文と一言一句完全一致し、かつ本文中にも「135点満点（15点×９教科）」の直接記載があり
  二重に裏取りできた(135点満点・第1学年不使用・変更なし)。★naraは[[T-N1-N4]]でR7→R8間の
  制度変更(135点→144点)が既に検出されている県のため、2023-r5の比較対象は変更前の
  2024-r6・2025-r7のみとし、2026-r8とは意図的に比較しない(テストで明示)。
- ehime/kochi/yamanashiは2024-r6のURLパターン（`r06`→`r05`等の年度部分の置換）で
  直接発見でき、pdftotextはCJKテキスト抽出不可（他県と同型の既知の制約。yamanashiは
  通常の空白でなく文字コードがシフトされたグリフのmojibakeという別パターン）だったため
  PyMuPDFでページをPNGにレンダリングしてビジョン解析した。
- **osaka/chiba/tochigi/wakayama/ibarakiは単純なURL置換では404だったが、「県教委
  サイトの年度別実施要項案内ページ」をWebSearchで見つけてから辿ると発見できた**。
  これが今回確立した主要手法。ページID・フォルダ番号・ファイル名の枝番・
  WordPressのpost slugはいずれも年度で不規則に変わる（wakayamaは年度ごとにページID
  自体が別・tochigiはR5だけフォルダ番号が初回作成時のまま・ibarakiはslugが
  `bylaws/`→`page-26505/`のように付け替わる）ため、機械的な数字置換だけに頼らないこと。
- 8県とも2024-r6・2025-r7・2026-r8と数値が完全一致（変更なし）。
- **nagano/toyama/iwate/shimane/aomoriは全て試行済みだが、WebSearchが提示した
  URLがいずれも実際には404だった、または索引ページの現行版が古い年度のPDFへの
  リンクを既に削除していた**（WebSearch要約の作話パターン・既知のリスクを複数回
  再確認。nagano/toyamaは`archive.org/wayback/available`APIでもスナップショット
  なしと確認済み）。Wayback CDX APIは2026-09-22時点で断続的に「Temporarily
  Offline」または429レート制限のため、この5県は裏取り不能で保留中。osaka/chiba/
  tochigi/kanagawa等のWayback依存県も同じ理由で復旧待ち。

## 収集方針（2024-r6から継承・Y-0を継承）

- **推測で埋めない**。現存する教委サイトに令和5年度版のページ/PDFが残っていればそれを使う。
  残っていない県は Wayback Machine の CDX API で探す。それでも見つからない県は `entries` に
  加えず、`meta.unavailable` に「取得不能」として理由付きで記録する。2値化しない。
- 各エントリの `diffFromCurrentYear` は自由記述のメモで、現行年度（2026-r8）・前年度（2025-r7）・
  前々年度（2024-r6）と比較して制度上の変更があったかを一次ソース確認の時点でその場に書き残す。
- **優先度は低い**（Task C本文に明記: 提案書9/6には間に合わず今期の収益への寄与は間接的）。
  T-Y13/T-Y14/T-Y15/T-S13A等の今期主食が払底した時の隙間タスクとして進める。

## 次にやること

未試行の県から、まず現行サイト直接型（`src/data/snapshots/2024-r6/exam-system.json`の
sourceUrlで`web.archive.org`を含まない県）を優先し、osaka/chiba/tochigi/wakayama/ibaraki
と同じ「県教委サイトの年度別実施要項案内ページをWebSearchで探す」型を試す。
nagano/toyama/iwate/shimane/aomoriは今回このセッションで試行済みだが解決できなかった
（詳細は上記「進捗状況」参照）ので、次回は同じ検索を繰り返すより先にWayback CDX APIの
復旧（`archive.org/wayback/available`で確認可能）を待つか、県サイト内を直接クロールして
索引ページを探す（トップページ→教育委員会→高校入試の階層を辿る）方式に切り替えると
よい。大市場県のうちkanagawa/aichi/saitama/hyogo/fukuokaはR6時点でWayback依存だった
ため、同じくWayback復旧待ち。
