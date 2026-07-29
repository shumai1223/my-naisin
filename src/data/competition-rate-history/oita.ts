/**
 * 大分県 多年度アーカイブ（Λ-4・29県目）。
 *
 * 一次ソース: 大分県教育委員会「令和7年度大分県立高等学校第一次入学者選抜最終志願状況」
 * （令和7年2月28日公表・全4ページ）。
 * https://www.pref.oita.jp/uploaded/attachment/2234489.pdf
 *
 * 既存Y-6 oita.tsと同一資料シリーズ。教委の年度別ハブページ（r07ichijisaisyuu.html）経由で
 * R7版を発見（attachment IDは年度と機械的に対応せずURL置換は不発）。「県立高校全日制課程合計」
 * 行を直接転記: 募集人員(quota)=5,666・最終志願者数(applicants)=5,783。倍率は資料に印字が無い
 * ためY-6と同じ方針で自前算出（5783/5666=1.0207…→finalRate=1.02）。定時制課程はY-6と同じ理由
 * でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.oita.jp/uploaded/attachment/2234489.pdf',
  sourceTitle: '大分県教育委員会 令和7年度大分県立高等学校第一次入学者選抜最終志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5666, applicants: 5783, rate: 1.02 },
};

export const OITA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'oita',
  years: [REIWA_7],
};
