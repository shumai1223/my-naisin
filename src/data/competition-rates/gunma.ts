/**
 * 群馬県 公立高等学校 倍率パイプラインα（Y-6・9県目・coverage='partial'／掛-1・R5〜R8の4年度分収録済み）。
 *
 * 一次ソース: 群馬県教育委員会「令和8年度群馬県公立高等学校入学者選抜 第２回志願先変更後の
 * 全日制課程選抜・フレックススクール選抜志願状況」（2月12日確定・全2ページ）。
 *
 * ⚠️群馬県のPDFはテキスト埋め込み型でpdftotext -layoutによるテキスト抽出が機能した（広島・熊本・
 * 宮城・岐阜・岡山・栃木と同型の高信頼度技法）。列は[学校別募集定員(A) / 学科・コース等 / 性別 /
 * 学科等別募集定員(B) / 学科等別志願者数(C) / 学科等別倍率(C/B) / 学校別志願者数(D) / 学校別倍率
 * (D/A)]。本ファイルのquota=B・finalApplicants=C・finalRate=C/Bとして転記した。
 *
 * ⚠️coverage.status='partial'とした理由（重要）: 収録した60校106レコードは、各校の学科別内訳
 * 合計（自己集計）がPDF記載の学校別志願者数(D列)と全60校で完全一致することを機械検証済み
 * （内部整合性100%）。しかしPDF末尾のグランドトータル（quota11,153・applicants10,745・倍率0.96）
 * とは一致しない（quota差50・applicants差47）。原因を調査した結果、この差分はPDF本文の学校別
 * 表に一切データが記載されず「連携型選抜実施校志願状況を参照してください」という注記のみが
 * 置かれている3校（尾瀬・万場・嬬恋）に起因すると判明した。別紙（連携型選抜実施校志願状況）の
 * 「全日制課程選抜」列（連携型選抜列を除く）だけを合算するとapplicants差分47に完全一致する
 * （尾瀬25＋万場9＋嬬恋13＝47）。しかしquota側は、別紙の注記に「連携型選抜の募集人員は、
 * 定めないものとする」と明記されており、全日制課程選抜専用の定員が別紙の学科等別募集定員
 * （152）から機械的に分離できない（単純に152を加算すると今度は超過してしまい、50という
 * 差分と一致する計算式が捏造なしには構築できなかった）。**この3校は捏造ゼロ優先のため
 * レコードとして収録せず、pendingDepartmentsに正直に記録する**（Y-0憲法③準拠）。
 *
 * 機械集計（quota11,001・applicants10,698、60校106レコード）は各校の学校別志願者数(D)とは
 * 完全一致するが、県全体のグランドトータルとは一致しないことを明記した上で収録する。
 *
 * ⚠️掛-1（R6・3年度目）: R6版一次資料(uploaded/attachment/616847.pdf「第2回志願先変更後の
 * 志願状況」全2頁)はR7/R8と異なり埋め込みフォントが壊れておりpdftotextでは日本語ラベルが
 * 全欠落する（数字のみ抽出できる状態）ため、pdftoppm 150〜300dpiビジョン解析で107レコードを
 * 転記した。全校について学校別志願者数(D列)と学科別内訳の機械合算が完全一致することを検証済み。
 * 印字済みグランドトータル（B=11,757・C=11,744）との差（quota192・applicants39）は、R7/R8と
 * 同型の理由（本表にデータが記載されず「連携型選抜実施校志願状況を参照してください」と
 * のみ注記される尾瀬・万場・嬬恋の3校）によるもので、年度により対象3校の合計quota/applicants
 * が変動するため差分の絶対値はR7/R8とは一致しない。この3校はY-0憲法③（捏造ゼロ）により
 * レコードとして収録せず。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const GUNMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'gunma',
  sources: [
    {
      url: 'https://www.pref.gunma.jp/uploaded/attachment/689968.pdf',
      docTitle:
        '群馬県教育委員会 令和8年度群馬県公立高等学校入学者選抜 第２回志願先変更後の全日制課程選抜・フレックススクール選抜志願状況',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
    {
      url: 'https://www.pref.gunma.jp/uploaded/attachment/651580.pdf',
      docTitle:
        '群馬県教育委員会 令和7年度群馬県公立高等学校入学者選抜 第２回志願先変更後の全日制課程選抜・フレックススクール選抜志願状況',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
    {
      url: 'https://www.pref.gunma.jp/uploaded/attachment/616847.pdf',
      docTitle:
        '群馬県教育委員会 令和6年度群馬県公立高等学校入学者選抜 第２回志願先変更後の全日制課程選抜・フレックススクール選抜志願状況（掛-1・gunma横展開R6・全日制完結）',
      fiscalYear: '令和6年度（2024年度）',
      fetchedAt: '2026-08-08',
    },
    {
      url: 'https://www.pref.gunma.jp/uploaded/attachment/146435.pdf',
      docTitle:
        '群馬県教育委員会 令和5年度群馬県公立高等学校入学者選抜 志願先変更後の全日制課程・フレックススクール後期選抜志願状況（掛-1・gunma横展開R5・4年度目・当時は前期/後期選抜の二段階制度）',
      fiscalYear: '令和5年度（2023年度）',
      fetchedAt: '2026-08-22',
    },
  ],
  coverage: {
    status: 'partial',
    includedDepartments: [
      '全日制課程選抜・フレックススクール選抜（60校106レコード。各校の学科別内訳合計は学校別志願者数(D列)と全校完全一致）',
    ],
    pendingDepartments: [
      '連携型選抜実施校3校（尾瀬・万場・嬬恋）: 本文の学校別表にデータが無く別紙参照のみ。別紙の全日制課程選抜列の合算でapplicants差分(47)は説明できるが、quota差分(50)を捏造なしに再現できる計算式が無いため収録を見送り',
      '定時制課程（他県と同じ理由でスコープ外）',
    ],
    note:
      'PDF末尾のグランドトータル（quota11,153・applicants10,745・倍率0.96）に対し、機械集計（quota11,001・' +
      'applicants10,698）は連携型選抜実施校3校分（quota差50・applicants差47）だけ少ない。差分の原因は特定済み' +
      '（尾瀬・万場・嬬恋の連携型選抜実施校3校）だが、quota側を機械的に再現できないため意図的に収録を見送った。',
  },
  // ⚠️掛-1（学校別×多年度）R7追加: 令和7年度版「第２回志願先変更後の全日制課程選抜、フレックススクール選抜志願状況」
  // （2月13日確定・全3頁）https://www.pref.gunma.jp/uploaded/attachment/651580.pdf を取得。R8と同型のCJK
  // ラベル抽出不能な埋め込みフォントだったためpdftoppm 300dpiビジョン解析で106レコード（60校）を転記。
  // 太田工業のみ「機械」「電子機械」がくくり募集（quota120を共有）だったため「機械・電子機械」の単一
  // レコードとして収録した（R8では機械のみquota80で電子機械が存在しない＝R7→R8で規模縮小した可能性が
  // あるが、いずれにせよ捏造なしにそのまま転記）。ページ2末尾の印字済み合計行「11,435(11,561) /
  // 11,435(11,561) / 11,467 / 1.00 / 11,467 / 1.00」に対し、node.js機械集計（quota11,283・
  // applicants11,425）はquota差152・applicants差42だけ少ない。この差分はR8と全く同じ理由（尾瀬64+
  // 万場44+嬬恋44=152・3校の「全日制課程選抜」欄の志願者数21+11+10=42と完全一致）で説明できることを
  // 特定した。3校はR7でも本文の学校別表にデータが無く別紙（連携型選抜実施校志願状況）参照のみで、
  // 別紙は学科等別募集定員が「連携型選抜の募集人員は定めないものとする」との注記どおり全日制課程選抜と
  // 連携型選抜で共有され分離不能なため、R8と同じ理由でこの3校は今回も収録を見送った（Y-0憲法③準拠）。
  //
  // ⚠️掛-1（学校別×多年度）R5追加（4年度目・末尾に追加）: 令和5年度（R5）版一次資料「志願先変更後の
  // 全日制課程・フレックススクール後期選抜志願状況」（https://www.pref.gunma.jp/uploaded/attachment/
  // 146435.pdf・全3頁・3月6日確定）を取得。群馬県はR6入試から単一選抜制度へ移行しており、R5は
  // 前期選抜／後期選抜の二段階選抜制度だった最後の年度。本PDFは「後期選抜」（前期選抜で一部合格者が
  // 既に決定した後の残り募集枠に対する選抜）の志願状況のみを掲載しており、列構成もR6-R8と異なる
  // （学科等別募集定員＝前期分を含む原定員／後期学校別募集人員／後期学科等別募集人員／学科等別
  // 志願者数(男・女・計)／学科等別倍率／学校別志願者数／学校別倍率）。本ファイルのquotaは、印字済み
  // 学科等別倍率（＝学科等別志願者数計÷後期学科等別募集人員）の分母である「後期学科等別募集人員」を
  // 採用した（R6-R8のB列と同じ「印字済み倍率の分母」という定義は維持しているが、後期選抜は前期選抜
  // 後の残り募集枠であるため、quotaの絶対水準はR6-R8の元定員と単純比較できない点に注意）。pdftotext
  // -layoutは埋め込みフォント破損によりCJKラベルが抽出不能（数字のみ抽出可）だったため、pdftoppm
  // 200〜400dpiビジョン解析で113レコード（64校）を転記した。node.js機械集計で全113レコードのquota
  // 合計（6,344）・applicants合計（6,276）が、PDF末尾のグランドトータル行「公立全日制・フレックス
  // スクール合計 11,838/11,838/6,344/6,344/3,481/2,795/6,276/0.99/6,276/0.99」の該当列（後期学科等別
  // 募集人員6,344・学科等別志願者数計6,276）と完全一致することを検証済み（R6-R8と異なり県全体
  // レベルで差分ゼロ）。さらに全64校について、学校別志願者数（D列相当）とその学校の学科別内訳の
  // 機械合算が完全一致することも検証済み。
  // ⚠️尾瀬・万場・嬬恋（連携型選抜実施校）はR6-R8では本文に一切データが記載されず収録を見送っていた
  // が、R5のこの後期選抜版PDFでは3校とも本文の学校別表に直接、募集人員・志願者数が記載されており
  // （尾瀬：普通11＋自然環境12＝23、万場：普通41、嬬恋：普通28＋普通(スポーツ・健康)7＋普通(流通
  // ビジネス)15＝50）、捏造なしに転記可能だったためR5に限り3校とも収録した（R5とR6以降でPDFの様式・
  // 情報粒度が異なることに起因する非対称性であり、恣意的な取捨選択ではない。R5時点では連携型選抜が
  // 別紙分離される前の様式だったとみられる）。
  // 一方、以下の学科・コースは本文の行が完全に空欄（募集人員・志願者数とも記載なし＝後期選抜での
  // 募集自体が無かった）だったため記録を見送った: 前橋西「国際」・勢多農林「植物デザイン」・太田
  // 工業「電子機械」・伊勢崎「グローバルコミュニケーション」・藤岡中央「理数」。他方、高崎商業
  // （グローバル/会計/情報/総合ビジネス）・藤岡北（生物生産・環境土木・ヒューマンサービス）・
  // 藤岡工業（機械・電子機械・電気）・富岡実業（生物生産・地域産業・電子機械）・館林商工（生産
  // システム・建築／総合ビジネス・情報ビジネスの2群）・桐生市立商業（商業・情報処理）は、募集人員が
  // 代表科・コースの行にのみ記載されるくくり募集のため、R6と同じ表記方針でコース名を連結した単一
  // レコードとして収録した。定時制課程選抜（別紙3頁目・前橋工業ほか10校）は他県と同じ理由でスコープ
  // 外のため収録していない。
  officialSubtotals: [],
  records: [
    { schoolName: '前橋', department: '普通', quota: 280, finalApplicants: 314, finalRate: 1.12 },
    { schoolName: '前橋南', department: '普通', quota: 200, finalApplicants: 209, finalRate: 1.05 },
    { schoolName: '前橋西', department: '普通', quota: 160, finalApplicants: 138, finalRate: 0.86 },
    { schoolName: '前橋女子', department: '普通', quota: 280, finalApplicants: 294, finalRate: 1.05 },
    { schoolName: '前橋東', department: '総合', quota: 200, finalApplicants: 217, finalRate: 1.09 },
    { schoolName: '勢多農林', department: '植物科学', quota: 80, finalApplicants: 78, finalRate: 0.98 },
    { schoolName: '勢多農林', department: '動物科学（資源動物）', quota: 20, finalApplicants: 19, finalRate: 0.95 },
    { schoolName: '勢多農林', department: '動物科学（応用動物）', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '勢多農林', department: '緑地土木', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '勢多農林', department: '食品科学', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '前橋工業', department: '機械', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '前橋工業', department: '電子機械', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '前橋工業', department: '電気', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '前橋工業', department: '電子', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '前橋工業', department: '建築', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '前橋工業', department: '土木', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '前橋商業', department: '商業', quota: 280, finalApplicants: 307, finalRate: 1.1 },
    { schoolName: '前橋清陵', department: '普通（昼間部）', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '前橋清陵', department: '普通（夜間部）', quota: 80, finalApplicants: 48, finalRate: 0.6 },
    { schoolName: '高崎', department: '普通', quota: 280, finalApplicants: 354, finalRate: 1.26 },
    { schoolName: '高崎東', department: '普通', quota: 160, finalApplicants: 144, finalRate: 0.9 },
    { schoolName: '高崎北', department: '普通', quota: 240, finalApplicants: 251, finalRate: 1.05 },
    { schoolName: '榛名', department: '普通', quota: 72, finalApplicants: 28, finalRate: 0.39 },
    { schoolName: '高崎女子', department: '普通', quota: 280, finalApplicants: 298, finalRate: 1.06 },
    { schoolName: '吉井', department: '総合', quota: 120, finalApplicants: 79, finalRate: 0.66 },
    { schoolName: '高崎工業', department: '機械', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '高崎工業', department: '電気', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '高崎工業', department: '情報技術', quota: 40, finalApplicants: 58, finalRate: 1.45 },
    { schoolName: '高崎工業', department: '建築', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '高崎工業', department: '土木', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '高崎工業', department: '工業化学', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '高崎商業', department: '商業（グローバル/会計/情報/総合ビジネス）', quota: 280, finalApplicants: 295, finalRate: 1.05 },
    { schoolName: '桐生', department: '普通', quota: 240, finalApplicants: 272, finalRate: 1.13 },
    { schoolName: '桐生', department: '理数', quota: 80, finalApplicants: 112, finalRate: 1.4 },
    { schoolName: '桐生清桜', department: '普通', quota: 160, finalApplicants: 144, finalRate: 0.9 },
    { schoolName: '桐生清桜', department: '普通（アドバンスト探究）', quota: 80, finalApplicants: 88, finalRate: 1.1 },
    { schoolName: '桐生工業', department: '機械', quota: 80, finalApplicants: 55, finalRate: 0.69 },
    { schoolName: '桐生工業', department: '建設', quota: 40, finalApplicants: 26, finalRate: 0.65 },
    { schoolName: '桐生工業', department: '創造技術（電気）', quota: 20, finalApplicants: 19, finalRate: 0.95 },
    { schoolName: '桐生工業', department: '創造技術（染織デザイン）', quota: 20, finalApplicants: 14, finalRate: 0.7 },
    { schoolName: '伊勢崎', department: '普通', quota: 280, finalApplicants: 344, finalRate: 1.23 },
    { schoolName: '伊勢崎清明', department: '普通', quota: 200, finalApplicants: 230, finalRate: 1.15 },
    { schoolName: '伊勢崎興陽', department: '総合', quota: 200, finalApplicants: 212, finalRate: 1.06 },
    { schoolName: '伊勢崎工業', department: '機械', quota: 80, finalApplicants: 84, finalRate: 1.05 },
    { schoolName: '伊勢崎工業', department: '電子機械', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '伊勢崎工業', department: '電気', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '伊勢崎工業', department: '工業化学', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '伊勢崎商業', department: '商業', quota: 200, finalApplicants: 196, finalRate: 0.98 },
    { schoolName: '太田', department: '普通', quota: 240, finalApplicants: 247, finalRate: 1.03 },
    { schoolName: '太田東', department: '普通', quota: 240, finalApplicants: 253, finalRate: 1.05 },
    { schoolName: '太田女子', department: '普通', quota: 240, finalApplicants: 236, finalRate: 0.98 },
    { schoolName: '新田暁', department: '総合', quota: 160, finalApplicants: 151, finalRate: 0.94 },
    { schoolName: '太田工業', department: '機械', quota: 80, finalApplicants: 76, finalRate: 0.95 },
    { schoolName: '太田工業', department: '電気情報', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '太田フレックス', department: '普通（Ⅰ部・昼）', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '太田フレックス', department: '普通（Ⅱ部・昼）', quota: 80, finalApplicants: 71, finalRate: 0.89 },
    { schoolName: '太田フレックス', department: '普通（Ⅲ部・夜）', quota: 80, finalApplicants: 18, finalRate: 0.23 },
    { schoolName: '沼田', department: '普通', quota: 160, finalApplicants: 131, finalRate: 0.82 },
    { schoolName: '沼田', department: '文理探究', quota: 40, finalApplicants: 61, finalRate: 1.53 },
    { schoolName: '利根実業', department: '生物生産', quota: 80, finalApplicants: 68, finalRate: 0.85 },
    { schoolName: '利根実業', department: '創生工学（機械）', quota: 20, finalApplicants: 22, finalRate: 1.1 },
    { schoolName: '利根実業', department: '創生工学（建設）', quota: 20, finalApplicants: 27, finalRate: 1.35 },
    { schoolName: '館林', department: '普通', quota: 160, finalApplicants: 140, finalRate: 0.88 },
    { schoolName: '館林女子', department: '普通', quota: 160, finalApplicants: 189, finalRate: 1.18 },
    { schoolName: '渋川', department: '普通', quota: 160, finalApplicants: 164, finalRate: 1.03 },
    { schoolName: '渋川女子', department: '普通', quota: 200, finalApplicants: 196, finalRate: 0.98 },
    { schoolName: '渋川青翠', department: '総合', quota: 120, finalApplicants: 103, finalRate: 0.86 },
    { schoolName: '渋川工業', department: '機械', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '渋川工業', department: '自動車', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '渋川工業', department: '電気', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '渋川工業', department: '情報システム', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '藤岡中央', department: '普通', quota: 160, finalApplicants: 135, finalRate: 0.84 },
    { schoolName: '藤岡北', department: '生物生産', quota: 120, finalApplicants: 111, finalRate: 0.93 },
    { schoolName: '藤岡工業', department: 'ものづくり創造', quota: 80, finalApplicants: 44, finalRate: 0.55 },
    { schoolName: '富岡', department: '普通', quota: 200, finalApplicants: 169, finalRate: 0.85 },
    { schoolName: '富岡実業', department: '生物生産', quota: 120, finalApplicants: 116, finalRate: 0.97 },
    { schoolName: '松井田', department: '普通', quota: 72, finalApplicants: 34, finalRate: 0.47 },
    { schoolName: '安中総合学園', department: '総合', quota: 200, finalApplicants: 168, finalRate: 0.84 },
    { schoolName: '大間々', department: '普通', quota: 120, finalApplicants: 94, finalRate: 0.78 },
    { schoolName: '下仁田', department: '普通', quota: 44, finalApplicants: 17, finalRate: 0.39 },
    { schoolName: '吾妻中央', department: '普通', quota: 72, finalApplicants: 45, finalRate: 0.63 },
    { schoolName: '吾妻中央', department: '生物生産', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '吾妻中央', department: '環境工学', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '吾妻中央', department: '福祉', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '長野原', department: '普通', quota: 44, finalApplicants: 29, finalRate: 0.66 },
    { schoolName: '玉村', department: '普通', quota: 80, finalApplicants: 43, finalRate: 0.54 },
    { schoolName: '板倉', department: '普通', quota: 72, finalApplicants: 44, finalRate: 0.61 },
    { schoolName: '館林商工', department: '生産システム', quota: 80, finalApplicants: 54, finalRate: 0.68 },
    { schoolName: '館林商工', department: '総合ビジネス', quota: 80, finalApplicants: 59, finalRate: 0.74 },
    { schoolName: '西邑楽', department: '普通', quota: 120, finalApplicants: 106, finalRate: 0.88 },
    { schoolName: '西邑楽', department: 'スポーツ', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '西邑楽', department: '芸術（音楽）', quota: 12, finalApplicants: 1, finalRate: 0.08 },
    { schoolName: '西邑楽', department: '芸術（美術）', quota: 20, finalApplicants: 18, finalRate: 0.9 },
    { schoolName: '大泉', department: '普通', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '大泉', department: '生物生産', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '大泉', department: 'グリーンサイエンス', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '大泉', department: '食品科学', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '市立前橋', department: '普通', quota: 240, finalApplicants: 270, finalRate: 1.13 },
    { schoolName: '高崎経済大学附属', department: '普通', quota: 245, finalApplicants: 312, finalRate: 1.27 },
    { schoolName: '高崎経済大学附属', department: '芸術（音楽系）', quota: 15, finalApplicants: 9, finalRate: 0.6 },
    { schoolName: '高崎経済大学附属', department: '芸術（美術系）', quota: 20, finalApplicants: 26, finalRate: 1.3 },
    { schoolName: '桐生市立商業', department: '商業', quota: 200, finalApplicants: 207, finalRate: 1.04 },
    { schoolName: '市立太田', department: '商業', quota: 153, finalApplicants: 158, finalRate: 1.03 },
    { schoolName: '利根商業', department: '普通', quota: 30, finalApplicants: 7, finalRate: 0.23 },
    { schoolName: '利根商業', department: '総合ビジネス', quota: 56, finalApplicants: 13, finalRate: 0.23 },
    { schoolName: '利根商業', department: '情報ビジネス', quota: 34, finalApplicants: 16, finalRate: 0.47 },
    { schoolName: '前橋', department: '普通', quota: 280, finalApplicants: 313, finalRate: 1.12, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋南', department: '普通', quota: 200, finalApplicants: 208, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋西', department: '普通', quota: 160, finalApplicants: 153, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋女子', department: '普通', quota: 280, finalApplicants: 335, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋東', department: '総合', quota: 200, finalApplicants: 227, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勢多農林', department: '植物科学', quota: 80, finalApplicants: 77, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勢多農林', department: '動物科学（資源動物）', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勢多農林', department: '動物科学（応用動物）', quota: 20, finalApplicants: 35, finalRate: 1.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勢多農林', department: '緑地土木', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '勢多農林', department: '食品科学', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋工業', department: '機械', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋工業', department: '電子機械', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋工業', department: '電気', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋工業', department: '電子', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋工業', department: '建築', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋工業', department: '土木', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋商業', department: '商業', quota: 280, finalApplicants: 322, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋清陵', department: '普通（昼間部）', quota: 80, finalApplicants: 77, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '前橋清陵', department: '普通（夜間部）', quota: 80, finalApplicants: 44, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎', department: '普通', quota: 280, finalApplicants: 368, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎東', department: '普通', quota: 160, finalApplicants: 182, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎北', department: '普通', quota: 240, finalApplicants: 283, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '榛名', department: '普通', quota: 72, finalApplicants: 51, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎女子', department: '普通', quota: 280, finalApplicants: 325, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吉井', department: '総合', quota: 120, finalApplicants: 106, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎工業', department: '機械', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎工業', department: '電気', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎工業', department: '情報技術', quota: 40, finalApplicants: 47, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎工業', department: '建築', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎工業', department: '土木', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎工業', department: '工業化学', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎商業', department: '商業（グローバル/会計/情報/総合ビジネス）', quota: 280, finalApplicants: 352, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生', department: '普通', quota: 240, finalApplicants: 251, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生', department: '理数', quota: 80, finalApplicants: 107, finalRate: 1.34, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生清桜', department: '普通', quota: 160, finalApplicants: 137, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生清桜', department: '普通（アドバンスト探究）', quota: 80, finalApplicants: 99, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生工業', department: '機械', quota: 80, finalApplicants: 66, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生工業', department: '建設', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生工業', department: '創造技術（電気）', quota: 20, finalApplicants: 23, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生工業', department: '創造技術（染織デザイン）', quota: 20, finalApplicants: 20, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎', department: '普通', quota: 280, finalApplicants: 308, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎清明', department: '普通', quota: 200, finalApplicants: 216, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎興陽', department: '総合', quota: 200, finalApplicants: 226, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎工業', department: '機械', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎工業', department: '電子機械', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎工業', department: '電気', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎工業', department: '工業化学', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊勢崎商業', department: '商業', quota: 240, finalApplicants: 236, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田', department: '普通', quota: 280, finalApplicants: 289, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田東', department: '普通', quota: 240, finalApplicants: 256, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田女子', department: '普通', quota: 240, finalApplicants: 255, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新田暁', department: '総合', quota: 160, finalApplicants: 155, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田工業', department: '機械・電子機械', quota: 120, finalApplicants: 98, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田工業', department: '電気情報', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅰ部・昼）', quota: 80, finalApplicants: 68, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅱ部・昼）', quota: 80, finalApplicants: 57, finalRate: 0.71, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅲ部・夜）', quota: 80, finalApplicants: 13, finalRate: 0.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '沼田', department: '普通', quota: 160, finalApplicants: 150, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '沼田', department: '文理探究', quota: 40, finalApplicants: 73, finalRate: 1.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '利根実業', department: '生物生産', quota: 80, finalApplicants: 87, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '利根実業', department: '創生工学（機械）', quota: 20, finalApplicants: 16, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '利根実業', department: '創生工学（建設）', quota: 20, finalApplicants: 15, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館林', department: '普通', quota: 200, finalApplicants: 196, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館林女子', department: '普通', quota: 160, finalApplicants: 187, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川', department: '普通', quota: 200, finalApplicants: 172, finalRate: 0.86, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川女子', department: '普通', quota: 200, finalApplicants: 190, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川青翠', department: '総合', quota: 160, finalApplicants: 115, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川工業', department: '機械', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川工業', department: '自動車', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川工業', department: '電気', quota: 40, finalApplicants: 40, finalRate: 1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '渋川工業', department: '情報システム', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤岡中央', department: '普通', quota: 160, finalApplicants: 164, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤岡北', department: '生物生産', quota: 120, finalApplicants: 101, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '藤岡工業', department: 'ものづくり創造', quota: 80, finalApplicants: 54, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡', department: '普通', quota: 200, finalApplicants: 211, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富岡実業', department: '生物生産', quota: 120, finalApplicants: 122, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松井田', department: '普通', quota: 72, finalApplicants: 31, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '安中総合学園', department: '総合', quota: 200, finalApplicants: 198, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大間々', department: '普通', quota: 120, finalApplicants: 104, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '下仁田', department: '普通', quota: 44, finalApplicants: 31, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吾妻中央', department: '普通', quota: 72, finalApplicants: 52, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吾妻中央', department: '生物生産', quota: 40, finalApplicants: 39, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吾妻中央', department: '環境工学', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '吾妻中央', department: '福祉', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '長野原', department: '普通', quota: 44, finalApplicants: 33, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '玉村', department: '普通', quota: 80, finalApplicants: 55, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '板倉', department: '普通', quota: 72, finalApplicants: 52, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館林商工', department: '生産システム', quota: 80, finalApplicants: 74, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '館林商工', department: '総合ビジネス', quota: 80, finalApplicants: 72, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西邑楽', department: '普通', quota: 120, finalApplicants: 113, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西邑楽', department: 'スポーツ', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西邑楽', department: '芸術（音楽）', quota: 12, finalApplicants: 4, finalRate: 0.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '西邑楽', department: '芸術（美術）', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大泉', department: '普通', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大泉', department: '生物生産', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大泉', department: 'グリーンサイエンス', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大泉', department: '食品科学', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立前橋', department: '普通', quota: 240, finalApplicants: 293, finalRate: 1.22, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎経済大学附属', department: '普通', quota: 245, finalApplicants: 280, finalRate: 1.14, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎経済大学附属', department: '芸術（音楽系）', quota: 15, finalApplicants: 16, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '高崎経済大学附属', department: '芸術（美術系）', quota: 20, finalApplicants: 28, finalRate: 1.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桐生市立商業', department: '商業', quota: 240, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立太田', department: '商業', quota: 155, finalApplicants: 161, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '利根商業', department: '普通', quota: 30, finalApplicants: 17, finalRate: 0.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '利根商業', department: '総合ビジネス', quota: 56, finalApplicants: 12, finalRate: 0.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '利根商業', department: '情報ビジネス', quota: 34, finalApplicants: 16, finalRate: 0.47, fiscalYear: '令和7年度（2025年度）' },
    // 掛-1横展開R6・3年度目: 令和6年度(R6)版一次資料(uploaded/attachment/616847.pdf「第2回志願先変更後の
    // 志願状況」全2頁)はR7/R8と異なり埋め込みフォントが壊れておりpdftotextでは日本語ラベルが
    // 全欠落(数字のみ抽出)。pdftoppm 150〜300dpiビジョン解析で107レコードを転記。学校別志願者数
    // (D列)と各校の学科別内訳の機械合算が全校で完全一致することを検証済み。印字済みグランド
    // トータル(B=11,757・C=11,744)との差(quota192・applicants39)は、本表に一切データが記載されず
    // 「連携型選抜実施校志願状況を参照してください」とのみ注記される3校(尾瀬・万場・嬬恋)による
    // もの(R7/R8と同型の既知の欠落パターン。年度により対象3校の合計quota/applicantsは変動するため
    // 差分の絶対値はR7/R8と一致しない)。この3校はY-0憲法③(捏造ゼロ)によりレコードとして収録せず。
    { schoolName: '前橋', department: '普通', quota: 280, finalApplicants: 337, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋南', department: '普通', quota: 200, finalApplicants: 219, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋西', department: '普通', quota: 160, finalApplicants: 172, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋女子', department: '普通', quota: 280, finalApplicants: 305, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋東', department: '総合', quota: 200, finalApplicants: 200, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '勢多農林', department: '植物科学', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '勢多農林', department: '動物科学（資源動物）', quota: 20, finalApplicants: 22, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '勢多農林', department: '動物科学（応用動物）', quota: 20, finalApplicants: 30, finalRate: 1.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '勢多農林', department: '緑地土木', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '勢多農林', department: '食品科学', quota: 40, finalApplicants: 56, finalRate: 1.4, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋工業', department: '機械', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋工業', department: '電子機械', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋工業', department: '電気', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋工業', department: '電子', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋工業', department: '建築', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋工業', department: '土木', quota: 40, finalApplicants: 40, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋商業', department: '商業', quota: 280, finalApplicants: 345, finalRate: 1.23, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋清陵', department: '普通（昼間部）', quota: 80, finalApplicants: 89, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '前橋清陵', department: '普通（夜間部）', quota: 80, finalApplicants: 61, finalRate: 0.76, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎', department: '普通', quota: 280, finalApplicants: 348, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎東', department: '普通', quota: 160, finalApplicants: 167, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎北', department: '普通', quota: 240, finalApplicants: 274, finalRate: 1.14, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '榛名', department: '普通', quota: 80, finalApplicants: 65, finalRate: 0.81, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎女子', department: '普通', quota: 280, finalApplicants: 321, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吉井', department: '総合', quota: 160, finalApplicants: 124, finalRate: 0.78, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎工業', department: '機械', quota: 40, finalApplicants: 40, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎工業', department: '電気', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎工業', department: '情報技術', quota: 40, finalApplicants: 57, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎工業', department: '建築', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎工業', department: '土木', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎工業', department: '工業化学', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎商業', department: '商業（グローバル/会計/情報/総合ビジネス）', quota: 280, finalApplicants: 325, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生', department: '普通', quota: 240, finalApplicants: 258, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生', department: '理数', quota: 80, finalApplicants: 149, finalRate: 1.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生清桜', department: '普通', quota: 160, finalApplicants: 141, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生清桜', department: '普通（アドバンスト探究）', quota: 80, finalApplicants: 114, finalRate: 1.43, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生工業', department: '機械', quota: 80, finalApplicants: 76, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生工業', department: '建設', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生工業', department: '創造技術（電気）', quota: 20, finalApplicants: 22, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生工業', department: '創造技術（染織デザイン）', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎', department: '普通', quota: 280, finalApplicants: 303, finalRate: 1.08, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎清明', department: '普通', quota: 200, finalApplicants: 218, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎興陽', department: '総合', quota: 200, finalApplicants: 203, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎工業', department: '機械', quota: 80, finalApplicants: 68, finalRate: 0.85, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎工業', department: '電子機械', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎工業', department: '電気', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎工業', department: '工業化学', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '伊勢崎商業', department: '商業', quota: 240, finalApplicants: 252, finalRate: 1.05, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田', department: '普通', quota: 280, finalApplicants: 287, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田東', department: '普通', quota: 240, finalApplicants: 213, finalRate: 0.89, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田女子', department: '普通', quota: 240, finalApplicants: 263, finalRate: 1.1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '新田暁', department: '総合', quota: 160, finalApplicants: 170, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田工業', department: '機械', quota: 120, finalApplicants: 114, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田工業', department: '電気情報', quota: 40, finalApplicants: 29, finalRate: 0.73, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅰ部・昼）', quota: 80, finalApplicants: 80, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅱ部・昼）', quota: 80, finalApplicants: 85, finalRate: 1.06, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅲ部・夜）', quota: 80, finalApplicants: 16, finalRate: 0.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '沼田', department: '普通', quota: 80, finalApplicants: 74, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '沼田', department: '普通（数理科学）', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '沼田女子', department: '普通', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '沼田女子', department: '普通（英数）', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '利根実業', department: '生物生産', quota: 80, finalApplicants: 76, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '利根実業', department: '創生工学（機械）', quota: 20, finalApplicants: 20, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '利根実業', department: '創生工学（土木）', quota: 20, finalApplicants: 5, finalRate: 0.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '館林', department: '普通', quota: 200, finalApplicants: 179, finalRate: 0.9, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '館林女子', department: '普通', quota: 200, finalApplicants: 172, finalRate: 0.86, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川', department: '普通', quota: 200, finalApplicants: 183, finalRate: 0.92, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川女子', department: '普通', quota: 200, finalApplicants: 221, finalRate: 1.11, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川青翠', department: '総合', quota: 160, finalApplicants: 152, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川工業', department: '機械', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川工業', department: '自動車', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川工業', department: '電気', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '渋川工業', department: '情報システム', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤岡中央', department: '普通', quota: 160, finalApplicants: 165, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤岡北', department: '生物生産・環境土木・ヒューマン・サービス(くくり)', quota: 120, finalApplicants: 118, finalRate: 0.98, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '藤岡工業', department: '機械・電子機械・電気(くくり)', quota: 120, finalApplicants: 74, finalRate: 0.62, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '富岡', department: '普通', quota: 200, finalApplicants: 208, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '富岡実業', department: '生物生産・地域産業・電子機械(くくり)', quota: 120, finalApplicants: 123, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '松井田', department: '普通', quota: 80, finalApplicants: 56, finalRate: 0.7, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '安中総合学園', department: '総合', quota: 200, finalApplicants: 204, finalRate: 1.02, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大間々', department: '普通', quota: 120, finalApplicants: 131, finalRate: 1.09, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '下仁田', department: '普通', quota: 64, finalApplicants: 13, finalRate: 0.2, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吾妻中央', department: '普通', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吾妻中央', department: '生物生産', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吾妻中央', department: '環境工学', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '吾妻中央', department: '福祉', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '長野原', department: '普通', quota: 64, finalApplicants: 22, finalRate: 0.34, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '玉村', department: '普通', quota: 80, finalApplicants: 76, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '板倉', department: '普通', quota: 80, finalApplicants: 49, finalRate: 0.61, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '館林商工', department: '生産システム・建築(くくり)', quota: 80, finalApplicants: 47, finalRate: 0.59, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '館林商工', department: '総合ビジネス・情報ビジネス(くくり)', quota: 80, finalApplicants: 74, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西邑楽', department: '普通', quota: 120, finalApplicants: 125, finalRate: 1.04, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西邑楽', department: 'スポーツ', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西邑楽', department: '芸術（音楽）', quota: 20, finalApplicants: 5, finalRate: 0.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '西邑楽', department: '芸術（美術）', quota: 20, finalApplicants: 25, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大泉', department: '普通', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大泉', department: '生物生産', quota: 40, finalApplicants: 40, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大泉', department: 'グリーンサイエンス', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '大泉', department: '食品科学', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立前橋', department: '普通', quota: 240, finalApplicants: 240, finalRate: 1, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎経済大学附属', department: '普通（普通コース）', quota: 245, finalApplicants: 300, finalRate: 1.22, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎経済大学附属', department: '芸術コース（音楽系）', quota: 15, finalApplicants: 14, finalRate: 0.93, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '高崎経済大学附属', department: '芸術コース（美術系）', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '桐生市立商業', department: '商業', quota: 240, finalApplicants: 297, finalRate: 1.24, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '市立太田', department: '商業', quota: 157, finalApplicants: 182, finalRate: 1.16, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '利根商業', department: '普通', quota: 52, finalApplicants: 18, finalRate: 0.35, fiscalYear: '令和6年度（2024年度）' },
    { schoolName: '利根商業', department: '地域経済・情報経済(くくり)', quota: 108, finalApplicants: 55, finalRate: 0.51, fiscalYear: '令和6年度（2024年度）' },
    // 掛-1横展開R5・4年度目: 令和5年度(R5)版一次資料(uploaded/attachment/146435.pdf「志願先変更後の
    // 全日制課程・フレックススクール後期選抜志願状況」全3頁)。R5は前期/後期選抜の二段階制度だった
    // 最後の年度で、本PDFは後期選抜分のみ掲載。quotaは印字済み学科等別倍率の分母である「後期学科等別
    // 募集人員」を採用(R6-R8のB列と同じ「印字済み倍率の分母」定義だが、後期選抜=前期選抜後の残り
    // 募集枠であるため絶対水準はR6-R8の元定員と単純比較できない)。node.js機械集計でquota合計6,344・
    // applicants合計6,276がPDF末尾のグランドトータルと完全一致(県全体レベルで差分ゼロ・R6-R8と
    // 異なり尾瀬・万場・嬬恋も本文に直接データがあり収録可能だった)。全64校でD列相当と学科別内訳の
    // 機械合算が完全一致することを検証済み。
    { schoolName: '前橋', department: '普通', quota: 196, finalApplicants: 230, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋南', department: '普通', quota: 100, finalApplicants: 129, finalRate: 1.29, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋西', department: '普通', quota: 80, finalApplicants: 106, finalRate: 1.33, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋女子', department: '普通', quota: 210, finalApplicants: 242, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋東', department: '総合', quota: 100, finalApplicants: 117, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '勢多農林', department: '植物科学', quota: 40, finalApplicants: 33, finalRate: 0.83, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '勢多農林', department: '動物科学（資源動物）', quota: 10, finalApplicants: 8, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '勢多農林', department: '動物科学（応用動物）', quota: 10, finalApplicants: 17, finalRate: 1.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '勢多農林', department: '緑地土木', quota: 20, finalApplicants: 20, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '勢多農林', department: '食品科学', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋工業', department: '機械', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋工業', department: '電子機械', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋工業', department: '電気', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋工業', department: '電子', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋工業', department: '建築', quota: 20, finalApplicants: 23, finalRate: 1.15, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋工業', department: '土木', quota: 20, finalApplicants: 24, finalRate: 1.2, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋商業', department: '商業', quota: 140, finalApplicants: 141, finalRate: 1.01, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋清陵', department: '普通（昼間部）', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '前橋清陵', department: '普通（夜間部）', quota: 48, finalApplicants: 31, finalRate: 0.65, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎', department: '普通', quota: 196, finalApplicants: 234, finalRate: 1.19, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎東', department: '普通', quota: 80, finalApplicants: 115, finalRate: 1.44, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎北', department: '普通', quota: 120, finalApplicants: 198, finalRate: 1.65, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '榛名', department: '普通', quota: 40, finalApplicants: 19, finalRate: 0.48, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎女子', department: '普通', quota: 196, finalApplicants: 256, finalRate: 1.31, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吉井', department: '総合', quota: 80, finalApplicants: 36, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎工業', department: '機械', quota: 20, finalApplicants: 21, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎工業', department: '電気', quota: 20, finalApplicants: 29, finalRate: 1.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎工業', department: '情報技術', quota: 20, finalApplicants: 34, finalRate: 1.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎工業', department: '建築', quota: 20, finalApplicants: 27, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎工業', department: '土木', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎工業', department: '工業化学', quota: 20, finalApplicants: 24, finalRate: 1.2, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎商業', department: '商業（グローバル/会計/情報/総合ビジネス）', quota: 140, finalApplicants: 102, finalRate: 0.73, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生', department: '普通', quota: 144, finalApplicants: 148, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生', department: '理数', quota: 48, finalApplicants: 78, finalRate: 1.63, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生清桜', department: '普通', quota: 80, finalApplicants: 79, finalRate: 0.99, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生清桜', department: '普通（アドバンスト探究）', quota: 40, finalApplicants: 64, finalRate: 1.6, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生工業', department: '機械', quota: 40, finalApplicants: 34, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生工業', department: '建設', quota: 20, finalApplicants: 15, finalRate: 0.75, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生工業', department: '創造技術（電気）', quota: 10, finalApplicants: 11, finalRate: 1.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生工業', department: '創造技術（染織デザイン）', quota: 10, finalApplicants: 13, finalRate: 1.3, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎', department: '普通', quota: 140, finalApplicants: 177, finalRate: 1.26, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎清明', department: '普通', quota: 100, finalApplicants: 135, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎興陽', department: '総合', quota: 100, finalApplicants: 116, finalRate: 1.16, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎工業', department: '機械', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎工業', department: '電子機械', quota: 20, finalApplicants: 18, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎工業', department: '電気', quota: 20, finalApplicants: 17, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎工業', department: '工業化学', quota: 20, finalApplicants: 17, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '伊勢崎商業', department: '商業', quota: 120, finalApplicants: 101, finalRate: 0.84, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田', department: '普通', quota: 196, finalApplicants: 210, finalRate: 1.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田東', department: '普通', quota: 120, finalApplicants: 143, finalRate: 1.19, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田女子', department: '普通', quota: 144, finalApplicants: 151, finalRate: 1.05, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '新田暁', department: '総合', quota: 80, finalApplicants: 108, finalRate: 1.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田工業', department: '機械', quota: 60, finalApplicants: 57, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田工業', department: '電気情報', quota: 20, finalApplicants: 14, finalRate: 0.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅰ部・昼）', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅱ部・昼）', quota: 40, finalApplicants: 14, finalRate: 0.35, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '太田フレックス', department: '普通（Ⅲ部・夜）', quota: 75, finalApplicants: 2, finalRate: 0.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '沼田', department: '普通', quota: 60, finalApplicants: 22, finalRate: 0.37, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '沼田', department: '普通（数理科学）', quota: 20, finalApplicants: 14, finalRate: 0.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '尾瀬', department: '普通', quota: 11, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '尾瀬', department: '自然環境', quota: 12, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '沼田女子', department: '普通', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '沼田女子', department: '普通（英数）', quota: 20, finalApplicants: 10, finalRate: 0.5, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '利根実業', department: '生物生産', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '利根実業', department: '創生工学（機械）', quota: 10, finalApplicants: 5, finalRate: 0.5, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '利根実業', department: '創生工学（土木）', quota: 10, finalApplicants: 1, finalRate: 0.1, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '館林', department: '普通', quota: 100, finalApplicants: 93, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '館林女子', department: '普通', quota: 100, finalApplicants: 90, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川', department: '普通', quota: 100, finalApplicants: 93, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川女子', department: '普通', quota: 100, finalApplicants: 108, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川青翠', department: '総合', quota: 80, finalApplicants: 78, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川工業', department: '機械', quota: 20, finalApplicants: 20, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川工業', department: '自動車', quota: 20, finalApplicants: 16, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川工業', department: '電気', quota: 20, finalApplicants: 17, finalRate: 0.85, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '渋川工業', department: '情報システム', quota: 20, finalApplicants: 16, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '藤岡中央', department: '普通', quota: 80, finalApplicants: 71, finalRate: 0.89, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '藤岡北', department: '生物生産・環境土木・ヒューマン・サービス(くくり)', quota: 60, finalApplicants: 70, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '藤岡工業', department: '機械・電子機械・電気(くくり)', quota: 60, finalApplicants: 15, finalRate: 0.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '富岡', department: '普通', quota: 120, finalApplicants: 91, finalRate: 0.76, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '富岡実業', department: '生物生産・地域産業・電子機械(くくり)', quota: 60, finalApplicants: 59, finalRate: 0.98, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '松井田', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '安中総合学園', department: '総合', quota: 100, finalApplicants: 107, finalRate: 1.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大間々', department: '普通', quota: 60, finalApplicants: 70, finalRate: 1.17, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '万場', department: '普通', quota: 41, finalApplicants: 3, finalRate: 0.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '下仁田', department: '普通', quota: 47, finalApplicants: 6, finalRate: 0.13, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吾妻中央', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吾妻中央', department: '生物生産', quota: 20, finalApplicants: 19, finalRate: 0.95, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吾妻中央', department: '環境工学', quota: 20, finalApplicants: 16, finalRate: 0.8, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '吾妻中央', department: '福祉', quota: 20, finalApplicants: 9, finalRate: 0.45, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '長野原', department: '普通', quota: 45, finalApplicants: 3, finalRate: 0.07, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '嬬恋', department: '普通', quota: 28, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '嬬恋', department: '普通（スポーツ・健康）', quota: 7, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '嬬恋', department: '普通（流通ビジネス）', quota: 15, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '玉村', department: '普通', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '板倉', department: '普通', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '館林商工', department: '生産システム・建築(くくり)', quota: 40, finalApplicants: 27, finalRate: 0.68, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '館林商工', department: '総合ビジネス・情報ビジネス(くくり)', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '西邑楽', department: '普通', quota: 60, finalApplicants: 74, finalRate: 1.23, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '西邑楽', department: 'スポーツ', quota: 8, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '西邑楽', department: '芸術（音楽）', quota: 14, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '西邑楽', department: '芸術（美術）', quota: 3, finalApplicants: 3, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大泉', department: '普通', quota: 20, finalApplicants: 18, finalRate: 0.9, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大泉', department: '生物生産', quota: 20, finalApplicants: 14, finalRate: 0.7, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大泉', department: 'グリーンサイエンス', quota: 20, finalApplicants: 20, finalRate: 1.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '大泉', department: '食品科学', quota: 20, finalApplicants: 25, finalRate: 1.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立前橋', department: '普通', quota: 120, finalApplicants: 137, finalRate: 1.14, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎経済大学附属', department: '普通（普通コース）', quota: 133, finalApplicants: 208, finalRate: 1.56, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎経済大学附属', department: '芸術コース（音楽系）', quota: 5, finalApplicants: 0, finalRate: 0.0, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '高崎経済大学附属', department: '芸術コース（美術系）', quota: 4, finalApplicants: 9, finalRate: 2.25, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '桐生市立商業', department: '商業', quota: 120, finalApplicants: 123, finalRate: 1.03, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '市立太田', department: '商業', quota: 78, finalApplicants: 84, finalRate: 1.08, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '利根商業', department: '普通', quota: 26, finalApplicants: 5, finalRate: 0.19, fiscalYear: '令和5年度（2023年度）' },
    { schoolName: '利根商業', department: '地域経済・情報経済(くくり)', quota: 54, finalApplicants: 21, finalRate: 0.39, fiscalYear: '令和5年度（2023年度）' },
  ],
};
