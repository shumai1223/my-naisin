/**
 * 熊本県 多年度アーカイブ（Λ-4・6県目）。
 *
 * 一次ソース: 熊本県教育委員会「令和7年度（2025年度）熊本県公立高等学校入学者選抜における
 * 後期（一般）選抜出願者数」（2025年2月17日公表）。
 * https://www.pref.kumamoto.jp/uploaded/life/226687_640196_misc.pdf
 *
 * 既存Y-6 kumamoto.ts（令和8年度・学校粒度52校162レコード）と同一の資料シリーズ（後期＝一般選抜・
 * 全日制課程）。R7ネイティブ文書の「計」行（募集人員8,258・出願者数7,585・倍率0.92）を直接
 * 転記した（ビジョン解析だが表全体が明瞭に読み取れており、令和8年度版に埋め込まれた前年度
 * 比較列の倍率0.92とも完全一致することを確認済み・二重検証済み）。定時制課程は既存Y-6と同じ
 * 理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/kumamoto.tsが確定済みのofficialSubtotals「全日制（後期・一般選抜）計」行をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/259416_786982_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和8年度（2026年度）熊本県公立高等学校入学者選抜後期（一般）選抜における出願変更状況（出願確定者数）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制（後期・一般選抜）計', quota: 8322, applicants: 7295, rate: 0.88 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/226687_640196_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和7年度（2025年度）熊本県公立高等学校入学者選抜における後期（一般）選抜出願者数',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8258, applicants: 7585, rate: 0.92 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのハブページ(196726.html)から同種の後期（一般）選抜
 * 出願者数PDF(令和6年2月16日発表・全5頁)を発見。全日制「計」行（後期選抜の募集人員8,250・
 * 出願者数7,760・倍率0.94）を直接転記（7760/8250=0.9406…≈0.94で印字済み倍率と整合）。
 * WebSearchで拾えた独立記事（前年度倍率0.94との言及）でも同一値を確認済み。定時制課程は
 * R7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/196726_510021_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和6年度（2024年度）熊本県公立高等学校入学者選抜における後期（一般）選抜出願者数',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8250, applicants: 7760, rate: 0.94 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのハブページ(163133.html)から後期（一般）選抜
 * 出願者数PDF(令和5年2月7日発表・全5頁)を発見。全日制課程「計」行（後期選抜の募集人員8,362・
 * 出願者数7,985・倍率0.95）を直接転記（7985/8362=0.9549…≈0.95で印字済み倍率と整合）。
 * 定時制課程はR6/R7と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/163133_377178_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和5年度（2023年度）熊本県公立高等学校入学者選抜における後期（一般）選抜出願者数',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8362, applicants: 7985, rate: 0.95 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのハブページ(123657.html)から後期（一般）選抜
 * 出願者数PDF(令和4年2月4日発表・全5頁)を発見。全日制課程「計」行（後期選抜の募集人員8,569・
 * 出願者数7,691・倍率0.90）を直接転記（7691/8569=0.8976…≈0.90で印字済み倍率と整合）。
 * 定時制課程はR5/R6/R7と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/123657_235390_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和4年度（2022年度）熊本県公立高等学校入学者選抜における後期（一般）選抜出願者数',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8569, applicants: 7691, rate: 0.9 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委のR3年度ハブページ(kyouiku/86706.html)経由で
 * 「令和3年度熊本県公立高等学校入学者選抜後期(一般)選抜における出願変更状況」PDF(令和3年2月22日
 * 発表・全5頁)を発見・Read toolで直読み。5頁目末尾の全日制課程「計」行（募集人員8,785・
 * 出願確定者数7,411・倍率0.84）を転記（7411/8785=0.8434…≈0.84で印字済み値と整合）。
 * R4〜R7と同一シリーズのリセモム確定記事（2021年2月24日発表）でも同一の3数値を独立確認済み。
 * 定時制課程はR4〜R7と同じ理由でスコープ外。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.kumamoto.jp/uploaded/life/86706_117052_misc.pdf',
  sourceTitle: '熊本県教育委員会 令和3年度（2021年度）熊本県公立高等学校入学者選抜後期（一般）選抜における出願変更状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8785, applicants: 7411, rate: 0.84 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3〜R7と同一シリーズのリセモム確定記事（2020年2月26日
 * 発表）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程「後期
 * （一般）選抜の募集人員8,743人に対し、8,041人が志願し、倍率は0.92倍」と明記
 * （8041/8743=0.9197…≈0.92で印字済み値と整合）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/26/54964.html',
  sourceTitle:
    'リセモム「【高校受験2020】熊本県公立高入試、後期（一般）選抜の出願状況・倍率（確定）熊本1.46倍」（熊本県教育委員会 令和2年度後期（一般）選抜出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・後期（一般）選抜 計', quota: 8743, applicants: 8041, rate: 0.92 },
};

export const KUMAMOTO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kumamoto',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
