/**
 * 長野県 多年度アーカイブ（Λ-4・10県目）。
 *
 * 一次ソース: 長野県教育委員会「令和7年度長野県公立高等学校入学者後期選抜志願者数②
 * （志望変更受付締切後の集計結果）」（2025年3月5日公表・訂正版）
 * https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r7/documents/20250305web2.pdf
 *
 * 既存Y-6 nagano.tsと同一の資料シリーズ（後期選抜志願者数②・志望変更受付締切後・全日制課程）。
 * 本文冒頭の記述「全日制課程の志望変更受付締切後の最終的な志願者は8,250人で、...志望変更後の
 * 志願倍率は0.94倍」および別紙１の「計」行（募集人員8,806・志願者数8,250・倍率0.94）の
 * 両方で確認できる。定時制課程（多部制・単位制含む）は既存Y-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r7/documents/20250305web2.pdf',
  sourceTitle: '長野県教育委員会 令和7年度長野県公立高等学校入学者後期選抜志願者数②（志望変更受付締切後の集計結果）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 8806, applicants: 8250, rate: 0.94 },
};

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版（2024-02-29公表）を発見。
 * 別紙１【公立全日制課程】の「計」行を直接転記（募集人員9,945・志願数9,312・倍率0.94）。
 * 本文冒頭にも同じ9,312人・0.94倍の記述があり、資料内で二重に確認できる。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.nagano.lg.jp/kyoiku/koko/saiyo-nyuushi/shiken/ko/r6/documents/20240229press.pdf',
  sourceTitle: '長野県教育委員会 令和6年度長野県公立高等学校入学者後期選抜志願者数②（志望変更受付締切後の集計結果）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 9945, applicants: 9312, rate: 0.94 },
};

export const NAGANO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'nagano',
  years: [REIWA_7, REIWA_6],
};
