/**
 * 熊本県 多年度アーカイブ（Λ-4・6県目）。
 *
 * 一次ソース: 熊本県教育委員会「令和7年度（2025年度）熊本県公立高等学校入学者選抜における
 * 後期（一般）選抜出願者数」（2025年2月17日公表）。
 * https://www.pref.kumamoto.jp/uploaded/life/226687_640196_misc.pdf
 *
 * 既存Y-6 kumamoto.ts（令和8年度・学校粒度52校162レコード）と同一の資料シリーズ（後期＝一般選抜・
 * 全日制課程）。R7ネイティブ文書の「計」行（募集人員8,258・出願者数7,585・倍率0.92）を直接
 * 転記した（ビジョン解析だが表全体が明瞭に読み取れており、令和8年度版に埋め込まれた前年度
 * 比較列の倍率0.92とも完全一致することを確認済み・二重検証済み）。定時制課程は既存Y-6と同じ
 * 理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/226687_640196_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和7年度（2025年度）熊本県公立高等学校入学者選抜における後期（一般）選抜出願者数',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8258, applicants: 7585, rate: 0.92 },
};

export const KUMAMOTO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kumamoto',
  years: [REIWA_7],
};
