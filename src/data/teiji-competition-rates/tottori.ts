import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 鳥取県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 鳥取県教育委員会「令和8年度鳥取県立高等学校入学者選抜最終志願者数一覧」
 * （一般志願変更後 R08_0224・全8頁。既存の全日制`src/data/competition-rates/tottori.ts`と
 * 同一PDFの8頁目「（定時制課程）」）。
 *
 * ⚠️対象範囲=定時制課程4校5レコード。quota/finalApplicantsは「最終志願者（2/24締切）」列
 * （志願辞退者数B・新志願者数C・特例措置者数Dを反映した確定値A-B+C+D）と「実質募集定員」列を
 * 採用（他県の「最終応募人員」相当）。鳥取緑風は【午前】【午後】が実質募集定員を共有し
 * （個別の内訳は印字されず合算56のみ）、印字済み競争率も両者合算の志願者数で算出されている
 * ため1レコードに統合し、【夜間】のみ独立した実質募集定員があるため別レコードとした。
 *
 * 機械集計（quota205・applicants121・倍率0.59）は表末尾の印字済み「県計」205/121/0.59と
 * 完全一致した。ToUnicode欠落は無く`pdftoppm 180dpi`のビジョン解析1回で全レコードを判読できた。
 */

export const TOTTORI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'tottori',
  sources: [
    {
      url: 'https://www.pref.tottori.lg.jp/secure/1418417/R08_ippan_saisyuu_shigansya.pdf',
      docTitle: '鳥取県教育委員会 令和8年度鳥取県立高等学校入学者選抜最終志願者数一覧（一般志願変更後 R08_0224）（定時制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程'],
    pendingDepartments: [],
    note: '8頁目「（定時制課程）」の全5レコードを完全収録。',
  },
  records: [
    { schoolName: '鳥取緑風', department: '総合（午前・午後）', quota: 56, finalApplicants: 44, finalRate: 0.79 },
    { schoolName: '鳥取緑風', department: '総合（夜間）', quota: 19, finalApplicants: 3, finalRate: 0.16 },
    { schoolName: '倉吉東', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '米子東', department: '普通', quota: 30, finalApplicants: 8, finalRate: 0.27 },
    { schoolName: '米子白鳳', department: '総合（午前・午後）', quota: 60, finalApplicants: 57, finalRate: 0.95 },
  ],
  officialSubtotals: [{ label: '県計', quota: 205, finalApplicants: 121, finalRate: 0.59 }],
};
