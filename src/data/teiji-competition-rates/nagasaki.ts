import type { PrefectureCompetitionRateFile } from '@/lib/competition-rate';

/**
 * 長崎県 定時制/夜間部（T-P1 P1-3・S1-3 A分類）。
 *
 * 一次ソース: 長崎県教育委員会「令和8年度公立高等学校入学者選抜 Ⅰ期選抜志願状況
 * （定時制/夜間部）」（既存の全日制`src/data/competition-rates/nagasaki.ts`と同一PDF
 * `1770615354.pdf`・全10頁のうち8頁目。1頁目は県全体の集計サマリーのみで学校別データが
 * 無いため、学校別データはこの8頁目の別表を使う）。
 *
 * ⚠️★重要な留保: このページの数値は**「Ⅰ期選抜」という特定の選抜区分のみ**の集計であり、
 * 本選抜（最終確定）の全体像ではない（タイトルに明記）。他県の「最終応募人員/最終出願者数」
 * とは前提が異なる点に注意（S1-4実装時・多年度比較時は必ずこの制約を踏まえること）。
 *
 * ⚠️対象範囲=8校12レコード（鳴滝定夜[普通/商業]・佐世保中央定夜[普通/普通エンカレッジ
 * コース/商業エンカレッジコース]・島原定・諫早定・大村定・五島定・長崎工業定[建築/工業技術]・
 * 佐世保工業定[工業技術]）。
 *
 * ⚠️quota/finalApplicants/finalRateの定義: 募集定員/Ⅰ期定員/Ⅰ期志願者数/本年度志願倍率/
 * 前年度志願倍率の5列のうちquota=Ⅰ期定員（募集定員でなくこちら。印字済み倍率と整合するのは
 * Ⅰ期定員のため）、finalApplicants=Ⅰ期志願者数、finalRate=印字済み「本年度志願倍率」を
 * そのまま転記した（前年度列は比較用のため不採用）。
 *
 * 機械集計（quota336・applicants133）は表末尾の印字済み「県立計」336／133／0.40と完全一致した。
 * ToUnicode欠落でpdftotext不可・`pdftoppm 150dpi`のビジョン解析1回で全12レコードを判読できた。
 */

export const NAGASAKI_TEIJI_COMPETITION_RATES: PrefectureCompetitionRateFile = {
  prefectureCode: 'nagasaki',
  sources: [
    {
      url: 'https://www.pref.nagasaki.jp/uploads/2026/02/1770615354.pdf',
      docTitle: '長崎県教育委員会 令和8年度公立高等学校入学者選抜 Ⅰ期選抜志願状況（定時制/夜間部）',
      fiscalYear: '令和8年度（2026年度）',
      fetchedAt: '2026-09-06',
    },
  ],
  coverage: {
    status: 'complete',
    includedDepartments: ['定時制/夜間部（Ⅰ期選抜のみ・本選抜全体ではない点に留意）'],
    pendingDepartments: [],
    note: '8頁目「Ⅰ期選抜志願状況（定時制/夜間部）」の全12レコードを完全収録。数値はⅠ期選抜のみで本選抜全体の集計ではない点に注意。',
  },
  records: [
    { schoolName: '鳴滝定夜', department: '普通', quota: 28, finalApplicants: 5, finalRate: 0.2 },
    { schoolName: '鳴滝定夜', department: '商業', quota: 28, finalApplicants: 3, finalRate: 0.1 },
    { schoolName: '佐世保中央定夜', department: '普通', quota: 28, finalApplicants: 21, finalRate: 0.8 },
    { schoolName: '佐世保中央定夜', department: '普通エンカレッジコース', quota: 28, finalApplicants: 31, finalRate: 1.1 },
    { schoolName: '佐世保中央定夜', department: '商業エンカレッジコース', quota: 28, finalApplicants: 13, finalRate: 0.5 },
    { schoolName: '島原定', department: '普通', quota: 28, finalApplicants: 4, finalRate: 0.1 },
    { schoolName: '諫早定', department: '普通', quota: 28, finalApplicants: 5, finalRate: 0.2 },
    { schoolName: '大村定', department: '普通', quota: 28, finalApplicants: 9, finalRate: 0.3 },
    { schoolName: '五島定', department: '普通', quota: 28, finalApplicants: 7, finalRate: 0.3 },
    { schoolName: '長崎工業定', department: '建築', quota: 28, finalApplicants: 9, finalRate: 0.3 },
    { schoolName: '長崎工業定', department: '工業技術', quota: 28, finalApplicants: 11, finalRate: 0.4 },
    { schoolName: '佐世保工業定', department: '工業技術', quota: 28, finalApplicants: 15, finalRate: 0.5 },
  ],
  officialSubtotals: [{ label: '県立計', quota: 336, finalApplicants: 133, finalRate: 0.4 }],
};
