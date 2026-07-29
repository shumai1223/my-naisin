/**
 * 和歌山県 多年度アーカイブ（Λ-4・36県目）。
 *
 * 一次ソース: 和歌山県教育委員会「令和7年度和歌山県立高等学校入学者選抜実施状況（一般選抜・
 * スポーツ推薦本出願状況）学校別・学科別状況(全日制)」（令和7年2月27日現在）。
 * https://www.pref.wakayama.lg.jp/prefg/500200/d00216812_d/fil/07honshutsugan.pdf
 *
 * 既存Y-6 wakayama.ts（令和8年度・08honsyutugan.pdf）とローマ字表記が異なる（R7は
 * "honshutsugan"・R8は"honsyutugan"）ため単純なURL置換は不発だったが、教委の年度別ハブページ
 * 経由で正しいURLを特定した。県立合計行を直接転記: 入学者枠数(quota)=5,915・スポーツ推薦本出願
 * 者数(D)=63＋一般選抜本出願者数(E)=5,044（applicants=D+E=5,107）・本出願倍率(D+E)/A=0.86
 * （5107/5915=0.8634…≈0.86で印字済み値と整合。Y-6と同じ列定義=D+E合算スコープ）。市立高校・
 * 定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00216812_d/fil/07honshutsugan.pdf',
  sourceTitle:
    '和歌山県教育委員会 令和7年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立 合計（全日制）', quota: 5915, applicants: 5107, rate: 0.86 },
};

export const WAKAYAMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'wakayama',
  years: [REIWA_7],
};
