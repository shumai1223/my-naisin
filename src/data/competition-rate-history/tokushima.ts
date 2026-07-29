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

export const TOKUSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tokushima',
  years: [REIWA_7],
};
