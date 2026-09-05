import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 岐阜県 定時制・通信制（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 岐阜県教育委員会「令和8年度岐阜県公立高等学校入学者選抜 出願者数一覧」（既存の
 * 全日制`src/data/competition-rates/gifu.ts`と同一PDF・全5頁のうち5頁目「2 定時制」「3 通信制」）。
 *
 * ⚠️対象範囲=①定時制11校16レコード（華陽フロンティア・東濃フロンティアは普通科がⅠ部/Ⅱ部/Ⅲ部の
 * 3部制のため各部を別レコード化・阿木は生産科学/総合生活の2学科）②通信制2校2レコード
 * （華陽フロンティア・飛騨高山）の計18レコード。
 *
 * ⚠️このページには印字済みの「計」行が存在しない（個票のみ）。P1-3で初めて公式合計での
 * 突合ができない県となったため、`officialSubtotals`は空のまま残し、代わりに個票の機械集計値
 * （定時制: 募集人員740／出願者数335、通信制: 募集人員320／出願者数132）をこのコメントに
 * 直接記録することで「1データ点1出典」を満たす（Y-0）。将来、県教委が別途「計」を公表した
 * 場合はofficialSubtotalsへ追記できる。
 *
 * ToUnicode欠落でpdftotextは数字のみ抽出・`pdftoppm 180dpi`のビジョン解析1回で全18レコードを
 * 判読できた。
 */

export const GIFU_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'gifu',
  sources: [
    {
      url: 'https://www.pref.gifu.lg.jp/uploaded/attachment/485854.pdf',
      docTitle: '岐阜県教育委員会 令和8年度岐阜県公立高等学校入学者選抜 出願者数一覧 2 定時制／3 通信制',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制', '通信制'],
    pendingDepartments: [],
    note: '5頁目「2 定時制」全16レコード＋「3 通信制」全2レコードを完全収録。ページ内に公式「計」行が無いため、officialSubtotalsは空のまま（自己検算値はヘッダコメント参照）。',
  },
  records: [
    // ===== 定時制 =====
    { schoolName: '華陽フロンティア', department: '普通（Ⅰ部）', quota: 80, finalApplicants: 74, finalRate: 0.93 },
    { schoolName: '華陽フロンティア', department: '普通（Ⅱ部）', quota: 80, finalApplicants: 48, finalRate: 0.6 },
    { schoolName: '華陽フロンティア', department: '普通（Ⅲ部）', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '岐阜商業', department: 'ビジネス', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '岐阜工業', department: '工業技術', quota: 40, finalApplicants: 14, finalRate: 0.35 },
    { schoolName: '大垣商業', department: 'ビジネス', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '大垣工業', department: '工業技術', quota: 40, finalApplicants: 10, finalRate: 0.25 },
    { schoolName: '加茂', department: '普通', quota: 60, finalApplicants: 44, finalRate: 0.73 },
    { schoolName: '東濃フロンティア', department: '普通（Ⅰ部）', quota: 40, finalApplicants: 24, finalRate: 0.6 },
    { schoolName: '東濃フロンティア', department: '普通（Ⅱ部）', quota: 40, finalApplicants: 40, finalRate: 1.0 },
    { schoolName: '東濃フロンティア', department: '普通（Ⅲ部）', quota: 40, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '中津', department: '普通', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '飛騨高山', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '関商工', department: '機械', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { schoolName: '阿木', department: '生産科学', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '阿木', department: '総合生活', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    // ===== 通信制 =====
    { schoolName: '華陽フロンティア', department: '普通（通信制）', quota: 240, finalApplicants: 112, finalRate: 0.47 },
    { schoolName: '飛騨高山', department: '普通（通信制）', quota: 80, finalApplicants: 20, finalRate: 0.25 },
  ],
  officialSubtotals: [],
};
