import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 奈良県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 奈良県教育委員会「令和8年度奈良県公立高等学校入学者一次選抜等出願状況（第二出願
 * 期間）」＜2　一次選抜・成人特別選抜［定時制課程］＞（既存の全日制`src/data/competition-rates/
 * nara.ts`と同一PDF・全2頁の2頁目下段）。
 * https://www.pref.nara.lg.jp/documents/5981/r8_itijisennbatu_dainisyutugannkikann_syutugannsyasuu.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、既存の全日制収集元と全く同一のPDFの
 * 2頁目に「2　一次選抜・成人特別選抜［定時制課程］」セクションが独立して存在した（fukushima・
 * iwate・miyazakiと同型の見落としパターン）。4校5レコード（奈良商工[工業・商業（くくり）]・
 * 大和中央[普通Ⅰ部/普通Ⅱ部]・畝傍・西吉野農業）の完全な学校別内訳。
 *
 * ⚠️奈良商工の「商業」学科は「工業」学科と同一行にまたがる罫線で表示され独立した募集人員/
 * 出願者数を持たない（全日制`nara.ts`の会計・情報ビジネス等くくり募集と同型）ため、
 * 「工業・商業」の単一レコードとして収録した。
 *
 * quotaは「募集人員」列、finalApplicantsは全日制と同じ規律で「第一出願期間」出願者数のみを
 * 採用（「第二出願期間」は未充足学科への第2希望受付という別プロセスのため除外）。倍率は
 * 資料に印字が無いため全日制と同じ規律で自前算出（finalRate=finalApplicants/quota、小数第2位
 * 四捨五入）。「成人特別選抜（内数）」列は出願者数に既に含まれる内数のため二重計上しない。
 *
 * 機械集計（quota246・applicants111、4校5レコード）が「合計」246/111と完全一致した（初回転記で
 * 一致・再修正なし）。pdftoppm 150〜300dpiのビジョン解析1回で全5レコードを判読した。
 */

export const NARA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'nara',
  sources: [
    {
      url: 'https://www.pref.nara.lg.jp/documents/5981/r8_itijisennbatu_dainisyutugannkikann_syutugannsyasuu.pdf',
      docTitle: '奈良県教育委員会 令和8年度奈良県公立高等学校入学者一次選抜等出願状況（第二出願期間・定時制課程）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程（一次選抜・第一出願期間）'],
    pendingDepartments: [],
    note: '「2　一次選抜・成人特別選抜［定時制課程］」セクションの全5レコード（4校）を完全収録。',
  },
  records: [
    { schoolName: '奈良商工', department: '工業・商業', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '大和中央', department: '普通（Ⅰ部）', quota: 75, finalApplicants: 38, finalRate: 0.51 },
    { schoolName: '大和中央', department: '普通（Ⅱ部）', quota: 75, finalApplicants: 43, finalRate: 0.57 },
    { schoolName: '畝傍', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '西吉野農業', department: '農業', quota: 16, finalApplicants: 5, finalRate: 0.31 },
  ],
  officialSubtotals: [
    { label: '県立計', schoolCount: 3, quota: 230, finalApplicants: 106, finalRate: 0.46 },
    { label: '市立計', schoolCount: 1, quota: 16, finalApplicants: 5, finalRate: 0.31 },
    { label: '合計', schoolCount: 4, quota: 246, finalApplicants: 111, finalRate: 0.45 },
  ],
};
