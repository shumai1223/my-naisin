import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 静岡県 定時制・単位制による定時制（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 静岡県教育委員会「令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）」
 * （既存の全日制`src/data/competition-rates/shizuoka.ts`と同一資料の11〜12頁目。全12頁のうち
 * 11頁目「定時制」・12頁目「令和8年度静岡県公立高等学校入学者選抜（春季選抜）志願者数一覧
 * （変更後）単位制による定時制」）。
 *
 * ⚠️対象範囲=11頁目【定時制】15校15レコード（三島長陵・静岡中央・ふじのくに国際・浜松大平台の
 * 4校は単位制のため別表）と、12頁目【単位制による定時制】4校4レコード（各校とも学校裁量枠の
 * 選抜段階別内訳が付随するが、内数のため先頭行の学校全体値のみをレコード化した）の計19校
 * 19レコード。
 *
 * 機械集計は2ブロックそれぞれの印字済み「合計」と完全一致した:
 * ①「定時制」計600／314／0.52 ②「単位制による定時制」計593／429／0.72。
 * ToUnicode欠落は無く`pdftoppm 170dpi`のビジョン解析で2頁とも極めて明瞭に判読できた。
 */

export const SHIZUOKA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'shizuoka',
  sources: [
    {
      url: 'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf',
      docTitle: '静岡県教育委員会 令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）【定時制】【単位制による定時制】',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制', '単位制による定時制'],
    pendingDepartments: [],
    note: '11頁目【定時制】と12頁目【単位制による定時制】の全19レコードを完全収録。',
  },
  records: [
    // ===== 定時制 =====
    { schoolName: '下田', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '伊豆伊東', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '小山', department: '普通', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '沼津工業', department: '工業技術', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '富士', department: '普通', quota: 40, finalApplicants: 22, finalRate: 0.55 },
    { schoolName: '富士宮東', department: '普通', quota: 40, finalApplicants: 29, finalRate: 0.73 },
    { schoolName: '清水東', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '静岡', department: '普通', quota: 40, finalApplicants: 9, finalRate: 0.23 },
    { schoolName: '科学技術', department: '工業技術', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '榛原', department: '普通', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '磐田南', department: '普通', quota: 40, finalApplicants: 62, finalRate: 1.55 },
    { schoolName: '浜松北', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '浜松工業', department: '工業技術', quota: 40, finalApplicants: 18, finalRate: 0.45 },
    { schoolName: '浜名', department: '普通', quota: 40, finalApplicants: 46, finalRate: 1.15 },
    { schoolName: '新居', department: '普通', quota: 40, finalApplicants: 30, finalRate: 0.75 },

    // ===== 単位制による定時制 =====
    { schoolName: '三島長陵', department: '普通', quota: 140, finalApplicants: 99, finalRate: 0.71 },
    { schoolName: '静岡中央', department: '普通', quota: 180, finalApplicants: 139, finalRate: 0.77 },
    { schoolName: 'ふじのくに国際', department: '普通', quota: 128, finalApplicants: 78, finalRate: 0.61 },
    { schoolName: '浜松大平台', department: '普通', quota: 145, finalApplicants: 113, finalRate: 0.78 },
  ],
  officialSubtotals: [
    { label: '定時制 合計', quota: 600, finalApplicants: 314, finalRate: 0.52 },
    { label: '単位制による定時制 合計', quota: 593, finalApplicants: 429, finalRate: 0.72 },
  ],
};
