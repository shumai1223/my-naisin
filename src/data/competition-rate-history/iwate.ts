/**
 * 岩手県 多年度アーカイブ（Λ-4・20県目）。
 *
 * 一次ソース: 岩手県教育委員会「令和7年度岩手県立高等学校入学者選抜 志願者数一覧表（調整後）」
 * ＜全日制＞（令和7年2月21日発表・全3ページ）。
 * https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/080/249/r7_sigansya_tyoseigo.pdf
 *
 * 既存Y-6 iwate.tsと同一資料シリーズ。教委の年度別記事ページ経由でR7版を発見（ファイル名は
 * "tyoseigo"でY-6のR8版"tyouseigo"とは1文字違う表記揺れがあるため単純なURL置換は不発）。
 * 「合計」行を直接転記: 一次募集募集定員(quota)=8,382・志願者数(applicants)=6,684・
 * 志願倍率(rate)=0.80（印字済み値をそのまま採用・59校113学科(学系)の校数表記もY-6と一致）。
 * 定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/080/249/r7_sigansya_tyoseigo.pdf',
  sourceTitle: '岩手県教育委員会 令和7年度岩手県立高等学校入学者選抜 志願者数一覧表（調整後）＜全日制＞',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（59校113学科）', quota: 8382, applicants: 6684, rate: 0.8 },
};

export const IWATE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'iwate',
  years: [REIWA_7],
};
