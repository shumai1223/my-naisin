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
 * 令和6年度は同一シリーズの前年度ページ（m0045100399.htm）から追加。
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

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版ページ本文「52校119学科・コースで
 * 6,819人、志願者数は7,360人、志願倍率は1.08倍」を直接引用。WebSearchのスニペットと
 * WebFetch本文抽出の両方で同一数値を確認済み。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100399.htm',
  sourceTitle: '三重県教育委員会 令和6年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 52, quota: 6819, applicants: 7360, rate: 1.08 },
};

/**
 * 令和5年度（2023年度）: 同一資料シリーズの令和5年度版ページ本文「53校120学科・コース
 * 6,945人 7,373人 1.06倍」を直接引用（WebSearchのスニペットとWebFetch本文抽出の両方で
 * 同一数値を確認済み・7373/6945=1.0616…≈1.06で整合）。学校数が53校（R6/R7は52校）と
 * 1校差があるが、統廃合等による正当な変動として学校数はそのまま記録する。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100344.htm',
  sourceTitle: '三重県教育委員会 令和5年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 53, quota: 6945, applicants: 7373, rate: 1.06 },
};

export const MIE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'mie',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
