import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 神奈川県 定時制・通信制（単位制）（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 神奈川県教育委員会「令和8年度神奈川県公立高等学校入学者選抜（共通選抜）志願状況」
 * （既存の全日制`src/data/competition-rates/kanagawa.ts`と同一PDF`bessi3.pdf`・全14頁の
 * うち12頁目「単位制 普通科」「単位制 総合学科」「単位制 専門学科（工業に関する学科）」
 * （定時制）＋「（通信制の課程）単位制 普通科」）。
 *
 * ⚠️対象範囲=①定時制・単位制普通科9校11レコード（横浜明朋・相模向陽館は午前部/午後部で
 * 別レコード化）②定時制・単位制総合学科2校4レコード（横浜市立横浜総合はⅠ部/Ⅱ部/Ⅲ部で
 * 別レコード化）③定時制・単位制専門学科（工業）1校3レコード（県立神奈川工業の機械/電気/建設）
 * ④通信制・単位制普通科2校2レコードの計20レコード。県立神奈川工業と県立厚木清南は複数
 * セクションに学校名が重複登場するため、`department`にセクションを示す角括弧タグ
 * （[単位制普通科・定時制]等）を付与して一意に区別した。
 *
 * ⚠️quota/finalApplicants/finalRateの定義: 4列（募集定員/共通選抜募集人員(A)/1月30日志願者数(B)/
 * 2月9日志願者数(C)）のうちquota=共通選抜募集人員(A)（募集定員でなくこちらを採用。他県の
 * 「最終応募人員」に相当し、印字済み競争率C/Aと整合するのはAのため）・finalApplicants=
 * 2月9日志願者数(C)（最終時点）・finalRate=印字済み「2月9日競争率(C/A)」をそのまま転記。
 *
 * ⚠️このPDFはToUnicode欠落でpdftotext不可だが、`pdftoppm 170dpi`のビジョン解析1回で
 * 全20レコードを判読できた。神奈川県は各セクションに学校群の小計＋セクション合計の2段階
 * 自己検算行を持つ（他県より充実）ため、機械集計は4セクションそれぞれの印字済み合計と
 * 完全一致した: ①単位制普通科983／558／0.57 ②単位制総合学科406／328／0.81
 * ③単位制専門学科（工業）84／16／0.19 ④通信制単位制普通科1,216／542／0.45。
 */

export const KANAGAWA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kanagawa',
  sources: [
    {
      url: 'https://www.pref.kanagawa.jp/documents/131973/bessi3.pdf',
      docTitle:
        '神奈川県教育委員会 令和8年度神奈川県公立高等学校入学者選抜（共通選抜）志願状況 単位制普通科／単位制総合学科／単位制専門学科（工業に関する学科）／（通信制の課程）単位制普通科',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制・単位制普通科', '定時制・単位制総合学科', '定時制・単位制専門学科（工業）', '通信制・単位制普通科'],
    pendingDepartments: [],
    note: '12頁目の4セクション（定時制3種＋通信制1種）の全20レコードを完全収録。各セクションとも印字済み合計と完全一致。',
  },
  records: [
    // ===== 定時制・単位制普通科 =====
    { schoolName: '県立神奈川工業', department: '普通科 [単位制普通科・定時制]', quota: 56, finalApplicants: 14, finalRate: 0.25 },
    { schoolName: '県立横浜明朋', department: '普通科・午前部 [単位制普通科・定時制]', quota: 125, finalApplicants: 124, finalRate: 0.99 },
    { schoolName: '県立横浜明朋', department: '普通科・午後部 [単位制普通科・定時制]', quota: 125, finalApplicants: 54, finalRate: 0.43 },
    { schoolName: '県立川崎', department: '普通科 [単位制普通科・定時制]', quota: 70, finalApplicants: 55, finalRate: 0.79 },
    { schoolName: '県立湘南', department: '普通科 [単位制普通科・定時制]', quota: 56, finalApplicants: 28, finalRate: 0.5 },
    { schoolName: '県立高浜', department: '普通科 [単位制普通科・定時制]', quota: 56, finalApplicants: 34, finalRate: 0.61 },
    { schoolName: '県立小田原', department: '普通科 [単位制普通科・定時制]', quota: 56, finalApplicants: 22, finalRate: 0.39 },
    { schoolName: '県立厚木清南', department: '普通科 [単位制普通科・定時制]', quota: 105, finalApplicants: 53, finalRate: 0.5 },
    { schoolName: '県立相模向陽館', department: '普通科・午前部 [単位制普通科・定時制]', quota: 125, finalApplicants: 88, finalRate: 0.7 },
    { schoolName: '県立相模向陽館', department: '普通科・午後部 [単位制普通科・定時制]', quota: 125, finalApplicants: 57, finalRate: 0.46 },
    { schoolName: '県立神奈川総合産業', department: '普通科 [単位制普通科・定時制]', quota: 84, finalApplicants: 29, finalRate: 0.35 },
    // ===== 定時制・単位制総合学科 =====
    { schoolName: '横浜市立横浜総合', department: '総合学科Ⅰ部 [単位制総合学科・定時制]', quota: 144, finalApplicants: 153, finalRate: 1.06 },
    { schoolName: '横浜市立横浜総合', department: '総合学科Ⅱ部 [単位制総合学科・定時制]', quota: 98, finalApplicants: 97, finalRate: 0.99 },
    { schoolName: '横浜市立横浜総合', department: '総合学科Ⅲ部 [単位制総合学科・定時制]', quota: 108, finalApplicants: 38, finalRate: 0.35 },
    { schoolName: '横須賀市立横須賀総合', department: '総合学科 [単位制総合学科・定時制]', quota: 56, finalApplicants: 40, finalRate: 0.71 },
    // ===== 定時制・単位制専門学科（工業） =====
    { schoolName: '県立神奈川工業', department: '機械科 [単位制専門学科(工業)・定時制]', quota: 28, finalApplicants: 2, finalRate: 0.07 },
    { schoolName: '県立神奈川工業', department: '電気科 [単位制専門学科(工業)・定時制]', quota: 28, finalApplicants: 8, finalRate: 0.29 },
    { schoolName: '県立神奈川工業', department: '建設科 [単位制専門学科(工業)・定時制]', quota: 28, finalApplicants: 6, finalRate: 0.21 },
    // ===== 通信制・単位制普通科 =====
    { schoolName: '県立横浜修悠館', department: '普通科 [単位制普通科・通信制]', quota: 1000, finalApplicants: 407, finalRate: 0.41 },
    { schoolName: '県立厚木清南', department: '普通科 [単位制普通科・通信制]', quota: 216, finalApplicants: 135, finalRate: 0.63 },
  ],
  officialSubtotals: [
    { label: '単位制普通科合計', quota: 983, finalApplicants: 558, finalRate: 0.57 },
    { label: '単位制総合学科合計', quota: 406, finalApplicants: 328, finalRate: 0.81 },
    { label: '単位制専門学科（工業）合計', quota: 84, finalApplicants: 16, finalRate: 0.19 },
    { label: '通信制単位制普通科合計', quota: 1216, finalApplicants: 542, finalRate: 0.45 },
  ],
};
