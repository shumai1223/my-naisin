/**
 * 埼玉県 公立高等学校 倍率パイプラインα（Y-2・先行8県の7県目）。
 *
 * 一次ソース: 埼玉県教育委員会「令和8年度埼玉県公立高等学校における入学志願確定者数」
 * https://www.pref.saitama.lg.jp/f2208/r8nyuushi-jouhou.html
 * https://www.pref.saitama.lg.jp/documents/268192/r8shigankakutei0219.pdf
 * 公表日: 令和8年2月19〜20日頃（xlsx版は公開されておらずPDF版のみ）。
 *
 * 千葉県と同様に1行=1学校×1学科のシンプルな形式。列は「募集人員」「入学許可予定者数(A)」
 * 「志願確定者数(B)」「倍率(B÷A)」の4本立て。募集人員の（）内は転勤等に伴う転編入学者数
 * （募集人員の内数）で、Aは実際に一般選抜で競われる枠（募集人員から差し引いた後の数）。
 * 本データはAをquota・Bをfinal Applicantsとして採用する（千葉県の「募集人員(B)」採用と同じ設計）。
 *
 * ⚠️対象範囲=全日制（普通科＋専門学科＋総合学科）を完全収録（241レコード）＝
 * **grand totalと機械的に完全一致（quota34,603・applicants35,976・倍率1.04）**。
 *
 * ⚠️2026-07-25追記（3件の未解明差分を解決）: 当初は普通科+4・農業に関する学科-40/-44・
 * 商業に関する学科+2という3件の未解明差分があったが、原PDFをWebFetchで再取得したところ
 * 全9ページのテキスト抽出に成功（当初はPDF単体読み取りに依存していたため精度が不足していた）。
 * これと既存データを機械的に突合した結果、以下4件の実際の誤りを特定・修正した：
 * ①熊谷西・越谷西・南稜・ふじみ野の4校で「2月10日時点の志願者数」列と「確定志願者数」列を
 * 混同していた転記ミス（普通科の合計+4はこの4件のネット差分と完全一致）。
 * ②杉戸農業高等学校は6学科（生物生産技術科・園芸科・造園科・食品流通科・生物生産工学科・
 * 生活技術科）を設置しているが、「生活技術科」の転記が丸ごと漏れていた（熊谷農業にも同名の
 * 学科があり、6→5学科への転記漏れは類似校の学科名に気を取られたことが原因と推測）。
 * quota40/applicants44を追加し、農業に関する学科の-40/-44と完全に一致して解消。
 * ③狭山経済高等学校の情報処理科で「確定数」列(75)ではなく「2月10日時点」列(77)を誤って
 * 転記していた（商業に関する学科の+2と一致）。
 * ④「越生翔陽」という誤った学校名で登録していたが、正しくは「越生翔桜」（令和8年4月に
 * 越生高校と鳩山高校の統合で新設された学校）とWebSearchで確認し訂正した。
 * これら全ての修正後、機械集計がPDF末尾のグランドトータル（quota34,603・applicants35,976・
 * 倍率1.04）と完全に一致することを確認した。
 *
 * 定時制は東京都・神奈川県・千葉県と同じ理由でスコープ外（全日制の外側の別課程のため
 * 対象外として明示的に除外）。伊奈学園総合高等学校の「普通科」は同校の普通・スポーツ科学・
 * 芸術の合算値（資料の注記通りそのまま1レコードとして収録・内訳への分解は資料上できない）。
 *
 * **2026-08-07追記(掛-1・学校別×多年度・hokkaido/tokyo/osaka/kanagawaに続く5県目)**: R7(令和7年度)版
 * (documents/241544/r7shigansha0220.pdf・全9頁)を発見。xlsxは提供されておらずWebFetchのテキスト
 * 抽出も学校名部分が空になる（埋め込みフォント欠落・tokyo/hokkaidoと同型の問題）ため、
 * `pdftoppm -r 300`でビジョン解析する方式を採用（1頁目は罫線・文字とも極めて明瞭で判読リスク低）。
 * 列は「募集人員」「入学許可予定者数(A)」「志願確定者数(B)」の3本立てで、R8と同じくA=quota・
 * B=finalApplicants採用。1頁目「全日制 普通科」56校（伊奈学園総合1校＋大宮光陵の外国語コースを
 * 含む）を収録。残り8頁（普通科続き＋専門学科＋総合学科）は次回以降のセッションで継続する。
 *
 * **2026-08-07追記(掛-1第2弾)**: 2頁目「普通科」続き46校を追加（計102レコード）。頁末尾に
 * 印字された「普通科 計」小計（quota25,877・applicants29,983・倍率1.16）と1〜2頁の合計が
 * 完全一致（node.js機械計算）。◯印の市立高校（市立川越/市立浦和/市立浦和南/市立大宮北/
 * 川口市立）はR8と同じ「市立」接頭辞込みの学校名で収録。これで「全日制 普通科」区分が完結。
 * 次頁（3頁目）以降は専門学科（農業・工業・商業等）が続く見込み。
 *
 * **2026-08-07追記(掛-1第3弾)**: 3頁目「専門学科・農業に関する学科」6校18レコードを追加。
 * 頁末尾の印字済み「農業科計」小計（quota796・applicants641・倍率0.81）と完全一致
 * （node.js機械計算）。次頁（4頁目）以降は専門学科の他学科（工業・商業等）が続く見込み。
 *
 * **2026-08-07追記(掛-1第4弾)**: 4頁目「専門学科・工業に関する学科」13校45レコードを追加。
 * 頁末尾の印字済み「工業科計」小計（quota2,382・applicants2,112・倍率0.89）と完全一致
 * （node.js機械計算）。「大宮工業」はR8で「大宮科学技術」に改組され学科名も刷新されている
 * （機械科等→機械工学科等）が、R7時点で実在した校名・学科名をそのまま収録した（R8とは
 * 別のschoolNameとして扱う設計・tokyo/kanagawaの学校統廃合と同型の対応）。次頁（5頁目）以降は
 * 専門学科の他学科（商業等）が続く見込み。
 *
 * **2026-08-07追記(掛-1第5弾)**: 5頁目「専門学科・商業に関する学科」15校27レコードを追加。
 * 頁末尾の印字済み「商業科計」小計（quota2,285・applicants2,151・倍率0.94）と完全一致
 * （node.js機械計算）。「八潮南」もR8データに対応する学校が見当たらず（既存test.tsのR8学校
 * リストには「八潮フロンティア」が代わりに存在＝改称の可能性）、大宮工業と同様R7時点の
 * 実在記録としてそのまま収録した。次頁（6頁目）以降は専門学科の残り学科＋総合学科が続く見込み。
 *
 * **2026-08-07追記(掛-1第6弾)**: 6頁目「専門学科・家庭/看護/外国語/美術/音楽/書道/体育に関する
 * 学科」計25レコードを追加。7つの学科区分それぞれの頁内小計（家庭320/304・看護80/95・
 * 外国語319/384・美術120/132・音楽120/66・書道40/40・体育160/186）全てと完全一致
 * （node.js機械計算）。外国語科は「越谷南」（R7）↔「越谷北」（R8）のように学校間で開設が
 * 移動している例があるが、これも年度ごとの実際の開設状況としてそのまま収録した。次頁
 * （7頁目）以降は専門学科の残り＋総合学科が続く見込み。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const SAITAMA_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'saitama',
  sources: [
    {
      url: 'https://www.pref.saitama.lg.jp/documents/268192/r8shigankakutei0219.pdf',
      docTitle: '埼玉県教育委員会 令和8年度埼玉県公立高等学校における入学志願確定者数（全日制・定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-24',
    },
    {
      url: 'https://www.pref.saitama.lg.jp/documents/241544/r7shigansha0220.pdf',
      docTitle: '埼玉県教育委員会 令和7年度埼玉県公立高等学校における入学志願確定者数（全日制・定時制）（1〜6/9頁・普通科完結+専門学科(農業・工業・商業・家庭・看護・外国語・美術・音楽・書道・体育)・掛-1・saitama横展開第1〜6弾）',
      fiscalYear: '令和7年度（2025年度）',
      fetchedAt: '2026-08-07',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制 普通科', '全日制 専門学科（農業・工業・商業・家庭・看護・外国語等14学科群）', '全日制 総合学科'],
    pendingDepartments: ['定時制（全日制の外側の別課程のため東京都・神奈川県・千葉県と同じ理由で意図的にスコープ外）'],
    note:
      '全日制（普通科＋専門学科＋総合学科・241レコード）を完全収録。機械集計（quota34,603・' +
      'applicants35,976・倍率1.04）がPDF末尾のグランドトータルと完全一致することを確認済み。' +
      '当初あった3件の未解明差分（普通科+4・農業に関する学科-40/-44・商業に関する学科+2）は' +
      '全て実際の転記ミスと判明し修正済み（詳細はファイル冒頭コメント参照）。定時制は全日制の' +
      '外側の別課程のためスコープ外として明示的に除外。',
  },
  officialSubtotals: [
    { label: '全日制合計', quota: 34603, finalApplicants: 35976, finalRate: 1.04 },
    { label: '普通科計', quota: 25517, finalApplicants: 27668, finalRate: 1.08 },
    { label: '総合学科計', quota: 1704, finalApplicants: 1525, finalRate: 0.89 },
    { label: '農業に関する学科 計', quota: 797, finalApplicants: 634, finalRate: 0.8 },
    { label: '工業に関する学科 計', quota: 2343, finalApplicants: 1973, finalRate: 0.84 },
    { label: '商業に関する学科 計', quota: 2206, finalApplicants: 1998, finalRate: 0.91 },
    { label: '家庭に関する学科 計', quota: 319, finalApplicants: 306, finalRate: 0.96 },
    { label: '看護に関する学科 計', quota: 80, finalApplicants: 88, finalRate: 1.1 },
    { label: '外国語に関する学科 計', quota: 240, finalApplicants: 270, finalRate: 1.13 },
    { label: '美術に関する学科 計', quota: 120, finalApplicants: 163, finalRate: 1.36 },
    { label: '音楽に関する学科 計', quota: 120, finalApplicants: 89, finalRate: 0.74 },
    { label: '書道に関する学科 計', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { label: '体育に関する学科 計', quota: 160, finalApplicants: 180, finalRate: 1.13 },
    { label: '理数に関する学科 計', quota: 280, finalApplicants: 400, finalRate: 1.43 },
    { label: '情報に関する学科 計', quota: 80, finalApplicants: 96, finalRate: 1.2 },
    { label: '福祉に関する学科 計', quota: 80, finalApplicants: 27, finalRate: 0.34 },
    { label: '人文に関する学科 計', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { label: '国際関係に関する学科 計', quota: 159, finalApplicants: 152, finalRate: 0.96 },
    { label: '映像芸術に関する学科 計', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { label: '舞台芸術に関する学科 計', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { label: '生物・環境に関する系 計', quota: 238, finalApplicants: 253, finalRate: 1.06 },
  ],
  records: [
    // ===== 全日制 普通科 =====
    { schoolName: '上尾', department: '普通科', quota: 238, finalApplicants: 316, finalRate: 1.33 },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, finalApplicants: 182, finalRate: 0.92 },
    { schoolName: '上尾橘', department: '普通科', quota: 118, finalApplicants: 53, finalRate: 0.45 },
    { schoolName: '上尾南', department: '普通科', quota: 238, finalApplicants: 247, finalRate: 1.04 },
    { schoolName: '朝霞', department: '普通科', quota: 318, finalApplicants: 305, finalRate: 0.96 },
    { schoolName: '朝霞西', department: '普通科', quota: 318, finalApplicants: 369, finalRate: 1.16 },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 718, finalApplicants: 789, finalRate: 1.1 },
    { schoolName: '入間向陽', department: '普通科', quota: 318, finalApplicants: 332, finalRate: 1.04 },
    { schoolName: '岩槻', department: '普通科', quota: 278, finalApplicants: 305, finalRate: 1.1 },
    { schoolName: '浦和', department: '普通科', quota: 358, finalApplicants: 434, finalRate: 1.21 },
    { schoolName: '浦和北', department: '普通科', quota: 318, finalApplicants: 334, finalRate: 1.05 },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, finalApplicants: 437, finalRate: 1.22 },
    { schoolName: '浦和西', department: '普通科', quota: 358, finalApplicants: 519, finalRate: 1.45 },
    { schoolName: '浦和東', department: '普通科', quota: 318, finalApplicants: 318, finalRate: 1.0 },
    { schoolName: '大宮', department: '普通科', quota: 318, finalApplicants: 507, finalRate: 1.59 },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, finalApplicants: 203, finalRate: 1.03 },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '大宮東', department: '普通科', quota: 238, finalApplicants: 219, finalRate: 0.92 },
    { schoolName: '大宮南', department: '普通科', quota: 358, finalApplicants: 386, finalRate: 1.08 },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 198, finalApplicants: 197, finalRate: 0.99 },
    { schoolName: '小川', department: '普通科', quota: 198, finalApplicants: 162, finalRate: 0.82 },
    { schoolName: '桶川', department: '普通科', quota: 278, finalApplicants: 265, finalRate: 0.95 },
    { schoolName: '桶川西', department: '普通科', quota: 118, finalApplicants: 102, finalRate: 0.86 },
    { schoolName: '越生翔桜', department: '普通科', quota: 118, finalApplicants: 51, finalRate: 0.43 },
    { schoolName: '春日部', department: '普通科', quota: 358, finalApplicants: 473, finalRate: 1.32 },
    { schoolName: '春日部女子', department: '普通科', quota: 238, finalApplicants: 243, finalRate: 1.02 },
    { schoolName: '春日部東', department: '普通科', quota: 318, finalApplicants: 323, finalRate: 1.02 },
    { schoolName: '川口', department: '普通科', quota: 318, finalApplicants: 356, finalRate: 1.12 },
    { schoolName: '川口北', department: '普通科', quota: 358, finalApplicants: 374, finalRate: 1.04 },
    { schoolName: '川口青陵', department: '普通科', quota: 278, finalApplicants: 277, finalRate: 0.99 },
    { schoolName: '川口東', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13 },
    { schoolName: '川越', department: '普通科', quota: 358, finalApplicants: 486, finalRate: 1.36 },
    { schoolName: '川越女子', department: '普通科', quota: 358, finalApplicants: 435, finalRate: 1.22 },
    { schoolName: '川越西', department: '普通科', quota: 278, finalApplicants: 302, finalRate: 1.09 },
    { schoolName: '川越初雁', department: '普通科', quota: 198, finalApplicants: 163, finalRate: 0.82 },
    { schoolName: '川越南', department: '普通科', quota: 358, finalApplicants: 431, finalRate: 1.2 },
    { schoolName: '北本', department: '普通科', quota: 118, finalApplicants: 113, finalRate: 0.96 },
    { schoolName: '久喜', department: '普通科', quota: 278, finalApplicants: 244, finalRate: 0.88 },
    { schoolName: '熊谷', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13 },
    { schoolName: '熊谷女子', department: '普通科', quota: 278, finalApplicants: 313, finalRate: 1.13 },
    { schoolName: '熊谷西', department: '普通科', quota: 278, finalApplicants: 324, finalRate: 1.17 },
    { schoolName: '栗橋北彩', department: '普通科', quota: 158, finalApplicants: 131, finalRate: 0.83 },
    { schoolName: '鴻巣', department: '普通科', quota: 198, finalApplicants: 172, finalRate: 0.87 },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, finalApplicants: 40, finalRate: 0.51 },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, finalApplicants: 405, finalRate: 1.27 },
    { schoolName: '越谷北', department: '普通科', quota: 318, finalApplicants: 381, finalRate: 1.2 },
    { schoolName: '越谷西', department: '普通科', quota: 318, finalApplicants: 320, finalRate: 1.01 },
    { schoolName: '越谷東', department: '普通科', quota: 278, finalApplicants: 290, finalRate: 1.04 },
    { schoolName: '越谷南', department: '普通科', quota: 318, finalApplicants: 427, finalRate: 1.34 },
    { schoolName: '児玉', department: '普通科', quota: 79, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '坂戸', department: '普通科', quota: 318, finalApplicants: 366, finalRate: 1.15 },
    { schoolName: '坂戸西', department: '普通科', quota: 318, finalApplicants: 302, finalRate: 0.95 },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, finalApplicants: 174, finalRate: 0.88 },
    { schoolName: '志木', department: '普通科', quota: 238, finalApplicants: 253, finalRate: 1.06 },
    { schoolName: '庄和', department: '普通科', quota: 158, finalApplicants: 157, finalRate: 0.99 },
    { schoolName: '白岡', department: '普通科', quota: 158, finalApplicants: 149, finalRate: 0.94 },
    { schoolName: '杉戸', department: '普通科', quota: 278, finalApplicants: 331, finalRate: 1.19 },
    { schoolName: '草加', department: '普通科', quota: 358, finalApplicants: 356, finalRate: 0.99 },
    { schoolName: '草加西', department: '普通科', quota: 238, finalApplicants: 241, finalRate: 1.01 },
    { schoolName: '草加東', department: '普通科', quota: 318, finalApplicants: 329, finalRate: 1.03 },
    { schoolName: '草加南', department: '普通科', quota: 238, finalApplicants: 242, finalRate: 1.02 },
    { schoolName: '秩父', department: '普通科', quota: 158, finalApplicants: 140, finalRate: 0.89 },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 198, finalApplicants: 131, finalRate: 0.66 },
    { schoolName: '所沢', department: '普通科', quota: 358, finalApplicants: 495, finalRate: 1.38 },
    { schoolName: '所沢北', department: '普通科', quota: 318, finalApplicants: 406, finalRate: 1.28 },
    { schoolName: '所沢中央', department: '普通科', quota: 318, finalApplicants: 322, finalRate: 1.01 },
    { schoolName: '所沢西', department: '普通科', quota: 318, finalApplicants: 346, finalRate: 1.09 },
    { schoolName: '豊岡', department: '普通科', quota: 318, finalApplicants: 338, finalRate: 1.06 },
    { schoolName: '南稜', department: '普通科', quota: 318, finalApplicants: 370, finalRate: 1.16 },
    { schoolName: '新座', department: '普通科', quota: 198, finalApplicants: 162, finalRate: 0.82 },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, finalApplicants: 215, finalRate: 1.09 },
    { schoolName: '蓮田松韻', department: '普通科', quota: 158, finalApplicants: 146, finalRate: 0.92 },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, finalApplicants: 165, finalRate: 1.04 },
    { schoolName: '羽生第一', department: '普通科', quota: 158, finalApplicants: 128, finalRate: 0.81 },
    { schoolName: '飯能', department: '普通科', quota: 278, finalApplicants: 242, finalRate: 0.87 },
    { schoolName: '日高', department: '普通科', quota: 118, finalApplicants: 92, finalRate: 0.78 },
    { schoolName: '日高', department: '情報コース', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '深谷', department: '普通科', quota: 198, finalApplicants: 149, finalRate: 0.75 },
    { schoolName: '深谷第一', department: '普通科', quota: 278, finalApplicants: 280, finalRate: 1.01 },
    { schoolName: '富士見', department: '普通科', quota: 198, finalApplicants: 207, finalRate: 1.05 },
    { schoolName: 'ふじみ野', department: '普通科', quota: 118, finalApplicants: 108, finalRate: 0.92 },
    { schoolName: '不動岡', department: '普通科', quota: 358, finalApplicants: 482, finalRate: 1.35 },
    { schoolName: '本庄', department: '普通科', quota: 318, finalApplicants: 347, finalRate: 1.09 },
    { schoolName: '松伏', department: '普通科', quota: 118, finalApplicants: 116, finalRate: 0.98 },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, finalApplicants: 37, finalRate: 0.93 },
    { schoolName: '松山', department: '普通科', quota: 278, finalApplicants: 226, finalRate: 0.81 },
    { schoolName: '松山女子', department: '普通科', quota: 318, finalApplicants: 309, finalRate: 0.97 },
    { schoolName: '三郷', department: '普通科', quota: 198, finalApplicants: 123, finalRate: 0.62 },
    { schoolName: '三郷北', department: '普通科', quota: 238, finalApplicants: 254, finalRate: 1.07 },
    { schoolName: '宮代', department: '普通科', quota: 198, finalApplicants: 184, finalRate: 0.93 },
    { schoolName: '妻沼', department: '普通科', quota: 118, finalApplicants: 79, finalRate: 0.67 },
    { schoolName: '八潮フロンティア', department: '普通科', quota: 119, finalApplicants: 112, finalRate: 0.94 },
    { schoolName: '与野', department: '普通科', quota: 358, finalApplicants: 370, finalRate: 1.03 },
    { schoolName: '和光国際', department: '普通科', quota: 238, finalApplicants: 309, finalRate: 1.3 },
    { schoolName: '鷲宮', department: '普通科', quota: 278, finalApplicants: 301, finalRate: 1.08 },
    { schoolName: '蕨', department: '普通科', quota: 318, finalApplicants: 376, finalRate: 1.18 },
    { schoolName: '市立川越', department: '普通科', quota: 140, finalApplicants: 178, finalRate: 1.27 },
    { schoolName: '市立浦和', department: '普通科', quota: 240, finalApplicants: 461, finalRate: 1.92 },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, finalApplicants: 446, finalRate: 1.39 },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, finalApplicants: 342, finalRate: 1.22 },
    { schoolName: '川口市立', department: '普通科', quota: 240, finalApplicants: 382, finalRate: 1.59 },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, finalApplicants: 133, finalRate: 1.66 },

    // ===== 全日制 専門学科：農業に関する学科 =====
    { schoolName: '熊谷農業', department: '食品科学科', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '熊谷農業', department: '生物生産工学科', quota: 79, finalApplicants: 71, finalRate: 0.9 },
    { schoolName: '熊谷農業', department: '生活技術科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '熊谷農業', department: '生物生産技術科', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '児玉', department: '生物資源科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '児玉', department: '環境デザイン科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '杉戸農業', department: '生物生産工学科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '杉戸農業', department: '園芸科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '杉戸農業', department: '造園科', quota: 39, finalApplicants: 36, finalRate: 0.92 },
    { schoolName: '杉戸農業', department: '食品流通科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '杉戸農業', department: '生活技術科', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '杉戸農業', department: '生物生産技術科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '秩父農工科学', department: '農業科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '秩父農工科学', department: '食品化学科', quota: 39, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '秩父農工科学', department: '森林科学科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '鳩ケ谷', department: '園芸デザイン科', quota: 40, finalApplicants: 36, finalRate: 0.9 },
    { schoolName: '羽生実業', department: '園芸科', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '羽生実業', department: '農業経済科', quota: 40, finalApplicants: 24, finalRate: 0.6 },

    // ===== 全日制 専門学科：工業に関する学科 =====
    { schoolName: '大宮科学技術', department: '機械工学科', quota: 80, finalApplicants: 62, finalRate: 0.78 },
    { schoolName: '大宮科学技術', department: '電気工学科', quota: 39, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '大宮科学技術', department: 'ロボット工学科', quota: 39, finalApplicants: 23, finalRate: 0.59 },
    { schoolName: '大宮科学技術', department: '建築デザイン工学科', quota: 79, finalApplicants: 61, finalRate: 0.77 },
    { schoolName: '春日部工業', department: '機械科', quota: 79, finalApplicants: 78, finalRate: 0.99 },
    { schoolName: '春日部工業', department: '電気科', quota: 79, finalApplicants: 77, finalRate: 0.97 },
    { schoolName: '春日部工業', department: '建築科', quota: 80, finalApplicants: 69, finalRate: 0.86 },
    { schoolName: '川口工業', department: '機械科', quota: 80, finalApplicants: 82, finalRate: 1.03 },
    { schoolName: '川口工業', department: '電気科', quota: 79, finalApplicants: 84, finalRate: 1.06 },
    { schoolName: '川口工業', department: '情報通信科', quota: 79, finalApplicants: 81, finalRate: 1.03 },
    { schoolName: '川越工業', department: 'デザイン科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '川越工業', department: '機械科', quota: 79, finalApplicants: 78, finalRate: 0.99 },
    { schoolName: '川越工業', department: '電気科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '川越工業', department: '建築科', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '川越工業', department: '化学科', quota: 79, finalApplicants: 72, finalRate: 0.91 },
    { schoolName: '久喜工業', department: '機械科', quota: 80, finalApplicants: 82, finalRate: 1.03 },
    { schoolName: '久喜工業', department: '電気科', quota: 39, finalApplicants: 30, finalRate: 0.77 },
    { schoolName: '久喜工業', department: '工業化学科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '久喜工業', department: '環境科学科', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '久喜工業', department: '情報技術科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '熊谷工業', department: '機械科', quota: 79, finalApplicants: 70, finalRate: 0.89 },
    { schoolName: '熊谷工業', department: '電気科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '熊谷工業', department: '建築科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '熊谷工業', department: '土木科', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '熊谷工業', department: '情報技術科', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '越谷総合技術', department: '電子機械科', quota: 39, finalApplicants: 29, finalRate: 0.74 },
    { schoolName: '越谷総合技術', department: '情報技術科', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '児玉', department: '機械科', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '児玉', department: '電子機械科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '狭山工業', department: '機械科', quota: 80, finalApplicants: 61, finalRate: 0.76 },
    { schoolName: '狭山工業', department: '電気科', quota: 39, finalApplicants: 27, finalRate: 0.69 },
    { schoolName: '狭山工業', department: '電子機械科', quota: 80, finalApplicants: 46, finalRate: 0.58 },
    { schoolName: '進修館', department: '電気システム科', quota: 39, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '進修館', department: '情報メディア科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '進修館', department: 'ものづくり科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '秩父農工科学', department: '電気システム科', quota: 39, finalApplicants: 27, finalRate: 0.69 },
    { schoolName: '秩父農工科学', department: '機械システム科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '新座総合技術', department: 'デザイン科', quota: 40, finalApplicants: 48, finalRate: 1.2 },
    { schoolName: '新座総合技術', department: '電子機械科', quota: 39, finalApplicants: 36, finalRate: 0.92 },
    { schoolName: '新座総合技術', department: '情報技術科', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '三郷工業技術', department: '機械科', quota: 39, finalApplicants: 39, finalRate: 1.0 },
    { schoolName: '三郷工業技術', department: '電気科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '三郷工業技術', department: '電子機械科', quota: 40, finalApplicants: 20, finalRate: 0.5 },
    { schoolName: '三郷工業技術', department: '情報技術科', quota: 40, finalApplicants: 21, finalRate: 0.53 },
    { schoolName: '三郷工業技術', department: '情報電子科', quota: 40, finalApplicants: 34, finalRate: 0.85 },

    // ===== 全日制 専門学科：商業に関する学科 =====
    { schoolName: '上尾', department: '商業科', quota: 120, finalApplicants: 154, finalRate: 1.28 },
    { schoolName: '岩槻商業', department: '商業科', quota: 39, finalApplicants: 23, finalRate: 0.59 },
    { schoolName: '岩槻商業', department: '情報処理科', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '浦和商業', department: '商業科', quota: 198, finalApplicants: 194, finalRate: 0.98 },
    { schoolName: '浦和商業', department: '情報処理科', quota: 80, finalApplicants: 86, finalRate: 1.08 },
    { schoolName: '大宮商業', department: '商業科', quota: 198, finalApplicants: 148, finalRate: 0.75 },
    { schoolName: '熊谷商業', department: '総合ビジネス科', quota: 199, finalApplicants: 161, finalRate: 0.81 },
    { schoolName: '鴻巣', department: '商業科', quota: 80, finalApplicants: 78, finalRate: 0.98 },
    { schoolName: '越谷総合技術', department: '流通経済科', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '越谷総合技術', department: '情報処理科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '狭山経済', department: '流通経済科', quota: 79, finalApplicants: 73, finalRate: 0.92 },
    { schoolName: '狭山経済', department: '会計科', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '狭山経済', department: '情報処理科', quota: 80, finalApplicants: 75, finalRate: 0.94 },
    { schoolName: '所沢商業', department: '情報処理科', quota: 79, finalApplicants: 57, finalRate: 0.72 },
    { schoolName: '所沢商業', department: '国際流通科', quota: 79, finalApplicants: 44, finalRate: 0.56 },
    { schoolName: '所沢商業', department: 'ビジネス会計科', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '新座総合技術', department: '総合ビジネス科', quota: 39, finalApplicants: 39, finalRate: 1.0 },
    { schoolName: '鳩ケ谷', department: '情報処理科', quota: 80, finalApplicants: 78, finalRate: 0.98 },
    { schoolName: '羽生実業', department: '商業科', quota: 39, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '羽生実業', department: '情報処理科', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '深谷商業', department: '商業科', quota: 158, finalApplicants: 160, finalRate: 1.01 },
    { schoolName: '深谷商業', department: '会計科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '深谷商業', department: '情報処理科', quota: 80, finalApplicants: 83, finalRate: 1.04 },
    { schoolName: '八潮フロンティア', department: 'ビジネス探究科', quota: 119, finalApplicants: 132, finalRate: 1.11 },
    { schoolName: '市立川越', department: '国際経済科', quota: 70, finalApplicants: 109, finalRate: 1.56 },
    { schoolName: '市立川越', department: '情報処理科', quota: 70, finalApplicants: 84, finalRate: 1.2 },

    // ===== 全日制 専門学科：家庭に関する学科 =====
    { schoolName: '鴻巣女子', department: '保育科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '鴻巣女子', department: '家政科学科', quota: 40, finalApplicants: 39, finalRate: 0.98 },
    { schoolName: '越谷総合技術', department: '服飾デザイン科', quota: 39, finalApplicants: 28, finalRate: 0.72 },
    { schoolName: '越谷総合技術', department: '食物デザイン科', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '秩父農工科学', department: 'ライフデザイン科', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '秩父農工科学', department: 'フードデザイン科', quota: 40, finalApplicants: 33, finalRate: 0.83 },
    { schoolName: '新座総合技術', department: '服飾デザイン科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '新座総合技術', department: '食物調理科', quota: 40, finalApplicants: 56, finalRate: 1.4 },

    // ===== 全日制 専門学科：看護に関する学科 =====
    { schoolName: '常盤', department: '看護科', quota: 80, finalApplicants: 88, finalRate: 1.1 },

    // ===== 全日制 専門学科：外国語に関する学科 =====
    { schoolName: '春日部女子', department: '外国語科', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '越谷北', department: '外国語科', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '坂戸', department: '外国語科', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '草加南', department: '外国語科', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '南稜', department: '外国語科', quota: 40, finalApplicants: 54, finalRate: 1.35 },
    { schoolName: '蕨', department: '外国語科', quota: 40, finalApplicants: 49, finalRate: 1.23 },

    // ===== 全日制 専門学科：美術に関する学科 =====
    { schoolName: '大宮光陵', department: '美術科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '越生翔桜', department: '美術表現科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '芸術総合', department: '美術科', quota: 40, finalApplicants: 65, finalRate: 1.63 },

    // ===== 全日制 専門学科：音楽に関する学科 =====
    { schoolName: '大宮光陵', department: '音楽科', quota: 40, finalApplicants: 45, finalRate: 1.13 },
    { schoolName: '芸術総合', department: '音楽科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '松伏', department: '音楽科', quota: 40, finalApplicants: 27, finalRate: 0.68 },

    // ===== 全日制 専門学科：書道に関する学科 =====
    { schoolName: '大宮光陵', department: '書道科', quota: 40, finalApplicants: 28, finalRate: 0.7 },

    // ===== 全日制 専門学科：体育に関する学科 =====
    { schoolName: '大宮東', department: '体育科', quota: 80, finalApplicants: 97, finalRate: 1.21 },
    { schoolName: 'ふじみ野', department: 'スポーツサイエンス科', quota: 80, finalApplicants: 83, finalRate: 1.04 },

    // ===== 全日制 専門学科：理数に関する学科 =====
    { schoolName: '大宮', department: '理数科', quota: 40, finalApplicants: 81, finalRate: 2.03 },
    { schoolName: '熊谷西', department: '理数科', quota: 40, finalApplicants: 35, finalRate: 0.88 },
    { schoolName: '越谷北', department: '理数科', quota: 40, finalApplicants: 61, finalRate: 1.53 },
    { schoolName: '所沢北', department: '理数科', quota: 40, finalApplicants: 73, finalRate: 1.83 },
    { schoolName: '松山', department: '理数科', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '市立大宮北', department: '理数科', quota: 40, finalApplicants: 49, finalRate: 1.23 },
    { schoolName: '川口市立', department: '理数科', quota: 40, finalApplicants: 60, finalRate: 1.5 },

    // ===== 全日制 専門学科：情報に関する学科 =====
    { schoolName: '大宮科学技術', department: '情報サイエンス科', quota: 80, finalApplicants: 96, finalRate: 1.2 },

    // ===== 全日制 専門学科：福祉に関する学科 =====
    { schoolName: '誠和福祉', department: '福祉科', quota: 80, finalApplicants: 27, finalRate: 0.34 },

    // ===== 全日制 専門学科：人文に関する学科 =====
    { schoolName: '春日部東', department: '人文科', quota: 40, finalApplicants: 39, finalRate: 0.98 },

    // ===== 全日制 専門学科：国際関係に関する学科 =====
    { schoolName: '岩槻', department: '国際教養科', quota: 40, finalApplicants: 47, finalRate: 1.18 },
    { schoolName: '秩父', department: '国際教養科', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '和光国際', department: '国際科', quota: 79, finalApplicants: 92, finalRate: 1.16 },

    // ===== 全日制 専門学科：映像芸術に関する学科 =====
    { schoolName: '芸術総合', department: '映像芸術科', quota: 40, finalApplicants: 43, finalRate: 1.08 },

    // ===== 全日制 専門学科：舞台芸術に関する学科 =====
    { schoolName: '芸術総合', department: '舞台芸術科', quota: 40, finalApplicants: 44, finalRate: 1.1 },

    // ===== 全日制 専門学科：生物・環境に関する系 =====
    { schoolName: 'いずみ', department: '生物系', quota: 119, finalApplicants: 133, finalRate: 1.12 },
    { schoolName: 'いずみ', department: '環境系', quota: 119, finalApplicants: 120, finalRate: 1.01 },

    // ===== 全日制 総合学科 =====
    { schoolName: '小鹿野', department: '総合学科', quota: 79, finalApplicants: 27, finalRate: 0.34 },
    { schoolName: '川越総合', department: '総合学科', quota: 238, finalApplicants: 280, finalRate: 1.18 },
    { schoolName: '久喜北陽', department: '総合学科', quota: 318, finalApplicants: 283, finalRate: 0.89 },
    { schoolName: '幸手桜', department: '総合学科', quota: 198, finalApplicants: 181, finalRate: 0.91 },
    { schoolName: '進修館', department: '総合学科', quota: 198, finalApplicants: 152, finalRate: 0.77 },
    { schoolName: '誠和福祉', department: '総合学科', quota: 79, finalApplicants: 25, finalRate: 0.32 },
    { schoolName: '滑川総合', department: '総合学科', quota: 278, finalApplicants: 266, finalRate: 0.96 },
    { schoolName: '吉川美南', department: '総合学科', quota: 118, finalApplicants: 115, finalRate: 0.97 },
    { schoolName: '寄居城北', department: '総合学科', quota: 198, finalApplicants: 196, finalRate: 0.99 },

    // ===== 掛-1(学校別×多年度)横展開: R7分・1頁目「全日制 普通科」56校 =====
    { schoolName: '上尾', department: '普通科', quota: 238, finalApplicants: 309, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上尾鷹の台', department: '普通科', quota: 198, finalApplicants: 201, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上尾橘', department: '普通科', quota: 158, finalApplicants: 62, finalRate: 0.39, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '上尾南', department: '普通科', quota: 238, finalApplicants: 250, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '朝霞', department: '普通科', quota: 318, finalApplicants: 428, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '朝霞西', department: '普通科', quota: 318, finalApplicants: 354, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '伊奈学園総合', department: '普通科（普通・スポーツ科学・芸術の合算）', quota: 716, finalApplicants: 855, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '入間向陽', department: '普通科', quota: 318, finalApplicants: 377, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻', department: '普通科', quota: 278, finalApplicants: 298, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和', department: '普通科', quota: 358, finalApplicants: 526, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和北', department: '普通科', quota: 318, finalApplicants: 372, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和第一女子', department: '普通科', quota: 358, finalApplicants: 469, finalRate: 1.31, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和西', department: '普通科', quota: 358, finalApplicants: 518, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和東', department: '普通科', quota: 318, finalApplicants: 421, finalRate: 1.32, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮', department: '普通科', quota: 318, finalApplicants: 481, finalRate: 1.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '普通科', quota: 198, finalApplicants: 224, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '外国語コース', quota: 40, finalApplicants: 46, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮東', department: '普通科', quota: 238, finalApplicants: 276, finalRate: 1.16, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮南', department: '普通科', quota: 358, finalApplicants: 481, finalRate: 1.34, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮武蔵野', department: '普通科', quota: 238, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '小川', department: '普通科', quota: 198, finalApplicants: 214, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桶川', department: '普通科', quota: 278, finalApplicants: 282, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '桶川西', department: '普通科', quota: 158, finalApplicants: 100, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越生', department: '普通科', quota: 79, finalApplicants: 58, finalRate: 0.73, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部', department: '普通科', quota: 358, finalApplicants: 494, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部女子', department: '普通科', quota: 238, finalApplicants: 248, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部東', department: '普通科', quota: 318, finalApplicants: 339, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口', department: '普通科', quota: 318, finalApplicants: 401, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口北', department: '普通科', quota: 358, finalApplicants: 458, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口青陵', department: '普通科', quota: 278, finalApplicants: 306, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口東', department: '普通科', quota: 278, finalApplicants: 324, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越', department: '普通科', quota: 358, finalApplicants: 526, finalRate: 1.47, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越女子', department: '普通科', quota: 358, finalApplicants: 421, finalRate: 1.18, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越西', department: '普通科', quota: 318, finalApplicants: 328, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越初雁', department: '普通科', quota: 198, finalApplicants: 190, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越南', department: '普通科', quota: 358, finalApplicants: 531, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '北本', department: '普通科', quota: 158, finalApplicants: 96, finalRate: 0.61, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜', department: '普通科', quota: 278, finalApplicants: 307, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷', department: '普通科', quota: 318, finalApplicants: 335, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷女子', department: '普通科', quota: 318, finalApplicants: 323, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷西', department: '普通科', quota: 278, finalApplicants: 284, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '栗橋北彩', department: '普通科', quota: 158, finalApplicants: 113, finalRate: 0.72, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣', department: '普通科', quota: 198, finalApplicants: 202, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣女子', department: '普通科', quota: 79, finalApplicants: 55, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越ケ谷', department: '普通科', quota: 318, finalApplicants: 428, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷北', department: '普通科', quota: 318, finalApplicants: 405, finalRate: 1.27, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷西', department: '普通科', quota: 318, finalApplicants: 323, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷東', department: '普通科', quota: 278, finalApplicants: 307, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷南', department: '普通科', quota: 318, finalApplicants: 457, finalRate: 1.44, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '普通科', quota: 79, finalApplicants: 51, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂戸', department: '普通科', quota: 318, finalApplicants: 360, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂戸西', department: '普通科', quota: 318, finalApplicants: 311, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山清陵', department: '普通科', quota: 198, finalApplicants: 182, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '志木', department: '普通科', quota: 238, finalApplicants: 300, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '庄和', department: '普通科', quota: 158, finalApplicants: 178, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '白岡', department: '普通科', quota: 158, finalApplicants: 166, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    // ===== 2頁目「全日制 普通科」続き45校（頁末尾「普通科 計」25,877/29,983/1.16で1〜2頁合計と一致確認済み） =====
    { schoolName: '杉戸', department: '普通科', quota: 278, finalApplicants: 370, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加', department: '普通科', quota: 358, finalApplicants: 390, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加西', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加東', department: '普通科', quota: 318, finalApplicants: 373, finalRate: 1.17, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加南', department: '普通科', quota: 238, finalApplicants: 285, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父', department: '普通科', quota: 198, finalApplicants: 180, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鶴ケ島清風', department: '普通科', quota: 198, finalApplicants: 169, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢', department: '普通科', quota: 358, finalApplicants: 467, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢北', department: '普通科', quota: 318, finalApplicants: 401, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢中央', department: '普通科', quota: 318, finalApplicants: 317, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢西', department: '普通科', quota: 318, finalApplicants: 360, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '豊岡', department: '普通科', quota: 318, finalApplicants: 334, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南稜', department: '普通科', quota: 318, finalApplicants: 422, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座', department: '普通科', quota: 198, finalApplicants: 195, finalRate: 0.98, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座柳瀬', department: '普通科', quota: 198, finalApplicants: 212, finalRate: 1.07, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蓮田松韻', department: '普通科', quota: 198, finalApplicants: 158, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳩ケ谷', department: '普通科', quota: 158, finalApplicants: 216, finalRate: 1.37, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生第一', department: '普通科', quota: 158, finalApplicants: 126, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '飯能', department: '普通科', quota: 278, finalApplicants: 291, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日高', department: '普通科', quota: 118, finalApplicants: 92, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '日高', department: '情報コース', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷', department: '普通科', quota: 198, finalApplicants: 146, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷第一', department: '普通科', quota: 278, finalApplicants: 314, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '富士見', department: '普通科', quota: 198, finalApplicants: 202, finalRate: 1.02, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'ふじみ野', department: '普通科', quota: 158, finalApplicants: 142, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '不動岡', department: '普通科', quota: 358, finalApplicants: 482, finalRate: 1.35, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '本庄', department: '普通科', quota: 318, finalApplicants: 367, finalRate: 1.15, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松伏', department: '普通科', quota: 118, finalApplicants: 133, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松伏', department: '情報ビジネスコース', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松山', department: '普通科', quota: 278, finalApplicants: 250, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松山女子', department: '普通科', quota: 318, finalApplicants: 353, finalRate: 1.11, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷', department: '普通科', quota: 198, finalApplicants: 135, finalRate: 0.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷北', department: '普通科', quota: 238, finalApplicants: 246, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '宮代', department: '普通科', quota: 198, finalApplicants: 209, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '妻沼', department: '普通科', quota: 119, finalApplicants: 104, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮南', department: '普通科', quota: 79, finalApplicants: 82, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '与野', department: '普通科', quota: 358, finalApplicants: 452, finalRate: 1.26, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '和光国際', department: '普通科', quota: 238, finalApplicants: 285, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鷲宮', department: '普通科', quota: 278, finalApplicants: 300, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蕨', department: '普通科', quota: 318, finalApplicants: 424, finalRate: 1.33, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立川越', department: '普通科', quota: 140, finalApplicants: 169, finalRate: 1.21, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立浦和', department: '普通科', quota: 240, finalApplicants: 451, finalRate: 1.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立浦和南', department: '普通科', quota: 320, finalApplicants: 495, finalRate: 1.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立大宮北', department: '普通科', quota: 280, finalApplicants: 413, finalRate: 1.48, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口市立', department: '普通科', quota: 240, finalApplicants: 402, finalRate: 1.68, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口市立', department: 'スポーツ科学コース', quota: 80, finalApplicants: 114, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    // ===== 3頁目「全日制 専門学科・農業に関する学科」18レコード（頁末尾「農業科計」796/641/0.81と完全一致） =====
    { schoolName: '熊谷農業', department: '食品科学科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷農業', department: '生物生産工学科', quota: 79, finalApplicants: 72, finalRate: 0.91, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷農業', department: '生活技術科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷農業', department: '生物生産技術科', quota: 80, finalApplicants: 59, finalRate: 0.74, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '生物資源科', quota: 39, finalApplicants: 37, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '環境デザイン科', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '生物生産工学科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '園芸科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '造園科', quota: 39, finalApplicants: 20, finalRate: 0.51, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '食品流通科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '生活技術科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '杉戸農業', department: '生物生産技術科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '農業科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '食品化学科', quota: 39, finalApplicants: 24, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '森林科学科', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳩ケ谷', department: '園芸デザイン科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '園芸科', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '農業経済科', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    // ===== 4頁目「全日制 専門学科・工業に関する学科」45レコード（頁末尾「工業科計」2382/2112/0.89と完全一致）=====
    // ⚠️「大宮工業」はR8で「大宮科学技術」に改組(機械科等→機械工学科等へ学科名も刷新)。R7時点の実在校名・学科名をそのまま収録。
    { schoolName: '大宮工業', department: '機械科', quota: 80, finalApplicants: 68, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮工業', department: '電気科', quota: 40, finalApplicants: 30, finalRate: 0.75, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮工業', department: '建築科', quota: 79, finalApplicants: 79, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮工業', department: '電子機械科', quota: 79, finalApplicants: 77, finalRate: 0.97, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部工業', department: '機械科', quota: 79, finalApplicants: 74, finalRate: 0.94, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部工業', department: '電気科', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部工業', department: '建築科', quota: 80, finalApplicants: 85, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口工業', department: '機械科', quota: 80, finalApplicants: 76, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口工業', department: '電気科', quota: 79, finalApplicants: 76, finalRate: 0.96, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川口工業', department: '情報通信科', quota: 79, finalApplicants: 62, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: 'デザイン科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '機械科', quota: 79, finalApplicants: 78, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '電気科', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '建築科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '川越工業', department: '化学科', quota: 79, finalApplicants: 49, finalRate: 0.62, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '機械科', quota: 80, finalApplicants: 83, finalRate: 1.04, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '電気科', quota: 39, finalApplicants: 32, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '工業化学科', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '環境科学科', quota: 40, finalApplicants: 15, finalRate: 0.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '久喜工業', department: '情報技術科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '機械科', quota: 79, finalApplicants: 61, finalRate: 0.77, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '電気科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '建築科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '土木科', quota: 40, finalApplicants: 36, finalRate: 0.9, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷工業', department: '情報技術科', quota: 40, finalApplicants: 50, finalRate: 1.25, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '電子機械科', quota: 39, finalApplicants: 41, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '情報技術科', quota: 40, finalApplicants: 42, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '機械科', quota: 40, finalApplicants: 20, finalRate: 0.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '児玉', department: '電子機械科', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山工業', department: '機械科', quota: 80, finalApplicants: 79, finalRate: 0.99, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山工業', department: '電気科', quota: 39, finalApplicants: 27, finalRate: 0.69, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山工業', department: '電子機械科', quota: 79, finalApplicants: 46, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: '電気システム科', quota: 39, finalApplicants: 25, finalRate: 0.64, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: '情報メディア科', quota: 40, finalApplicants: 21, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '進修館', department: 'ものづくり科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '電気システム科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: '機械システム科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: 'デザイン科', quota: 40, finalApplicants: 55, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '電子機械科', quota: 39, finalApplicants: 34, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '情報技術科', quota: 40, finalApplicants: 44, finalRate: 1.1, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '機械科', quota: 39, finalApplicants: 33, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '電気科', quota: 39, finalApplicants: 39, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '電子機械科', quota: 40, finalApplicants: 24, finalRate: 0.6, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '情報技術科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '三郷工業技術', department: '情報電子科', quota: 40, finalApplicants: 32, finalRate: 0.8, fiscalYear: '令和7年度（2025年度）' },
    // ===== 5頁目「全日制 専門学科・商業に関する学科」15校27レコード（頁末尾「商業科計」2285/2151/0.94と完全一致）=====
    // ⚠️「八潮南」はR8データに対応する学校が見当たらない(統廃合の可能性)。R7時点の実在記録としてそのまま収録。
    { schoolName: '上尾', department: '商業科', quota: 120, finalApplicants: 165, finalRate: 1.38, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻商業', department: '商業科', quota: 79, finalApplicants: 42, finalRate: 0.53, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '岩槻商業', department: '情報処理科', quota: 80, finalApplicants: 63, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和商業', department: '商業科', quota: 198, finalApplicants: 172, finalRate: 0.87, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '浦和商業', department: '情報処理科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮商業', department: '商業科', quota: 198, finalApplicants: 183, finalRate: 0.92, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '熊谷商業', department: '総合ビジネス科', quota: 198, finalApplicants: 169, finalRate: 0.85, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣', department: '商業科', quota: 80, finalApplicants: 81, finalRate: 1.01, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '流通経済科', quota: 40, finalApplicants: 31, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '情報処理科', quota: 40, finalApplicants: 37, finalRate: 0.93, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山経済', department: '流通経済科', quota: 79, finalApplicants: 83, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山経済', department: '会計科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '狭山経済', department: '情報処理科', quota: 80, finalApplicants: 87, finalRate: 1.09, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢商業', department: '情報処理科', quota: 79, finalApplicants: 65, finalRate: 0.82, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢商業', department: '国際流通科', quota: 79, finalApplicants: 62, finalRate: 0.78, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '所沢商業', department: 'ビジネス会計科', quota: 40, finalApplicants: 17, finalRate: 0.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '総合ビジネス科', quota: 39, finalApplicants: 39, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鳩ケ谷', department: '情報処理科', quota: 80, finalApplicants: 84, finalRate: 1.05, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '商業科', quota: 39, finalApplicants: 16, finalRate: 0.41, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '羽生実業', department: '情報処理科', quota: 40, finalApplicants: 25, finalRate: 0.63, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷商業', department: '商業科', quota: 158, finalApplicants: 167, finalRate: 1.06, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷商業', department: '会計科', quota: 40, finalApplicants: 38, finalRate: 0.95, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '深谷商業', department: '情報処理科', quota: 80, finalApplicants: 67, finalRate: 0.84, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮南', department: '商業科', quota: 79, finalApplicants: 70, finalRate: 0.89, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '八潮南', department: '情報処理科', quota: 80, finalApplicants: 49, finalRate: 0.61, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立川越', department: '国際経済科', quota: 70, finalApplicants: 110, finalRate: 1.57, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '市立川越', department: '情報処理科', quota: 70, finalApplicants: 104, finalRate: 1.49, fiscalYear: '令和7年度（2025年度）' },
    // ===== 6頁目「全日制 専門学科・家庭/看護/外国語/美術/音楽/書道/体育に関する学科」25レコード（各学科の頁内小計と完全一致）=====
    { schoolName: '鴻巣女子', department: '保育科', quota: 40, finalApplicants: 26, finalRate: 0.65, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '鴻巣女子', department: '家政科学科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '服飾デザイン科', quota: 39, finalApplicants: 31, finalRate: 0.79, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷総合技術', department: '食物調理科', quota: 40, finalApplicants: 52, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: 'ライフデザイン科', quota: 40, finalApplicants: 18, finalRate: 0.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '秩父農工科学', department: 'フードデザイン科', quota: 40, finalApplicants: 43, finalRate: 1.08, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '服飾デザイン科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '新座総合技術', department: '食物調理科', quota: 40, finalApplicants: 49, finalRate: 1.23, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '常盤', department: '看護科', quota: 80, finalApplicants: 95, finalRate: 1.19, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '春日部女子', department: '外国語科', quota: 40, finalApplicants: 35, finalRate: 0.88, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越谷南', department: '外国語科', quota: 40, finalApplicants: 60, finalRate: 1.5, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '坂戸', department: '外国語科', quota: 40, finalApplicants: 41, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '草加南', department: '外国語科', quota: 40, finalApplicants: 45, finalRate: 1.13, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '南稜', department: '外国語科', quota: 40, finalApplicants: 48, finalRate: 1.2, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '和光国際', department: '外国語科', quota: 79, finalApplicants: 98, finalRate: 1.24, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '蕨', department: '外国語科', quota: 40, finalApplicants: 57, finalRate: 1.43, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '美術科', quota: 40, finalApplicants: 58, finalRate: 1.45, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '越生', department: '美術科', quota: 40, finalApplicants: 23, finalRate: 0.58, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術総合', department: '美術科', quota: 40, finalApplicants: 51, finalRate: 1.28, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '音楽科', quota: 40, finalApplicants: 28, finalRate: 0.7, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '芸術総合', department: '音楽科', quota: 40, finalApplicants: 16, finalRate: 0.4, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '松伏', department: '音楽科', quota: 40, finalApplicants: 22, finalRate: 0.55, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮光陵', department: '書道科', quota: 40, finalApplicants: 40, finalRate: 1.0, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: '大宮東', department: '体育科', quota: 80, finalApplicants: 104, finalRate: 1.3, fiscalYear: '令和7年度（2025年度）' },
    { schoolName: 'ふじみ野', department: 'スポーツサイエンス科', quota: 80, finalApplicants: 82, finalRate: 1.03, fiscalYear: '令和7年度（2025年度）' },
  ],
};
