import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 大分県 定時制課程（T-Y11F §5順序#4・S1-3 C分類→実機確認でA相当に格上げ）。
 *
 * 一次ソース: 大分県教育委員会「令和8年度大分県立高等学校第一次入学者選抜第一志願最終志願状況」
 * （既存の全日制`src/data/competition-rates/oita.ts`と同一PDF・全4頁の4頁目下段「［定時制］」）。
 * https://www.pref.oita.jp/uploaded/attachment/2261572.pdf
 *
 * ⚠️S1-3台帳ではC分類（定型文のみで所在不明）だったが、`pdftotext -layout`では4頁目の
 * ［定時制］表の数値列は抽出できたものの学校名・学科名の日本語ラベルが欠落していたため
 * （fukushima・iwate・miyazaki・naraと同型のpdftotext日本語ラベル欠落パターン）、
 * `pdftoppm 200dpi`のビジョン解析で確認した。4校9レコードの完全な学校別内訳
 * （中津東[機械/商業]・大分工業[機械/電気]・爽風館[普通Ⅰ部/Ⅱ部/Ⅲ部・商業Ⅲ部]・日田[普通]）。
 *
 * quotaは全日制と同じ規律で「募集人員」列を採用（「入学定員」列は概数の募集枠であり実際の
 * 選抜対象人数ではないため）。finalApplicantsは「最終志願者数」列。倍率は資料に印字が無いため
 * 全日制と同じ規律で自前算出（finalRate=finalApplicants/quota、小数第2位四捨五入）。
 *
 * 機械集計（quota344・applicants65、4校9レコード）が「県立高校定時制課程合計」募集人員344・
 * 最終志願者数65と完全一致した（初回転記で一致・再修正なし）。中津東・大分工業・爽風館の
 * 学校別「計」小計も原資料に印字されており、機械集計との完全一致を確認済み。
 */

export const OITA_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'oita',
  sources: [
    {
      url: 'https://www.pref.oita.jp/uploaded/attachment/2261572.pdf',
      docTitle: '大分県教育委員会 令和8年度大分県立高等学校第一次入学者選抜第一志願最終志願状況（定時制）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-09',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程（4校9レコード）'],
    pendingDepartments: [],
    note: '4頁目「［定時制］」の全9レコード（4校）を完全収録。「県立高校定時制課程合計」募集人員344・最終志願者数65と完全一致。',
  },
  records: [
    { schoolName: '中津東', department: '機械', quota: 40, finalApplicants: 3, finalRate: 0.08 },
    { schoolName: '中津東', department: '商業', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '大分工業', department: '機械', quota: 40, finalApplicants: 6, finalRate: 0.15 },
    { schoolName: '大分工業', department: '電気', quota: 40, finalApplicants: 2, finalRate: 0.05 },
    { schoolName: '爽風館', department: '普通（Ⅰ部）', quota: 43, finalApplicants: 16, finalRate: 0.37 },
    { schoolName: '爽風館', department: '普通（Ⅱ部）', quota: 32, finalApplicants: 9, finalRate: 0.28 },
    { schoolName: '爽風館', department: '普通（Ⅲ部）', quota: 35, finalApplicants: 1, finalRate: 0.03 },
    { schoolName: '爽風館', department: '商業（Ⅲ部）', quota: 36, finalApplicants: 0, finalRate: 0 },
    { schoolName: '日田', department: '普通', quota: 38, finalApplicants: 26, finalRate: 0.68 },
  ],
  officialSubtotals: [
    { label: '中津東計', schoolCount: 1, quota: 80, finalApplicants: 5, finalRate: 0.06 },
    { label: '大分工業計', schoolCount: 1, quota: 80, finalApplicants: 8, finalRate: 0.1 },
    { label: '爽風館計', schoolCount: 1, quota: 146, finalApplicants: 26, finalRate: 0.18 },
    { label: '合計', schoolCount: 4, quota: 344, finalApplicants: 65, finalRate: 0.19 },
  ],
};
