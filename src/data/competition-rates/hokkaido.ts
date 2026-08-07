/**
 * 北海道 公立高等学校 倍率パイプラインα（Y-6・coverage='partial'・空知地区+石狩地区(全日制普通科)
 * +札幌市(市立高校・全日制)+後志地区(全日制普通科)+胆振地区(全日制普通科)+日高地区(全日制)
 * +渡島地区(全日制)+檜山地区(全日制)+上川地区(全日制)+留萌地区(全日制)+宗谷地区(全日制)
 * +オホーツク地区(全日制)+十勝地区(全日制)+釧路地区(全日制)+根室地区(全日制)＝
 * 全14管内すべてに着手済み。ただし各地区の連携型（別選抜方式でスキーマ不一致）のみ
 * スコープ外のためstatus='partial'のまま）。
 *
 * 一次ソース: 北海道教育委員会「R8入学者選抜状況報告書 §3 学校別受検者数及び合格者数」
 * （令和8年度＝2026年度入学者選抜・全14頁・管内(空知/石狩/後志/胆振/日高/渡島/檜山/上川/
 * 留萌/宗谷/オホーツク/十勝/釧路/根室/札幌市)ごとに全日制(普通教育学科/専門教育・総合学科)・
 * 定時制・有朋単位制のセクションに分かれる）。
 *
 * ⚠️このPDFは埋め込みフォントのToUnicodeマッピングが欠落しており学校名・学科名がpdftotext
 * では読めない（okinawa.tsと同型の罠）が、数値列（募集人員・出願者数・受検者数・倍率・合格者数）
 * はpdftotext -layoutで正確に抽出できることを2026-08-06に発見。学校名・学科名はRead toolの
 * ビジョン解析で読み取り、行順で数値列と突合する2段階の技法を確立した。
 *
 * ⚠️検算方式（重要）: 各行について「受検者数÷募集人員≒印字済み倍率」を突合し、不一致の行は
 * 誤読の疑いとして収録を見送る。空知地区で1行（滝川西・情報マネジメント科）がこの検算で
 * 数値の対応関係を特定できず、pendingDepartmentsに正直に記録した。
 *
 * quota=募集人員、finalApplicants=出願者数（第1次・他県のΛ-4 hokkaidoエントリと同じ「第1次
 * 出願者数」の定義）、finalRate=finalApplicants/quotaを自前算出（原資料の印字倍率は受検者数を
 * 分子にしており他県との定義が異なるため採用しない）。
 *
 * coverage.status='partial': 全14管内（空知/石狩/後志/胆振/日高/渡島/檜山/上川/留萌/宗谷/
 * オホーツク/十勝/釧路/根室/札幌市）の「普通教育を主とする学科」「専門教育を主とする学科及び
 * 総合学科」を収録。「札幌市」は道立高校の石狩地区とは別の管理者（市立＝札幌市教育委員会所管）
 * のため報告書上も独立した地区として扱われている（市立札幌旭丘・藻岩・平岸・清田・新川・
 * 啓北商業の6校）。各地区の詳細な収録経緯・技法・見送り理由は下記coverage.note参照。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const HOKKAIDO_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'hokkaido',
  sources: [
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/3/1/7/8/5/5/0/_/05_p9-p22.pdf',
      docTitle: '北海道教育委員会 R8入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（全14頁・空知〜根室の全14管内を収録）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-08-06',
    },
    {
      url: 'https://www.dokyoi.pref.hokkaido.lg.jp/fs/1/2/0/5/0/3/2/7/_/p9-22_gakkoubetu.pdf',
      docTitle: '北海道教育委員会 R7入学者選抜状況報告書「§3 学校別受検者数及び合格者数」（全14頁・R8と同一シリーズの前年度版・掛-1第1弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '空知地区・全日制（令和8年度29レコード＋令和7年度31レコード＝掛-1第1弾・学校別×多年度の試験実装）',
      '石狩地区・全日制「普通教育を主とする学科」（令和8年度31レコード）＋「専門教育を主とする学科及び総合学科」（令和8年度26レコード、資料p11・2026-08-07にビジョン解析で再確認し収録）＋令和7年度分57レコード（普通31+専門26・掛-1第2弾）',
      '札幌市・全日制（市立高校6校・令和8年度9レコード＋令和7年度分9レコード＝掛-1第3弾）',
      '後志地区・全日制「普通教育を主とする学科」（令和8年度6レコード）＋「専門教育を主とする学科及び総合学科」（令和8年度11レコード、資料p13中表・2026-08-07にpdftoppm 600dpi+ffmpegクロップで微小フォント学科名を再確認し収録）＋令和7年度分17レコード（普通6+専門/総合11・掛-1第4弾）',
      '胆振地区・全日制「普通教育を主とする学科」（令和8年度11レコード）＋「専門教育を主とする学科及び総合学科」（令和8年度16レコード、資料p14上表・2026-08-07に石狩と同じ理由で見送り撤回のうえ収録）＋令和7年度分27レコード（普通11+専門/総合16・掛-1第5弾）',
      '日高地区・全日制「普通教育を主とする学科」（令和8年度4レコード）＋「専門教育を主とする学科及び総合学科」（令和8年度3レコード）＋令和7年度分7レコード（普通4+専門/総合3・掛-1第6弾）',
      '渡島地区・全日制「普通教育を主とする学科」（令和8年度10レコード・知内高校含む）＋「専門教育を主とする学科及び総合学科」（令和8年度19レコード・資料p16掲載）＋令和7年度分普通10レコード＋専門/総合20レコード（掛-1第6弾+第7弾）',
      '檜山地区・全日制「普通教育を主とする学科」（令和8年度3レコード）＋「総合学科」（令和8年度1レコード・檜山北高校）＋令和7年度分4レコード（掛-1第7弾）',
      '上川地区・全日制「普通教育を主とする学科」（令和8年度14レコード、資料p17上表）＋「専門教育を主とする学科及び総合学科」（令和8年度23レコード、資料p17下表）＋令和7年度分37レコード（普通14+専門/総合23・掛-1第8弾・学校構成はR8と完全一致）',
      '留萌地区・全日制「普通教育を主とする学科」（3レコード）＋「専門教育を主とする学科」（4レコード、資料p18掲載）',
      '宗谷地区・全日制「普通教育を主とする学科」（6レコード）＋「専門教育を主とする学科」（2レコード、資料p18掲載）',
      'オホーツク地区・全日制「普通教育を主とする学科」（16レコード）＋「専門教育を主とする学科及び総合学科」（15レコード、資料p19掲載）',
      '十勝地区・全日制「普通教育を主とする学科」（12レコード）＋「専門教育を主とする学科及び総合学科」（16レコード、資料p20掲載）',
      '釧路地区・全日制「普通教育を主とする学科」（9レコード）＋「専門教育を主とする学科及び総合学科」（12レコード、資料p21掲載・連携型テーブルなし）',
      '根室地区・全日制「普通教育を主とする学科」（5レコード）＋「専門教育を主とする学科」（6レコード、資料p22掲載・全14頁の最終地区）',
    ],
    pendingDepartments: [
      '胆振地区・鵡川高校「普通科（連携型）」（出願者数/倍率の列が無い別選抜方式のためスキーマ不一致・スコープ外）',
      '日高地区・えりも高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外）',
      '上川地区・上川高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外・資料p17中表）',
      'オホーツク地区・湧別高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外・資料p19中表）',
      '十勝地区・鹿追高校＋広尾高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外・資料p20中表）',
      '根室地区・羅臼高校「普通科（連携型）」（同上の理由でスキーマ不一致・スコープ外・資料p22中表）',
      '空知地区・滝川西高校「情報マネジメント科」（検算式で数値の対応関係を特定できず見送り）',
      '札幌市・市立札幌大通「定時制」（他県のY-6と同じ理由でスコープ外）',
      '後志地区・定時制（小樽潮陵・真狩・留寿都・小樽未来創造。他県のY-6と同じ理由でスコープ外）',
      '胆振地区・定時制（室蘭栄・苫小牧東・苫小牧工業。他県のY-6と同じ理由でスコープ外）',
      '定時制課程・有朋単位制（他県のY-6と同じ理由でスコープ外）',
    ],
    note:
      '空知地区の全日制29レコードは各行「受検者数÷募集人員≒印字済み倍率」の検算で全件一致を確認済み。' +
      '石狩地区・全日制普通科の31レコード、札幌市・全日制の9レコードもRead toolのビジョン解析' +
      '(資料p10/p12の表・p12は400dpi高解像度レンダリングで学科名の小さい文字も確認)とpdftotext ' +
      '-layout(同頁の数値列)を独立に突合し全件一致を確認した(学校名セルが1行1校または結合セルが' +
      '無い簡潔な構造のため空知と同水準の確度)。pdftotext -layoutで数値を正確抽出し、学校名・学科名' +
      'はRead toolのビジョン解析で行順突合した。渡島地区・専門/総合学科(資料p16)と檜山地区(同頁)は' +
      'pdftoppm -r 300による300dpi高解像度レンダリングで学科名を確認し、pdftotext -layoutの数値列と' +
      '行順突合した(結合セルなし・簡潔な構造のため空知と同水準の確度)。上川地区(資料p17)は' +
      'pdftoppm -r 600によるさらに高解像度のレンダリング(600dpi)＋ffmpegでの部分クロップ拡大で' +
      '「富良野・園芸観光デザイン」等の微小フォント学科名まで確認し、pdftotext -layoutの数値列と' +
      '全37行を行順突合した(結合セルなし・空知と同水準の確度)。留萌地区・宗谷地区(資料p18)は' +
      'pdftoppm -r 300による300dpi高解像度レンダリングで学科名を確認し、pdftotext -layoutの数値列と' +
      '全15行を行順突合した(結合セルなし・空知と同水準の確度)。オホーツク地区(資料p19)は' +
      'pdftoppm -r 300による300dpi高解像度レンダリングで学科名を確認し、pdftotext -layoutの数値列と' +
      '全31行を行順突合した(結合セルなし・空知と同水準の確度)。十勝地区(資料p20・28行)・釧路地区' +
      '(資料p21・21行、連携型テーブルなし)・根室地区(資料p22・11行、全14頁の最終頁)も同じくpdftoppm ' +
      '-r 300による300dpi高解像度レンダリングで学科名を確認し、pdftotext -layoutの数値列と全行を' +
      '行順突合した(結合セルなし・空知と同水準の確度)。これで全14頁(空知〜根室の14管内)の一次読み込みが' +
      '完了した(石狩/後志/胆振の専門教育学科の一部と各地区の連携型はスキーマ制約により見送り継続)。' +
      '⚠️2026-08-07追記: 後志地区・専門教育学科(資料p13中表)は2026-08-06時点で「小樽未来創造・' +
      '小樽水産の学科名が微小フォントで判読不確実」として見送っていたが、pdftoppm -r 600(600dpi)＋' +
      'ffmpegでの部分クロップ拡大で再検証したところ「機械電気システム」「建設システム」「情報会計' +
      'マネジメント」等の学科名が明確に判読可能と判明し、pdftotext -layoutの数値列と全12行を行順' +
      '突合のうえ収録した(結合セルなし・空知と同水準の確度)。' +
      '⚠️2026-08-07追記2: 石狩地区・専門教育学科(資料p11・26レコード)も再挑戦し全件収録した。' +
      '2026-08-06時点では「学校名セルが複数学科行にまたがる結合セルで列ズレ誤読リスクが高い」として' +
      '見送っていたが、実際に300dpi/600dpiでビジョン解析したところ罫線は明瞭で学校名(1校が複数行の' +
      '学科を持つ場合も罫線で区切られる)と学科名の対応は一意に読み取れた。判明した真因: pdftotext ' +
      '-layoutの数値列抽出順序が、学校名セルが複数行にまたがる箇所で入れ替わり(quotaの値が対応する' +
      'データ行より前にまとめて出力される)、pdftotext側の機械的な数値列とビジョン解析の行順が単純な' +
      '1対1突合では合わなくなる問題であり、学校名・学科名の判読自体は曖昧ではなかった。念のため' +
      '「千歳」高校の2学科(国際教養科・国際流通科)は600dpiクロップで学校名分割の誤読(「千歳国際」+' +
      '「流通」等)が無いか個別に再確認した。今回はpdftotext数値列との自動突合を行わず、300dpi/600dpi' +
      '画像から出願者数・受検者数・倍率・合格者数を直接目視転記し、各行の受検者数÷募集人員≒印字済み' +
      '倍率の検算のみで整合性を確認した(全26行一致)。' +
      '⚠️2026-08-07追記3【自己訂正】: 直前の追記2で「胆振地区の見送り分(室蘭工業等)は1つのセルに' +
      '複数の学科名が併記され罫線でも分離されていない真の結合セルであり解決しない」と記録したが、' +
      'これは検証せずに旧セッションの判定を鵜呑みにした誤り。実際に資料p14上表を300dpiでビジョン' +
      '解析したところ石狩と全く同様に罫線は明瞭で学校名・学科名は一意に読み取れ、pdftotext -layoutの' +
      '数値列とも(石狩と異なりこちらは順序の乱れも無く)全16行が問題なく突合できたため、そのまま' +
      '全件収録した。**教訓: 「結合セルで見送り」という過去の判定文言を見た場合、鵜呑みにせず必ず' +
      '実際に画像を見て検証すること(石狩・胆振の2件連続でこのパターンが再現した)**。' +
      '⚠️2026-08-07追記4(掛-1第1弾): 教委サイトのR8報告書ページ(hk/gks/156952.html)と同じ構造の' +
      'R7版ページ(hk/gks/117975.html)にも同一シリーズの§3学校別PDF(p9-22_gakkoubetu.pdf)が存在する' +
      'と判明し、空知地区(31レコード)をfiscalYear:"令和7年度（2025年度）"付きで追加した(TIER掛-1= ' +
      '学校別×多年度の初実装)。WebFetchの要約が誤ったベースドメイン(www.pref.hokkaido.lg.jp)を提示' +
      'したためPDFが取得できず一度失敗したが、教委サイトのHTMLを直接curlしてhref属性を確認したところ' +
      '実際のドメインはR8と同じdokyoi.pref.hokkaido.lg.jpだったと判明(WebFetch要約の別種のハルシネー' +
      'ションパターンとして記録・URLはリンクのテキストだけでなくbase domainまで実ファイルで裏取り' +
      'すること)。R7版はR8と全く同じ14頁構成(空知〜根室)で、pdftotext -layoutの数値列も乱れなく' +
      '全31行が問題なく突合できた。fiscalYearフィールドは省略時sources[0](=R8)を指す後方互換設計の' +
      'ためR8の既存293レコードは無改修。' +
      '⚠️2026-08-07追記5(掛-1第2弾): 石狩地区のR7分(普通31+専門/総合26=57レコード)も同じ技法で' +
      '追加した。R7の石狩専門/総合テーブルはR8と異なりpdftotext -layoutの数値列順序の乱れも無く' +
      '(石狩R8で見られた学校名複数行セルによる順序入れ替え問題は今回発生せず)、全57行が問題なく' +
      '突合できた。' +
      '⚠️2026-08-07追記6(掛-1第3弾): 札幌市(市立高校)のR7分9レコードも追加した(PDF内部頁4=印字' +
      'ページ12)。R7のR8からの頁ズレは無く(PDF頁1=空知/2=石狩普通/3=石狩専門/4=札幌市...という' +
      'R8と同一の頁順序をそのまま維持)、市立札幌旭丘・藻岩・平岸(2学科)・清田(2学科)・新川・' +
      '啓北商業の6校9レコードをpdftoppm 300dpiのビジョン解析で収録した(結合セルなし・空知と同水準' +
      'の確度)。' +
      '⚠️2026-08-07追記7(掛-1第4弾): 後志地区のR7分17レコード(普通6+専門/総合11)も追加した' +
      '(PDF内部頁5=印字ページ13)。頁順序は引き続きR8と同一。専門/総合学科の学校名(小樽未来創造・' +
      '小樽水産の複数学科)もR7では600dpi等の高解像度化なしの300dpiで明確に判読でき(R8で微小フォント' +
      'に苦労した箇所だが、R7版のPDFは文字がやや大きく印字されている可能性がある)、pdftotext -layout' +
      'の数値列と全17行を行順突合した(結合セルなし)。なお既存R8のcoverage.includedDepartmentsで' +
      '「12レコード」としていた後志専門/総合の件数表記は、実際のrecords配列を数えると11レコードで' +
      'あり従来から軽微な誤記だったため、この追記と合わせて正しい件数(11レコード)に訂正した。' +
      '⚠️2026-08-07追記8(掛-1第5弾): 胆振地区のR7分27レコード(普通11+専門/総合16)も追加した' +
      '(PDF内部頁5後半〜頁6=印字ページ13〜14)。学校名・学科構成はR8と完全に一致(室蘭栄・室蘭清水丘・' +
      '登別青嶺・伊達開来・苫小牧東西南・白老東・追分・厚真・鵡川の11校、専門は室蘭栄(理数)・' +
      '壮瞥(地域農業)・室蘭工業(3学科)・苫小牧工業(6学科)・虻田(事務情報)・苫小牧総合経済(3学科)・' +
      '室蘭東翔(総合)の7校16レコード)だが募集人員が年度により変動する行がある(例:伊達開来160→200)。' +
      'pdftotext -layoutの数値列と全27行を行順突合した(結合セルなし・300dpiで学科名は明瞭)。同頁に' +
      '鵡川高校「普通科(連携型)」の別表も再度確認したが、R8と同様に出願者数/倍率の列が無く' +
      'スキーマ不一致のためスコープ外(pendingDepartments既存記載どおり)。' +
      '⚠️2026-08-07追記9(掛-1第6弾): 日高地区のR7分7レコード(普通4+専門/総合3)と渡島地区のR7分' +
      '普通10レコードも追加した(PDF内部頁6後半〜頁7=印字ページ14〜15)。日高専門/総合は静内農業' +
      '(食品科学・生産科学)+浦河総合の3レコードでR8と完全一致。渡島普通は函館中部・函館西・南茅部・' +
      '上磯・七飯・松前・八雲・長万部・市立函館・知内の10校でR8と完全一致(知内は独立の小表だが同一' +
      '区分として合算済み)。渡島の専門/総合(19レコード・資料p16相当)は次回に持ち越し。pdftotext ' +
      '-layoutの数値列と全17行を行順突合した(結合セルなし)。' +
      '⚠️2026-08-07追記10(掛-1第7弾): 渡島地区の専門/総合R7分20レコードと檜山地区R7分4レコードを' +
      '追加した(PDF内部頁8=印字ページ16)。**函館水産のみR8(3学科:海洋技術/食品創造/機関工学)と' +
      'R7(4学科:海洋技術/水産食品/品質管理流通/機関工学)で学科構成が異なる**ことを検出した(誤読では' +
      'なく、画像上で4学科分の独立した行(各募集人員40・推薦枠36)が明瞭に区切られており、令和7→' +
      '令和8年度にかけて学科再編(水産食品+品質管理流通の統合等)があったと考えられる・他校の学科' +
      '構成はR7=R8で一致)。残る19校(函館中部理数・大野農業3学科・函館工業5学科・函館商業4学科・' +
      '福島商業・八雲総合ビジネス・森総合)はR8と完全一致。檜山地区(江差・上ノ国・奥尻・檜山北)も' +
      '学校構成はR8と完全一致。pdftotext -layoutの数値列と全24行を行順突合した(結合セルなし)。' +
      '⚠️2026-08-07追記11(掛-1第8弾): 上川地区のR7分37レコード(普通14+専門/総合23)も追加した' +
      '(PDF内部頁9=印字ページ17)。学校・学科構成はR8と完全一致(普通14校=旭川東西北永嶺・鷹栖・' +
      '東川・美瑛・上川・富良野・上富良野・南富良野・士別翔雲・名寄・美深、専門/総合23レコード=' +
      '旭川西理数・おといねっぷ美術工芸・旭川農業4学科・富良野2学科・旭川工業6学科・名寄情報技術・' +
      '旭川商業4学科・士別翔雲総合ビジネス・下川商業・旭川南総合・剣淵総合)。上川高校の普通科' +
      '(連携型)もR8同様出願者数/倍率列なしでスコープ外のまま。pdftotext -layoutの数値列と全37行を' +
      '行順突合した(結合セルなし・300dpiで学科名明瞭)。',
  },
  officialSubtotals: [],
  records: [
    { schoolName: '岩見沢東', department: '普通', quota: 160, finalApplicants: 134, finalRate: 0.84 },
    { schoolName: '岩見沢東', department: '文理探究', quota: 80, finalApplicants: 79, finalRate: 0.99 },
    { schoolName: '月形', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.42 },
    { schoolName: '夕張', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '長沼', department: '普通', quota: 80, finalApplicants: 35, finalRate: 0.44 },
    { schoolName: '栗山', department: '普通', quota: 80, finalApplicants: 30, finalRate: 0.38 },
    { schoolName: '岩見沢緑陵', department: '普通', quota: 160, finalApplicants: 161, finalRate: 1.01 },
    { schoolName: '滝川', department: '普通', quota: 160, finalApplicants: 168, finalRate: 1.05 },
    { schoolName: '砂川', department: '普通', quota: 80, finalApplicants: 70, finalRate: 0.88 },
    { schoolName: '芦別', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.42 },
    { schoolName: '深川西', department: '普通', quota: 80, finalApplicants: 53, finalRate: 0.66 },
    { schoolName: '滝川西', department: '普通', quota: 120, finalApplicants: 126, finalRate: 1.05 },
    { schoolName: '滝川', department: '理数', quota: 40, finalApplicants: 33, finalRate: 0.82 },
    { schoolName: '岩見沢農業', department: '酪農科学', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '岩見沢農業', department: '畜産科学', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '岩見沢農業', department: '食品科学', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '岩見沢農業', department: '農業土木工学', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '岩見沢農業', department: '環境造園科', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '岩見沢農業', department: '森林科学科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '岩見沢農業', department: '生活科学', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '深川東', department: '生産科学', quota: 40, finalApplicants: 23, finalRate: 0.57 },
    { schoolName: '新十津川農業', department: '農業・生活', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '滝川工業', department: '電子機械', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '滝川工業', department: '電気', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '岩見沢緑陵', department: 'みらい設計', quota: 80, finalApplicants: 84, finalRate: 1.05 },
    { schoolName: '三笠', department: '調理師', quota: 20, finalApplicants: 27, finalRate: 1.35 },
    { schoolName: '三笠', department: '製菓', quota: 20, finalApplicants: 25, finalRate: 1.25 },
    { schoolName: '美唄聖華', department: '衛生看護', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '美唄尚栄', department: '総合', quota: 80, finalApplicants: 37, finalRate: 0.46 },
    { schoolName: '札幌東', department: '普通', quota: 320, finalApplicants: 416, finalRate: 1.3 },
    { schoolName: '札幌西', department: '普通', quota: 320, finalApplicants: 454, finalRate: 1.42 },
    { schoolName: '札幌南', department: '普通', quota: 320, finalApplicants: 412, finalRate: 1.29 },
    { schoolName: '札幌北', department: '普通', quota: 320, finalApplicants: 391, finalRate: 1.22 },
    { schoolName: '札幌月寒', department: '普通', quota: 320, finalApplicants: 414, finalRate: 1.29 },
    { schoolName: '札幌啓成', department: '普通', quota: 280, finalApplicants: 317, finalRate: 1.13 },
    { schoolName: '札幌北陵', department: '普通', quota: 320, finalApplicants: 364, finalRate: 1.14 },
    { schoolName: '札幌手稲', department: '普通', quota: 320, finalApplicants: 340, finalRate: 1.06 },
    { schoolName: '札幌丘珠', department: '普通', quota: 280, finalApplicants: 235, finalRate: 0.84 },
    { schoolName: '札幌西陵', department: '普通', quota: 240, finalApplicants: 194, finalRate: 0.81 },
    { schoolName: '札幌白石', department: '普通', quota: 280, finalApplicants: 360, finalRate: 1.29 },
    { schoolName: '札幌東陵', department: '普通', quota: 280, finalApplicants: 329, finalRate: 1.18 },
    { schoolName: '札幌南陵', department: '普通', quota: 80, finalApplicants: 64, finalRate: 0.8 },
    { schoolName: '札幌東豊', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '札幌真栄', department: '普通', quota: 200, finalApplicants: 162, finalRate: 0.81 },
    { schoolName: '札幌あすかぜ', department: '普通', quota: 80, finalApplicants: 59, finalRate: 0.74 },
    { schoolName: '札幌稲雲', department: '普通', quota: 280, finalApplicants: 313, finalRate: 1.12 },
    { schoolName: '札幌英藍', department: '普通', quota: 280, finalApplicants: 261, finalRate: 0.93 },
    { schoolName: '札幌平岡', department: '普通', quota: 240, finalApplicants: 315, finalRate: 1.31 },
    { schoolName: '札幌白陵', department: '普通', quota: 80, finalApplicants: 41, finalRate: 0.51 },
    { schoolName: '札幌国際情報', department: '普通', quota: 80, finalApplicants: 118, finalRate: 1.48 },
    { schoolName: '江別', department: '普通', quota: 200, finalApplicants: 225, finalRate: 1.13 },
    { schoolName: '野幌', department: '普通', quota: 120, finalApplicants: 68, finalRate: 0.57 },
    { schoolName: '大麻', department: '普通', quota: 280, finalApplicants: 274, finalRate: 0.98 },
    { schoolName: '千歳', department: '普通', quota: 200, finalApplicants: 254, finalRate: 1.27 },
    { schoolName: '北広島', department: '普通', quota: 280, finalApplicants: 317, finalRate: 1.13 },
    { schoolName: '北広島西', department: '普通', quota: 160, finalApplicants: 88, finalRate: 0.55 },
    { schoolName: '石狩南', department: '普通', quota: 280, finalApplicants: 319, finalRate: 1.14 },
    { schoolName: '当別', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '恵庭南', department: '普通', quota: 200, finalApplicants: 130, finalRate: 0.65 },
    { schoolName: '恵庭北', department: '普通', quota: 240, finalApplicants: 204, finalRate: 0.85 },
    { schoolName: '札幌啓成', department: '理数', quota: 40, finalApplicants: 69, finalRate: 1.73 },
    { schoolName: '恵庭南', department: '体育', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '札幌国際情報', department: '国際文化', quota: 80, finalApplicants: 95, finalRate: 1.19 },
    { schoolName: '千歳', department: '国際教養', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '当別', department: '園芸デザイン', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '札幌工業', department: '機械', quota: 80, finalApplicants: 87, finalRate: 1.09 },
    { schoolName: '札幌工業', department: '電気', quota: 80, finalApplicants: 86, finalRate: 1.08 },
    { schoolName: '札幌工業', department: '建築', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '札幌工業', department: '土木', quota: 80, finalApplicants: 58, finalRate: 0.73 },
    { schoolName: '札幌琴似工業', department: '電子機械', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '札幌琴似工業', department: '電気', quota: 80, finalApplicants: 72, finalRate: 0.9 },
    { schoolName: '札幌琴似工業', department: '情報技術', quota: 80, finalApplicants: 67, finalRate: 0.84 },
    { schoolName: '札幌琴似工業', department: '環境化学', quota: 80, finalApplicants: 57, finalRate: 0.71 },
    { schoolName: '札幌国際情報', department: '理数工学', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '札幌東商業', department: '流通経済', quota: 80, finalApplicants: 102, finalRate: 1.28 },
    { schoolName: '札幌東商業', department: '国際経済', quota: 80, finalApplicants: 89, finalRate: 1.11 },
    { schoolName: '札幌東商業', department: '会計ビジネス', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '札幌東商業', department: '情報処理', quota: 80, finalApplicants: 94, finalRate: 1.18 },
    { schoolName: '札幌国際情報', department: 'グローバルビジネス', quota: 120, finalApplicants: 137, finalRate: 1.14 },
    { schoolName: '江別', department: '事務情報', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '千歳', department: '国際流通', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '江別', department: '生活デザイン', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '当別', department: '家政', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '石狩翔陽', department: '総合', quota: 320, finalApplicants: 348, finalRate: 1.09 },
    { schoolName: '札幌厚別', department: '総合', quota: 280, finalApplicants: 293, finalRate: 1.05 },
    { schoolName: '千歳北陽', department: '総合', quota: 160, finalApplicants: 121, finalRate: 0.76 },
    { schoolName: '市立札幌旭丘', department: '普通', quota: 240, finalApplicants: 351, finalRate: 1.46 },
    { schoolName: '市立札幌藻岩', department: '普通', quota: 240, finalApplicants: 301, finalRate: 1.25 },
    { schoolName: '市立札幌平岸', department: '普通', quota: 280, finalApplicants: 388, finalRate: 1.39 },
    { schoolName: '市立札幌平岸', department: 'デザインアート', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '市立札幌清田', department: '普通', quota: 200, finalApplicants: 251, finalRate: 1.25 },
    { schoolName: '市立札幌清田', department: 'グローバル', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '市立札幌新川', department: '普通', quota: 320, finalApplicants: 403, finalRate: 1.26 },
    { schoolName: '市立札幌旭丘', department: '数理データサイエンス', quota: 80, finalApplicants: 90, finalRate: 1.13 },
    { schoolName: '市立札幌啓北商業', department: '未来商学', quota: 240, finalApplicants: 191, finalRate: 0.8 },
    { schoolName: '小樽潮陵', department: '普通', quota: 200, finalApplicants: 205, finalRate: 1.02 },
    { schoolName: '小樽桜陽', department: '普通', quota: 200, finalApplicants: 176, finalRate: 0.88 },
    { schoolName: '岩内', department: '普通', quota: 80, finalApplicants: 61, finalRate: 0.76 },
    { schoolName: '寿都', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '蘭越', department: '普通', quota: 40, finalApplicants: 23, finalRate: 0.57 },
    { schoolName: '倶知安', department: '普通', quota: 160, finalApplicants: 108, finalRate: 0.68 },
    { schoolName: '倶知安農業', department: '生産科学', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '小樽未来創造', department: '機械電気システム', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '小樽未来創造', department: '建設システム', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '小樽未来創造', department: '流通マネジメント', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '小樽未来創造', department: '情報会計マネジメント', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '岩内', department: '地域産業ビジネス', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '小樽水産', department: '海洋漁業', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '小樽水産', department: '水産食品', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '小樽水産', department: '栽培漁業', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '小樽水産', department: '情報通信', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '余市紅志', department: '総合', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: 'ニセコ国際', department: '総合', quota: 70, finalApplicants: 59, finalRate: 0.84 },
    { schoolName: '室蘭栄', department: '普通', quota: 120, finalApplicants: 134, finalRate: 1.12 },
    { schoolName: '室蘭清水丘', department: '普通', quota: 160, finalApplicants: 132, finalRate: 0.83 },
    { schoolName: '登別青嶺', department: '普通', quota: 120, finalApplicants: 62, finalRate: 0.52 },
    { schoolName: '伊達開来', department: '普通', quota: 160, finalApplicants: 119, finalRate: 0.74 },
    { schoolName: '苫小牧東', department: '普通', quota: 240, finalApplicants: 312, finalRate: 1.3 },
    { schoolName: '苫小牧西', department: '普通', quota: 160, finalApplicants: 182, finalRate: 1.14 },
    { schoolName: '苫小牧南', department: '普通', quota: 160, finalApplicants: 184, finalRate: 1.15 },
    { schoolName: '白老東', department: '普通', quota: 80, finalApplicants: 31, finalRate: 0.39 },
    { schoolName: '追分', department: '普通', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '厚真', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '鵡川', department: '普通', quota: 80, finalApplicants: 49, finalRate: 0.61 },
    { schoolName: '室蘭栄', department: '理数', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '壮瞥', department: '地域農業', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '室蘭工業', department: '電子機械', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '室蘭工業', department: '電気', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '室蘭工業', department: '建設', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '苫小牧工業', department: '電子機械', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '苫小牧工業', department: '電気', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '苫小牧工業', department: '情報技術', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '苫小牧工業', department: '建築', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '苫小牧工業', department: '土木', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '苫小牧工業', department: '環境化学', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '虻田', department: '事務情報', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '苫小牧総合経済', department: '流通経済', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '苫小牧総合経済', department: '国際経済', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '苫小牧総合経済', department: '情報処理', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '室蘭東翔', department: '総合', quota: 160, finalApplicants: 155, finalRate: 0.97 },
    { schoolName: '平取', department: '普通', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '富川', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '静内', department: '普通', quota: 200, finalApplicants: 152, finalRate: 0.76 },
    { schoolName: 'えりも', department: '普通', quota: 70, finalApplicants: 28, finalRate: 0.4 },
    { schoolName: '静内農業', department: '食品科学', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '静内農業', department: '生産科学', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '浦河総合', department: '総合', quota: 120, finalApplicants: 87, finalRate: 0.73 },
    { schoolName: '函館中部', department: '普通', quota: 160, finalApplicants: 186, finalRate: 1.16 },
    { schoolName: '函館西', department: '普通', quota: 240, finalApplicants: 301, finalRate: 1.25 },
    { schoolName: '南茅部', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '上磯', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '七飯', department: '普通', quota: 120, finalApplicants: 100, finalRate: 0.83 },
    { schoolName: '松前', department: '普通', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '八雲', department: '普通', quota: 80, finalApplicants: 65, finalRate: 0.81 },
    { schoolName: '長万部', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '市立函館', department: '普通', quota: 200, finalApplicants: 283, finalRate: 1.42 },
    { schoolName: '知内', department: '普通', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '函館中部', department: '理数', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '大野農業', department: '農業科学', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '大野農業', department: '園芸福祉', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '大野農業', department: '食品科学', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '函館工業', department: '電子機械', quota: 40, finalApplicants: 50, finalRate: 1.25 },
    { schoolName: '函館工業', department: '電気情報工学', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '函館工業', department: '建築', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '函館工業', department: '環境土木', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '函館工業', department: '工業化学', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '函館商業', department: '流通ビジネス', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '函館商業', department: '国際経済', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '函館商業', department: '会計ビジネス', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '函館商業', department: '情報処理', quota: 40, finalApplicants: 56, finalRate: 1.4 },
    { schoolName: '福島商業', department: '商業', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '八雲', department: '総合ビジネス', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '函館水産', department: '海洋技術', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '函館水産', department: '食品創造', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '函館水産', department: '機関工学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '森', department: '総合', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '江差', department: '普通', quota: 80, finalApplicants: 35, finalRate: 0.44 },
    { schoolName: '上ノ国', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '奥尻', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '檜山北', department: '総合', quota: 80, finalApplicants: 55, finalRate: 0.69 },
    { schoolName: '旭川東', department: '普通', quota: 240, finalApplicants: 286, finalRate: 1.19 },
    { schoolName: '旭川西', department: '普通', quota: 160, finalApplicants: 217, finalRate: 1.36 },
    { schoolName: '旭川北', department: '普通', quota: 200, finalApplicants: 230, finalRate: 1.15 },
    { schoolName: '旭川永嶺', department: '普通', quota: 200, finalApplicants: 224, finalRate: 1.12 },
    { schoolName: '鷹栖', department: '普通', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '東川', department: '普通', quota: 80, finalApplicants: 72, finalRate: 0.9 },
    { schoolName: '美瑛', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '上川', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '富良野', department: '普通', quota: 120, finalApplicants: 94, finalRate: 0.78 },
    { schoolName: '上富良野', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '南富良野', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '士別翔雲', department: '普通', quota: 120, finalApplicants: 73, finalRate: 0.61 },
    { schoolName: '名寄', department: '普通', quota: 160, finalApplicants: 124, finalRate: 0.78 },
    { schoolName: '美深', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '旭川西', department: '理数', quota: 40, finalApplicants: 57, finalRate: 1.43 },
    { schoolName: 'おといねっぷ美術工芸', department: '工芸', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '旭川農業', department: '農業科学', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '旭川農業', department: '食品科学', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '旭川農業', department: '森林科学', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '旭川農業', department: '生活科学', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '富良野', department: '園芸観光デザイン', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '旭川工業', department: '電子機械', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '旭川工業', department: '電気', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '旭川工業', department: '情報技術', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '旭川工業', department: '建築', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '旭川工業', department: '土木', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '旭川工業', department: '工業化学', quota: 40, finalApplicants: 16, finalRate: 0.4 },
    { schoolName: '名寄', department: '情報技術', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '富良野', department: '電気情報システム', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '旭川商業', department: '流通ビジネス', quota: 80, finalApplicants: 73, finalRate: 0.91 },
    { schoolName: '旭川商業', department: '国際ビジネス', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '旭川商業', department: '会計', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '旭川商業', department: '情報処理', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '士別翔雲', department: '総合ビジネス', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '下川商業', department: '商業', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '旭川南', department: '総合', quota: 200, finalApplicants: 196, finalRate: 0.98 },
    { schoolName: '剣淵', department: '総合', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '留萌', department: '普通', quota: 160, finalApplicants: 108, finalRate: 0.68 },
    { schoolName: '羽幌', department: '普通', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '天塩', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '遠別農業', department: '生産科学', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '留萌', department: '電気・建築', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '留萌', department: '情報ビジネス', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '苫前商業', department: '商業', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '稚内', department: '普通', quota: 120, finalApplicants: 95, finalRate: 0.79 },
    { schoolName: '豊富', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '浜頓別', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '枝幸', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '利尻', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '礼文', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '稚内商業', department: '商業', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '稚内', department: '衛生看護', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '北見北斗', department: '普通', quota: 200, finalApplicants: 192, finalRate: 0.96 },
    { schoolName: '北見柏陽', department: '普通', quota: 200, finalApplicants: 248, finalRate: 1.24 },
    { schoolName: '北見緑陵', department: '普通', quota: 120, finalApplicants: 147, finalRate: 1.23 },
    { schoolName: '常呂', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '美幌', department: '普通', quota: 80, finalApplicants: 32, finalRate: 0.4 },
    { schoolName: '津別', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '訓子府', department: '普通', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '佐呂間', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '網走南ケ丘', department: '普通', quota: 160, finalApplicants: 175, finalRate: 1.09 },
    { schoolName: '網走桂陽', department: '普通', quota: 80, finalApplicants: 61, finalRate: 0.76 },
    { schoolName: '清里', department: '普通', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '遠軽', department: '普通', quota: 200, finalApplicants: 163, finalRate: 0.82 },
    { schoolName: '湧別', department: '普通', quota: 80, finalApplicants: 51, finalRate: 0.64 },
    { schoolName: '紋別', department: '普通', quota: 120, finalApplicants: 73, finalRate: 0.61 },
    { schoolName: '興部', department: '普通', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '雄武', department: '普通', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '北見北斗', department: '理数', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '美幌', department: '未来農業', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '北見工業', department: '電子機械', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '北見工業', department: '電気', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '北見工業', department: '建設', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '紋別', department: '電子機械', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '北見商業', department: '商業', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '北見商業', department: '流通経済', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '北見商業', department: '情報処理', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '網走桂陽', department: '商業', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '網走桂陽', department: '事務情報', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '紋別', department: '総合ビジネス', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '置戸', department: '福祉', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '斜里', department: '総合', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '大空', department: '総合', quota: 36, finalApplicants: 45, finalRate: 1.25 },
    { schoolName: '帯広柏葉', department: '普通', quota: 240, finalApplicants: 280, finalRate: 1.17 },
    { schoolName: '帯広三条', department: '普通', quota: 240, finalApplicants: 263, finalRate: 1.1 },
    { schoolName: '帯広緑陽', department: '普通', quota: 160, finalApplicants: 195, finalRate: 1.22 },
    { schoolName: '音更', department: '普通', quota: 120, finalApplicants: 60, finalRate: 0.5 },
    { schoolName: '上士幌', department: '普通', quota: 80, finalApplicants: 60, finalRate: 0.75 },
    { schoolName: '芽室', department: '普通', quota: 160, finalApplicants: 218, finalRate: 1.36 },
    { schoolName: '幕別清陵', department: '普通', quota: 120, finalApplicants: 112, finalRate: 0.93 },
    { schoolName: '鹿追', department: '普通', quota: 80, finalApplicants: 50, finalRate: 0.63 },
    { schoolName: '大樹', department: '地域探究', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '広尾', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '本別', department: '普通', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '足寄', department: '普通', quota: 80, finalApplicants: 46, finalRate: 0.58 },
    { schoolName: '帯広農業', department: '農業科学', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '帯広農業', department: '酪農科学', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '帯広農業', department: '食品科学', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '帯広農業', department: '農業土木工学', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '帯広農業', department: '森林科学', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '更別農業', department: '農業', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '更別農業', department: '生活科学', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '士幌', department: 'アグリビジネス', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '士幌', department: 'フードシステム', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '帯広工業', department: '電子機械', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '帯広工業', department: '電気', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '帯広工業', department: '建築', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '帯広工業', department: '環境土木', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '帯広南商業', department: '商業', quota: 200, finalApplicants: 246, finalRate: 1.23 },
    { schoolName: '清水', department: '総合', quota: 120, finalApplicants: 63, finalRate: 0.53 },
    { schoolName: '池田', department: '総合', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '釧路湖陵', department: '文理探究', quota: 160, finalApplicants: 187, finalRate: 1.17 },
    { schoolName: '釧路江南', department: '普通', quota: 200, finalApplicants: 206, finalRate: 1.03 },
    { schoolName: '釧路東', department: '普通', quota: 80, finalApplicants: 61, finalRate: 0.76 },
    { schoolName: '阿寒', department: '普通', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '白糠', department: '普通', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '弟子屈', department: '普通', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '厚岸翔洋', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '釧路北陽', department: '普通', quota: 200, finalApplicants: 204, finalRate: 1.02 },
    { schoolName: '霧多布', department: '普通', quota: 60, finalApplicants: 15, finalRate: 0.25 },
    { schoolName: '釧路湖陵', department: '理数探究', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '釧路工業', department: '電子機械', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '釧路工業', department: '電気', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '釧路工業', department: '建築', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '釧路工業', department: '土木', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '釧路工業', department: '工業化学', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '釧路商業', department: '流通マネジメント', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '釧路商業', department: '会計マネジメント', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '釧路商業', department: '情報マネジメント', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '厚岸翔洋', department: '海洋資源', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '釧路明輝', department: '総合', quota: 160, finalApplicants: 198, finalRate: 1.24 },
    { schoolName: '標茶', department: '総合', quota: 80, finalApplicants: 43, finalRate: 0.54 },
    { schoolName: '根室', department: '普通', quota: 120, finalApplicants: 84, finalRate: 0.7 },
    { schoolName: '別海', department: '普通', quota: 120, finalApplicants: 61, finalRate: 0.51 },
    { schoolName: '中標津', department: '普通', quota: 160, finalApplicants: 121, finalRate: 0.76 },
    { schoolName: '標津', department: '普通', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '羅臼', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '別海', department: '酪農経営', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '中標津農業', department: '生産技術', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '中標津農業', department: '食品ビジネス', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '根室', department: '商業', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '根室', department: '事務情報', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '中標津', department: '総合ビジネス', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    // 掛-1(学校別×多年度)第1弾: 空知地区・令和7年度（2025年度）分。以下すべてfiscalYear明記。
    { schoolName: '岩見沢東', department: '普通', quota: 160, finalApplicants: 138, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢東', department: '文理探究', quota: 80, finalApplicants: 78, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '月形', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '夕張', department: '普通', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長沼', department: '普通', quota: 80, finalApplicants: 47, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '栗山', department: '普通', quota: 80, finalApplicants: 37, finalRate: 0.46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢緑陵', department: '普通', quota: 160, finalApplicants: 157, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滝川', department: '普通', quota: 160, finalApplicants: 153, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '砂川', department: '普通', quota: 80, finalApplicants: 51, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芦別', department: '普通', quota: 80, finalApplicants: 23, finalRate: 0.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深川西', department: '普通', quota: 120, finalApplicants: 67, finalRate: 0.56, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滝川西', department: '普通', quota: 120, finalApplicants: 109, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滝川', department: '理数', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '農業科学', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '畜産科学', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '食品科学', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '農業土木工学', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '環境造園', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '森林科学', quota: 40, finalApplicants: 19, finalRate: 0.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢農業', department: '生活科学', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深川東', department: '生産科学', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新十津川農業', department: '農業・生活', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滝川工業', department: '電子機械', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滝川工業', department: '電気', quota: 40, finalApplicants: 12, finalRate: 0.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奈井江商業', department: '情報処理', quota: 40, finalApplicants: 8, finalRate: 0.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩見沢緑陵', department: '情報コミュニケーション', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '滝川西', department: '情報マネジメント', quota: 120, finalApplicants: 94, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三笠', department: '調理師', quota: 20, finalApplicants: 26, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三笠', department: '製菓', quota: 20, finalApplicants: 22, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美唄聖華', department: '衛生看護', quota: 80, finalApplicants: 51, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美唄尚栄', department: '総合', quota: 80, finalApplicants: 43, finalRate: 0.54, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第2弾: 石狩地区・令和7年度（2025年度）分。
    { schoolName: '札幌東', department: '普通', quota: 320, finalApplicants: 502, finalRate: 1.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌西', department: '普通', quota: 320, finalApplicants: 441, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌南', department: '普通', quota: 320, finalApplicants: 415, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌北', department: '普通', quota: 320, finalApplicants: 369, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌月寒', department: '普通', quota: 320, finalApplicants: 454, finalRate: 1.42, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌啓成', department: '普通', quota: 280, finalApplicants: 357, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌北陵', department: '普通', quota: 320, finalApplicants: 378, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌手稲', department: '普通', quota: 320, finalApplicants: 335, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌丘珠', department: '普通', quota: 280, finalApplicants: 271, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌西陵', department: '普通', quota: 240, finalApplicants: 257, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌白石', department: '普通', quota: 280, finalApplicants: 335, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌東陵', department: '普通', quota: 280, finalApplicants: 324, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌南陵', department: '普通', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌東豊', department: '普通', quota: 120, finalApplicants: 81, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌真栄', department: '普通', quota: 200, finalApplicants: 196, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌あすかぜ', department: '普通', quota: 80, finalApplicants: 96, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌稲雲', department: '普通', quota: 280, finalApplicants: 365, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌英藍', department: '普通', quota: 280, finalApplicants: 366, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌平岡', department: '普通', quota: 240, finalApplicants: 270, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌白陵', department: '普通', quota: 80, finalApplicants: 57, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌国際情報', department: '普通', quota: 80, finalApplicants: 116, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江別', department: '普通', quota: 200, finalApplicants: 230, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '野幌', department: '普通', quota: 120, finalApplicants: 58, finalRate: 0.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大麻', department: '普通', quota: 280, finalApplicants: 335, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千歳', department: '普通', quota: 200, finalApplicants: 243, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北広島', department: '普通', quota: 280, finalApplicants: 354, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北広島西', department: '普通', quota: 160, finalApplicants: 134, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石狩南', department: '普通', quota: 280, finalApplicants: 328, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '当別', department: '普通', quota: 40, finalApplicants: 14, finalRate: 0.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '恵庭南', department: '普通', quota: 200, finalApplicants: 177, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '恵庭北', department: '普通', quota: 240, finalApplicants: 244, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌啓成', department: '理数', quota: 40, finalApplicants: 87, finalRate: 2.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '恵庭南', department: '体育', quota: 80, finalApplicants: 80, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌国際情報', department: '国際文化', quota: 80, finalApplicants: 98, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千歳', department: '国際教養', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '当別', department: '園芸デザイン', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌工業', department: '機械', quota: 80, finalApplicants: 66, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌工業', department: '電気', quota: 80, finalApplicants: 65, finalRate: 0.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌工業', department: '建築', quota: 80, finalApplicants: 90, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌工業', department: '土木', quota: 80, finalApplicants: 56, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌琴似工業', department: '電子機械', quota: 80, finalApplicants: 92, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌琴似工業', department: '電気', quota: 80, finalApplicants: 89, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌琴似工業', department: '情報技術', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌琴似工業', department: '環境化学', quota: 80, finalApplicants: 85, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌国際情報', department: '理数工学', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌東商業', department: '流通経済', quota: 80, finalApplicants: 80, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌東商業', department: '国際経済', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌東商業', department: '会計ビジネス', quota: 80, finalApplicants: 80, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌東商業', department: '情報処理', quota: 80, finalApplicants: 81, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌国際情報', department: 'グローバルビジネス', quota: 120, finalApplicants: 153, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江別', department: '事務情報', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千歳', department: '国際流通', quota: 80, finalApplicants: 63, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江別', department: '生活デザイン', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '当別', department: '家政', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石狩翔陽', department: '総合', quota: 320, finalApplicants: 335, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '札幌厚別', department: '総合', quota: 280, finalApplicants: 320, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千歳北陽', department: '総合', quota: 160, finalApplicants: 103, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第3弾: 札幌市（市立高校）地区・令和7年度（2025年度）分。
    { schoolName: '市立札幌旭丘', department: '普通', quota: 240, finalApplicants: 333, finalRate: 1.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌藻岩', department: '普通', quota: 240, finalApplicants: 295, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌平岸', department: '普通', quota: 280, finalApplicants: 482, finalRate: 1.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌平岸', department: 'デザインアート', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌清田', department: '普通', quota: 200, finalApplicants: 250, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌清田', department: 'グローバル', quota: 40, finalApplicants: 58, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌新川', department: '普通', quota: 320, finalApplicants: 392, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌旭丘', department: '数理データサイエンス', quota: 80, finalApplicants: 70, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立札幌啓北商業', department: '未来商学', quota: 240, finalApplicants: 257, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第4弾: 後志地区・令和7年度（2025年度）分。
    { schoolName: '小樽潮陵', department: '普通', quota: 200, finalApplicants: 210, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽桜陽', department: '普通', quota: 200, finalApplicants: 218, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩内', department: '普通', quota: 80, finalApplicants: 58, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '寿都', department: '普通', quota: 40, finalApplicants: 28, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蘭越', department: '普通', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倶知安', department: '普通', quota: 160, finalApplicants: 127, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '倶知安農業', department: '生産科学', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽未来創造', department: '機械電気システム', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽未来創造', department: '建設システム', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽未来創造', department: '流通マネジメント', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽未来創造', department: '情報会計マネジメント', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩内', department: '地域産業ビジネス', quota: 40, finalApplicants: 4, finalRate: 0.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽水産', department: '海洋漁業', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽水産', department: '水産食品', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽水産', department: '栽培漁業', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小樽水産', department: '情報通信', quota: 40, finalApplicants: 12, finalRate: 0.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '余市紅志', department: '総合', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第5弾: 胆振地区・令和7年度（2025年度）分。
    { schoolName: '室蘭栄', department: '普通', quota: 120, finalApplicants: 138, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '室蘭清水丘', department: '普通', quota: 160, finalApplicants: 134, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '登別青嶺', department: '普通', quota: 120, finalApplicants: 89, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊達開来', department: '普通', quota: 200, finalApplicants: 136, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧東', department: '普通', quota: 240, finalApplicants: 349, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧西', department: '普通', quota: 160, finalApplicants: 182, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧南', department: '普通', quota: 160, finalApplicants: 181, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白老東', department: '普通', quota: 80, finalApplicants: 62, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '追分', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '厚真', department: '普通', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鵡川', department: '普通', quota: 80, finalApplicants: 42, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '室蘭栄', department: '理数', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '壮瞥', department: '地域農業', quota: 40, finalApplicants: 13, finalRate: 0.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '室蘭工業', department: '電子機械', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '室蘭工業', department: '電気', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '室蘭工業', department: '建設', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧工業', department: '電子機械', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧工業', department: '電気', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧工業', department: '情報技術', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧工業', department: '建築', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧工業', department: '土木', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧工業', department: '環境化学', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '虻田', department: '事務情報', quota: 40, finalApplicants: 12, finalRate: 0.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧総合経済', department: '流通経済', quota: 40, finalApplicants: 55, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧総合経済', department: '国際経済', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '苫小牧総合経済', department: '情報処理', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '室蘭東翔', department: '総合', quota: 160, finalApplicants: 169, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第6弾: 日高地区・令和7年度（2025年度）分。
    { schoolName: '平取', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富川', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '静内', department: '普通', quota: 200, finalApplicants: 163, finalRate: 0.815, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'えりも', department: '普通', quota: 70, finalApplicants: 29, finalRate: 0.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '静内農業', department: '食品科学', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '静内農業', department: '生産科学', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦河', department: '総合', quota: 120, finalApplicants: 83, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第6弾: 渡島地区・全日制普通科・令和7年度（2025年度）分（専門/総合は次回）。
    { schoolName: '函館中部', department: '普通', quota: 160, finalApplicants: 186, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館西', department: '普通', quota: 240, finalApplicants: 310, finalRate: 1.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南茅部', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上磯', department: '普通', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '七飯', department: '普通', quota: 120, finalApplicants: 103, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松前', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八雲', department: '普通', quota: 80, finalApplicants: 63, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長万部', department: '普通', quota: 40, finalApplicants: 7, finalRate: 0.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立函館', department: '普通', quota: 200, finalApplicants: 259, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '知内', department: '普通', quota: 80, finalApplicants: 31, finalRate: 0.39, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第7弾: 渡島地区・専門教育を主とする学科及び総合学科・令和7年度（2025年度）分。
    { schoolName: '函館中部', department: '理数', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大野農業', department: '農業科学', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大野農業', department: '園芸福祉', quota: 40, finalApplicants: 15, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大野農業', department: '食品科学', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館工業', department: '電子機械', quota: 40, finalApplicants: 60, finalRate: 1.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館工業', department: '電気情報工学', quota: 40, finalApplicants: 54, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館工業', department: '建築', quota: 40, finalApplicants: 55, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館工業', department: '環境土木', quota: 40, finalApplicants: 52, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館工業', department: '工業化学', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館商業', department: '流通ビジネス', quota: 40, finalApplicants: 67, finalRate: 1.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館商業', department: '国際経済', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館商業', department: '会計ビジネス', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館商業', department: '情報処理', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福島商業', department: '商業', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八雲', department: '総合ビジネス', quota: 40, finalApplicants: 7, finalRate: 0.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館水産', department: '海洋技術', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館水産', department: '水産食品', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館水産', department: '品質管理流通', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '函館水産', department: '機関工学', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '森', department: '総合', quota: 40, finalApplicants: 28, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第7弾: 檜山地区・令和7年度（2025年度）分。
    { schoolName: '江差', department: '普通', quota: 80, finalApplicants: 47, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上ノ国', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '奥尻', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '檜山北', department: '総合', quota: 80, finalApplicants: 53, finalRate: 0.66, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第8弾: 上川地区・全日制普通科・令和7年度（2025年度）分。
    { schoolName: '旭川東', department: '普通', quota: 240, finalApplicants: 293, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川西', department: '普通', quota: 160, finalApplicants: 185, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川北', department: '普通', quota: 200, finalApplicants: 213, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川永嶺', department: '普通', quota: 200, finalApplicants: 264, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鷹栖', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東川', department: '普通', quota: 80, finalApplicants: 72, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美瑛', department: '普通', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上川', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富良野', department: '普通', quota: 120, finalApplicants: 106, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上富良野', department: '普通', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南富良野', department: '普通', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '士別翔雲', department: '普通', quota: 120, finalApplicants: 82, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '名寄', department: '普通', quota: 160, finalApplicants: 109, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美深', department: '普通', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1第8弾: 上川地区・専門教育を主とする学科及び総合学科・令和7年度（2025年度）分。
    { schoolName: '旭川西', department: '理数', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'おといねっぷ美術工芸', department: '工芸', quota: 40, finalApplicants: 53, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川農業', department: '農業科学', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川農業', department: '食品科学', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川農業', department: '森林科学', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川農業', department: '生活科学', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富良野', department: '園芸観光デザイン', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川工業', department: '電子機械', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川工業', department: '電気', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川工業', department: '情報技術', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川工業', department: '建築', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川工業', department: '土木', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川工業', department: '工業化学', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '名寄', department: '情報技術', quota: 40, finalApplicants: 19, finalRate: 0.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富良野', department: '電気情報システム', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川商業', department: '流通ビジネス', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川商業', department: '国際ビジネス', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川商業', department: '会計', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川商業', department: '情報処理', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '士別翔雲', department: '総合ビジネス', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '下川商業', department: '商業', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '旭川南', department: '総合', quota: 200, finalApplicants: 259, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '剣淵', department: '総合', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
  ],
};
