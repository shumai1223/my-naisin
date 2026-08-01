/**
 * 栃木県 多年度アーカイブ（Λ-4・46県目）。
 *
 * 一次ソース: 栃木県教育委員会「令和8（2026）年度県立高等学校入学者選抜一般選抜出願変更状況
 * （全日制課程）」。
 * https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf
 *
 * Y-6のtochigi.tsと同一資料のPDF末尾「全日制計」合計行をそのまま転記（同一年度・現在年度分
 * のみのためgranularity='grand-total-only'）。quotaは募集定員そのものではなく「一般選抜定員」
 * （募集定員から特色選抜等の内定者数を控除した値）である点、他県と定義が異なるため注記する
 * （Y-6側の定義をそのまま踏襲・詳細はcompetition-rates/tochigi.ts参照）。Y-6側で57校107
 * レコードの機械集計がこの合計行（quota7,259・applicants7,602・倍率1.05）と完全一致することを
 * 確認済み。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl:
    'https://www.pref.tochigi.lg.jp/m04/r08/documents/r8zennitiseiippansenbatsusyutsuganhenkojokyo.pdf',
  sourceTitle: '栃木県教育委員会 令和8（2026）年度県立高等学校入学者選抜一般選抜出願変更状況（全日制課程）',
  fetchedAt: '2026-07-25',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計（一般選抜定員ベース）', schoolCount: 57, quota: 7259, applicants: 7602, rate: 1.05 },
};

export const TOCHIGI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tochigi',
  years: [REIWA_8],
};
