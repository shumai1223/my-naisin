/**
 * 宮崎県 多年度アーカイブ（Λ-4・25県目）。
 *
 * 一次ソース: 宮崎県教育委員会「令和7年度宮崎県立高等学校入学者選抜（課程別）」内
 * 「一般入学者選抜『最終』志願状況」（令和7年2月25日発表・志願変更後）。
 * https://www.pref.miyazaki.lg.jp/documents/89488/89488_20250225152347-1.pdf
 *
 * 既存Y-6 miyazaki.tsと同一資料シリーズ。教委の年度別ハブページ経由でR7版を発見（documents
 * IDは年度と機械的に対応しないためURL置換は不発）。全日制「合計」行を直接転記: 一般入学募集人員
 * (quota)=3,862・一般入学者選抜「最終」志願者数(applicants)=3,159・倍率(rate)=0.82
 * （3159/3862=0.8181…≈0.82で整合。WebSearch要約とも独立一致）。Y-6と同じ列定義
 * （推薦入学は対象外・一般入学募集人員のみ）。定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.miyazaki.lg.jp/documents/89488/89488_20250225152347-1.pdf',
  sourceTitle: '宮崎県教育委員会 令和7年度宮崎県立高等学校入学者選抜（課程別）一般入学者選抜「最終」志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', quota: 3862, applicants: 3159, rate: 0.82 },
};

export const MIYAZAKI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'miyazaki',
  years: [REIWA_7],
};
