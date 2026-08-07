/**
 * 東京都 公立高等学校 倍率パイプラインα（Y-2・先行8県の1県目・型化担当）。
 *
 * 一次ソース: 東京都教育委員会「令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）」
 * https://www.kyoiku.metro.tokyo.lg.jp/admission/high_school/past/first_application/20260213_ichiji_final
 * 個票（普通科・コース/単位制以外）:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182440-757
 * 総括表:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/01-v2
 * 公表日: 2026-02-13（令和8年度・最終応募状況）
 *
 * 個票（普通科・コース制/単位制/海外帰国生徒対象）:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182442-923
 * 個票（専門学科13学科・総合学科・定時制/チャレンジスクール）:
 * https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/03-3-v2
 *
 * ✅全日制167校を完了（coverage参照）。普通科119校＋専門学科38校（商業/ビジネス
 * コミュニケーション/工業(単位制含む)/科学技術/農業/水産/家庭(単位制含む)/福祉/理数/
 * 芸術/体育/国際/併合/産業の13学科）＋総合学科10校。3種の合計は総括表の「全日制合計」
 * 167校・30,439・38,148・1.25と完全一致（本ファイル末尾のofficialSubtotals参照）。
 * 定時制課程（チャレンジスクール等）・在京外国人生徒等対象選抜は全日制の外側の別集計の
 * ため対象外（Y-1の学校マスターとは別途の課程区分であり、本タスクのスコープ外）。
 *
 * ⚠️掛-1（R6追加・3年度目・第1弾）: R6一次資料は東京都教育委員会「令和6年度東京都立高等学校
 * 入学者選抜応募状況（最終応募状況）」（過去ページ admission/high_school/past/first_application/
 * release20240214_02から発見）。総括表（documents/d/kyoiku/2_54）の「全日制合計」167校・
 * quota30,343・applicants42,017・倍率1.38を最終目標として記録。R7と同型のPDF構成（1[普通科
 * (コース、単位制以外の学校)]=documents/d/kyoiku/4_35・全3頁）で、R7と異なりB(内定者数)/
 * D(第一志願者数)/E列を持たず募集人員/最終応募人員/最終応募倍率の3列のみとシンプル。今回は
 * 1頁目（千代田〜練馬の18区・43校）をpdftoppm 300dpiビジョン解析で転記した。深沢（世田谷）は
 * R7と同様まだ単位制へ分類変更される前でこの通常表に含まれる（quota142・applicants124）。
 * 残り（足立/葛飾/江戸川の区部15校＋多摩部44校＋島しょ6校＋コース制/単位制/海外帰国生徒対象＋
 * 専門学科13学科＋総合学科）はR7と同じくtokyoのURLパターンに沿って次回以降のセッションで
 * 横展開を継続する（R7は第1弾〜第10弾の10回に分けて完結させた前例に倣う）。
 *
 * ⚠️掛-1（R6追加・第2弾）: 2頁目（区部残り15校=足立7・葛飾2・江戸川6＋多摩部30校=八王子5・
 * 立川1・武蔵野1・青梅1・府中3・昭島2・調布3・町田5・小金井1・小平3・日野3・東村山2）を追加した。
 * この頁末尾に印字されたページ内小計「区部計12,172/18,828/1.55」が、1頁目43校(quota9,060・
 * applicants14,579)+2頁目区部残り15校(quota3,112・applicants4,249)=58校の合計と完全一致（node.js
 * で機械計算し確認）。R7と同じく深沢を含めて区部58校（R8基準の57校+1）で説明がつく。多摩部30校は
 * 継続中（頁末尾の小計はまだ印字されない・3頁目の残り14校を待つ）。
 *
 * ⚠️掛-1（R6追加・第3弾・個票PDF1完結）: 3頁目「1[普通科(コース単位制以外)]」の多摩部残り14校
 * （国立/福生/狛江/東大和×2/清瀬/久留米西/武蔵村山/永山/羽村/秋留台/五日市/田無/保谷）と
 * 「2[普通科(島しょの学校)]」6校（大島/新島/神津/三宅/八丈/小笠原）を追加し、個票PDF1
 * （区部58+多摩部44+島しょ6=108校）が完結した。頁末尾に印字された3つの小計「多摩部計
 * 9,309/12,723/1.37」「コース、単位制以外計21,481/31,551/1.47」「島しょ計306/91/0.30」
 * 全てが機械集計と完全一致（node.jsで確認・多摩部計=2頁目30校+3頁目14校=44校、コース単位制
 * 以外計=区部計12,172+多摩部計9,309、いずれも1頁目冒頭の総括表の値とも整合）。多摩部44校・
 * 島しょ6校という数もR8と完全一致。次回はコース制/単位制/海外帰国生徒対象（総括表の他URLを
 * 過去ページrelease20240214_02から探索）に進む。
 *
 * ⚠️掛-1（R6追加・第4弾）: R6はR7と異なり「3[コース制]・4[単位制]」と「5[海外帰国生徒対象]」が
 * 1本のPDF（documents/d/kyoiku/3_44・全2頁）にまとまっている（R7は個票PDFが「1」と「3〜5」で
 * 分かれていたが、R6は同じ過去ページのリンクで「普通科（コース・単位制以外）」＝documents/d/kyoiku/
 * 4_35、「普通科（コース・単位制・海外帰国生徒対象）」＝documents/d/kyoiku/3_44の2本立て）。
 * コース制4校（深川外国語・片倉造形美術・松が谷外国語・小平外国語）・単位制11校（深沢が含まれない
 * 点も含めR7と学校構成が完全一致）・海外帰国生徒対象6校（帰国生3+引揚者3）を追加した。印字された
 * 4つの小計「コース制計224/364/1.63」「単位制計2,146/3,131/1.46」「帰国対象計44/67/1.52」
 * 「引揚対象計18/0/0.00」（→海外帰国生徒対象計62/67/1.08）全てが機械集計と完全一致（node.jsで
 * 確認）。さらにPDF末尾の「普通科計24,219/35,204/1.45」（119校相当）が、これまで収録した5区分
 * （コース単位制以外計21,481+島しょ計306+コース制計224+単位制計2,146+海外帰国生徒対象計62、
 * applicants側も同様）の合計と完全一致することを確認し、**R6の普通科119校が全て完結**した。
 *
 * ⚠️掛-1（R6追加・第5弾）: 「専門学科・定時制課程（単位制）」（documents/d/kyoiku/1_61・全8頁）を
 * 取得。6[商業に関する学科]〜22[総合学科]の17区分（商業7校・ビジネスコミュニケーション科2校・
 * 工業科（単位制以外）15校・工業科（単位制）1校・科学技術科2校・農業科5校・水産科1校・家庭科
 * （単位制以外）3校・家庭科（単位制）1校・福祉科2校・理数科2校・芸術科1校・体育科2校・国際科
 * 1校・併合科3校・産業科2校・総合学科10校＝レコード数60）を追加した。23[定時制課程（単位制の
 * 学校）]・24[チャレンジスクール等]は全日制外のスコープ外として除外した。工業科・農業科・家庭科・
 * 国際科・産業科は学校内の複数コース（例: 蔵前工科の機械/電気/建築/設備工業）を合算した学校ごとの
 * 「計」行を1レコードとして採用（R7/R8と同じ規則）。ページ内に印字された17個の小計「商業計
 * 795/812/1.02」「ビジネスコミュニケーション科計231/256/1.11」「工業計(単位制以外)1,584/1,252/0.79」
 * 「単位制計108/87/0.81」「工業合計1,692/1,339/0.79」「科学技術科計252/383/1.52」「農業計
 * 413/477/1.15」「水産計42/45/1.07」「家庭計222/216/0.97」「単位制計49/55/1.12」「家庭合計
 * 271/271/1.00」「福祉計53/14/0.26」「理数計68/169/2.49」「芸術計112/219/1.96」「体育計52/59/1.13」
 * 「国際計138/302/2.19」「併合科計105/18/0.17」「産業科計274/294/1.07」「総合学科計
 * 1,626/2,155/1.33」全てが機械集計と完全一致（node.jsで確認）。これで**tokyo R6(167校)が完了**した。
 *
 * ⚠️掛-1（R5追加・4年度目・第1弾）: R5一次資料は東京都教育委員会の過去ページ
 * （admission/high_school/past/first_application/release20230214_02）から発見。総括表
 * （documents/d/kyoiku/01_teisei_2・令和5年2月21日訂正版）で全日制合計167校・quota30,825・
 * applicants42,236・倍率1.37を確認（訂正前の値は打消線で併記されており訂正後の赤字を採用）。
 * 個票「1[普通科（コース、単位制以外の学校）]」（documents/d/kyoiku/03_teisei_2・全3頁）の
 * 1〜2頁目（区部58校＝千代田〜練馬の18区43校＋足立/葛飾/江戸川15校）をpdftoppm 300dpiビジョン
 * 解析で転記した。杉並「西」は最終応募人員・倍率が令和5年2月21日訂正の対象校で、訂正後の値
 * （女230・計463・倍率計1.83）を採用した。頁末尾の「区部計12,531/19,195/1.53」（訂正後の値）が
 * 58校の機械集計と完全一致（node.jsで確認）。R6/R7/R8と同じく深沢を含む58校で区部が構成される。
 *
 * ⚠️掛-1（R5追加・第2弾・個票PDF1完結）: 3頁目の多摩部44校（八王子5・立川1・武蔵野1・青梅1・
 * 府中3・昭島2・調布3・町田5・小金井1・小平3・日野3・東村山2・国立1・福生1・狛江1・東大和2・
 * 清瀬1・東久留米1・武蔵村山1・多摩1・羽村1・あきる野2・西東京2）と「2[普通科（島しょの学校）]」
 * 6校（大島/新島/神津/三宅/八丈/小笠原）を追加。新島は令和5年2月21日訂正の対象校で訂正後の値
 * （計10・倍率0.25）を採用。頁末尾の3つの小計「多摩部計9,388/12,778/1.36」「コース、単位制以外計
 * 21,919/31,973/1.46」（訂正後）「島しょ計307/130/0.42」（訂正後）全てが機械集計と完全一致
 * （node.jsで確認・コース単位制以外計=区部計12,531+多摩部計9,388、いずれも整合）。これで
 * **個票PDF1（区部58+多摩部44+島しょ6=108校）が完結**した。次回はPDF2「4[普通科（コース制の
 * 学校）]・5[普通科（単位制の学校）]・海外帰国生徒対象」（documents/d/kyoiku/04_teisei_3）に進む。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const TOKYO_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tokyo',
  sources: [
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182440-757',
      docTitle:
        '東京都教育委員会 令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）1[普通科（コース、単位制以外の学校）]・2[普通科（島しょの学校）]',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2026-02-13-182442-923',
      docTitle:
        '東京都教育委員会 令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）3[普通科（コース制の学校）]・4[普通科（単位制の学校）]・5[普通科（海外帰国生徒対象）]',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/03-3-v2',
      docTitle:
        '東京都教育委員会 令和8年度東京都立高等学校入学者選抜応募状況（最終応募状況）6〜22[専門学科13学科・総合学科]（23〜25の定時制課程・チャレンジスクール・在京外国人生徒等対象選抜は全日制の外側のため対象外）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2025-02-13-002',
      docTitle:
        '東京都教育委員会 令和7年度東京都立高等学校入学者選抜応募状況（最終応募状況）1[普通科（コース、単位制以外の学校）]（掛-1・学校別×多年度のtokyo横展開第1弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2025-02-13-003',
      docTitle:
        '東京都教育委員会 令和7年度東京都立高等学校入学者選抜応募状況（最終応募状況）3[普通科（コース制の学校）]・4[普通科（単位制の学校）]・5[普通科（海外帰国生徒対象）]（掛-1・tokyo横展開第4弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/2025-02-13-004',
      docTitle:
        '東京都教育委員会 令和7年度東京都立高等学校入学者選抜応募状況（最終応募状況）6〜22[専門学科13学科・総合学科]（全8頁・掛-1・tokyo横展開第5弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/4_35',
      docTitle:
        '東京都教育委員会 令和6年度東京都立高等学校入学者選抜応募状況（最終応募状況）1[普通科（コース、単位制以外の学校）]・2[普通科（島しょの学校）]（掛-1・tokyo横展開R6第1〜3弾・全3頁完結）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/3_44',
      docTitle:
        '東京都教育委員会 令和6年度東京都立高等学校入学者選抜応募状況（最終応募状況）3[普通科（コース制の学校）]・4[普通科（単位制の学校）]・5[普通科（海外帰国生徒対象）]（掛-1・tokyo横展開R6第4弾・全2頁完結・普通科119校完了）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/1_61',
      docTitle:
        '東京都教育委員会 令和6年度東京都立高等学校入学者選抜応募状況（最終応募状況）6〜22[専門学科13学科・総合学科]（23〜24の定時制課程・チャレンジスクールは対象外・掛-1・tokyo横展開R6第5弾・全8頁中1〜6頁・R6(167校)完結）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.kyoiku.metro.tokyo.lg.jp/documents/d/kyoiku/03_teisei_2',
      docTitle:
        '東京都教育委員会 令和5年度東京都立高等学校入学者選抜応募状況（最終応募状況・令和5年2月21日訂正版）1[普通科（コース、単位制以外の学校）]・2[普通科（島しょの学校）]（掛-1・tokyo横展開R5第1〜2弾・全3頁完結・区部58+多摩部44+島しょ6=108校）',
      fiscalYear: '令和5年度（2023年度）',
      fetchedAt: '2026-08-08',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: [
      '普通科（コース・単位制・海外帰国生徒対象・専門学科・総合学科以外）',
      '普通科（島しょの学校）',
      '普通科（コース制の学校）',
      '普通科（単位制の学校）',
      '普通科（海外帰国生徒対象）',
      '専門学科（商業・ビジネスコミュニケーション・工業・科学技術・農業・水産・家庭・福祉・理数・芸術・体育・国際・併合・産業の13学科）',
      '総合学科',
    ],
    pendingDepartments: [],
    note:
      '全日制167校（普通科119＋専門学科38＋総合学科10）を全て取り込み済み。定時制課程（チャレンジスクール等）・在京外国人生徒等対象選抜は全日制の外側の別集計のため対象外（スコープ外として明示的に除外）。' +
      '⚠️2026-08-07(掛-1横展開・hokkaidoで確立した技法をtokyoに横展開する第1弾): R7(令和7年度)版の' +
      '個票PDF「1[普通科(コース、単位制以外の学校)]」(documents/d/kyoiku/2025-02-13-002)が' +
      '東京都教育委員会の過去ページ(admission/high_school/past/first_application/2025021301)から' +
      '発見でき、hokkaidoと同型の埋め込みフォント欠落(pdftotext -layoutは数値列のみ抽出可・学校名は' +
      'ビジョン解析が必要)を確認したうえで、1頁目(千代田〜練馬の18区・43校)を収録した。' +
      '⚠️発見: 世田谷区「深沢」高校はR8ではdepartment"普通科(単位制)"に分類されているが、R7の' +
      'このPDFでは通常の「普通科(コース、単位制以外)」表に掲載されていた(quota142→130、' +
      'applicants123→82と規模も縮小)。誤読ではなく、深沢高校が令和7→8年度にかけて単位制に' +
      '移行したことを示す実在の制度変更と考えられるため、R7レコードのdepartmentは"普通科"' +
      '(このPDFの表どおり)のまま記録した。区部57校のうち残り(足立/葛飾/江戸川)・多摩部44校・' +
      '島しょ6校、およびコース制/単位制/海外帰国生徒対象(002以外のPDF)・専門学科13学科・総合学科' +
      'は次回以降のセッションで横展開を継続する。' +
      '⚠️追記(2頁目・区部残り15校+多摩部30校): 足立/葛飾/江戸川の区部残り15校と、八王子/立川/武蔵野/' +
      '青梅/府中/昭島/調布/町田/小金井/小平/日野/東村山の多摩部30校(継続中)を追加した。この頁末尾に' +
      'ページ内小計「区部計 12,036/17,140/1.42」が印字されており、1頁目(43校)+2頁目区部残り(15校・' +
      '深沢含む)=58校のquota合計8951+3085=12036・applicants合計13460+3680=17140と両方とも完全一致' +
      '(node.jsで機械計算し確認)。**この58という数はR8の区部57校+1(深沢が単位制へ移行する前のR7時点' +
      'ではまだ区部の通常表に含まれていたため)で説明がつき、転記精度の傍証になる**。' +
      '⚠️追記(3頁目・多摩部残り14校+島しょ6校=20校): これで個票PDF「1[普通科(コース、単位制以外の' +
      '学校)]」(2025-02-13-002)は完結(区部58+多摩部44+島しょ6=108校)。頁末尾の「多摩部計' +
      '9,219/11,703/1.27」小計と、2頁目多摩部30校+3頁目多摩部14校=44校のquota/applicants合計が' +
      '両方とも完全一致(9219/11703・node.jsで機械計算し確認)。多摩部44校という数もR8の多摩部44校と' +
      '完全一致し、区部(深沢の分類差1校を除き)・多摩部・島しょいずれも学校数の整合が取れている。' +
      '次回は002以外のPDF(コース制/単位制/海外帰国生徒対象=003、専門学科13学科・総合学科=03-3-v2)' +
      'のR7版を同じ過去ページから探して横展開する。' +
      '⚠️追記(掛-1第4弾): PDF「3[コース制]・4[単位制]・5[海外帰国生徒対象]」(2025-02-13-003)を' +
      '追加した。コース制4校(深川外国語・片倉造形美術・松が谷外国語・小平外国語)はR8と学校構成が' +
      '完全一致、印字小計「コース制計224/276/1.23」ともquota/applicants合計が一致(224/276)。' +
      '**単位制は11校のみ(R8は12校)**——R8で唯一の相違点は「深沢」で、これは1頁目で発見済みの' +
      '深沢の分類変更(R7では普通科の通常表に掲載・単位制表には未掲載)と完全に整合する追加の証拠に' +
      'なった。印字小計「単位制計2,151/2,883/1.34」ともquota/applicants合計が一致(2151/2883・' +
      'node.jsで機械計算し確認)。海外帰国生徒対象6校(帰国生3+引揚者3)もR8と学校構成・quota額が' +
      '完全一致(引揚者3校は3年ともapplicants0)。これでPDF「1〜5」(区部/多摩部/島しょ/コース制/' +
      '単位制/海外帰国生徒対象=普通科129校相当のうちR7では128校)が完結。次回は専門学科13学科・' +
      '総合学科(03-3-v2のR7版)を探索する。' +
      '⚠️追記(掛-1第5弾): R7版の専門学科13学科・総合学科は個票PDF「2025-02-13-004」(全8頁)に' +
      'まとまっていると確認した(R8では03-3-v2という1本のPDFに相当)。1頁目「6[商業に関する学科]」' +
      '7校＋「7[ビジネスコミュニケーション科]」2校を追加した。学校構成はR8と完全一致し、印字小計' +
      '「商業計792/777/0.98」「ビジネスコミュニケーション科計231/245/1.06」ともquota/applicants' +
      '合計が完全一致(node.jsで機械計算し確認)。残り7頁(工業/科学技術/農業/水産/家庭/福祉/理数/' +
      '芸術/体育/国際/併合/産業の11学科＋総合学科)は次回以降のセッションで継続する。' +
      '⚠️追記(掛-1第6弾): 2頁目「8[工業に関する学科(単位制以外の学校)]」11校を追加した。この頁は' +
      '学校ごとに複数の学科・コース(例: 工芸=マシンクラフト/アートクラフト/インテリア/デザイン/' +
      'グラフィックアーツの5コース)に分かれ、頁内に学校ごとの「計」行が印字されている。R8のtokyo.ts' +
      'は各校を1レコードに集約(学校名+department"工業科"の単一レコードでコース別内訳は持たない)して' +
      'いるため、R7もこの「計」行の値をそのまま1校1レコードとして収録した(コース別の内訳は非収録)。' +
      '11校(工芸・蔵前工科・墨田工科・総合工科・中野工科・杉並工科・荒川工科・北豊島工科・練馬工科・' +
      '足立工科・葛西工科)全てR8と学校構成が一致。工業科は全15校のためR8にある残り4校(府中工科・' +
      '町田工科・多摩工科・田無工科)は次頁(3頁目)に続く見込み。' +
      '⚠️追記(掛-1第7弾): 3頁目で工業科(単位制以外)残り4校(府中工科・町田工科・多摩工科・田無工科)を' +
      '追加し工業科(単位制以外)全15校が完結。印字小計「工業計1,575/1,231/0.78」がquota/applicants' +
      '合計と完全一致(node.jsで機械計算し確認)。続けて「9[工業に関する学科(単位制の学校)]」六郷工科' +
      '1校(単位制計96/68/0.71)・「10[科学技術科]」2校(科学技術・多摩科学技術・計252/319/1.27)も' +
      '同頁に収録されていたため合わせて追加した。工業科(単位制以外+単位制)の頁内合計「工業合計' +
      '1,671/1,299/0.78」とも完全一致。これでR7の工業科(単位制以外/単位制)・科学技術科が全て完結。' +
      '次頁(4頁目)は農業科/水産科等が続く見込み。' +
      '⚠️追記(掛-1第8弾): 4頁目「11[農業に関する学科]」5校・「12[水産に関する学科]」1校・' +
      '「13[家庭に関する学科(単位制以外の学校)]」3校の計9校を追加した。印字小計「農業計413/536/1.30」' +
      '「水産計42/46/1.10」「家庭計222/193/0.87」の3つ全てがcompetition-rate-history側のREIWA_7' +
      'カテゴリ値(農業科413/536/1.30・水産科42/46/1.10・家庭科(単位制以外)222/193/0.87)と完全一致' +
      '(node.js機械計算で確認)。府中の「農業」高校は農業科・家庭科の両方に学科を持つため2レコードに' +
      'なる(R8のtokyo.tsと同じ構造)。次頁(5頁目)は家庭科(単位制)/福祉科/理数科等が続く見込み。' +
      '⚠️追記(掛-1第9弾): 5頁目「14[家庭に関する学科(単位制の学校)]」1校・「15[福祉に関する学科]」2校・' +
      '「16[理数に関する学科]」2校・「17[芸術に関する学科]」1校・「18[体育に関する学科]」2校の計8校を' +
      '追加した。印字小計「家庭合計271/237/0.87」(単位制以外222/193+単位制49/44の合算と整合)・' +
      '「福祉計50/32/0.64」「理数計72/230/3.19」「芸術計112/200/1.79」「体育計52/85/1.63」の' +
      '全てがcompetition-rate-history側のREIWA_7カテゴリ値(家庭科(単位制)49/44/0.90・福祉科50/32/0.64・' +
      '理数科72/230/3.19・芸術科112/200/1.79・体育科52/85/1.63)と完全一致(node.js機械計算で確認)。' +
      '次頁(6頁目)は国際科/併合科/産業科等が続く見込み。' +
      '⚠️追記(掛-1第10弾・個票PDF004完結): 6頁目「19[国際関係に関する学科]」1校・「20[併合科]」3校・' +
      '「21[産業科]」2校・「22[総合学科]」10校の計16校を追加した。印字小計「国際計138/243/1.76」' +
      '「併合科計105/11/0.10」「産業科計252/245/0.97」「総合学科計1,626/2,036/1.25」全てが' +
      'competition-rate-history側のREIWA_7カテゴリ値と完全一致(node.js機械計算で確認)。7頁目「23[定時制' +
      '課程(単位制の学校)]」・8頁目「24[定時制課程単位制総合学科(チャレンジスクール)及び定時制課程単位制' +
      '普通科(チャレンジ枠)]」は目視確認のうえ全日制の外側の別集計としてスコープ外(既存のR8方針と同一)。' +
      'これで個票PDF「1〜5」(2025-02-13-002/003/004)全てが完結し、**R7(令和7年度)の全日制167校相当の' +
      '学校別データが1〜22の全区分で収録完了**(coverage参照)。次回セッションでは掛-1の対象県を' +
      'tokyo以外(hokkaido以外の残り45県)へ横展開するフェーズに進む。',
  },
  officialSubtotals: [
    { label: '区部計', schoolCount: 57, quota: 12088, finalApplicants: 16926, finalRate: 1.4 },
    { label: '多摩部計', schoolCount: 44, quota: 9344, finalApplicants: 11630, finalRate: 1.24 },
    { label: '島しょ計', schoolCount: 6, quota: 310, finalApplicants: 100, finalRate: 0.32 },
    { label: 'コース、単位制以外計（区部+多摩部）', schoolCount: 101, quota: 21432, finalApplicants: 28556, finalRate: 1.33 },
    {
      label: '普通科（コース、単位制、海外帰国生徒対象以外）計＋普通科（島しょ）計',
      schoolCount: 107,
      quota: 21742,
      finalApplicants: 28656,
      finalRate: 1.32,
    },
    { label: 'コース制計', schoolCount: 4, quota: 224, finalApplicants: 279, finalRate: 1.25 },
    { label: '単位制計', schoolCount: 12, quota: 2276, finalApplicants: 2948, finalRate: 1.3 },
    { label: '帰国対象計', schoolCount: 3, quota: 44, finalApplicants: 67, finalRate: 1.52 },
    { label: '引揚対象計', schoolCount: 3, quota: 18, finalApplicants: 0, finalRate: 0 },
    { label: '海外帰国生徒対象計', schoolCount: 6, quota: 62, finalApplicants: 67, finalRate: 1.08 },
    { label: '普通科計', schoolCount: 119, quota: 24304, finalApplicants: 31950, finalRate: 1.31 },
    { label: '商業計', schoolCount: 7, quota: 798, finalApplicants: 717, finalRate: 0.9 },
    { label: 'ビジネスコミュニケーション科計', schoolCount: 2, quota: 231, finalApplicants: 227, finalRate: 0.98 },
    { label: '工業計', quota: 1690, finalApplicants: 1219, finalRate: 0.72 },
    { label: '科学技術科計', schoolCount: 2, quota: 254, finalApplicants: 287, finalRate: 1.13 },
    { label: '農業計', schoolCount: 5, quota: 413, finalApplicants: 450, finalRate: 1.09 },
    { label: '水産計', schoolCount: 1, quota: 42, finalApplicants: 57, finalRate: 1.36 },
    { label: '家庭合計', quota: 271, finalApplicants: 276, finalRate: 1.02 },
    { label: '福祉計', schoolCount: 2, quota: 54, finalApplicants: 34, finalRate: 0.63 },
    { label: '理数計', schoolCount: 2, quota: 71, finalApplicants: 210, finalRate: 2.96 },
    { label: '芸術計', schoolCount: 1, quota: 112, finalApplicants: 182, finalRate: 1.63 },
    { label: '体育計', schoolCount: 2, quota: 56, finalApplicants: 62, finalRate: 1.11 },
    { label: '国際計', schoolCount: 1, quota: 138, finalApplicants: 250, finalRate: 1.81 },
    { label: '併合科計', schoolCount: 3, quota: 105, finalApplicants: 16, finalRate: 0.15 },
    { label: '産業科計', schoolCount: 2, quota: 274, finalApplicants: 227, finalRate: 0.83 },
    { label: '専門学科合計', schoolCount: 38, quota: 4509, finalApplicants: 4214, finalRate: 0.93 },
    { label: '総合学科計', schoolCount: 10, quota: 1626, finalApplicants: 1984, finalRate: 1.22 },
    { label: '全日制合計', schoolCount: 167, quota: 30439, finalApplicants: 38148, finalRate: 1.25 },
  ],
  records: [
    // ===== 区部（57校） =====
    { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 520, finalRate: 2.06 },
    { schoolName: '三田', area: '港', department: '普通科', quota: 236, finalApplicants: 343, finalRate: 1.45 },
    { schoolName: '戸山', area: '新宿', department: '普通科', quota: 252, finalApplicants: 474, finalRate: 1.88 },
    { schoolName: '竹早', area: '文京', department: '普通科', quota: 177, finalApplicants: 293, finalRate: 1.66 },
    { schoolName: '向丘', area: '文京', department: '普通科', quota: 220, finalApplicants: 345, finalRate: 1.57 },
    { schoolName: '上野', area: '台東', department: '普通科', quota: 252, finalApplicants: 471, finalRate: 1.87 },
    { schoolName: '日本橋', area: '墨田', department: '普通科', quota: 189, finalApplicants: 204, finalRate: 1.08 },
    { schoolName: '本所', area: '墨田', department: '普通科', quota: 189, finalApplicants: 273, finalRate: 1.44 },
    { schoolName: '城東', area: '江東', department: '普通科', quota: 252, finalApplicants: 413, finalRate: 1.64 },
    { schoolName: '東', area: '江東', department: '普通科', quota: 189, finalApplicants: 298, finalRate: 1.58 },
    { schoolName: '深川', area: '江東', department: '普通科', quota: 185, finalApplicants: 265, finalRate: 1.43 },
    { schoolName: '大崎', area: '品川', department: '普通科', quota: 221, finalApplicants: 349, finalRate: 1.58 },
    { schoolName: '小山台', area: '品川', department: '普通科', quota: 252, finalApplicants: 412, finalRate: 1.63 },
    { schoolName: '八潮', area: '品川', department: '普通科', quota: 188, finalApplicants: 131, finalRate: 0.7 },
    { schoolName: '駒場', area: '目黒', department: '普通科', quota: 220, finalApplicants: 458, finalRate: 2.08 },
    { schoolName: '目黒', area: '目黒', department: '普通科', quota: 189, finalApplicants: 395, finalRate: 2.09 },
    { schoolName: '大森', area: '大田', department: '普通科', quota: 127, finalApplicants: 64, finalRate: 0.5 },
    { schoolName: '蒲田', area: '大田', department: '普通科', quota: 109, finalApplicants: 99, finalRate: 0.91 },
    { schoolName: '田園調布', area: '大田', department: '普通科', quota: 188, finalApplicants: 306, finalRate: 1.63 },
    { schoolName: '雪谷', area: '大田', department: '普通科', quota: 221, finalApplicants: 359, finalRate: 1.62 },
    { schoolName: '桜町', area: '世田谷', department: '普通科', quota: 252, finalApplicants: 286, finalRate: 1.13 },
    { schoolName: '千歳丘', area: '世田谷', department: '普通科', quota: 221, finalApplicants: 287, finalRate: 1.3 },
    { schoolName: '松原', area: '世田谷', department: '普通科', quota: 156, finalApplicants: 246, finalRate: 1.58 },
    { schoolName: '青山', area: '渋谷', department: '普通科', quota: 221, finalApplicants: 455, finalRate: 2.06 },
    { schoolName: '広尾', area: '渋谷', department: '普通科', quota: 154, finalApplicants: 280, finalRate: 1.82 },
    { schoolName: '鷺宮', area: '中野', department: '普通科', quota: 220, finalApplicants: 403, finalRate: 1.83 },
    { schoolName: '武蔵丘', area: '中野', department: '普通科', quota: 253, finalApplicants: 319, finalRate: 1.26 },
    { schoolName: '杉並', area: '杉並', department: '普通科', quota: 253, finalApplicants: 357, finalRate: 1.41 },
    { schoolName: '豊多摩', area: '杉並', department: '普通科', quota: 252, finalApplicants: 419, finalRate: 1.66 },
    { schoolName: '西', area: '杉並', department: '普通科', quota: 252, finalApplicants: 383, finalRate: 1.52 },
    { schoolName: '豊島', area: '豊島', department: '普通科', quota: 252, finalApplicants: 535, finalRate: 2.12 },
    { schoolName: '文京', area: '豊島', department: '普通科', quota: 284, finalApplicants: 381, finalRate: 1.34 },
    { schoolName: '竹台', area: '荒川', department: '普通科', quota: 171, finalApplicants: 238, finalRate: 1.39 },
    { schoolName: '板橋', area: '板橋', department: '普通科', quota: 221, finalApplicants: 346, finalRate: 1.57 },
    { schoolName: '大山', area: '板橋', department: '普通科', quota: 157, finalApplicants: 72, finalRate: 0.46 },
    { schoolName: '北園', area: '板橋', department: '普通科', quota: 253, finalApplicants: 421, finalRate: 1.66 },
    { schoolName: '高島', area: '板橋', department: '普通科', quota: 252, finalApplicants: 282, finalRate: 1.12 },
    { schoolName: '井草', area: '練馬', department: '普通科', quota: 221, finalApplicants: 274, finalRate: 1.24 },
    { schoolName: '石神井', area: '練馬', department: '普通科', quota: 252, finalApplicants: 417, finalRate: 1.65 },
    { schoolName: '田柄', area: '練馬', department: '普通科', quota: 152, finalApplicants: 74, finalRate: 0.49 },
    { schoolName: '練馬', area: '練馬', department: '普通科', quota: 189, finalApplicants: 213, finalRate: 1.13 },
    { schoolName: '光丘', area: '練馬', department: '普通科', quota: 185, finalApplicants: 137, finalRate: 0.74 },
    { schoolName: '青井', area: '足立', department: '普通科', quota: 164, finalApplicants: 67, finalRate: 0.41 },
    { schoolName: '足立', area: '足立', department: '普通科', quota: 220, finalApplicants: 299, finalRate: 1.36 },
    { schoolName: '足立新田', area: '足立', department: '普通科', quota: 222, finalApplicants: 231, finalRate: 1.04 },
    { schoolName: '足立西', area: '足立', department: '普通科', quota: 156, finalApplicants: 162, finalRate: 1.04 },
    { schoolName: '足立東', area: '足立', department: '普通科', quota: 138, finalApplicants: 117, finalRate: 0.85 },
    { schoolName: '江北', area: '足立', department: '普通科', quota: 252, finalApplicants: 421, finalRate: 1.67 },
    { schoolName: '淵江', area: '足立', department: '普通科', quota: 189, finalApplicants: 177, finalRate: 0.94 },
    { schoolName: '葛飾野', area: '葛飾', department: '普通科', quota: 253, finalApplicants: 285, finalRate: 1.13 },
    { schoolName: '南葛飾', area: '葛飾', department: '普通科', quota: 171, finalApplicants: 216, finalRate: 1.26 },
    { schoolName: '江戸川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 393, finalRate: 1.55 },
    { schoolName: '葛西南', area: '江戸川', department: '普通科', quota: 190, finalApplicants: 150, finalRate: 0.79 },
    { schoolName: '小岩', area: '江戸川', department: '普通科', quota: 284, finalApplicants: 390, finalRate: 1.37 },
    { schoolName: '小松川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 297, finalRate: 1.17 },
    { schoolName: '篠崎', area: '江戸川', department: '普通科', quota: 222, finalApplicants: 198, finalRate: 0.89 },
    { schoolName: '紅葉川', area: '江戸川', department: '普通科', quota: 189, finalApplicants: 226, finalRate: 1.2 },

    // ===== 多摩部（44校） =====
    { schoolName: '片倉', area: '八王子', department: '普通科', quota: 189, finalApplicants: 232, finalRate: 1.23 },
    { schoolName: '八王子北', area: '八王子', department: '普通科', quota: 158, finalApplicants: 178, finalRate: 1.13 },
    { schoolName: '八王子東', area: '八王子', department: '普通科', quota: 252, finalApplicants: 308, finalRate: 1.22 },
    { schoolName: '富士森', area: '八王子', department: '普通科', quota: 249, finalApplicants: 320, finalRate: 1.29 },
    { schoolName: '松が谷', area: '八王子', department: '普通科', quota: 188, finalApplicants: 265, finalRate: 1.41 },
    { schoolName: '立川', area: '立川', department: '普通科', quota: 220, finalApplicants: 323, finalRate: 1.47 },
    { schoolName: '武蔵野北', area: '武蔵野', department: '普通科', quota: 189, finalApplicants: 281, finalRate: 1.49 },
    { schoolName: '多摩', area: '青梅', department: '普通科', quota: 163, finalApplicants: 52, finalRate: 0.32 },
    { schoolName: '府中', area: '府中', department: '普通科', quota: 252, finalApplicants: 410, finalRate: 1.63 },
    { schoolName: '府中西', area: '府中', department: '普通科', quota: 235, finalApplicants: 267, finalRate: 1.14 },
    { schoolName: '府中東', area: '府中', department: '普通科', quota: 253, finalApplicants: 328, finalRate: 1.3 },
    { schoolName: '昭和', area: '昭島', department: '普通科', quota: 252, finalApplicants: 472, finalRate: 1.87 },
    { schoolName: '拝島', area: '昭島', department: '普通科', quota: 221, finalApplicants: 213, finalRate: 0.96 },
    { schoolName: '神代', area: '調布', department: '普通科', quota: 252, finalApplicants: 424, finalRate: 1.68 },
    { schoolName: '調布北', area: '調布', department: '普通科', quota: 188, finalApplicants: 326, finalRate: 1.73 },
    { schoolName: '調布南', area: '調布', department: '普通科', quota: 189, finalApplicants: 281, finalRate: 1.49 },
    { schoolName: '小川', area: '町田', department: '普通科', quota: 252, finalApplicants: 285, finalRate: 1.13 },
    { schoolName: '成瀬', area: '町田', department: '普通科', quota: 221, finalApplicants: 269, finalRate: 1.22 },
    { schoolName: '野津田', area: '町田', department: '普通科', quota: 95, finalApplicants: 36, finalRate: 0.38 },
    { schoolName: '町田', area: '町田', department: '普通科', quota: 253, finalApplicants: 306, finalRate: 1.21 },
    { schoolName: '山崎', area: '町田', department: '普通科', quota: 166, finalApplicants: 62, finalRate: 0.37 },
    { schoolName: '小金井北', area: '小金井', department: '普通科', quota: 189, finalApplicants: 307, finalRate: 1.62 },
    { schoolName: '小平', area: '小平', department: '普通科', quota: 157, finalApplicants: 235, finalRate: 1.5 },
    { schoolName: '小平西', area: '小平', department: '普通科', quota: 222, finalApplicants: 256, finalRate: 1.15 },
    { schoolName: '小平南', area: '小平', department: '普通科', quota: 221, finalApplicants: 317, finalRate: 1.43 },
    { schoolName: '日野', area: '日野', department: '普通科', quota: 253, finalApplicants: 459, finalRate: 1.81 },
    { schoolName: '日野台', area: '日野', department: '普通科', quota: 241, finalApplicants: 353, finalRate: 1.46 },
    { schoolName: '南平', area: '日野', department: '普通科', quota: 253, finalApplicants: 329, finalRate: 1.3 },
    { schoolName: '東村山', area: '東村山', department: '普通科', quota: 136, finalApplicants: 133, finalRate: 0.98 },
    { schoolName: '東村山西', area: '東村山', department: '普通科', quota: 189, finalApplicants: 130, finalRate: 0.69 },
    { schoolName: '国立', area: '国立', department: '普通科', quota: 252, finalApplicants: 330, finalRate: 1.31 },
    { schoolName: '福生', area: '福生', department: '普通科', quota: 221, finalApplicants: 242, finalRate: 1.1 },
    { schoolName: '狛江', area: '狛江', department: '普通科', quota: 253, finalApplicants: 425, finalRate: 1.68 },
    { schoolName: '東大和', area: '東大和', department: '普通科', quota: 221, finalApplicants: 277, finalRate: 1.25 },
    { schoolName: '東大和南', area: '東大和', department: '普通科', quota: 220, finalApplicants: 367, finalRate: 1.67 },
    { schoolName: '清瀬', area: '清瀬', department: '普通科', quota: 220, finalApplicants: 264, finalRate: 1.2 },
    { schoolName: '久留米西', area: '東久留米', department: '普通科', quota: 188, finalApplicants: 169, finalRate: 0.9 },
    { schoolName: '武蔵村山', area: '武蔵村山', department: '普通科', quota: 221, finalApplicants: 227, finalRate: 1.03 },
    { schoolName: '永山', area: '多摩', department: '普通科', quota: 246, finalApplicants: 234, finalRate: 0.95 },
    { schoolName: '羽村', area: '羽村', department: '普通科', quota: 204, finalApplicants: 71, finalRate: 0.35 },
    { schoolName: '秋留台', area: 'あきる野', department: '普通科', quota: 166, finalApplicants: 151, finalRate: 0.91 },
    { schoolName: '五日市', area: 'あきる野', department: '普通科', quota: 129, finalApplicants: 53, finalRate: 0.41 },
    { schoolName: '田無', area: '西東京', department: '普通科', quota: 252, finalApplicants: 299, finalRate: 1.19 },
    { schoolName: '保谷', area: '西東京', department: '普通科', quota: 253, finalApplicants: 364, finalRate: 1.44 },

    // ===== 島しょ（6校） =====
    { schoolName: '大島', area: '大島', department: '普通科', quota: 80, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '新島', area: '新島', department: '普通科', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '神津', area: '神津島', department: '普通科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '三宅', area: '三宅', department: '普通科', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '八丈', area: '八丈', department: '普通科', quota: 80, finalApplicants: 29, finalRate: 0.36 },
    { schoolName: '小笠原', area: '小笠原', department: '普通科', quota: 30, finalApplicants: 16, finalRate: 0.53 },

    // ===== 普通科（コース制の学校）（4校・既存校への追加学科・延べ校数は既存107校に含まれるため校数への計上は0） =====
    { schoolName: '深川', area: '江東', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 79, finalRate: 1.41 },
    { schoolName: '片倉', area: '八王子', department: '普通科（コース制・造形美術）', quota: 56, finalApplicants: 37, finalRate: 0.66 },
    { schoolName: '松が谷', area: '八王子', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 82, finalRate: 1.46 },
    { schoolName: '小平', area: '小平', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 81, finalRate: 1.45 },

    // ===== 普通科（単位制の学校）（12校・新規校） =====
    { schoolName: '新宿', area: '新宿', department: '普通科（単位制）', quota: 284, finalApplicants: 629, finalRate: 2.21 },
    { schoolName: '忍岡', area: '台東', department: '普通科（単位制）', quota: 124, finalApplicants: 134, finalRate: 1.08 },
    { schoolName: '墨田川', area: '墨田', department: '普通科（単位制）', quota: 252, finalApplicants: 296, finalRate: 1.17 },
    { schoolName: '美原', area: '大田', department: '普通科（単位制）', quota: 156, finalApplicants: 115, finalRate: 0.74 },
    { schoolName: '深沢', area: '世田谷', department: '普通科（単位制）', quota: 130, finalApplicants: 82, finalRate: 0.63 },
    { schoolName: '芦花', area: '世田谷', department: '普通科（単位制）', quota: 220, finalApplicants: 322, finalRate: 1.46 },
    { schoolName: '飛鳥', area: '北', department: '普通科（単位制）', quota: 170, finalApplicants: 196, finalRate: 1.15 },
    { schoolName: '板橋有徳', area: '板橋', department: '普通科（単位制）', quota: 156, finalApplicants: 155, finalRate: 0.99 },
    { schoolName: '大泉桜', area: '練馬', department: '普通科（単位制）', quota: 156, finalApplicants: 150, finalRate: 0.96 },
    { schoolName: '翔陽', area: '八王子', department: '普通科（単位制）', quota: 188, finalApplicants: 181, finalRate: 0.96 },
    { schoolName: '国分寺', area: '国分寺', department: '普通科（単位制）', quota: 252, finalApplicants: 409, finalRate: 1.62 },
    { schoolName: '上水', area: '武蔵村山', department: '普通科（単位制）', quota: 188, finalApplicants: 279, finalRate: 1.48 },

    // ===== 普通科（海外帰国生徒対象）（6校・既存校への追加学科・帰国生3+引揚者3） =====
    { schoolName: '三田', area: '港', department: '普通科（海外帰国生徒対象・帰国生）', quota: 18, finalApplicants: 24, finalRate: 1.33 },
    { schoolName: '竹早', area: '文京', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 24, finalRate: 1.85 },
    { schoolName: '日野台', area: '日野', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 19, finalRate: 1.46 },
    { schoolName: '深川', area: '江東', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0 },
    { schoolName: '光丘', area: '練馬', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0 },
    { schoolName: '富士森', area: '八王子', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0 },

    // ===== 専門学科（38校・学校単位の科別「計」で集計。同一学校が複数専門学科を持つ場合は複数レコード） =====
    // --- 商業科（7校） ---
    { schoolName: '芝商業', area: '港', department: '商業科', quota: 100, finalApplicants: 84, finalRate: 0.84 },
    { schoolName: '江東商業', area: '江東', department: '商業科', quota: 105, finalApplicants: 93, finalRate: 0.89 },
    { schoolName: '第三商業', area: '江東', department: '商業科', quota: 105, finalApplicants: 115, finalRate: 1.1 },
    { schoolName: '第一商業', area: '渋谷', department: '商業科', quota: 131, finalApplicants: 68, finalRate: 0.52 },
    { schoolName: '第四商業', area: '練馬', department: '商業科', quota: 105, finalApplicants: 85, finalRate: 0.81 },
    { schoolName: '葛飾商業', area: '葛飾', department: '商業科', quota: 126, finalApplicants: 106, finalRate: 0.84 },
    { schoolName: '第五商業', area: '国立', department: '商業科', quota: 126, finalApplicants: 166, finalRate: 1.32 },

    // --- ビジネスコミュニケーション科（2校） ---
    { schoolName: '大田桜台', area: '大田', department: 'ビジネスコミュニケーション科', quota: 105, finalApplicants: 87, finalRate: 0.83 },
    { schoolName: '千早', area: '豊島', department: 'ビジネスコミュニケーション科', quota: 126, finalApplicants: 140, finalRate: 1.11 },

    // --- 工業科（単位制以外・15校。学校の「計」行で集計） ---
    { schoolName: '工芸', area: '文京', department: '工業科', quota: 125, finalApplicants: 212, finalRate: 1.7 },
    { schoolName: '蔵前工科', area: '台東', department: '工業科', quota: 107, finalApplicants: 71, finalRate: 0.66 },
    { schoolName: '墨田工科', area: '江東', department: '工業科', quota: 114, finalApplicants: 65, finalRate: 0.57 },
    { schoolName: '総合工科', area: '世田谷', department: '工業科', quota: 88, finalApplicants: 43, finalRate: 0.49 },
    { schoolName: '中野工科', area: '中野', department: '工業科', quota: 84, finalApplicants: 73, finalRate: 0.87 },
    { schoolName: '杉並工科', area: '杉並', department: '工業科', quota: 111, finalApplicants: 36, finalRate: 0.32 },
    { schoolName: '荒川工科', area: '荒川', department: '工業科', quota: 112, finalApplicants: 30, finalRate: 0.27 },
    { schoolName: '北豊島工科', area: '板橋', department: '工業科', quota: 97, finalApplicants: 39, finalRate: 0.4 },
    { schoolName: '練馬工科', area: '練馬', department: '工業科', quota: 105, finalApplicants: 95, finalRate: 0.9 },
    { schoolName: '足立工科', area: '足立', department: '工業科', quota: 95, finalApplicants: 55, finalRate: 0.58 },
    { schoolName: '葛西工科', area: '江戸川', department: '工業科', quota: 122, finalApplicants: 88, finalRate: 0.72 },
    { schoolName: '府中工科', area: '府中', department: '工業科', quota: 106, finalApplicants: 101, finalRate: 0.95 },
    { schoolName: '町田工科', area: '町田', department: '工業科', quota: 108, finalApplicants: 53, finalRate: 0.49 },
    { schoolName: '多摩工科', area: '福生', department: '工業科', quota: 109, finalApplicants: 101, finalRate: 0.93 },
    { schoolName: '田無工科', area: '西東京', department: '工業科', quota: 111, finalApplicants: 85, finalRate: 0.77 },

    // --- 工業科（単位制・1校） ---
    { schoolName: '六郷工科', area: '大田', department: '工業科（単位制）', quota: 96, finalApplicants: 72, finalRate: 0.75 },

    // --- 科学技術科（2校） ---
    { schoolName: '科学技術', area: '江東', department: '科学技術科', quota: 107, finalApplicants: 78, finalRate: 0.73 },
    { schoolName: '多摩科学技術', area: '小金井', department: '科学技術科', quota: 147, finalApplicants: 209, finalRate: 1.42 },

    // --- 農業科（5校） ---
    { schoolName: '園芸', area: '世田谷', department: '農業科', quota: 99, finalApplicants: 120, finalRate: 1.21 },
    { schoolName: '農芸', area: '杉並', department: '農業科', quota: 92, finalApplicants: 89, finalRate: 0.97 },
    { schoolName: '農産', area: '葛飾', department: '農業科', quota: 84, finalApplicants: 92, finalRate: 1.1 },
    { schoolName: '農業', area: '府中', department: '農業科', quota: 63, finalApplicants: 77, finalRate: 1.22 },
    { schoolName: '瑞穂農芸', area: '瑞穂', department: '農業科', quota: 75, finalApplicants: 72, finalRate: 0.96 },

    // --- 水産科（1校） ---
    { schoolName: '大島海洋国際', area: '大島', department: '水産科', quota: 42, finalApplicants: 57, finalRate: 1.36 },

    // --- 家庭科（単位制以外・3校） ---
    { schoolName: '赤羽北桜', area: '北', department: '家庭科', quota: 123, finalApplicants: 136, finalRate: 1.11 },
    { schoolName: '農業', area: '府中', department: '家庭科', quota: 50, finalApplicants: 60, finalRate: 1.2 },
    { schoolName: '瑞穂農芸', area: '瑞穂', department: '家庭科', quota: 49, finalApplicants: 26, finalRate: 0.53 },

    // --- 家庭科（単位制・1校） ---
    { schoolName: '忍岡', area: '台東', department: '家庭科（単位制）', quota: 49, finalApplicants: 54, finalRate: 1.1 },

    // --- 福祉科（2校） ---
    { schoolName: '赤羽北桜', area: '北', department: '福祉科', quota: 25, finalApplicants: 27, finalRate: 1.08 },
    { schoolName: '野津田', area: '町田', department: '福祉科', quota: 29, finalApplicants: 7, finalRate: 0.24 },

    // --- 理数科（2校） ---
    { schoolName: '科学技術', area: '江東', department: '理数科', quota: 37, finalApplicants: 69, finalRate: 1.86 },
    { schoolName: '立川', area: '立川', department: '理数科', quota: 34, finalApplicants: 141, finalRate: 4.15 },

    // --- 芸術科（1校） ---
    { schoolName: '総合芸術', area: '新宿', department: '芸術科', quota: 112, finalApplicants: 182, finalRate: 1.63 },

    // --- 体育科（2校） ---
    { schoolName: '駒場', area: '目黒', department: '体育科', quota: 28, finalApplicants: 34, finalRate: 1.21 },
    { schoolName: '野津田', area: '町田', department: '体育科', quota: 28, finalApplicants: 28, finalRate: 1.0 },

    // --- 国際科（1校） ---
    { schoolName: '国際', area: '目黒', department: '国際科', quota: 138, finalApplicants: 250, finalRate: 1.81 },

    // --- 併合科（3校） ---
    { schoolName: '大島', area: '大島', department: '併合科（農林・家政）', quota: 35, finalApplicants: 10, finalRate: 0.29 },
    { schoolName: '三宅', area: '三宅', department: '併合科（農業・家政）', quota: 35, finalApplicants: 3, finalRate: 0.09 },
    { schoolName: '八丈', area: '八丈', department: '併合科（園芸・家政）', quota: 35, finalApplicants: 3, finalRate: 0.09 },

    // --- 産業科（2校） ---
    { schoolName: '橘', area: '墨田', department: '産業科', quota: 148, finalApplicants: 78, finalRate: 0.53 },
    { schoolName: '八王子桑志', area: '八王子', department: '産業科', quota: 126, finalApplicants: 149, finalRate: 1.18 },

    // ===== 総合学科（10校） =====
    { schoolName: '晴海総合', area: '中央', department: '総合学科', quota: 192, finalApplicants: 399, finalRate: 2.08 },
    { schoolName: 'つばさ総合', area: '大田', department: '総合学科', quota: 164, finalApplicants: 183, finalRate: 1.12 },
    { schoolName: '世田谷総合', area: '世田谷', department: '総合学科', quota: 164, finalApplicants: 188, finalRate: 1.15 },
    { schoolName: '杉並総合', area: '杉並', department: '総合学科', quota: 150, finalApplicants: 213, finalRate: 1.42 },
    { schoolName: '王子総合', area: '北', department: '総合学科', quota: 164, finalApplicants: 175, finalRate: 1.07 },
    { schoolName: '葛飾総合', area: '葛飾', department: '総合学科', quota: 136, finalApplicants: 141, finalRate: 1.04 },
    { schoolName: '青梅総合', area: '青梅', department: '総合学科', quota: 164, finalApplicants: 165, finalRate: 1.01 },
    { schoolName: '町田総合', area: '町田', department: '総合学科', quota: 164, finalApplicants: 165, finalRate: 1.01 },
    { schoolName: '東久留米総合', area: '東久留米', department: '総合学科', quota: 164, finalApplicants: 217, finalRate: 1.32 },
    { schoolName: '若葉総合', area: '稲城', department: '総合学科', quota: 164, finalApplicants: 138, finalRate: 0.84 },
    // 掛-1(学校別×多年度)横展開第1弾: R7(令和7年度)分・個票PDF1頁目(千代田〜練馬の18区・43校)。
    { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 507, finalRate: 2.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三田', area: '港', department: '普通科', quota: 204, finalApplicants: 354, finalRate: 1.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '戸山', area: '新宿', department: '普通科', quota: 252, finalApplicants: 526, finalRate: 2.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '竹早', area: '文京', department: '普通科', quota: 209, finalApplicants: 320, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '向丘', area: '文京', department: '普通科', quota: 220, finalApplicants: 347, finalRate: 1.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上野', area: '台東', department: '普通科', quota: 252, finalApplicants: 481, finalRate: 1.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日本橋', area: '墨田', department: '普通科', quota: 179, finalApplicants: 216, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '本所', area: '墨田', department: '普通科', quota: 189, finalApplicants: 285, finalRate: 1.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '城東', area: '江東', department: '普通科', quota: 252, finalApplicants: 374, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東', area: '江東', department: '普通科', quota: 189, finalApplicants: 290, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深川', area: '江東', department: '普通科', quota: 185, finalApplicants: 335, finalRate: 1.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大崎', area: '品川', department: '普通科', quota: 221, finalApplicants: 339, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小山台', area: '品川', department: '普通科', quota: 252, finalApplicants: 368, finalRate: 1.46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮', area: '品川', department: '普通科', quota: 168, finalApplicants: 128, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '駒場', area: '目黒', department: '普通科', quota: 220, finalApplicants: 423, finalRate: 1.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '目黒', area: '目黒', department: '普通科', quota: 189, finalApplicants: 265, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大森', area: '大田', department: '普通科', quota: 130, finalApplicants: 58, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蒲田', area: '大田', department: '普通科', quota: 85, finalApplicants: 93, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '田園調布', area: '大田', department: '普通科', quota: 176, finalApplicants: 248, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '雪谷', area: '大田', department: '普通科', quota: 221, finalApplicants: 358, finalRate: 1.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桜町', area: '世田谷', department: '普通科', quota: 252, finalApplicants: 290, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千歳丘', area: '世田谷', department: '普通科', quota: 221, finalApplicants: 252, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深沢', area: '世田谷', department: '普通科', quota: 142, finalApplicants: 123, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松原', area: '世田谷', department: '普通科', quota: 156, finalApplicants: 219, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '青山', area: '渋谷', department: '普通科', quota: 221, finalApplicants: 433, finalRate: 1.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '広尾', area: '渋谷', department: '普通科', quota: 185, finalApplicants: 331, finalRate: 1.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鷺宮', area: '中野', department: '普通科', quota: 220, finalApplicants: 362, finalRate: 1.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武蔵丘', area: '中野', department: '普通科', quota: 253, finalApplicants: 391, finalRate: 1.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉並', area: '杉並', department: '普通科', quota: 253, finalApplicants: 323, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '豊多摩', area: '杉並', department: '普通科', quota: 252, finalApplicants: 538, finalRate: 2.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西', area: '杉並', department: '普通科', quota: 252, finalApplicants: 407, finalRate: 1.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '豊島', area: '豊島', department: '普通科', quota: 252, finalApplicants: 534, finalRate: 2.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '文京', area: '豊島', department: '普通科', quota: 284, finalApplicants: 381, finalRate: 1.34, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '竹台', area: '荒川', department: '普通科', quota: 155, finalApplicants: 229, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '板橋', area: '板橋', department: '普通科', quota: 221, finalApplicants: 315, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大山', area: '板橋', department: '普通科', quota: 137, finalApplicants: 99, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北園', area: '板橋', department: '普通科', quota: 253, finalApplicants: 465, finalRate: 1.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高島', area: '板橋', department: '普通科', quota: 252, finalApplicants: 273, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '井草', area: '練馬', department: '普通科', quota: 221, finalApplicants: 318, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '石神井', area: '練馬', department: '普通科', quota: 220, finalApplicants: 407, finalRate: 1.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '田柄', area: '練馬', department: '普通科', quota: 129, finalApplicants: 107, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '練馬', area: '練馬', department: '普通科', quota: 189, finalApplicants: 209, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '光丘', area: '練馬', department: '普通科', quota: 185, finalApplicants: 139, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開第2弾: R7分・個票PDF2頁目(区部残り15校+多摩部30校=45校)。
    { schoolName: '青井', area: '足立', department: '普通科', quota: 142, finalApplicants: 77, finalRate: 0.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足立', area: '足立', department: '普通科', quota: 220, finalApplicants: 339, finalRate: 1.54, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足立新田', area: '足立', department: '普通科', quota: 209, finalApplicants: 202, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足立西', area: '足立', department: '普通科', quota: 156, finalApplicants: 176, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足立東', area: '足立', department: '普通科', quota: 122, finalApplicants: 128, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江北', area: '足立', department: '普通科', quota: 252, finalApplicants: 415, finalRate: 1.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '淵江', area: '足立', department: '普通科', quota: 179, finalApplicants: 148, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '葛飾野', area: '葛飾', department: '普通科', quota: 253, finalApplicants: 300, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南葛飾', area: '葛飾', department: '普通科', quota: 161, finalApplicants: 234, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江戸川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 372, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '葛西南', area: '江戸川', department: '普通科', quota: 190, finalApplicants: 112, finalRate: 0.59, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小岩', area: '江戸川', department: '普通科', quota: 284, finalApplicants: 466, finalRate: 1.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小松川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 300, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '篠崎', area: '江戸川', department: '普通科', quota: 222, finalApplicants: 187, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '紅葉川', area: '江戸川', department: '普通科', quota: 189, finalApplicants: 224, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '片倉', area: '八王子', department: '普通科', quota: 189, finalApplicants: 228, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八王子北', area: '八王子', department: '普通科', quota: 158, finalApplicants: 193, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八王子東', area: '八王子', department: '普通科', quota: 252, finalApplicants: 382, finalRate: 1.52, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富士森', area: '八王子', department: '普通科', quota: 249, finalApplicants: 299, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松が谷', area: '八王子', department: '普通科', quota: 188, finalApplicants: 262, finalRate: 1.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '立川', area: '立川', department: '普通科', quota: 220, finalApplicants: 333, finalRate: 1.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武蔵野北', area: '武蔵野', department: '普通科', quota: 189, finalApplicants: 259, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多摩', area: '青梅', department: '普通科', quota: 159, finalApplicants: 79, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '府中', area: '府中', department: '普通科', quota: 252, finalApplicants: 349, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '府中西', area: '府中', department: '普通科', quota: 237, finalApplicants: 254, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '府中東', area: '府中', department: '普通科', quota: 240, finalApplicants: 302, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '昭和', area: '昭島', department: '普通科', quota: 252, finalApplicants: 392, finalRate: 1.56, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '拝島', area: '昭島', department: '普通科', quota: 221, finalApplicants: 218, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '神代', area: '調布', department: '普通科', quota: 252, finalApplicants: 499, finalRate: 1.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '調布北', area: '調布', department: '普通科', quota: 188, finalApplicants: 325, finalRate: 1.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '調布南', area: '調布', department: '普通科', quota: 189, finalApplicants: 315, finalRate: 1.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小川', area: '町田', department: '普通科', quota: 252, finalApplicants: 307, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '成瀬', area: '町田', department: '普通科', quota: 221, finalApplicants: 312, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '野津田', area: '町田', department: '普通科', quota: 100, finalApplicants: 49, finalRate: 0.49, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '町田', area: '町田', department: '普通科', quota: 253, finalApplicants: 296, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '山崎', area: '町田', department: '普通科', quota: 138, finalApplicants: 92, finalRate: 0.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小金井北', area: '小金井', department: '普通科', quota: 189, finalApplicants: 282, finalRate: 1.49, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小平', area: '小平', department: '普通科', quota: 157, finalApplicants: 222, finalRate: 1.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小平西', area: '小平', department: '普通科', quota: 222, finalApplicants: 266, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小平南', area: '小平', department: '普通科', quota: 221, finalApplicants: 287, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日野', area: '日野', department: '普通科', quota: 253, finalApplicants: 359, finalRate: 1.42, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日野台', area: '日野', department: '普通科', quota: 241, finalApplicants: 289, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南平', area: '日野', department: '普通科', quota: 253, finalApplicants: 364, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東村山', area: '東村山', department: '普通科', quota: 116, finalApplicants: 178, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東村山西', area: '東村山', department: '普通科', quota: 189, finalApplicants: 166, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開第3弾: R7分・個票PDF3頁目(多摩部残り14校+島しょ6校=20校)。個票PDF002はこれで完結。
    { schoolName: '国立', area: '国立', department: '普通科', quota: 252, finalApplicants: 386, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '福生', area: '福生', department: '普通科', quota: 221, finalApplicants: 255, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狛江', area: '狛江', department: '普通科', quota: 253, finalApplicants: 459, finalRate: 1.81, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東大和', area: '東大和', department: '普通科', quota: 221, finalApplicants: 221, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東大和南', area: '東大和', department: '普通科', quota: 220, finalApplicants: 288, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '清瀬', area: '清瀬', department: '普通科', quota: 220, finalApplicants: 264, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久留米西', area: '東久留米', department: '普通科', quota: 188, finalApplicants: 221, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '武蔵村山', area: '武蔵村山', department: '普通科', quota: 221, finalApplicants: 256, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '永山', area: '多摩', department: '普通科', quota: 243, finalApplicants: 235, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽村', area: '羽村', department: '普通科', quota: 172, finalApplicants: 125, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秋留台', area: 'あきる野', department: '普通科', quota: 136, finalApplicants: 117, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '五日市', area: 'あきる野', department: '普通科', quota: 127, finalApplicants: 58, finalRate: 0.46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '田無', area: '西東京', department: '普通科', quota: 252, finalApplicants: 305, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '保谷', area: '西東京', department: '普通科', quota: 253, finalApplicants: 355, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大島', area: '大島', department: '普通科', quota: 80, finalApplicants: 29, finalRate: 0.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新島', area: '新島', department: '普通科', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '神津', area: '神津島', department: '普通科', quota: 40, finalApplicants: 14, finalRate: 0.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三宅', area: '三宅', department: '普通科', quota: 40, finalApplicants: 6, finalRate: 0.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八丈', area: '八丈', department: '普通科', quota: 77, finalApplicants: 28, finalRate: 0.36, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小笠原', area: '小笠原', department: '普通科', quota: 30, finalApplicants: 16, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開第4弾: R7分・個票PDF003(コース制4校+単位制11校+海外帰国生徒対象6校=21校)。
    { schoolName: '深川', area: '江東', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 95, finalRate: 1.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '片倉', area: '八王子', department: '普通科（コース制・造形美術）', quota: 56, finalApplicants: 53, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松が谷', area: '八王子', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 59, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小平', area: '小平', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 69, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新宿', area: '新宿', department: '普通科（単位制）', quota: 284, finalApplicants: 551, finalRate: 1.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '忍岡', area: '台東', department: '普通科（単位制）', quota: 124, finalApplicants: 115, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '墨田川', area: '墨田', department: '普通科（単位制）', quota: 252, finalApplicants: 278, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '美原', area: '大田', department: '普通科（単位制）', quota: 156, finalApplicants: 153, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芦花', area: '世田谷', department: '普通科（単位制）', quota: 220, finalApplicants: 445, finalRate: 2.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '飛鳥', area: '北', department: '普通科（単位制）', quota: 170, finalApplicants: 179, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '板橋有徳', area: '板橋', department: '普通科（単位制）', quota: 156, finalApplicants: 155, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大泉桜', area: '練馬', department: '普通科（単位制）', quota: 156, finalApplicants: 191, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '翔陽', area: '八王子', department: '普通科（単位制）', quota: 193, finalApplicants: 147, finalRate: 0.76, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '国分寺', area: '国分寺', department: '普通科（単位制）', quota: 252, finalApplicants: 421, finalRate: 1.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上水', area: '武蔵村山', department: '普通科（単位制）', quota: 188, finalApplicants: 248, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三田', area: '港', department: '普通科（海外帰国生徒対象・帰国生）', quota: 18, finalApplicants: 33, finalRate: 1.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '竹早', area: '文京', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 21, finalRate: 1.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日野台', area: '日野', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 11, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深川', area: '江東', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '光丘', area: '練馬', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富士森', area: '八王子', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開第5弾: R7分・個票PDF004の1頁目(商業7校+ビジネスコミュニケーション科2校=9校)。
    { schoolName: '芝商業', area: '港', department: '商業科', quota: 99, finalApplicants: 105, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '江東商業', area: '江東', department: '商業科', quota: 105, finalApplicants: 93, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '第三商業', area: '江東', department: '商業科', quota: 105, finalApplicants: 92, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '第一商業', area: '渋谷', department: '商業科', quota: 126, finalApplicants: 110, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '第四商業', area: '練馬', department: '商業科', quota: 105, finalApplicants: 73, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '葛飾商業', area: '葛飾', department: '商業科', quota: 126, finalApplicants: 140, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '第五商業', area: '国立', department: '商業科', quota: 126, finalApplicants: 164, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大田桜台', area: '大田', department: 'ビジネスコミュニケーション科', quota: 105, finalApplicants: 81, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '千早', area: '豊島', department: 'ビジネスコミュニケーション科', quota: 126, finalApplicants: 164, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開第6弾: R7分・個票PDF004の2頁目(工業に関する学科・単位制以外11校・学校ごとの計行を採用)。
    { schoolName: '工芸', area: '文京', department: '工業科', quota: 125, finalApplicants: 203, finalRate: 1.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蔵前工科', area: '台東', department: '工業科', quota: 111, finalApplicants: 79, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '墨田工科', area: '江東', department: '工業科', quota: 119, finalApplicants: 84, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '総合工科', area: '世田谷', department: '工業科', quota: 105, finalApplicants: 61, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '中野工科', area: '中野', department: '工業科', quota: 63, finalApplicants: 55, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉並工科', area: '杉並', department: '工業科', quota: 118, finalApplicants: 31, finalRate: 0.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '荒川工科', area: '荒川', department: '工業科', quota: 112, finalApplicants: 53, finalRate: 0.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北豊島工科', area: '板橋', department: '工業科', quota: 97, finalApplicants: 48, finalRate: 0.49, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '練馬工科', area: '練馬', department: '工業科', quota: 88, finalApplicants: 53, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '足立工科', area: '足立', department: '工業科', quota: 101, finalApplicants: 83, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '葛西工科', area: '江戸川', department: '工業科', quota: 115, finalApplicants: 79, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '府中工科', area: '府中', department: '工業科', quota: 105, finalApplicants: 109, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '町田工科', area: '町田', department: '工業科', quota: 105, finalApplicants: 108, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多摩工科', area: '福生', department: '工業科', quota: 106, finalApplicants: 98, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '田無工科', area: '西東京', department: '工業科', quota: 105, finalApplicants: 87, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    // --- 工業科（単位制・1校） ---
    { schoolName: '六郷工科', area: '大田', department: '工業科（単位制）', quota: 96, finalApplicants: 68, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    // --- 科学技術科（2校） ---
    { schoolName: '科学技術', area: '江東', department: '科学技術科', quota: 105, finalApplicants: 106, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '多摩科学技術', area: '小金井', department: '科学技術科', quota: 147, finalApplicants: 213, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    // --- 農業科（5校） ---
    { schoolName: '園芸', area: '世田谷', department: '農業科', quota: 99, finalApplicants: 151, finalRate: 1.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農芸', area: '杉並', department: '農業科', quota: 92, finalApplicants: 101, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農産', area: '葛飾', department: '農業科', quota: 84, finalApplicants: 93, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農業', area: '府中', department: '農業科', quota: 63, finalApplicants: 92, finalRate: 1.46, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '瑞穂農芸', area: '瑞穂', department: '農業科', quota: 75, finalApplicants: 99, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    // --- 水産科（1校） ---
    { schoolName: '大島海洋国際', area: '大島', department: '水産科', quota: 42, finalApplicants: 46, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    // --- 家庭科（単位制以外・3校） ---
    { schoolName: '赤羽北桜', area: '北', department: '家庭科', quota: 123, finalApplicants: 89, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '農業', area: '府中', department: '家庭科', quota: 50, finalApplicants: 57, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '瑞穂農芸', area: '瑞穂', department: '家庭科', quota: 49, finalApplicants: 47, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    // --- 家庭科（単位制・1校） ---
    { schoolName: '忍岡', area: '台東', department: '家庭科（単位制）', quota: 49, finalApplicants: 44, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    // --- 福祉科（2校） ---
    { schoolName: '赤羽北桜', area: '北', department: '福祉科', quota: 25, finalApplicants: 26, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '野津田', area: '町田', department: '福祉科', quota: 25, finalApplicants: 6, finalRate: 0.24, fiscalYear: '令和7年度（2025年度）' },
    // --- 理数科（2校） ---
    { schoolName: '科学技術', area: '江東', department: '理数科', quota: 37, finalApplicants: 72, finalRate: 1.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '立川', area: '立川', department: '理数科', quota: 35, finalApplicants: 158, finalRate: 4.51, fiscalYear: '令和7年度（2025年度）' },
    // --- 芸術科（1校） ---
    { schoolName: '総合芸術', area: '新宿', department: '芸術科', quota: 112, finalApplicants: 200, finalRate: 1.79, fiscalYear: '令和7年度（2025年度）' },
    // --- 体育科（2校） ---
    { schoolName: '駒場', area: '目黒', department: '体育科', quota: 28, finalApplicants: 64, finalRate: 2.29, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '野津田', area: '町田', department: '体育科', quota: 24, finalApplicants: 21, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    // --- 国際科（1校） ---
    { schoolName: '国際', area: '目黒', department: '国際科', quota: 138, finalApplicants: 243, finalRate: 1.76, fiscalYear: '令和7年度（2025年度）' },
    // --- 併合科（3校） ---
    { schoolName: '大島', area: '大島', department: '併合科（農林・家政）', quota: 35, finalApplicants: 7, finalRate: 0.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三宅', area: '三宅', department: '併合科（農業・家政）', quota: 35, finalApplicants: 3, finalRate: 0.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八丈', area: '八丈', department: '併合科（園芸・家政）', quota: 35, finalApplicants: 1, finalRate: 0.03, fiscalYear: '令和7年度（2025年度）' },
    // --- 産業科（2校） ---
    { schoolName: '橘', area: '墨田', department: '産業科', quota: 126, finalApplicants: 124, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八王子桑志', area: '八王子', department: '産業科', quota: 126, finalApplicants: 121, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    // ===== 総合学科（10校） =====
    { schoolName: '晴海総合', area: '中央', department: '総合学科', quota: 192, finalApplicants: 321, finalRate: 1.67, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'つばさ総合', area: '大田', department: '総合学科', quota: 164, finalApplicants: 169, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '世田谷総合', area: '世田谷', department: '総合学科', quota: 164, finalApplicants: 160, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉並総合', area: '杉並', department: '総合学科', quota: 150, finalApplicants: 254, finalRate: 1.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '王子総合', area: '北', department: '総合学科', quota: 164, finalApplicants: 194, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '葛飾総合', area: '葛飾', department: '総合学科', quota: 136, finalApplicants: 157, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '青梅総合', area: '青梅', department: '総合学科', quota: 164, finalApplicants: 200, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '町田総合', area: '町田', department: '総合学科', quota: 164, finalApplicants: 163, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '東久留米総合', area: '東久留米', department: '総合学科', quota: 164, finalApplicants: 233, finalRate: 1.42, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '若葉総合', area: '稲城', department: '総合学科', quota: 164, finalApplicants: 185, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 253, finalApplicants: 459, finalRate: 1.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三田', area: '港', department: '普通科', quota: 204, finalApplicants: 393, finalRate: 1.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '戸山', area: '新宿', department: '普通科', quota: 252, finalApplicants: 499, finalRate: 1.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '竹早', area: '文京', department: '普通科', quota: 177, finalApplicants: 313, finalRate: 1.77, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '向丘', area: '文京', department: '普通科', quota: 220, finalApplicants: 440, finalRate: 2.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上野', area: '台東', department: '普通科', quota: 252, finalApplicants: 491, finalRate: 1.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日本橋', area: '墨田', department: '普通科', quota: 179, finalApplicants: 239, finalRate: 1.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '本所', area: '墨田', department: '普通科', quota: 189, finalApplicants: 379, finalRate: 2.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '城東', area: '江東', department: '普通科', quota: 284, finalApplicants: 542, finalRate: 1.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東', area: '江東', department: '普通科', quota: 221, finalApplicants: 316, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深川', area: '江東', department: '普通科', quota: 185, finalApplicants: 318, finalRate: 1.72, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大崎', area: '品川', department: '普通科', quota: 221, finalApplicants: 336, finalRate: 1.52, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小山台', area: '品川', department: '普通科', quota: 252, finalApplicants: 339, finalRate: 1.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八潮', area: '品川', department: '普通科', quota: 148, finalApplicants: 173, finalRate: 1.17, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '駒場', area: '目黒', department: '普通科', quota: 252, finalApplicants: 460, finalRate: 1.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '目黒', area: '目黒', department: '普通科', quota: 189, finalApplicants: 371, finalRate: 1.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大森', area: '大田', department: '普通科', quota: 165, finalApplicants: 69, finalRate: 0.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '蒲田', area: '大田', department: '普通科', quota: 85, finalApplicants: 92, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '田園調布', area: '大田', department: '普通科', quota: 168, finalApplicants: 314, finalRate: 1.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '雪谷', area: '大田', department: '普通科', quota: 221, finalApplicants: 380, finalRate: 1.72, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桜町', area: '世田谷', department: '普通科', quota: 252, finalApplicants: 271, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '千歳丘', area: '世田谷', department: '普通科', quota: 221, finalApplicants: 295, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深沢', area: '世田谷', department: '普通科', quota: 142, finalApplicants: 124, finalRate: 0.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松原', area: '世田谷', department: '普通科', quota: 156, finalApplicants: 165, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '青山', area: '渋谷', department: '普通科', quota: 221, finalApplicants: 458, finalRate: 2.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '広尾', area: '渋谷', department: '普通科', quota: 157, finalApplicants: 339, finalRate: 2.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '鷺宮', area: '中野', department: '普通科', quota: 220, finalApplicants: 366, finalRate: 1.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '武蔵丘', area: '中野', department: '普通科', quota: 253, finalApplicants: 469, finalRate: 1.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉並', area: '杉並', department: '普通科', quota: 253, finalApplicants: 428, finalRate: 1.69, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '豊多摩', area: '杉並', department: '普通科', quota: 252, finalApplicants: 471, finalRate: 1.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西', area: '杉並', department: '普通科', quota: 252, finalApplicants: 428, finalRate: 1.7, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '豊島', area: '豊島', department: '普通科', quota: 253, finalApplicants: 574, finalRate: 2.27, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '文京', area: '豊島', department: '普通科', quota: 284, finalApplicants: 408, finalRate: 1.44, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '竹台', area: '荒川', department: '普通科', quota: 183, finalApplicants: 280, finalRate: 1.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '板橋', area: '板橋', department: '普通科', quota: 221, finalApplicants: 348, finalRate: 1.57, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大山', area: '板橋', department: '普通科', quota: 169, finalApplicants: 103, finalRate: 0.61, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '北園', area: '板橋', department: '普通科', quota: 253, finalApplicants: 450, finalRate: 1.78, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高島', area: '板橋', department: '普通科', quota: 252, finalApplicants: 326, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '井草', area: '練馬', department: '普通科', quota: 221, finalApplicants: 422, finalRate: 1.91, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '石神井', area: '練馬', department: '普通科', quota: 220, finalApplicants: 373, finalRate: 1.7, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '田柄', area: '練馬', department: '普通科', quota: 134, finalApplicants: 117, finalRate: 0.87, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '練馬', area: '練馬', department: '普通科', quota: 189, finalApplicants: 255, finalRate: 1.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '光丘', area: '練馬', department: '普通科', quota: 185, finalApplicants: 186, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '青井', area: '足立', department: '普通科', quota: 137, finalApplicants: 169, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '足立', area: '足立', department: '普通科', quota: 252, finalApplicants: 338, finalRate: 1.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '足立新田', area: '足立', department: '普通科', quota: 209, finalApplicants: 243, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '足立西', area: '足立', department: '普通科', quota: 156, finalApplicants: 180, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '足立東', area: '足立', department: '普通科', quota: 122, finalApplicants: 162, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '江北', area: '足立', department: '普通科', quota: 252, finalApplicants: 386, finalRate: 1.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '淵江', area: '足立', department: '普通科', quota: 179, finalApplicants: 229, finalRate: 1.28, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '葛飾野', area: '葛飾', department: '普通科', quota: 253, finalApplicants: 345, finalRate: 1.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '南葛飾', area: '葛飾', department: '普通科', quota: 161, finalApplicants: 226, finalRate: 1.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '江戸川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 433, finalRate: 1.71, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '葛西南', area: '江戸川', department: '普通科', quota: 190, finalApplicants: 195, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小岩', area: '江戸川', department: '普通科', quota: 284, finalApplicants: 471, finalRate: 1.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小松川', area: '江戸川', department: '普通科', quota: 253, finalApplicants: 321, finalRate: 1.27, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '篠崎', area: '江戸川', department: '普通科', quota: 222, finalApplicants: 267, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '紅葉川', area: '江戸川', department: '普通科', quota: 189, finalApplicants: 284, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '片倉', area: '八王子', department: '普通科', quota: 189, finalApplicants: 230, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八王子北', area: '八王子', department: '普通科', quota: 158, finalApplicants: 181, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八王子東', area: '八王子', department: '普通科', quota: 252, finalApplicants: 342, finalRate: 1.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '富士森', area: '八王子', department: '普通科', quota: 249, finalApplicants: 297, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松が谷', area: '八王子', department: '普通科', quota: 220, finalApplicants: 300, finalRate: 1.36, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '立川', area: '立川', department: '普通科', quota: 220, finalApplicants: 318, finalRate: 1.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '武蔵野北', area: '武蔵野', department: '普通科', quota: 189, finalApplicants: 255, finalRate: 1.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多摩', area: '青梅', department: '普通科', quota: 157, finalApplicants: 109, finalRate: 0.69, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '府中', area: '府中', department: '普通科', quota: 220, finalApplicants: 418, finalRate: 1.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '府中西', area: '府中', department: '普通科', quota: 235, finalApplicants: 288, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '府中東', area: '府中', department: '普通科', quota: 240, finalApplicants: 361, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '昭和', area: '昭島', department: '普通科', quota: 252, finalApplicants: 379, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '拝島', area: '昭島', department: '普通科', quota: 221, finalApplicants: 267, finalRate: 1.21, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '神代', area: '調布', department: '普通科', quota: 252, finalApplicants: 456, finalRate: 1.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '調布北', area: '調布', department: '普通科', quota: 188, finalApplicants: 298, finalRate: 1.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '調布南', area: '調布', department: '普通科', quota: 189, finalApplicants: 327, finalRate: 1.73, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小川', area: '町田', department: '普通科', quota: 252, finalApplicants: 312, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '成瀬', area: '町田', department: '普通科', quota: 221, finalApplicants: 249, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '野津田', area: '町田', department: '普通科', quota: 99, finalApplicants: 60, finalRate: 0.61, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '町田', area: '町田', department: '普通科', quota: 253, finalApplicants: 359, finalRate: 1.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '山崎', area: '町田', department: '普通科', quota: 138, finalApplicants: 155, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小金井北', area: '小金井', department: '普通科', quota: 189, finalApplicants: 317, finalRate: 1.68, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小平', area: '小平', department: '普通科', quota: 189, finalApplicants: 264, finalRate: 1.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小平西', area: '小平', department: '普通科', quota: 222, finalApplicants: 313, finalRate: 1.41, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小平南', area: '小平', department: '普通科', quota: 221, finalApplicants: 363, finalRate: 1.64, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日野', area: '日野', department: '普通科', quota: 253, finalApplicants: 430, finalRate: 1.7, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日野台', area: '日野', department: '普通科', quota: 241, finalApplicants: 335, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '南平', area: '日野', department: '普通科', quota: 253, finalApplicants: 398, finalRate: 1.57, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東村山', area: '東村山', department: '普通科', quota: 116, finalApplicants: 166, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東村山西', area: '東村山', department: '普通科', quota: 189, finalApplicants: 210, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '国立', area: '国立', department: '普通科', quota: 252, finalApplicants: 393, finalRate: 1.56, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '福生', area: '福生', department: '普通科', quota: 221, finalApplicants: 286, finalRate: 1.29, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '狛江', area: '狛江', department: '普通科', quota: 285, finalApplicants: 460, finalRate: 1.61, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東大和', area: '東大和', department: '普通科', quota: 221, finalApplicants: 293, finalRate: 1.33, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東大和南', area: '東大和', department: '普通科', quota: 220, finalApplicants: 304, finalRate: 1.38, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '清瀬', area: '清瀬', department: '普通科', quota: 220, finalApplicants: 306, finalRate: 1.39, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '久留米西', area: '東久留米', department: '普通科', quota: 188, finalApplicants: 203, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '武蔵村山', area: '武蔵村山', department: '普通科', quota: 221, finalApplicants: 244, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '永山', area: '多摩', department: '普通科', quota: 236, finalApplicants: 303, finalRate: 1.28, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '羽村', area: '羽村', department: '普通科', quota: 201, finalApplicants: 136, finalRate: 0.68, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '秋留台', area: 'あきる野', department: '普通科', quota: 136, finalApplicants: 184, finalRate: 1.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '五日市', area: 'あきる野', department: '普通科', quota: 136, finalApplicants: 48, finalRate: 0.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '田無', area: '西東京', department: '普通科', quota: 252, finalApplicants: 377, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '保谷', area: '西東京', department: '普通科', quota: 253, finalApplicants: 429, finalRate: 1.7, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大島', area: '大島', department: '普通科', quota: 80, finalApplicants: 22, finalRate: 0.28, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新島', area: '新島', department: '普通科', quota: 40, finalApplicants: 8, finalRate: 0.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '神津', area: '神津島', department: '普通科', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三宅', area: '三宅', department: '普通科', quota: 40, finalApplicants: 2, finalRate: 0.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八丈', area: '八丈', department: '普通科', quota: 76, finalApplicants: 28, finalRate: 0.37, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小笠原', area: '小笠原', department: '普通科', quota: 30, finalApplicants: 14, finalRate: 0.47, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深川', area: '江東', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 114, finalRate: 2.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '片倉', area: '八王子', department: '普通科（コース制・造形美術）', quota: 56, finalApplicants: 66, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松が谷', area: '八王子', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 81, finalRate: 1.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '小平', area: '小平', department: '普通科（コース制・外国語）', quota: 56, finalApplicants: 103, finalRate: 1.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新宿', area: '新宿', department: '普通科（単位制）', quota: 284, finalApplicants: 686, finalRate: 2.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '忍岡', area: '台東', department: '普通科（単位制）', quota: 124, finalApplicants: 130, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '墨田川', area: '墨田', department: '普通科（単位制）', quota: 252, finalApplicants: 323, finalRate: 1.28, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '美原', area: '大田', department: '普通科（単位制）', quota: 156, finalApplicants: 175, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '芦花', area: '世田谷', department: '普通科（単位制）', quota: 220, finalApplicants: 455, finalRate: 2.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '飛鳥', area: '北', department: '普通科（単位制）', quota: 170, finalApplicants: 181, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '板橋有徳', area: '板橋', department: '普通科（単位制）', quota: 156, finalApplicants: 177, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大泉桜', area: '練馬', department: '普通科（単位制）', quota: 156, finalApplicants: 174, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '翔陽', area: '八王子', department: '普通科（単位制）', quota: 188, finalApplicants: 202, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '国分寺', area: '国分寺', department: '普通科（単位制）', quota: 252, finalApplicants: 365, finalRate: 1.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '上水', area: '武蔵村山', department: '普通科（単位制）', quota: 188, finalApplicants: 263, finalRate: 1.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三田', area: '港', department: '普通科（海外帰国生徒対象・帰国生）', quota: 18, finalApplicants: 22, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '竹早', area: '文京', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 30, finalRate: 2.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '日野台', area: '日野', department: '普通科（海外帰国生徒対象・帰国生）', quota: 13, finalApplicants: 15, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '深川', area: '江東', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '光丘', area: '練馬', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '富士森', area: '八王子', department: '普通科（海外帰国生徒対象・引揚者）', quota: 6, finalApplicants: 0, finalRate: 0, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開第5弾: R6分・専門学科・定時制課程（単位制）（documents/d/kyoiku/1_61）の1〜6頁目。
    { schoolName: '芝商業', area: '港', department: '商業科', quota: 102, finalApplicants: 98, finalRate: 0.96, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '江東商業', area: '江東', department: '商業科', quota: 105, finalApplicants: 100, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '第三商業', area: '江東', department: '商業科', quota: 105, finalApplicants: 125, finalRate: 1.19, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '第一商業', area: '渋谷', department: '商業科', quota: 126, finalApplicants: 117, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '第四商業', area: '練馬', department: '商業科', quota: 105, finalApplicants: 93, finalRate: 0.89, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '葛飾商業', area: '葛飾', department: '商業科', quota: 126, finalApplicants: 122, finalRate: 0.97, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '第五商業', area: '国立', department: '商業科', quota: 126, finalApplicants: 157, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大田桜台', area: '大田', department: 'ビジネスコミュニケーション科', quota: 105, finalApplicants: 107, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '千早', area: '豊島', department: 'ビジネスコミュニケーション科', quota: 126, finalApplicants: 149, finalRate: 1.18, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '工芸', area: '文京', department: '工業科', quota: 125, finalApplicants: 206, finalRate: 1.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '蔵前工科', area: '台東', department: '工業科', quota: 100, finalApplicants: 103, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '墨田工科', area: '江東', department: '工業科', quota: 132, finalApplicants: 54, finalRate: 0.41, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '総合工科', area: '世田谷', department: '工業科', quota: 105, finalApplicants: 58, finalRate: 0.55, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '中野工科', area: '中野', department: '工業科', quota: 63, finalApplicants: 58, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉並工科', area: '杉並', department: '工業科', quota: 104, finalApplicants: 35, finalRate: 0.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '荒川工科', area: '荒川', department: '工業科', quota: 120, finalApplicants: 45, finalRate: 0.38, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '北豊島工科', area: '板橋', department: '工業科', quota: 98, finalApplicants: 44, finalRate: 0.45, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '練馬工科', area: '練馬', department: '工業科', quota: 88, finalApplicants: 116, finalRate: 1.32, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '足立工科', area: '足立', department: '工業科', quota: 107, finalApplicants: 71, finalRate: 0.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '葛西工科', area: '江戸川', department: '工業科', quota: 120, finalApplicants: 78, finalRate: 0.65, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '府中工科', area: '府中', department: '工業科', quota: 107, finalApplicants: 100, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '町田工科', area: '町田', department: '工業科', quota: 105, finalApplicants: 110, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多摩工科', area: '福生', department: '工業科', quota: 105, finalApplicants: 106, finalRate: 1.01, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '田無工科', area: '西東京', department: '工業科', quota: 105, finalApplicants: 68, finalRate: 0.65, fiscalYear: '令和6年度（2024年度）' },
    // --- 工業科（単位制・1校） ---
    { schoolName: '六郷工科', area: '大田', department: '工業科（単位制）', quota: 108, finalApplicants: 87, finalRate: 0.81, fiscalYear: '令和6年度（2024年度）' },
    // --- 科学技術科（2校） ---
    { schoolName: '科学技術', area: '江東', department: '科学技術科', quota: 105, finalApplicants: 131, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '多摩科学技術', area: '小金井', department: '科学技術科', quota: 147, finalApplicants: 252, finalRate: 1.71, fiscalYear: '令和6年度（2024年度）' },
    // --- 農業科（5校） ---
    { schoolName: '園芸', area: '世田谷', department: '農業科', quota: 99, finalApplicants: 140, finalRate: 1.41, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '農芸', area: '杉並', department: '農業科', quota: 92, finalApplicants: 95, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '農産', area: '葛飾', department: '農業科', quota: 84, finalApplicants: 72, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '農業', area: '府中', department: '農業科', quota: 63, finalApplicants: 100, finalRate: 1.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '瑞穂農芸', area: '瑞穂', department: '農業科', quota: 75, finalApplicants: 70, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    // --- 水産科（1校） ---
    { schoolName: '大島海洋国際', area: '大島', department: '水産科', quota: 42, finalApplicants: 45, finalRate: 1.07, fiscalYear: '令和6年度（2024年度）' },
    // --- 家庭科（単位制以外・3校） ---
    { schoolName: '赤羽北桜', area: '北', department: '家庭科', quota: 123, finalApplicants: 102, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '農業', area: '府中', department: '家庭科', quota: 50, finalApplicants: 81, finalRate: 1.62, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '瑞穂農芸', area: '瑞穂', department: '家庭科', quota: 49, finalApplicants: 33, finalRate: 0.67, fiscalYear: '令和6年度（2024年度）' },
    // --- 家庭科（単位制・1校） ---
    { schoolName: '忍岡', area: '台東', department: '家庭科（単位制）', quota: 49, finalApplicants: 55, finalRate: 1.12, fiscalYear: '令和6年度（2024年度）' },
    // --- 福祉科（2校） ---
    { schoolName: '赤羽北桜', area: '北', department: '福祉科', quota: 25, finalApplicants: 6, finalRate: 0.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '野津田', area: '町田', department: '福祉科', quota: 28, finalApplicants: 8, finalRate: 0.29, fiscalYear: '令和6年度（2024年度）' },
    // --- 理数科（2校） ---
    { schoolName: '科学技術', area: '江東', department: '理数科', quota: 34, finalApplicants: 77, finalRate: 2.26, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '立川', area: '立川', department: '理数科', quota: 34, finalApplicants: 92, finalRate: 2.71, fiscalYear: '令和6年度（2024年度）' },
    // --- 芸術科（1校） ---
    { schoolName: '総合芸術', area: '新宿', department: '芸術科', quota: 112, finalApplicants: 219, finalRate: 1.96, fiscalYear: '令和6年度（2024年度）' },
    // --- 体育科（2校） ---
    { schoolName: '駒場', area: '目黒', department: '体育科', quota: 28, finalApplicants: 49, finalRate: 1.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '野津田', area: '町田', department: '体育科', quota: 24, finalApplicants: 10, finalRate: 0.42, fiscalYear: '令和6年度（2024年度）' },
    // --- 国際科（1校） ---
    { schoolName: '国際', area: '目黒', department: '国際科', quota: 138, finalApplicants: 302, finalRate: 2.19, fiscalYear: '令和6年度（2024年度）' },
    // --- 併合科（3校） ---
    { schoolName: '大島', area: '大島', department: '併合科（農林・家政）', quota: 35, finalApplicants: 11, finalRate: 0.31, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '三宅', area: '三宅', department: '併合科（農業・家政）', quota: 35, finalApplicants: 3, finalRate: 0.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八丈', area: '八丈', department: '併合科（園芸・家政）', quota: 35, finalApplicants: 4, finalRate: 0.11, fiscalYear: '令和6年度（2024年度）' },
    // --- 産業科（2校） ---
    { schoolName: '橘', area: '墨田', department: '産業科', quota: 126, finalApplicants: 112, finalRate: 0.89, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '八王子桑志', area: '八王子', department: '産業科', quota: 148, finalApplicants: 182, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    // ===== 総合学科（10校） =====
    { schoolName: '晴海総合', area: '中央', department: '総合学科', quota: 192, finalApplicants: 412, finalRate: 2.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: 'つばさ総合', area: '大田', department: '総合学科', quota: 164, finalApplicants: 164, finalRate: 1.0, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '世田谷総合', area: '世田谷', department: '総合学科', quota: 164, finalApplicants: 173, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '杉並総合', area: '杉並', department: '総合学科', quota: 150, finalApplicants: 249, finalRate: 1.66, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '王子総合', area: '北', department: '総合学科', quota: 164, finalApplicants: 234, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '葛飾総合', area: '葛飾', department: '総合学科', quota: 136, finalApplicants: 142, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '青梅総合', area: '青梅', department: '総合学科', quota: 164, finalApplicants: 233, finalRate: 1.42, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '町田総合', area: '町田', department: '総合学科', quota: 164, finalApplicants: 169, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '東久留米総合', area: '東久留米', department: '総合学科', quota: 164, finalApplicants: 174, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '若葉総合', area: '稲城', department: '総合学科', quota: 164, finalApplicants: 205, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R5第1弾: R5分・個票PDF「1[普通科（コース、単位制以外の学校）]」の1〜2頁目(区部58校)。
    { schoolName: '日比谷', area: '千代田', department: '普通科', quota: 254, finalApplicants: 581, finalRate: 2.29, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三田', area: '港', department: '普通科', quota: 237, finalApplicants: 405, finalRate: 1.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '戸山', area: '新宿', department: '普通科', quota: 253, finalApplicants: 490, finalRate: 1.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '竹早', area: '文京', department: '普通科', quota: 178, finalApplicants: 338, finalRate: 1.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '向丘', area: '文京', department: '普通科', quota: 253, finalApplicants: 376, finalRate: 1.49, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '上野', area: '台東', department: '普通科', quota: 253, finalApplicants: 458, finalRate: 1.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '日本橋', area: '墨田', department: '普通科', quota: 212, finalApplicants: 271, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '本所', area: '墨田', department: '普通科', quota: 222, finalApplicants: 310, finalRate: 1.4, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '城東', area: '江東', department: '普通科', quota: 253, finalApplicants: 457, finalRate: 1.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '東', area: '江東', department: '普通科', quota: 222, finalApplicants: 368, finalRate: 1.66, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深川', area: '江東', department: '普通科', quota: 185, finalApplicants: 357, finalRate: 1.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大崎', area: '品川', department: '普通科', quota: 222, finalApplicants: 333, finalRate: 1.5, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小山台', area: '品川', department: '普通科', quota: 253, finalApplicants: 383, finalRate: 1.51, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八潮', area: '品川', department: '普通科', quota: 150, finalApplicants: 154, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '駒場', area: '目黒', department: '普通科', quota: 253, finalApplicants: 406, finalRate: 1.6, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '目黒', area: '目黒', department: '普通科', quota: 191, finalApplicants: 410, finalRate: 2.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大森', area: '大田', department: '普通科', quota: 159, finalApplicants: 77, finalRate: 0.48, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '蒲田', area: '大田', department: '普通科', quota: 87, finalApplicants: 133, finalRate: 1.53, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '田園調布', area: '大田', department: '普通科', quota: 170, finalApplicants: 350, finalRate: 2.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '雪谷', area: '大田', department: '普通科', quota: 222, finalApplicants: 414, finalRate: 1.86, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桜町', area: '世田谷', department: '普通科', quota: 253, finalApplicants: 316, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '千歳丘', area: '世田谷', department: '普通科', quota: 222, finalApplicants: 236, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '深沢', area: '世田谷', department: '普通科', quota: 144, finalApplicants: 120, finalRate: 0.83, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松原', area: '世田谷', department: '普通科', quota: 190, finalApplicants: 291, finalRate: 1.53, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '青山', area: '渋谷', department: '普通科', quota: 222, finalApplicants: 446, finalRate: 2.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '広尾', area: '渋谷', department: '普通科', quota: 155, finalApplicants: 351, finalRate: 2.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '鷺宮', area: '中野', department: '普通科', quota: 222, finalApplicants: 460, finalRate: 2.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '武蔵丘', area: '中野', department: '普通科', quota: 254, finalApplicants: 497, finalRate: 1.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '杉並', area: '杉並', department: '普通科', quota: 254, finalApplicants: 382, finalRate: 1.5, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '豊多摩', area: '杉並', department: '普通科', quota: 253, finalApplicants: 491, finalRate: 1.94, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '西', area: '杉並', department: '普通科', quota: 253, finalApplicants: 463, finalRate: 1.83, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '豊島', area: '豊島', department: '普通科', quota: 253, finalApplicants: 506, finalRate: 2.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '文京', area: '豊島', department: '普通科', quota: 285, finalApplicants: 495, finalRate: 1.74, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '竹台', area: '荒川', department: '普通科', quota: 184, finalApplicants: 233, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '板橋', area: '板橋', department: '普通科', quota: 254, finalApplicants: 326, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大山', area: '板橋', department: '普通科', quota: 171, finalApplicants: 140, finalRate: 0.82, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '北園', area: '板橋', department: '普通科', quota: 254, finalApplicants: 457, finalRate: 1.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高島', area: '板橋', department: '普通科', quota: 253, finalApplicants: 330, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '井草', area: '練馬', department: '普通科', quota: 254, finalApplicants: 412, finalRate: 1.62, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '石神井', area: '練馬', department: '普通科', quota: 253, finalApplicants: 485, finalRate: 1.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '田柄', area: '練馬', department: '普通科', quota: 135, finalApplicants: 75, finalRate: 0.56, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '練馬', area: '練馬', department: '普通科', quota: 191, finalApplicants: 236, finalRate: 1.24, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '光丘', area: '練馬', department: '普通科', quota: 185, finalApplicants: 156, finalRate: 0.84, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '青井', area: '足立', department: '普通科', quota: 152, finalApplicants: 105, finalRate: 0.69, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '足立', area: '足立', department: '普通科', quota: 222, finalApplicants: 336, finalRate: 1.51, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '足立新田', area: '足立', department: '普通科', quota: 210, finalApplicants: 218, finalRate: 1.04, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '足立西', area: '足立', department: '普通科', quota: 158, finalApplicants: 186, finalRate: 1.18, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '足立東', area: '足立', department: '普通科', quota: 123, finalApplicants: 160, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '江北', area: '足立', department: '普通科', quota: 253, finalApplicants: 481, finalRate: 1.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '淵江', area: '足立', department: '普通科', quota: 212, finalApplicants: 219, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '葛飾野', area: '葛飾', department: '普通科', quota: 254, finalApplicants: 317, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '南葛飾', area: '葛飾', department: '普通科', quota: 162, finalApplicants: 183, finalRate: 1.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '江戸川', area: '江戸川', department: '普通科', quota: 286, finalApplicants: 435, finalRate: 1.52, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '葛西南', area: '江戸川', department: '普通科', quota: 192, finalApplicants: 189, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小岩', area: '江戸川', department: '普通科', quota: 285, finalApplicants: 515, finalRate: 1.81, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小松川', area: '江戸川', department: '普通科', quota: 254, finalApplicants: 313, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '篠崎', area: '江戸川', department: '普通科', quota: 223, finalApplicants: 277, finalRate: 1.24, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '紅葉川', area: '江戸川', department: '普通科', quota: 222, finalApplicants: 286, finalRate: 1.29, fiscalYear: '令和5年度（2023年度）' },
    // 掛-1横展開R5第2弾: R5分・個票1[普通科（コース単位制以外）]の3頁目(多摩部44校)+「2[普通科（島しょの学校）]」6校。個票1完結(区部58+多摩部44+島しょ6=108校)。
    { schoolName: '片倉', area: '八王子', department: '普通科', quota: 191, finalApplicants: 300, finalRate: 1.57, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八王子北', area: '八王子', department: '普通科', quota: 160, finalApplicants: 208, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八王子東', area: '八王子', department: '普通科', quota: 253, finalApplicants: 325, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '富士森', area: '八王子', department: '普通科', quota: 282, finalApplicants: 426, finalRate: 1.51, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松が谷', area: '八王子', department: '普通科', quota: 222, finalApplicants: 313, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '立川', area: '立川', department: '普通科', quota: 222, finalApplicants: 310, finalRate: 1.4, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '武蔵野北', area: '武蔵野', department: '普通科', quota: 191, finalApplicants: 296, finalRate: 1.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '多摩', area: '青梅', department: '普通科', quota: 159, finalApplicants: 107, finalRate: 0.67, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '府中', area: '府中', department: '普通科', quota: 222, finalApplicants: 448, finalRate: 2.02, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '府中西', area: '府中', department: '普通科', quota: 236, finalApplicants: 314, finalRate: 1.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '府中東', area: '府中', department: '普通科', quota: 241, finalApplicants: 349, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '昭和', area: '昭島', department: '普通科', quota: 253, finalApplicants: 478, finalRate: 1.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '拝島', area: '昭島', department: '普通科', quota: 222, finalApplicants: 236, finalRate: 1.06, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '神代', area: '調布', department: '普通科', quota: 253, finalApplicants: 487, finalRate: 1.92, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '調布北', area: '調布', department: '普通科', quota: 190, finalApplicants: 281, finalRate: 1.48, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '調布南', area: '調布', department: '普通科', quota: 191, finalApplicants: 391, finalRate: 2.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小川', area: '町田', department: '普通科', quota: 253, finalApplicants: 349, finalRate: 1.38, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '成瀬', area: '町田', department: '普通科', quota: 222, finalApplicants: 290, finalRate: 1.31, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '野津田', area: '町田', department: '普通科', quota: 96, finalApplicants: 69, finalRate: 0.72, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '町田', area: '町田', department: '普通科', quota: 254, finalApplicants: 312, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '山崎', area: '町田', department: '普通科', quota: 140, finalApplicants: 138, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小金井北', area: '小金井', department: '普通科', quota: 191, finalApplicants: 269, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小平', area: '小平', department: '普通科', quota: 159, finalApplicants: 215, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小平西', area: '小平', department: '普通科', quota: 223, finalApplicants: 286, finalRate: 1.28, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小平南', area: '小平', department: '普通科', quota: 222, finalApplicants: 345, finalRate: 1.55, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '日野', area: '日野', department: '普通科', quota: 286, finalApplicants: 401, finalRate: 1.4, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '日野台', area: '日野', department: '普通科', quota: 243, finalApplicants: 344, finalRate: 1.42, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '南平', area: '日野', department: '普通科', quota: 254, finalApplicants: 381, finalRate: 1.5, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '東村山', area: '東村山', department: '普通科', quota: 119, finalApplicants: 208, finalRate: 1.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '東村山西', area: '東村山', department: '普通科', quota: 191, finalApplicants: 186, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '国立', area: '国立', department: '普通科', quota: 253, finalApplicants: 372, finalRate: 1.47, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '福生', area: '福生', department: '普通科', quota: 222, finalApplicants: 278, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '狛江', area: '狛江', department: '普通科', quota: 254, finalApplicants: 434, finalRate: 1.71, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '東大和', area: '東大和', department: '普通科', quota: 222, finalApplicants: 283, finalRate: 1.27, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '東大和南', area: '東大和', department: '普通科', quota: 222, finalApplicants: 313, finalRate: 1.41, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '清瀬', area: '清瀬', department: '普通科', quota: 253, finalApplicants: 277, finalRate: 1.09, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '久留米西', area: '東久留米', department: '普通科', quota: 190, finalApplicants: 231, finalRate: 1.22, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '武蔵村山', area: '武蔵村山', department: '普通科', quota: 222, finalApplicants: 223, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '永山', area: '多摩', department: '普通科', quota: 234, finalApplicants: 260, finalRate: 1.11, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '羽村', area: '羽村', department: '普通科', quota: 202, finalApplicants: 137, finalRate: 0.68, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '秋留台', area: 'あきる野', department: '普通科', quota: 137, finalApplicants: 132, finalRate: 0.96, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '五日市', area: 'あきる野', department: '普通科', quota: 129, finalApplicants: 45, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '田無', area: '西東京', department: '普通科', quota: 253, finalApplicants: 367, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '保谷', area: '西東京', department: '普通科', quota: 254, finalApplicants: 364, finalRate: 1.43, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大島', area: '大島', department: '普通科', quota: 80, finalApplicants: 36, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新島', area: '新島', department: '普通科', quota: 40, finalApplicants: 10, finalRate: 0.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '神津', area: '神津島', department: '普通科', quota: 40, finalApplicants: 14, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '三宅', area: '三宅', department: '普通科', quota: 40, finalApplicants: 4, finalRate: 0.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '八丈', area: '八丈', department: '普通科', quota: 77, finalApplicants: 37, finalRate: 0.48, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '小笠原', area: '小笠原', department: '普通科', quota: 30, finalApplicants: 29, finalRate: 0.97, fiscalYear: '令和5年度（2023年度）' },
  ],
};
