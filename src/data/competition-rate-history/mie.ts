/**
 * 三重県 多年度アーカイブ（Λ-4・12県目）。
 *
 * 一次ソース: 三重県教育委員会「令和7年度三重県立高等学校後期選抜志願状況（最終）を
 * 取りまとめました」（2025年公表）
 * https://www.pref.mie.lg.jp/TOPICS/m0045100440.htm
 *
 * 既存Y-6 mie.tsと同一の資料シリーズ（後期選抜志願状況・最終）。ページ本文の記述
 * 「52校118学科・コース　6,589人　7,230人　1.10倍」を直接引用。学校数52校は
 * 既存Y-6のofficialSubtotals（全日制総計・schoolCount52）と完全一致しており、
 * 同一スコープであることを確認済み。定時制・通信制課程は既存Y-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100440.htm',
  sourceTitle: '三重県教育委員会 令和7年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 52, quota: 6589, applicants: 7230, rate: 1.1 },
};

export const MIE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'mie',
  years: [REIWA_7],
};
