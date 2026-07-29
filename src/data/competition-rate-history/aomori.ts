/**
 * 青森県 多年度アーカイブ（Λ-4・15県目）。
 *
 * 一次ソース: 青森県教育委員会「令和7年度青森県立高等学校入学者選抜出願状況等（全日制の課程）」。
 * https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/R7senbatsu_syutsugan-zennitisei.pdf
 *
 * 既存Y-6 aomori.ts（令和8年度版）と同一URLパターン（RXsenbatsu_syutsugan-zennitisei.pdf）で
 * R7版に直接アクセスできた。末尾の「全日制の課程合計」行を直接転記: 入学者募集人員7,135
 * (括弧内7,060は三本木高校の内部進学者75人差引後の入学者選抜募集人員と同値)/入学者選抜
 * 募集人員7,060/学科別出願者数6,533/学科別倍率0.93（6533/7060=0.9252…≈0.93で整合）。
 * quotaはY-6と同じ列（入学者選抜募集人員）を採用。定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.aomori.lg.jp/soshiki/kyoiku/e-gakyo/files/R7senbatsu_syutsugan-zennitisei.pdf',
  sourceTitle: '青森県教育委員会 令和7年度青森県立高等学校入学者選抜出願状況等（全日制の課程）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程合計', quota: 7060, applicants: 6533, rate: 0.93 },
};

export const AOMORI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'aomori',
  years: [REIWA_7],
};
