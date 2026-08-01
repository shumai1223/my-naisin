/**
 * 大阪府 多年度アーカイブ（Λ-4・44県目）。
 *
 * 一次ソース: 大阪府教育委員会「令和8年度大阪府公立高等学校 一般入学者選抜（全日制の課程）
 * の志願者数（令和8年3月6日午後2時（締切数））」。
 * https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx
 *
 * Y-6のosaka.tsと同一資料の表1〜6全体合計行をそのまま転記（同一年度・現在年度分のみのため
 * granularity='grand-total-only'）。Y-6側でxlsx原本の自前パースにより転記精度を確保済み
 * （詳細はcompetition-rates/osaka.ts参照）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.osaka.lg.jp/documents/125698/r08_ippan_sigansya_0306.xlsx',
  sourceTitle:
    '大阪府教育委員会 令和8年度大阪府公立高等学校 一般入学者選抜（全日制の課程）の志願者数（令和8年3月6日午後2時（締切数））表1〜6全体',
  fetchedAt: '2026-07-24',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全体合計（表1+表2+表3+表4+表5+表6）', quota: 31847, applicants: 33422, rate: 1.05 },
};

export const OSAKA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'osaka',
  years: [REIWA_8],
};
