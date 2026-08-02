/**
 * 徳島県 多年度アーカイブ（Λ-4・33県目）。
 *
 * 一次ソース: 徳島県教育委員会「令和7年度徳島県公立高等学校一般選抜出願状況（2月27日志願変更後）」
 * （2025年2月27日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/27/81036.html
 *
 * 既存Y-6 tokushima.tsのURL（file/975）はID型で年度と機械的に対応せず原本PDFの直接発見には
 * 至らなかった。教委発表を報じたリセモム記事から「全日制の課程は、一般選抜募集人員4,102人に対し
 * 4,062人が志願し、志願倍率は0.99倍」を直接引用（4062/4102=0.9902…≈0.99で整合。WebSearch
 * 要約とも独立一致）。Y-6と同じ「一般選抜（推薦選抜等を除く）」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/27/81036.html',
  sourceTitle:
    'リセモム「徳島県公立高入試の志願状況（確定）」（徳島県教育委員会 令和7年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4102, applicants: 4062, rate: 0.99 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年3月1日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制の課程「一般選抜」全体:
 * 一般選抜募集人員4,211・志願者数4,232・志願倍率1.00（4232/4211=1.0050…≈1.00で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/03/01/76203.html',
  sourceTitle:
    'リセモム「徳島県公立高入試の志願状況（確定）」（徳島県教育委員会 令和6年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4211, applicants: 4232, rate: 1.0 },
};

export const TOKUSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tokushima',
  years: [REIWA_7, REIWA_6],
};
