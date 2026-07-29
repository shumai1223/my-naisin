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

export const SAGA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'saga',
  years: [REIWA_7],
};
