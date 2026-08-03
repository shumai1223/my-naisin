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

/**
 * 令和5年度（2023年度）: R6/R7と同じ旧制度（特色選抜＋一般選抜の2段階）下でのリセモム確定
 * 記事（2023年3月7日発表）をWebFetchで直接引用。全日制課程「一般選抜」全体: 募集人員4,432・
 * 志願者数5,062・競争倍率1.14（5062/4432=1.1422…≈1.14で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/03/07/71272.html',
  sourceTitle:
    'リセモム「【高校受験2023】奈良県公立高、一般選抜の志願状況（確定）奈良1.11倍」（奈良県教育委員会 令和5年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・特色選抜合格者を除く）', quota: 4432, applicants: 5062, rate: 1.14 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同じ旧制度（特色選抜＋一般選抜の2段階）下でのリセモム確定
 * 記事（2022年3月4日発表）をWebFetchで直接引用。全日制課程「一般選抜」全体: 募集人員4,956・
 * 志願者数4,916・競争倍率0.99（4916/4956=0.9919…≈0.99で整合）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/03/04/66095.html',
  sourceTitle:
    'リセモム「【高校受験2022】奈良県公立高、一般選抜の志願状況（確定）奈良1.17倍」（奈良県教育委員会 令和4年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・特色選抜合格者を除く）', quota: 4956, applicants: 4916, rate: 0.99 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4/R5/R6/R7と同じ旧制度（特色選抜＋一般選抜の2段階）
 * 下でのリセモム確定記事（2021年3月5日発表）をWebFetchで直接引用。全日制課程「一般選抜」
 * 全体: 募集人員4,934・出願者数4,740・競争倍率0.96（4740/4934=0.9607…≈0.96で整合。記事本文
 * にも同数値が明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/08/60833.html',
  sourceTitle:
    'リセモム「【高校受験2021】奈良県公立高、一般選抜の志願状況（確定）奈良1.29倍」（奈良県教育委員会 令和3年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・特色選抜合格者を除く）', quota: 4934, applicants: 4740, rate: 0.96 },
};

export const NARA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'nara',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
