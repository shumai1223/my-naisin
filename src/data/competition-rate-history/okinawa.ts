/**
 * 沖縄県 多年度アーカイブ（Λ-4・30県目）。
 *
 * 一次ソース: 沖縄県教育委員会「令和7年度（令和6年度実施）県立高等学校入学者選抜 一般選抜等
 * 最終志願状況」（令和7年2月18日発表・全4ページ）。
 * https://www.pref.okinawa.lg.jp/_res/projects/default_project/_page_/001/032/815/r06saisyu.pdf
 *
 * ⚠️沖縄県は年度呼称が「実施年度」基準（令和7年度入学者選抜＝令和6年度中に実施）のため、既存
 * Y-6 okinawa.ts（令和8年度＝令和7年度実施・r07saisyu.pdf）の1年前を指すファイル名は
 * r06saisyu.pdfとなる（他県のR7↔R8単純置換パターンとは異なる罠）。教委の「令和6年度実施」
 * ページ経由で発見。
 *
 * Y-6と同じ理由で全日制・定時制課程が同一表に混在し「全日制のみ」の公式小計が印字されないため、
 * 資料末尾の「総計」（募集人員14,557・最終志願者計13,448）から、資料中の定時制6箇所
 * （コザ定時商業40/20・那覇工業定時2科80/10・北部農林定時農業40/9・中部農林定時農業40/15・
 * 八重山商工定時商業40/16・泊(定時制単独校)160/116＝定時制合計募集人員400・志願者186）を
 * 機械的に減算した全日制のみの値を採用（募集人員14,157・志願者13,262・倍率13262/14157=
 * 0.9368…→0.94）。Y-0憲法②「1データ点=1出典」の精神に沿い印字値からの単純減算のみで
 * 捏造は含まない（Y-6と同型の算出方針）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.pref.okinawa.lg.jp/_res/projects/default_project/_page_/001/032/815/r06saisyu.pdf',
  sourceTitle: '沖縄県教育委員会 令和7年度（令和6年度実施）県立高等学校入学者選抜 一般選抜等最終志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制のみ（総計から定時制6箇所を減算）', quota: 14157, applicants: 13262, rate: 0.94 },
};

export const OKINAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'okinawa',
  years: [REIWA_7],
};
