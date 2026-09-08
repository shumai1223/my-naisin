import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 宮崎県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 宮崎県教育委員会「一般入学者選抜『最終』志願状況」（既存の全日制
 * `src/data/competition-rates/miyazaki.ts`と同一PDF・全3頁の3頁目下段「2　定時制課程」）。
 * https://www.pref.miyazaki.lg.jp/documents/99874/99874_20260224160129-1.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と全く同一のPDFの
 * 3頁目に、1頁目「1　全日制課程」の「全日制合計」行に続く形で独立した「2　定時制課程」
 * セクションが存在した（pdftotextでは日本語ラベルが全欠落するため過去のC分類判定grepが
 * 検知できなかった＝fukushima/iwateと同型の「見落としパターン」）。5校10レコード（延岡青朋
 * [普通/商業]・富島[商業]・宮崎工業[機械/電気/建築]・都城泉ヶ丘[普通/商業]・宮崎東[普通(昼間の
 * 部)/普通(夜間の部)]）の完全な学校別内訳。
 *
 * quotaは「一般入学　募集人員」列（定員から推薦入学内定者数を控除した実質枠・全日制と同じ
 * 規律）、finalApplicantsは「一般入学者選抜『最終』志願状況　志願者数」列、finalRateは同
 * 「倍率」列（印字済み値をそのまま採用）。機械集計（quota389・applicants122、5校10レコード）が
 * 「定時制合計」389/122/0.31と完全一致した（初回転記で一致・再修正なし）。pdftoppm 150dpiの
 * ビジョン解析1回で全10レコードを判読した。
 */

export const MIYAZAKI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'miyazaki',
  sources: [
    {
      url: 'https://www.pref.miyazaki.lg.jp/documents/99874/99874_20260224160129-1.pdf',
      docTitle: '宮崎県教育委員会 一般入学者選抜「最終」志願状況（定時制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程（一般入学）'],
    pendingDepartments: [],
    note: '「2　定時制課程」セクションの全10レコード（6校）を完全収録。',
  },
  records: [
    { schoolName: '延岡青朋', department: '普通', quota: 37, finalApplicants: 18, finalRate: 0.49 },
    { schoolName: '延岡青朋', department: '商業', quota: 35, finalApplicants: 10, finalRate: 0.29 },
    { schoolName: '富島', department: '商業', quota: 30, finalApplicants: 11, finalRate: 0.37 },
    { schoolName: '宮崎工業', department: '機械', quota: 35, finalApplicants: 4, finalRate: 0.11 },
    { schoolName: '宮崎工業', department: '電気', quota: 38, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '宮崎工業', department: '建築', quota: 39, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '都城泉ヶ丘', department: '普通', quota: 38, finalApplicants: 11, finalRate: 0.29 },
    { schoolName: '都城泉ヶ丘', department: '商業', quota: 38, finalApplicants: 6, finalRate: 0.16 },
    { schoolName: '宮崎東', department: '普通（昼間の部）', quota: 61, finalApplicants: 51, finalRate: 0.84 },
    { schoolName: '宮崎東', department: '普通（夜間の部）', quota: 38, finalApplicants: 6, finalRate: 0.16 },
  ],
  officialSubtotals: [{ label: '定時制合計', schoolCount: 5, quota: 389, finalApplicants: 122, finalRate: 0.31 }],
};
