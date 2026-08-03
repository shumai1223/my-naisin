/**
 * 滋賀県 多年度アーカイブ（Λ-4・32県目）。
 *
 * 一次ソース: 滋賀県教育委員会「令和7年度滋賀県立高等学校入学者選抜 一般選抜（一次募集相当）
 * 確定出願状況」（2025年3月3日確定発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/03/03/81057.html
 *
 * ⚠️既存Y-6 shiga.ts（令和8年度・学校独自型選抜+一般型選抜の二本立て）とは選抜制度が異なる年度
 * である点に注意: 滋賀県は令和8年度から入学者選抜を一本化する制度改正があり（2月・3月の2回実施
 * →「学校独自型選抜」「一般型選抜」の2通りに再編）、令和7年度は改正前の旧制度（推薦選抜・特色選抜・
 * スポーツ文化芸術推薦選抜＋一般選抜）。本ファイルは旧制度の「一般選抜」（他県の一般選抜相当・
 * 各種推薦/特色選抜の合格者は対象外）を採用した。全日制課程を直接引用: 学力検査定員(quota)=6,253・
 * 確定出願者数(applicants)=6,563・出願倍率(rate)=1.05（6563/6253=1.0496…≈1.05で整合。
 * WebSearch要約・記事本文の2件で独立確認）。原本PDF（19頁の「結果のまとめ」はこの環境の
 * poppler未導入によりページ指定読み取り不可のため未到達）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/03/03/81057.html',
  sourceTitle:
    'リセモム「滋賀県公立高、一般選抜の出願状況（確定）」（滋賀県教育委員会 令和7年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6253, applicants: 6563, rate: 1.05 },
};

/**
 * 令和6年度（2024年度）: R7と同じ旧制度下でのリセモム確定記事（2024年3月1日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程「一般選抜」全体: 学力検査
 * 定員6,369・確定出願者数6,727・出願倍率1.06（6727/6369=1.0562…≈1.06で整合。記事は「前年度と
 * 同じ1.06倍」とも明記）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/03/01/76207.html',
  sourceTitle:
    'リセモム「滋賀県公立高、一般選抜の出願状況（確定）」（滋賀県教育委員会 令和6年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6369, applicants: 6727, rate: 1.06 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同じ旧制度下でのリセモム確定記事（2023年3月6日発表）を
 * WebFetchで直接引用。全日制課程「一般選抜」全体（44校66科）: 学力検査定員6,286・確定
 * 出願者数6,689・出願倍率1.06（6689/6286=1.0641…≈1.06で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/03/06/71248.html',
  sourceTitle:
    'リセモム「【高校受験2023】滋賀県公立高、一般選抜の出願状況（確定）膳所1.61倍」（滋賀県教育委員会 令和5年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6286, applicants: 6689, rate: 1.06 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同じ旧制度下でのリセモム確定記事（2022年3月7日発表）を
 * WebFetchで直接引用。全日制課程「一般選抜」全体: 学力検査定員6,308・出願者数6,912・
 * 出願倍率1.09（6912/6308=1.0958…≈1.09で整合。記事本文にも同数値が明記）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/03/07/66110.html',
  sourceTitle:
    'リセモム「【高校受験2022】滋賀県立高、一般選抜の出願状況（確定）膳所1.56倍」（滋賀県教育委員会 令和4年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6308, applicants: 6912, rate: 1.09 },
};

export const SHIGA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'shiga',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
