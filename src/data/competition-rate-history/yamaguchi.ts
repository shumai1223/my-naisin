/**
 * 山口県 多年度アーカイブ（Λ-4・38県目）。
 *
 * 一次ソース: 山口県教育委員会「令和7年度山口県公立高等学校入学者選抜 第1次募集志願者数
 * （確定・2025年2月21日発表）」を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/21/80932.html
 *
 * 既存Y-6 yamaguchi.tsが注記する通り、山口県は出願期間開始前の「志願状況調査」（予備意向調査）と
 * 出願締切後の「入学志願者数」（確定出願）の2種類が別々に公表される県であり、原本PDFへの直接
 * アクセスは今回至らなかったが、リセモム記事のタイトルに明記された「確定」の表記から締切後の
 * 確定出願データであることを確認した上で採用: 全日制課程第1次募集の定員(quota)=5,533・
 * 出願者数(applicants)=5,612・出願倍率(rate)=1.01（5612/5533=1.0143…≈1.01で整合。WebSearch
 * 要約とも独立一致）。Y-6と同じ「第一次募集の定員（特色選抜等合格内定者数を除く）」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/21/80932.html',
  sourceTitle:
    'リセモム「山口県公立高、第1次募集志願状況（確定）」（山口県教育委員会 令和7年度第1次募集入学志願者数の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程 第1次募集', quota: 5533, applicants: 5612, rate: 1.01 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年2月26日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程第1次募集全体: 定員5,584・
 * 出願者数5,811・確定出願倍率1.04（5811/5584=1.0407…≈1.04で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/26/76116.html',
  sourceTitle:
    'リセモム「山口県公立高、第1次募集志願状況（確定）」（山口県教育委員会 令和6年度第1次募集入学志願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程 第1次募集', quota: 5584, applicants: 5811, rate: 1.04 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム確定記事（2023年2月24日発表）を
 * WebFetchで直接引用。全日制課程第1次募集全体: 定員5,675・出願者数6,079・確定出願倍率1.07
 * （6079/5675=1.0712…≈1.07で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/24/71102.html',
  sourceTitle:
    'リセモム「【高校受験2023】山口県公立高、第1次募集志願状況（確定）徳山（理数）1.6倍」（山口県教育委員会 令和5年度第1次募集入学志願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程 第1次募集', quota: 5675, applicants: 6079, rate: 1.07 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのリセモム確定記事（2022年2月25日発表）を
 * WebFetchで直接引用。全日制課程第1次募集全体: 定員5,650・出願者数6,121・確定出願倍率1.08
 * （6121/5650=1.0834…≈1.08で整合。記事本文にも同数値が明記）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/25/65985.html',
  sourceTitle:
    'リセモム「【高校受験2022】山口県公立高、第1次募集志願状況（確定）徳山（理数）1.6倍」（山口県教育委員会 令和4年度第1次募集入学志願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程 第1次募集', quota: 5650, applicants: 6121, rate: 1.08 },
};

/**
 * 令和3年度（2021年度）: R4-R7と同一シリーズのリセモム確定記事（2021年3月2日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程第1次募集全体: 定員5,577・
 * 出願者数6,143・確定出願倍率1.10（6143/5577=1.1017…≈1.10で整合。記事本文にも同数値が明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/02/60730.html',
  sourceTitle:
    'リセモム「【高校受験2021】山口県公立高、第1次募集の出願状況（確定）徳山（理数）2.2倍」（山口県教育委員会 令和3年度第1次募集入学志願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程 第1次募集', quota: 5577, applicants: 6143, rate: 1.1 },
};

export const YAMAGUCHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'yamaguchi',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
