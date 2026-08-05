/**
 * 徳島県 多年度アーカイブ（Λ-4・33県目）。
 *
 * 一次ソース: 徳島県教育委員会「令和7年度徳島県公立高等学校一般選抜出願状況（2月27日志願変更後）」
 * （2025年2月27日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/27/81036.html
 *
 * 既存Y-6 tokushima.tsのURL（file/975）はID型で年度と機械的に対応せず原本PDFの直接発見には
 * 至らなかった。教委発表を報じたリセモム記事から「全日制の課程は、一般選抜募集人員4,102人に対し
 * 4,062人が志願し、志願倍率は0.99倍」を直接引用（4062/4102=0.9902…≈0.99で整合。WebSearch
 * 要約とも独立一致）。Y-6と同じ「一般選抜（推薦選抜等を除く）」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/tokushima.tsが一次ソースPDF(file/975・
 * 令和8年度徳島県公立高等学校一般選抜出願状況)から確定済みのofficialSubtotals「全日制計」行
 * (募集人員4,165・出願者数4,160・倍率1.0)をそのまま転記（新規リサーチ不要・R7の二次情報源
 * =リセモムより信頼度の高い一次PDFが直接使える・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://nyuushi.tokushima-ec.ed.jp/file/975',
  sourceTitle: '徳島県教育委員会 令和8年度徳島県公立高等学校一般選抜出願状況（2月26日志願変更後）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4165, applicants: 4160, rate: 1.0 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/27/81036.html',
  sourceTitle:
    'リセモム「徳島県公立高入試の志願状況（確定）」（徳島県教育委員会 令和7年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4102, applicants: 4062, rate: 0.99 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年3月1日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制の課程「一般選抜」全体:
 * 一般選抜募集人員4,211・志願者数4,232・志願倍率1.00（4232/4211=1.0050…≈1.00で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/03/01/76203.html',
  sourceTitle:
    'リセモム「徳島県公立高入試の志願状況（確定）」（徳島県教育委員会 令和6年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4211, applicants: 4232, rate: 1.0 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム確定記事（2023年3月2日発表）を
 * WebFetchで直接引用。全日制の課程「一般選抜」全体: 一般選抜募集人員4,187・志願者数4,174・
 * 志願倍率1.00（4174/4187=0.9969…≈1.00で印字済み値と整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/03/02/71199.html',
  sourceTitle:
    'リセモム「【高校受験2023】徳島県公立高入試の志願状況（確定）徳島市立（理数）1.03倍」（徳島県教育委員会 令和5年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4187, applicants: 4174, rate: 1.0 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのリセモム確定記事（2022年3月3日発表）を
 * WebFetchで直接引用。全日制の課程「一般選抜」全体: 一般選抜募集人員4,314・志願者数4,376・
 * 志願倍率1.01（4376/4314=1.0144…≈1.01で整合。WebSearch要約とも独立一致）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/03/03/66078.html',
  sourceTitle:
    'リセモム「【高校受験2022】徳島県公立高入試の志願状況（確定）徳島市立（理数）1.03倍」（徳島県教育委員会 令和4年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4314, applicants: 4376, rate: 1.01 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4/R5/R6/R7と同一シリーズのリセモム確定記事
 * （2021年3月4日発表）をWebFetchで直接引用。全日制の課程「一般選抜」全体: 一般選抜募集人員
 * 4,261・志願者数4,247・志願倍率1.00（4247/4261=0.9967…≈1.00で整合。記事本文にも同数値が
 * 明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/05/60814.html',
  sourceTitle:
    'リセモム「【高校受験2021】徳島県公立高、一般選抜の志願状況（確定）徳島北（国際英語）1.05倍」（徳島県教育委員会 令和3年度一般選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制の課程', quota: 4261, applicants: 4247, rate: 1.0 },
};

export const TOKUSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tokushima',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
