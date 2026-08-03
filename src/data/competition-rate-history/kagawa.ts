/**
 * 香川県 多年度アーカイブ（Λ-4・21県目）。
 *
 * 一次ソース: 香川県教育委員会「令和7年度香川県公立高等学校 一般選抜 出願者数（全日制課程
 * 小学科・コース別）（一般選抜志願変更締切後）」（2025年2月26日公表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/26/80995.html
 *
 * 既存Y-6 kagawa.tsの一次ソースURL（documents/15096/syutugan8-3-2.pdf）はドキュメント管理IDが
 * 年度と機械的に対応しないため単純な置換が効かず、原本PDFの直接発見には至らなかった。教委発表を
 * 報じたリセモム記事から「入学定員から自己推薦選抜合格者などを除いた定員4,376人に対し出願者数が
 * 4,732人で、出願倍率は1.08倍」を直接引用。WebSearch要約でも同一の3数値が独立して繰り返し
 * 確認できたため採用（[[fable5-loop-protocol]]の「単一WebSearch要約のみに依存しない」原則を
 * 記事本文の直接引用で満たした）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/26/80995.html',
  sourceTitle:
    'リセモム「香川県公立高の出願状況（確定）」（香川県教育委員会 令和7年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4376, applicants: 4732, rate: 1.08 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム記事（2024年2月22日・志願変更締切後確定）を
 * WebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程全体「入学定員（自己
 * 推薦選抜合格者等除く）4,553人・出願者数5,056人・出願倍率1.11倍」を転記（5056/4553=1.1105…≈1.11
 * で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/22/76076.html',
  sourceTitle:
    'リセモム「香川県公立高の出願状況（確定）」（香川県教育委員会 令和6年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4553, applicants: 5056, rate: 1.11 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム記事（2023年2月22日・志願変更締切後
 * 確定）をWebFetchで直接引用。全日制課程全体「入学定員（自己推薦選抜合格者等除く）4,609人・
 * 出願者数5,299人・出願倍率1.15倍」を転記（5299/4609=1.1497…≈1.15で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/22/71059.html',
  sourceTitle:
    'リセモム「【高校受験2023】香川県公立高の出願状況（確定）高松（普通）1.14倍」（香川県教育委員会 令和5年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4609, applicants: 5299, rate: 1.15 },
};

export const KAGAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kagawa',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
