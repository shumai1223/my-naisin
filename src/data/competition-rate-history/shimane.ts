/**
 * 島根県 多年度アーカイブ（Λ-4・40県目）。
 *
 * 一次ソース: 島根県教育委員会「令和7年度島根県公立高等学校入学者選抜における一般選抜の
 * 志願変更後の出願状況について」（令和7年2月19日発表・2月17日17時現在）。
 * https://www3.pref.shimane.jp/houdou/uploads/163178/144962/4cc0862207c55a920a5822ed4dd0d78e.pdf
 *
 * 既存Y-6 shimane.tsと同一資料シリーズ（全日制「本校」35校＝県立34校＋市立1校（松江市立皆美が丘
 * 女子高等学校）。分校1校・定時制3校は別区分のためY-6と同じ理由でスコープ外）。「全日制 本校35」
 * 行を直接転記: 一般選抜募集定員(quota)=3,217・志願変更後出願者数(applicants)=2,667・
 * 対募集定員競争率(rate)=0.83（印字済み値をそのまま採用・2667/3217=0.8291…≈0.83で整合。
 * WebSearch要約とも独立一致）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www3.pref.shimane.jp/houdou/uploads/163178/144962/4cc0862207c55a920a5822ed4dd0d78e.pdf',
  sourceTitle:
    '島根県教育委員会 令和7年度島根県公立高等学校入学者選抜における一般選抜の志願変更後の出願状況について',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 本校（35校＝県立34校＋市立1校）', quota: 3217, applicants: 2667, rate: 0.83 },
};

export const SHIMANE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'shimane',
  years: [REIWA_7],
};
