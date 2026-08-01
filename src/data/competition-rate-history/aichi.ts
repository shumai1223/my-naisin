/**
 * 愛知県 多年度アーカイブ（Λ-4・43県目）。
 *
 * 一次ソース: 愛知県教育委員会高等学校教育課「令和8年度愛知県公立高等学校入学者選抜（全日制課程）
 * における一般選抜等の志願変更後の志願者数（最終）について」。
 * https://www.pref.aichi.jp/uploaded/attachment/600212.pdf
 *
 * Y-6のaichi.tsと同一資料の「合計」行をそのまま転記（同一年度・現在年度分のみのため
 * granularity='grand-total-only'）。Y-6側で機械集計240レコードとの突合を行い、初回転記で
 * 西尾1校の抜け落ちを発見・追記して合計行（quota30,789・applicants53,196・倍率1.73）と
 * 完全一致することを確認済み（詳細はcompetition-rates/aichi.ts参照）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.aichi.jp/uploaded/attachment/600212.pdf',
  sourceTitle:
    '愛知県教育委員会高等学校教育課 令和8年度愛知県公立高等学校入学者選抜（全日制課程）における一般選抜等の志願変更後の志願者数（最終）について',
  fetchedAt: '2026-07-25',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', schoolCount: 156, quota: 30789, applicants: 53196, rate: 1.73 },
};

export const AICHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'aichi',
  years: [REIWA_8],
};
