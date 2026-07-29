/**
 * 鹿児島県 多年度アーカイブ（Λ-4・22県目）。
 *
 * 一次ソース: 鹿児島県教育委員会「令和7年度鹿児島県公立高等学校入学最終出願者数」
 * （令和7年2月21日・学区別7学区分・全7ページ）。
 * https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/119293_20250221172257-1.pdf
 *
 * 既存Y-6 kagoshima.tsと同一資料シリーズ。教委の年度別ハブページ（r7saisyusyutugansya.html）
 * 経由でR7版を発見。1ページ目の県立・市立内訳表に「全日制 計」行があり、そのまま6ページ目末尾の
 * 「全日制　合計」行とも一致する: 募集定員11,641・学力検査定員(quota)=10,398・
 * 最終出願者数(applicants)=8,455（括弧内163は全日制普通科「一定枠」の内数再掲・Y-6と同じ理由で
 * 別枠加算しない）・倍率(rate)=0.81。Y-6と同じ列定義（学力検査定員＝募集定員－推薦等内定者数）
 * を採用。定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/119293_20250221172257-1.pdf',
  sourceTitle: '鹿児島県教育委員会 令和7年度鹿児島県公立高等学校入学最終出願者数',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 10398, applicants: 8455, rate: 0.81 },
};

export const KAGOSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kagoshima',
  years: [REIWA_7],
};
