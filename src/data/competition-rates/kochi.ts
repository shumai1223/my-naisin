/**
 * 高知県 公立高等学校 倍率パイプラインα（Y-6・23県目）。
 *
 * 一次ソース: 高知県教育委員会「令和8年度Ａ日程等志願先変更後の状況（学校別）」
 * （令和8年3月12日修正・全2ページ）。
 *
 * ⚠️高知県はテキスト埋め込み型PDFだが日本語のToUnicodeマッピングが欠落しておりpdftotextでは
 * 数値のみ抽出され学校名/学科名が読めなかったため、PDFをReadツールで画像として視覚的に読み取った
 * （兵庫県・鳥取県・大分県と同型の技法）。
 *
 * ⚠️高知県は「Ａ日程」（本データベースが採用する主選抜・入学定員から特別枠等を除いた募集定員に
 * 対する第1志望者数の競争率）と「Ｂ日程」（Ａ日程合格者を除いた残り募集定員に対する2次的な出願、
 * 他県の2次募集と同種のため対象外）の2段階選抜を持つ。本データベースはＡ日程のみを採用する
 * （列は[入学定員 / 募集定員（＝quota。注4により一部の学校はこうちフロンティア募集合格者数を
 * 入学定員から除いた数）/ 第1志望者数（＝applicants）/ 志願率（＝finalRate。第1志望者数÷募集定員）]）。
 *
 * ⚠️高知国際高校「国際（グローバル）探究」学科は募集定員が「若干名」（数値化不能）と公表されており、
 * Y-0憲法③「機械可読不能は正直にスキップ」に従い記録しない（静岡県の「連携（定めない）」等と同型の
 * 扱い）。この学科の第1志望者数7名は、公式の県立計（募集定員4,092・第1志望者数2,837）には含まれるが
 * 本データベースの機械集計（募集定員4,092・第1志望者数2,830）には含まれないため意図的に一致しない
 * （officialSubtotalsは本データベースが実際に積み上げられる数値=2,830を採用し、注記で公式値との
 * 差分理由を明記する）。高知海洋高校「船舶職員養成課程」は水産(海洋)学科の内数のため独立レコード化
 * しない。多部制単位制・定時制・連携型中高一貫教育校に係る特別選抜は他県の定時制/特色選抜と同じ理由で
 * 意図的にスコープ外。
 *
 * 全ての学校別「計」行（安芸=65・山田=87・高知農業=243・高知東工業=72・岡豊=282・高知東=169・
 * 高知工業=278・高知丸の内=185・高知小津=259・高知国際=211（普通204分のみ採用）・須崎総合=136・
 * 幡多農業=86・宿毛工業=75・高知商業=314）との内訳合計一致をNode.jsスクリプトで機械検証済み。
 * 県立計・市立計・合計いずれも機械集計と完全一致（募集定員は完全一致・第1志望者数は上記の
 * 高知国際グローバル探究7名分のみ意図的な差分）。
 */
import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

