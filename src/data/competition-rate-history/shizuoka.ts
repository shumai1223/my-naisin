/**
 * 静岡県 多年度アーカイブ（Λ-4・45県目）。
 *
 * 一次ソース: 静岡県教育委員会「令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）」。
 * https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf
 *
 * Y-6のshizuoka.tsと同一資料のPDF9ページ目末尾「公立合計」行をそのまま転記（同一年度・
 * 現在年度分のみのためgranularity='grand-total-only'）。Y-6側で全日制90校162レコードの
 * 機械集計が公立合計（quota16,954・applicants16,895・倍率1.00）と完全一致することを
 * 確認済み（詳細はcompetition-rates/shizuoka.ts参照）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl:
    'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf',
  sourceTitle: '静岡県教育委員会 令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）',
  fetchedAt: '2026-07-25',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立合計', quota: 16954, applicants: 16895, rate: 1.0 },
};

export const SHIZUOKA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'shizuoka',
  years: [REIWA_8],
};
