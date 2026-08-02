/**
 * 福井県 多年度アーカイブ（Λ-4・17県目）。
 *
 * 一次ソース: 福井県教育委員会「令和7年度福井県立高等学校一般入学者選抜志願変更状況
 * （2月18日変更最終日）」（全2ページ）。
 * https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7ippan_d/fil/R7henko3.pdf
 *
 * 既存Y-6 fukui.ts（令和8年度・r08ippan_d/fil/R8henko3.pdf）と同一資料シリーズ。ディレクトリ名は
 * 年度によって桁数が変わる（R8="r08ippan_d"だがR7="r7ippan_d"・ゼロ埋めなし）ため単純な文字列
 * 置換ではアクセスできず、教委の年度別ハブページ（r7ippan.html）経由で正しいURLを特定した。
 * 全日制「合計」行を直接転記: 一般選抜募集人員(C)=3,398（＝本ファイルのquota、Y-6と同じ列）・
 * 変更後第一志望出願者数=3,465・変更後第一志望倍率=1.02（3465/3398=1.0197…≈1.02で整合）。
 * 定時制課程は他県と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r7ippan_d/fil/R7henko3.pdf',
  sourceTitle: '福井県教育委員会 令和7年度福井県立高等学校一般入学者選抜志願変更状況（2月18日変更最終日）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3398, applicants: 3465, rate: 1.02 },
};

/**
 * 令和6年度（2024年度）: ディレクトリ名がR7とも異なる（"r6ittupan_d"・"ippan"でなく
 * "ittupan"表記）ため単純な年度桁置換では404となり、教委の年度別ハブページ
 * （r6ittupan.html）経由でR6henkou3.pdf（2月16日変更最終日・全3頁）を特定した。全日制
 * 「合計」行を直接転記: 一般選抜募集人員(C)=3,578・変更後第一志望出願者数=3,577・
 * 変更後第一志望倍率=1.00（3577/3578=0.9997…≈1.00で整合）。定時制課程は他県と同じ理由で
 * スコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.fukui.lg.jp/doc/koukou/nyugaku/r6ittupan_d/fil/R6henkou3.pdf',
  sourceTitle: '福井県教育委員会 令和6年度福井県立高等学校一般入学者選抜志願変更状況（2月16日変更最終日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 3578, applicants: 3577, rate: 1.0 },
};

export const FUKUI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'fukui',
  years: [REIWA_7, REIWA_6],
};
