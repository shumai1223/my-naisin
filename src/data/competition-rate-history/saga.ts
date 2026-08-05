/**
 * 佐賀県 多年度アーカイブ（Λ-4・31県目）。
 *
 * 一次ソース: 佐賀県教育委員会「令和7年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後）
 * をお知らせします」（令和7年2月26日公表・全3ページ）。
 * https://www.pref.saga.lg.jp/kyouiku/kiji003111936/3_111936_345623_up_nh8p0xkw.pdf
 *
 * 既存Y-6 saga.tsと同一資料シリーズ。教委の年度別記事ページ（kiji003111936）経由でR7版を発見
 * （記事IDは年度と機械的に対応せずURL置換は不発）。全日制「合計」行を直接転記: 一般選抜募集人員
 * (quota)=4,505・一般選抜志願者数（志願変更後・applicants）=4,596・志願倍率(rate)=1.02
 * （4596/4505=1.0202…≈1.02で整合・Y-6と同じ列定義）。定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/saga.tsが確定済みのofficialSubtotals「全日制計」行をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.saga.lg.jp/kyouiku/kiji003118261/3_118261_381978_up_jpwwphq6.pdf',
  sourceTitle: '佐賀県教育委員会 令和8年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後・訂正版）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 4212, applicants: 4191, rate: 1 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.saga.lg.jp/kyouiku/kiji003111936/3_111936_345623_up_nh8p0xkw.pdf',
  sourceTitle: '佐賀県教育委員会 令和7年度佐賀県立高等学校入学者選抜一般選抜志願状況（志願変更後）をお知らせします',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 4505, applicants: 4596, rate: 1.02 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年2月28日発表・志願変更後）を
 * WebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程の一般選抜: 募集人員
 * 4,667・出願者数4,880・出願倍率1.05（4880/4667=1.0456…≈1.05で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/28/76164.html',
  sourceTitle: 'リセモム「佐賀県立高、一般選抜の出願状況（確定）」（佐賀県教育委員会 令和6年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 4667, applicants: 4880, rate: 1.05 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム確定記事（2023年3月1日発表・志願変更後）
 * をWebFetchで直接引用。全日制課程の一般選抜: 募集人員4,744・出願者数4,899・出願倍率1.03
 * （4899/4744=1.0327…≈1.03で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/03/01/71178.html',
  sourceTitle: 'リセモム「【高校受験2023】佐賀県立高、一般選抜の出願状況（確定）佐賀西1.15倍」（佐賀県教育委員会 令和5年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 4744, applicants: 4899, rate: 1.03 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのリセモム確定記事（2022年3月2日発表・
 * 志願変更後）をWebFetchで直接引用。全日制課程の一般選抜: 募集人員4,742・出願者数4,919・
 * 出願倍率1.04（4919/4742=1.0373…≈1.04で整合。記事本文にも「前年度と同じ1.04倍」と明記）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/03/02/66051.html',
  sourceTitle: 'リセモム「【高校受験2022】佐賀県立高、一般選抜の出願状況（確定）佐賀西1.17倍」（佐賀県教育委員会 令和4年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 4742, applicants: 4919, rate: 1.04 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4/R5/R6/R7と同一シリーズのリセモム確定記事
 * （2021年2月25日発表）をWebFetchで直接引用。全日制課程の一般選抜: 募集人員4,711・
 * 出願者数4,905・出願倍率1.04（4905/4711=1.0412…≈1.04で整合。記事本文にも「前年度より
 * 0.01ポイント増の1.04倍」と明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/02/26/60680.html',
  sourceTitle: 'リセモム「【高校受験2021】佐賀県立高、一般選抜の出願状況（確定）佐賀西1.35倍」（佐賀県教育委員会 令和3年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 4711, applicants: 4905, rate: 1.04 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3〜R7と同一シリーズのリセモム確定記事（2020年2月27日
 * 発表・志願変更後）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制
 * 課程の一般選抜: 募集人員4,987・出願者数5,149・出願倍率1.03（5149/4987=1.0325…≈1.03で整合。
 * 記事本文にも同数値が明記）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/28/55032.html',
  sourceTitle: 'リセモム「【高校受験2020】佐賀県立高の出願状況（確定）佐賀西1.14倍」（佐賀県教育委員会 令和2年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 4987, applicants: 5149, rate: 1.03 },
};

export const SAGA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'saga',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
