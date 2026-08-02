/**
 * 奈良県 多年度アーカイブ（Λ-4・27県目）。
 *
 * 一次ソース: 奈良県教育委員会「令和7年度奈良県公立高等学校入学者選抜（一般選抜）出願状況」
 * （2025年3月6日確定発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/03/06/81148.html
 *
 * ⚠️既存Y-6 nara.ts（令和8年度・一次選抜第一出願期間）とは選抜制度が異なる年度である点に注意:
 * 奈良県は令和8年度から特色選抜と一般選抜を一本化した「一次選抜」に移行しており、令和7年度は
 * 移行前の旧制度（特色選抜＋一般選抜の2段階）。本ファイルは旧制度の「一般選抜」（他県の一般選抜
 * 相当・特色選抜合格者は対象外）を採用した。全日制課程「一般選抜」を直接引用: 募集人員4,400・
 * 志願者数4,490・競争倍率1.02（4490/4400=1.0204…≈1.02で整合。WebSearch要約・記事本文の
 * 2件で独立確認）。原本PDF（documents/5981/配下・年度prefix置換は404）への直接アクセスには
 * 至らなかった。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/03/06/81148.html',
  sourceTitle:
    'リセモム「奈良県公立高、一般選抜の志願状況（確定）」（奈良県教育委員会 令和7年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・特色選抜合格者を除く）', quota: 4400, applicants: 4490, rate: 1.02 },
};

/**
 * 令和6年度（2024年度）: R7と同じ旧制度（特色選抜＋一般選抜の2段階）下でのリセモム確定記事
 * （2024年3月4日発表）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。
 * 全日制課程「一般選抜」全体: 募集人員4,440・志願者数4,702・競争倍率1.06（4702/4440=1.0590…
 * ≈1.06で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/03/04/76234.html',
  sourceTitle:
    'リセモム「奈良県公立高、一般選抜の志願状況（確定）」（奈良県教育委員会 令和6年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・特色選抜合格者を除く）', quota: 4440, applicants: 4702, rate: 1.06 },
};

export const NARA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'nara',
  years: [REIWA_7, REIWA_6],
};
