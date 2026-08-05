/**
 * 福島県 多年度アーカイブ（Λ-4・18県目）。
 *
 * 一次ソース: 福島県教育委員会「令和7年度福島県立高等学校入学者選抜後期選抜志願状況
 * （出願先変更後）について」（別紙2・令和7年3月19日公表・全日制2ページ）。
 * https://www.pref.fukushima.lg.jp/uploaded/attachment/679719.pdf
 *
 * 既存Y-6 fukushima.ts（令和8年度版）と同一資料シリーズ。画像スキャンPDF（テキスト層なし）だが
 * 300dpi相当の解像度でビジョン解析すると罫線・数字とも明瞭に読み取れた（Y-6と同じ罠と対策）。
 * 全日制「合計」行を直接転記: 後期選抜募集定員(quota)=1,603・志願者数(出願先変更後・applicants)
 * =175。倍率は資料に印字が無いため自前算出（175/1603=0.1092…→finalRate=0.11、Y-6と同じ計算
 * 方針）。前期選抜・連携型選抜・定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/fukushima.tsが確定済みのofficialSubtotals「全日制 合計」行(後期選抜のみスコープ)をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/735188.pdf',
  sourceTitle: '福島県教育委員会 令和８年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1686, applicants: 106, rate: 0.06 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/679719.pdf',
  sourceTitle: '福島県教育委員会 令和7年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）について',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1603, applicants: 175, rate: 0.11 },
};

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版（別紙2・令和6年3月19日公表・
 * テキスト層ありPDF・全2頁）を福島県公式サイトのR6年度入学者選抜ページから発見。
 * 巻末サマリー表「全日制 合計」（後期選抜募集定員1,484・志願者数(出願先変更後)230）を
 * 直接転記。倍率は資料に印字が無いため自前算出（230/1484=0.1550…→0.15、R7と同じ計算方針）。
 * 前期選抜・連携型選抜・定時制課程はR7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/621430.pdf',
  sourceTitle: '福島県教育委員会 令和6年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1484, applicants: 230, rate: 0.15 },
};

/**
 * 令和5年度（2023年度）: 同一資料シリーズの令和5年度版（令和5年3月20日公表・画像スキャンPDF・
 * 全3頁）を福島県公式サイトのR5年度入学者選抜ページから発見。3頁目の全日制サマリー表
 * （実施学校数44校・後期選抜募集定員1,675人・志願者数(出願先変更後)203人）を直接転記。
 * 倍率は資料に印字が無いため自前算出（203/1675=0.1212…→0.12、R6/R7と同じ計算方針）。
 * 前期選抜・連携型選抜・定時制課程はR6/R7と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/562892.pdf',
  sourceTitle: '福島県教育委員会 令和5年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1675, applicants: 203, rate: 0.12 },
};

/**
 * 令和4年度（2022年度）: 同一資料シリーズの令和4年度版（令和4年3月17日公表・画像スキャン
 * PDF・全3頁）を福島県公式サイトのR4年度入学者選抜ページから発見。3頁目の全日制サマリー表
 * （実施学校数48校・後期選抜募集定員1,825人・志願者数(出願先変更後)228人）を直接転記。倍率は
 * 資料に印字が無いため自前算出（228/1825=0.1249…→0.12、R5〜R7と同じ計算方針）。前期選抜・
 * 連携型選抜・定時制課程はR5〜R7と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/500729.pdf',
  sourceTitle: '福島県教育委員会 令和4年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1825, applicants: 228, rate: 0.12 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委サイトのR3年度入学者選抜アーカイブページ
 * （site/edu/r3koukounyushi.html）経由で同一シリーズの一次PDF（435913.pdf・令和3年3月18日
 * 公表・全3頁）を発見・Read toolで直読み成功。2頁目末尾の全日制合計行（実施学校数52校・
 * 後期選抜募集定員1,882人・志願者数(出願先変更後)244人）を転記し、3頁目の全日制/定時制
 * サマリー表とも完全一致することを確認済み。倍率は資料に印字が無いため自前算出
 * （244/1882=0.1296…→0.13、R4〜R7と同じ計算方針）。前期選抜・連携型選抜・定時制課程は
 * R4〜R7と同じ理由でスコープ外。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/435913.pdf',
  sourceTitle: '福島県教育委員会 令和3年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1882, applicants: 244, rate: 0.13 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。教委サイトのR2年度入学者選抜アーカイブページ
 * （site/edu/r1koukounyushi.html・注記: URL上のr1表記だが本文は「令和２年度」）経由で
 * 同一シリーズの一次PDF（訂正版・376950.pdf・令和2年3月23日公表・全3頁）を発見・Read toolで
 * 直読み成功。3頁目の全日制/定時制サマリー表（実施学校数59校・実施学科コース数110・後期選抜
 * 募集定員1,671人・志願者数(二次・出願先変更後)263人）を転記。倍率は資料に印字が無いため
 * 自前算出（263/1671=0.1574…→0.16、R3〜R7と同じ計算方針）。前期選抜・連携型選抜・定時制
 * 課程はR3〜R7と同じ理由でスコープ外。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/376950.pdf',
  sourceTitle: '福島県教育委員会 令和2年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後・訂正版）について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1671, applicants: 263, rate: 0.16 },
};

export const FUKUSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'fukushima',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