export const KOCHI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kochi',
  sources: [
    {
      url: 'https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_henkougo0205.pdf',
      docTitle: '高知県教育委員会 令和8年度Ａ日程等志願先変更後の状況（学校別）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-07-25',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['全日制・Ａ日程（県立31校・市立高知商業を含む32校75レコード）'],
    pendingDepartments: [
      '高知国際「国際（グローバル）探究」学科（募集定員が「若干名」で数値化不能のため除外。第1志望者数7名は公式合計には含まれるが本データベースの合計には含まれない）',
      'Ｂ日程（Ａ日程合格者を除いた残り募集定員への2次的出願のため他県の2次募集と同じ理由でスコープ外）',
      '多部制単位制・定時制（全日制の外側の別課程のため他県と同じ理由でスコープ外）',
      '連携型中高一貫教育校に係る特別選抜（一般選抜とは別の選抜区分のため他県の推薦/特色選抜と同じ理由でスコープ外）',
    ],
    note:
      '公式の県立計（募集定員4,092・第1志望者数2,837）に対し、本データベースの機械集計（募集定員4,092・' +
      '第1志望者数2,830）は募集定員が完全一致し、第1志望者数は高知国際グローバル探究学科（募集定員非公表' +
      'のため記録から除外・第1志望者数7名分）の差分のみで説明がつく。officialSubtotalsは本データベースが' +
      '実際に積み上げられる数値を採用した。',
  },
  officialSubtotals: [
    { label: '県立計', schoolCount: 31, quota: 4092, finalApplicants: 2830 },
    { label: '市立計（高知商業）', schoolCount: 1, quota: 280, finalApplicants: 314 },
    { label: '合計', schoolCount: 32, quota: 4372, finalApplicants: 3144 },
  ],
  records: [
    { schoolName: '室戸', department: '総合', quota: 44, finalApplicants: 5, finalRate: 0.11 },
    { schoolName: '安芸', department: '普通', quota: 95, finalApplicants: 34, finalRate: 0.36 },
    { schoolName: '安芸', department: '工業(機械)', quota: 20, finalApplicants: 4, finalRate: 0.2 },
    { schoolName: '安芸', department: '工業(土木)', quota: 20, finalApplicants: 0, finalRate: 0 },
    { schoolName: '安芸', department: '商業(ビジネス)', quota: 34, finalApplicants: 27, finalRate: 0.79 },
    { schoolName: '城山', department: '普通', quota: 70, finalApplicants: 20, finalRate: 0.29 },
    { schoolName: '山田', department: '普通', quota: 80, finalApplicants: 52, finalRate: 0.65 },
    { schoolName: '山田', department: '探究(グローバル)', quota: 40, finalApplicants: 8, finalRate: 0.2 },
    { schoolName: '山田', department: '商業(ビ探)', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '嶺北', department: '普通', quota: 50, finalApplicants: 3, finalRate: 0.06 },
    { schoolName: '高知農業', department: '農業(農総)', quota: 40, finalApplicants: 38, finalRate: 0.95 },
    { schoolName: '高知農業', department: '農業(畜総)', quota: 40, finalApplicants: 51, finalRate: 1.28 },
    { schoolName: '高知農業', department: '農業(森総)', quota: 40, finalApplicants: 25, finalRate: 0.63 },
    { schoolName: '高知農業', department: '農業(環土)', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '高知農業', department: '農業(食ビ)', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '高知農業', department: '農業(生総)', quota: 40, finalApplicants: 52, finalRate: 1.3 },
    { schoolName: '高知東工業', department: '工業(機械)', quota: 40, finalApplicants: 27, finalRate: 0.68 },
    { schoolName: '高知東工業', department: '工業(機械システム)', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '高知東工業', department: '工業(電子)', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '高知東工業', department: '工業(電機)', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '岡豊', department: '普通', quota: 200, finalApplicants: 212, finalRate: 1.06 },
    { schoolName: '岡豊', department: '普通(芸術コース)', quota: 40, finalApplicants: 30, finalRate: 0.75 },
    { schoolName: '岡豊', department: '普通(体育コース)', quota: 40, finalApplicants: 40, finalRate: 1 },
    { schoolName: '高知東', department: '総合', quota: 200, finalApplicants: 151, finalRate: 0.76 },
    { schoolName: '高知東', department: '看護', quota: 30, finalApplicants: 18, finalRate: 0.6 },
    { schoolName: '高知工業', department: '工業(機械)', quota: 40, finalApplicants: 44, finalRate: 1.1 },
    { schoolName: '高知工業', department: '工業(電気)', quota: 40, finalApplicants: 34, finalRate: 0.85 },
    { schoolName: '高知工業', department: '工業(情技)', quota: 40, finalApplicants: 43, finalRate: 1.08 },
    { schoolName: '高知工業', department: '工業(工化)', quota: 40, finalApplicants: 28, finalRate: 0.7 },
    { schoolName: '高知工業', department: '工業(土木)', quota: 40, finalApplicants: 42, finalRate: 1.05 },
    { schoolName: '高知工業', department: '工業(建築)', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '高知工業', department: '工業(総デ)', quota: 40, finalApplicants: 41, finalRate: 1.03 },
    { schoolName: '高知追手前', department: '普通', quota: 240, finalApplicants: 206, finalRate: 0.86 },
    { schoolName: '吾北', department: '普通', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '高知丸の内', department: '普通', quota: 140, finalApplicants: 164, finalRate: 1.17 },
    { schoolName: '高知丸の内', department: 'チャレンジＡ', quota: 10, finalApplicants: 7, finalRate: 0.7 },
    { schoolName: '高知丸の内', department: '音楽', quota: 30, finalApplicants: 14, finalRate: 0.47 },
    { schoolName: '高知小津', department: '普通', quota: 240, finalApplicants: 242, finalRate: 1.01 },
    { schoolName: '高知小津', department: '理数', quota: 30, finalApplicants: 17, finalRate: 0.57 },
    { schoolName: '高知国際', department: '普通', quota: 200, finalApplicants: 204, finalRate: 1.02 },
    { schoolName: '伊野商業', department: '商業(キャリア)', quota: 120, finalApplicants: 66, finalRate: 0.55 },
    { schoolName: '春野', department: '総合', quota: 160, finalApplicants: 128, finalRate: 0.8 },
    { schoolName: '高岡', department: '普通', quota: 70, finalApplicants: 25, finalRate: 0.36 },
    { schoolName: '高知海洋', department: '水産(海洋)', quota: 35, finalApplicants: 13, finalRate: 0.37 },
    { schoolName: '須崎総合', department: '普通', quota: 120, finalApplicants: 85, finalRate: 0.71 },
    { schoolName: '須崎総合', department: '工業(機械系)機械', quota: 20, finalApplicants: 17, finalRate: 0.85 },
    { schoolName: '須崎総合', department: '工業(造船)', quota: 20, finalApplicants: 4, finalRate: 0.2 },
    { schoolName: '須崎総合', department: '工業(電情系)電気', quota: 20, finalApplicants: 2, finalRate: 0.1 },
    { schoolName: '須崎総合', department: '工業(電情)', quota: 20, finalApplicants: 9, finalRate: 0.45 },
    { schoolName: '須崎総合', department: '工業(シ工系)機制', quota: 20, finalApplicants: 4, finalRate: 0.2 },
    { schoolName: '須崎総合', department: '工業(住環)', quota: 20, finalApplicants: 15, finalRate: 0.75 },
    { schoolName: '佐川', department: '普通', quota: 70, finalApplicants: 29, finalRate: 0.41 },
    { schoolName: '窪川', department: '普通', quota: 50, finalApplicants: 19, finalRate: 0.38 },
    { schoolName: '檮原', department: '普通', quota: 31, finalApplicants: 4, finalRate: 0.13 },
    { schoolName: '四万十', department: '普通', quota: 22, finalApplicants: 1, finalRate: 0.05 },
    { schoolName: '四万十', department: '普通(自環コース)', quota: 25, finalApplicants: 0, finalRate: 0 },
    { schoolName: '大方', department: '普通', quota: 33, finalApplicants: 7, finalRate: 0.21 },
    { schoolName: '幡多農業', department: '農業(園システム)', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '幡多農業', department: '農業(アグリ)', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '幡多農業', department: '農業(グリーン)', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '幡多農業', department: '農業(コーディネート)', quota: 40, finalApplicants: 32, finalRate: 0.8 },
    { schoolName: '中村', department: '普通', quota: 161, finalApplicants: 139, finalRate: 0.86 },
    { schoolName: '西土佐', department: '普通', quota: 34, finalApplicants: 2, finalRate: 0.06 },
    { schoolName: '宿毛工業', department: '工業(機械系)機械', quota: 20, finalApplicants: 5, finalRate: 0.25 },
    { schoolName: '宿毛工業', department: '工業(自車)', quota: 20, finalApplicants: 16, finalRate: 0.8 },
    { schoolName: '宿毛工業', department: '工業(建設系)土木', quota: 20, finalApplicants: 21, finalRate: 1.05 },
    { schoolName: '宿毛工業', department: '工業(建築)', quota: 20, finalApplicants: 10, finalRate: 0.5 },
    { schoolName: '宿毛工業', department: '工業(電気)', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '宿毛工業', department: '工業(情技)', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '宿毛', department: '総合', quota: 58, finalApplicants: 13, finalRate: 0.22 },
    { schoolName: '清水', department: '普通(未来)', quota: 50, finalApplicants: 3, finalRate: 0.06 },
    { schoolName: '高知商業', department: '商業(総合マネ)', quota: 140, finalApplicants: 146, finalRate: 1.04 },
    { schoolName: '高知商業', department: '商業(社会マネ)', quota: 70, finalApplicants: 91, finalRate: 1.3 },
    { schoolName: '高知商業', department: '商業(情報マネ)', quota: 35, finalApplicants: 41, finalRate: 1.17 },
    { schoolName: '高知商業', department: '商業(スポマネ)', quota: 35, finalApplicants: 36, finalRate: 1.03 },
  ],
};
