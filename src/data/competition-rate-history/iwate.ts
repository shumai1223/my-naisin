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

/**
 * 令和4年度（2022年度）: R5と同じ理由（教委旧サイトの閉鎖）で原本PDF未到達のため、R5/R6/R7と
 * 同一シリーズの一般選抜確定志願状況を報じたリセモム記事（2022年2月24日発表）をWebFetchで
 * 直接引用。「全日制合計62校の実質定員8,049人に対し6,836人が志願し、実質志願倍率は0.85倍」
 * と明記（6836/8049=0.8493…≈0.85で整合）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/24/65928.html',
  sourceTitle:
    'リセモム「【高校受験2022】岩手県公立高、一般選抜の志願状況（確定）盛岡第一1.31倍」（岩手県教育委員会 令和4年度一般選抜確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（62校）', quota: 8049, applicants: 6836, rate: 0.85 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4/R5と同じ理由（教委旧サイトの閉鎖）で原本PDF未到達の
 * ため、R4/R5/R6/R7と同一シリーズの一般選抜確定志願状況を報じたリセモム記事（2021年2月24日
 * 発表）をWebFetchで直接引用。「全日制合計62校の実質定員8,068人に対し6,590人が志願し、実質
 * 志願倍率は0.82倍」と明記（6590/8068=0.8168…≈0.82で整合）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/02/25/60642.html',
  sourceTitle:
    'リセモム「【高校受験2021】岩手県立高、一般選抜の志願状況（確定）盛岡第一1.13倍」（岩手県教育委員会 令和3年度一般選抜確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（62校）', quota: 8068, applicants: 6590, rate: 0.82 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3〜R7と同一シリーズの一般選抜確定志願状況を報じた
 * リセモム記事（2020年2月21日発表）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認
 * して採用。「全日制合計62校の実質定員8,115人に対し7,088人が志願し、実質志願倍率は0.87倍」
 * と明記（7088/8115=0.8734…≈0.87で整合）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/21/54923.html',
  sourceTitle:
    'リセモム「【高校受験2020】岩手県立高、一般選抜の志願状況・倍率（確定）盛岡第一1.17倍など」（岩手県教育委員会 令和2年度一般選抜確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計（62校）', quota: 8115, applicants: 7088, rate: 0.87 },
};

export const IWATE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'iwate',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
