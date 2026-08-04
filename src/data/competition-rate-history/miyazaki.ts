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

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年2月27日発表・志願変更後）
 * をWebFetchで直接引用。全日制課程一般入学者選抜全体: 募集人員3,948・志願者数3,190・
 * 志願倍率0.81（3190/3948=0.8081…≈0.81で整合。記事本文にも同数値が明記）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/27/76145.html',
  sourceTitle:
    'リセモム「【高校受験2024】宮崎県立高、一般入試の志願状況（確定）宮崎西（理数）2.44倍」（宮崎県教育委員会 令和6年度一般入学者選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', quota: 3948, applicants: 3190, rate: 0.81 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム確定記事（2023年2月24日発表・志願変更後）
 * をWebFetchで直接引用。全日制課程一般入学者選抜全体: 募集人員4,106・志願者数3,514・
 * 志願倍率0.86（3514/4106=0.8558…≈0.86で整合。記事本文にも同数値が明記・推薦入学
 * は含まないことも記事内「推薦・連携型入学者選抜の合格者は3月17日に発表」の記述で確認済み）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/24/71101.html',
  sourceTitle:
    'リセモム「【高校受験2023】宮崎県立高、一般入試の志願状況（確定）宮崎西（理数）2.19倍」（宮崎県教育委員会 令和5年度一般入学者選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', quota: 4106, applicants: 3514, rate: 0.86 },
};

export const MIYAZAKI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'miyazaki',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
