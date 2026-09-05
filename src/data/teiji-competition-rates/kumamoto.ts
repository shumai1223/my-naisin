import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 熊本県 定時制課程（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 熊本県教育委員会「令和8年度熊本県公立高等学校入学者選抜 後期（一般）選抜
 * 出願確定状況」（既存の全日制`src/data/competition-rates/kumamoto.ts`と同一PDF
 * `259416_786982_misc.pdf`・全5頁のうち5頁目「＜定時制課程＞」）。
 *
 * ⚠️対象範囲=定時制課程8校12レコード（湧心館・熊本工業は学校名単独の行が普通/情報科学等・
 * 機械/電気/建築の内訳合計になっているため、学校単独行は不採用とし学科・コース別の内訳行
 * のみを実際のレコードとして収録した。他6校は単一学科のため学校名行がそのままレコード）。
 *
 * ⚠️定時制課程には前期（特色）選抜が無い（同欄は全行「−」）ため、quota=後期（一般）選抜の
 * 募集人員、finalApplicants=出願確定者数（当初の出願者数に出願変更による増減を反映した
 * 最終値）、finalRate=印字済み「変更後倍率（8年度）」をそのまま転記した（7年度列は前年度
 * 比較用のため不採用）。
 *
 * 機械集計（quota440・applicants136）は表末尾の印字済み「計」440／136／136／3／0.31／0.28と
 * 完全一致した。ToUnicode欠落でpdftotext不可・`pdftoppm 180dpi`のビジョン解析1回で
 * 全14行（学校集計行2件を除く実質12レコード）を判読できた。
 */

export const KUMAMOTO_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'kumamoto',
  sources: [
    {
      url: 'https://www.pref.kumamoto.jp/uploaded/life/259416_786982_misc.pdf',
      docTitle: '熊本県教育委員会 令和8年度熊本県公立高等学校入学者選抜 後期（一般）選抜出願確定状況 ＜定時制課程＞',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-05',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制課程'],
    pendingDepartments: [],
    note: '5頁目「＜定時制課程＞」の全12レコード（学校単独の内訳合計行2件を除く）を完全収録。',
  },
  records: [
    { schoolName: '湧心館', department: '普通', quota: 40, finalApplicants: 23, finalRate: 0.58 },
    { schoolName: '湧心館', department: '情報科学（情報処理コース）', quota: 30, finalApplicants: 5, finalRate: 0.17 },
    { schoolName: '湧心館', department: '情報科学（科学技術コース）', quota: 10, finalApplicants: 2, finalRate: 0.2 },
    { schoolName: '熊本工業', department: '機械', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '熊本工業', department: '電気', quota: 40, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '熊本工業', department: '建築', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '岱志', department: '普通', quota: 40, finalApplicants: 12, finalRate: 0.3 },
    { schoolName: '玉名', department: '普通', quota: 40, finalApplicants: 15, finalRate: 0.38 },
    { schoolName: '八代工業', department: '総合学科', quota: 40, finalApplicants: 17, finalRate: 0.43 },
    { schoolName: '人吉', department: '普通', quota: 40, finalApplicants: 11, finalRate: 0.28 },
    { schoolName: '水俣', department: '商業', quota: 40, finalApplicants: 13, finalRate: 0.33 },
    { schoolName: '天草', department: '普通', quota: 40, finalApplicants: 10, finalRate: 0.25 },
  ],
  officialSubtotals: [{ label: '計', quota: 440, finalApplicants: 136, finalRate: 0.31 }],
};
