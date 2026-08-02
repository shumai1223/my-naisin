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

/**
 * 令和6年度（2024年度）: R7と同一シリーズの一次PDF（01_R6ippansenbatu_henkougo.pdf・
 * 令和6年2月14日17:00現在）をWebSearchで直接発見。全19頁規模の多段見出し表（Osaka型の誤読
 * リスクに該当）のためRead toolでの直読み結果を単独採用せず、独立した二次ソース（リセモム
 * 確定記事2024年2月16日発表）をWebSearch要約とWebFetch直接引用の2回で突合し、PDF内の
 * 「全日制　計」（県立34校＋松江市立1校＝35校、R7の「本校35」と同一スコープ）行の印字値と
 * 完全一致することを確認して採用: 一般選抜募集定員4,169・出願者数（志願変更後）3,481・
 * 志願倍率0.83（3481/4169=0.8351…だが印字値0.83をそのまま採用）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl:
    'https://www.pref.shimane.lg.jp/education/kyoiku/senbatsu/senbatsu_info/index.data/01_R6ippansenbatu_henkougo.pdf',
  sourceTitle:
    '島根県教育委員会 令和6年度島根県公立高等学校入学者選抜における一般選抜出願者数（志願変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 本校（35校＝県立34校＋市立1校）', quota: 4169, applicants: 3481, rate: 0.83 },
};

export const SHIMANE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'shimane',
  years: [REIWA_7, REIWA_6],
};
