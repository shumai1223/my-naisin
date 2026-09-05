import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 鹿児島県 定時制（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 鹿児島県教育委員会「令和8年度公立高等学校入学学力検査最終出願者数（定時制）」
 * （既存の全日制`src/data/competition-rates/kagoshima.ts`と同一PDF
 * `126595_20260304191737-1.pdf`・全7頁のうち7頁目）。
 *
 * ⚠️対象範囲=鹿児島学区（開陽・普通/オフィス情報の2学科）+大島学区（奄美・商業）の2校3レコード
 * （47県中最も小規模）。
 *
 * ⚠️quota/finalApplicants/finalRateの定義: 募集定員/学力検査定員/最終出願者数/倍率(本年・前年)
 * の4列のうちquota=学力検査定員（募集定員でなくこちら。印字済み倍率と整合するのは学力検査定員
 * のため）、finalApplicants=最終出願者数、finalRate=印字済み倍率(本年)をそのまま転記した
 * （前年列は比較用のため不採用）。
 *
 * 機械集計は学区ごとの小計と定時制合計いずれとも完全一致した: ①鹿児島学区計36／31／0.86
 * ②大島学区計40／7／0.18 ③定時制合計76／38／0.50。ToUnicode欠落でpdftotext不可・
 * `pdftoppm 180dpi`のビジョン解析1回で全3レコードを判読できた。
 */

export const KAGOSHIMA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kagoshima',
  sources: [
    {
      url: 'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/126595_20260304191737-1.pdf',
      docTitle: '鹿児島県教育委員会 令和8年度公立高等学校入学学力検査最終出願者数（定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制'],
    pendingDepartments: [],
    note: '7頁目「（定時制）」の全3レコード（2校・鹿児島学区+大島学区）を完全収録。',
  },
  records: [
    { schoolName: '開陽', department: '普通', quota: 16, finalApplicants: 24, finalRate: 1.5 },
    { schoolName: '開陽', department: 'オフィス情報', quota: 20, finalApplicants: 7, finalRate: 0.35 },
    { schoolName: '奄美', department: '商業', quota: 40, finalApplicants: 7, finalRate: 0.18 },
  ],
  officialSubtotals: [
    { label: '鹿児島学区計', quota: 36, finalApplicants: 31, finalRate: 0.86 },
    { label: '大島学区計', quota: 40, finalApplicants: 7, finalRate: 0.18 },
    { label: '定時制合計', quota: 76, finalApplicants: 38, finalRate: 0.5 },
  ],
};
