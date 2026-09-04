import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 島根県 定時制（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 島根県教育委員会「令和8年度島根県公立高等学校入学者選抜 一般選抜出願者数
 * （志願変更後）」（令和8年2月16日17:00現在・全1頁）
 * https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/kanendosenbatsu.data/01_R8_henkougoitiran_teisei.pdf
 * （既存の全日制`src/data/competition-rates/shimane.ts`と同一PDFの下段「定時制」表。
 * ファイル名の「teisei」は「訂正」の意で「定時制」ではないが、内容は全日制・定時制とも
 * 完全版が掲載されている）。
 *
 * ⚠️対象範囲=【定時制】3校8レコード（松江工業・宍道・浜田、いずれも複数学科/時間帯で
 * 別レコード）。finalApplicantsは「出願者数合計（志願変更後）」列（j列）を採用した
 * （志願変更前の値ではなく、志願変更を反映した最終値）。宍道（夜間）は志願変更前4名→
 * 変更後3名という実際の減少例。
 *
 * 機械集計（quota360・applicants134・倍率0.37）は表末尾の印字済み「合計」360/134/0.37と
 * 完全一致した。ToUnicode欠落は無く`pdftoppm 400dpi`のクロップ画像で高精細に判読できた。
 */

export const SHIMANE_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shimane',
  sources: [
    {
      url: 'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/kanendosenbatsu.data/01_R8_henkougoitiran_teisei.pdf',
      docTitle: '島根県教育委員会 令和8年度島根県公立高等学校入学者選抜 一般選抜出願者数（志願変更後）【定時制】',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制'],
    pendingDepartments: [],
    note: '【定時制】表の全8レコードを完全収録。',
  },
  records: [
    { schoolName: '松江工業（定時）', department: '機械', quota: 40, finalApplicants: 5, finalRate: 0.13 },
    { schoolName: '松江工業（定時）', department: '電気', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '松江工業（定時）', department: '建築', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '宍道（定時）', department: '普通（午前）', quota: 80, finalApplicants: 66, finalRate: 0.83 },
    { schoolName: '宍道（定時）', department: '普通（午後）', quota: 40, finalApplicants: 31, finalRate: 0.78 },
    { schoolName: '宍道（定時）', department: '普通（夜間）', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '浜田（定時）', department: '普通（昼間）', quota: 40, finalApplicants: 19, finalRate: 0.48 },
    { schoolName: '浜田（定時）', department: '普通（夜間）', quota: 40, finalApplicants: 2, finalRate: 0.05 },
  ],
  officialSubtotals: [{ label: '合計', quota: 360, finalApplicants: 134, finalRate: 0.37 }],
};
