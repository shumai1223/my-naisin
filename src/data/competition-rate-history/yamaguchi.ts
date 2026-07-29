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

export const YAMAGUCHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'yamaguchi',
  years: [REIWA_7],
};
