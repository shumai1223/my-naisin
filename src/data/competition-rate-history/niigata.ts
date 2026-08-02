/**
 * 新潟県 多年度アーカイブ（Λ-4・28県目）。
 *
 * 一次ソース: 新潟県教育委員会「令和7年度新潟県公立高等学校入学者選抜一般選抜志願状況」
 * （2025年2月19日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/19/80880.html
 *
 * 既存Y-6 niigata.tsの一次ソースURLは年度非依存の常設パス（毎年上書きされる形式）のため、
 * 現在アクセスすると最新年度分に置き換わっており過去年度分の直接取得ができない。教委発表を
 * 報じたリセモム記事から「全日制課程は一般選抜の募集人数11,567人に対し、志願者数11,931人で、
 * 平均志願倍率は1.03倍」を直接引用（11931/11567=1.0315…≈1.03で整合。WebSearch要約とも
 * 独立一致）。Y-6と同じ「特色化選抜合格内定者数を除く一般選抜」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/19/80880.html',
  sourceTitle:
    'リセモム「新潟県公立高、一般選抜の志願状況」（新潟県教育委員会 令和7年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 11567, applicants: 11931, rate: 1.03 },
};

/**
 * 令和6年度（2024年度）: R7と同じスコープ（特色化選抜合格内定者数を除く一般選抜）のリセモム
 * 確定記事（2024年2月29日発表）をWebSearch要約（新潟日報の独立記事も一致）とWebFetch直接
 * 引用の2回で同一数値を確認して採用。全日制課程「一般選抜」全体: 募集人数12,168・志願者数
 * 12,551・平均志願倍率1.03（12551/12168=1.0315…≈1.03で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/29/76186.html',
  sourceTitle:
    'リセモム「新潟県公立高、一般選抜の志願状況（確定）」（新潟県教育委員会 令和6年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 12168, applicants: 12551, rate: 1.03 },
};

export const NIIGATA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'niigata',
  years: [REIWA_7, REIWA_6],
};
