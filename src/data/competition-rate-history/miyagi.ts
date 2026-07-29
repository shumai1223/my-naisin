/**
 * 宮城県 多年度アーカイブ（Λ-4・7県目）。
 *
 * 一次ソース: 宮城県教育庁高校教育課「令和7年度宮城県公立高等学校入学者選抜に係る
 * 第一次募集 出願状況について」（記者発表資料・2025年2月14日）
 * https://www.pref.miyagi.jp/documents/56099/r7_1st_soukatu_houdou.pdf
 *
 * 「２ 総括」の表に全日制課程の第一次募集（R7・R6）が並記されており、東京都の総括表と
 * 同型の「当年度＋前年度併記」形式（本資料はテキスト抽出が明瞭でビジョン解析の誤読リスクが低い）。
 * 令和8年度分は既存のcompetition-rates/miyagi.ts（学校粒度・68校129レコード・
 * grand total quota13,400/applicants12,516/倍率0.93）でカバー済みのため、本ファイルには
 * 令和7・令和6年度のみを収録する（tokyo/kanagawa/chiba/fukuoka/hyogo/kumamotoの各historyファイルと
 * 同じ設計方針）。定時制課程・連携型選抜・社会人特別選抜・全国募集選抜は既存Y-6と同じ理由で
 * スコープ外（全日制課程・第一次募集の通常枠のみ）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const SOURCE = {
  sourceUrl: 'https://www.pref.miyagi.jp/documents/56099/r7_1st_soukatu_houdou.pdf',
  sourceTitle: '宮城県教育庁高校教育課 令和7年度宮城県公立高等学校入学者選抜に係る第一次募集出願状況について（総括）',
  fetchedAt: '2026-07-29',
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  ...SOURCE,
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 13440, applicants: 13349, rate: 0.99 },
};

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  ...SOURCE,
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 13640, applicants: 13609, rate: 1.0 },
};

export const MIYAGI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'miyagi',
  years: [REIWA_7, REIWA_6],
};
