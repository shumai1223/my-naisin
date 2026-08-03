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

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版（令和6年2月21日発表・全4頁＜全日制
 * ＋定時制＞・テキスト埋め込み型PDF）をWebSearch経由で直接発見（URL末尾が"tyouseigo"で
 * R7の"tyoseigo"と1文字違いの表記揺れ、既存Y-6の罠と同型）。全日制「合計」行（61校117学科・
 * 学系・コース）を直接転記: 実質定員(quota)=7,862・調整後志願者数(applicants)=6,281・
 * 実質志願倍率(rate)=0.80（印字済み値をそのまま採用・6281/7862=0.7989…≈0.80で整合）。
 * 定時制課程はR7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl:
    'https://www.pref.iwate.jp/_res/projects/default_project/_page_/001/071/366/r6_ippan_sigansya_tyouseigo.pdf',
  sourceTitle: '岩手県教育委員会 令和6年度岩手県立高等学校入学者選抜 志願者数一覧表（調整後）＜全日制＞',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（61校117学科）', quota: 7862, applicants: 6281, rate: 0.8 },
};

/**
 * 令和5年度（2023年度）: 教委の令和5年度用サイトが令和6年度以降に閉鎖され原本PDFへの直接
 * アクセスに至らなかったため、R6/R7と同一シリーズの一般選抜確定志願状況を報じたリセモム記事
 * （2023年2月24日発表）をWebFetchで直接引用。「全日制62校117学科の実質定員7,881人に対し
 * 6,424人が志願、実質志願倍率は0.82倍」と明記（6424/7881=0.8153…≈0.82で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/24/71088.html',
  sourceTitle:
    'リセモム「【高校受験2023】岩手県公立高、一般選抜の志願状況（確定）盛岡第一1.19倍」（岩手県教育委員会 令和5年度一般選抜確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（62校117学科）', quota: 7881, applicants: 6424, rate: 0.82 },
};

export const IWATE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'iwate',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
