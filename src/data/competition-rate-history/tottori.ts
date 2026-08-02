/**
 * 鳥取県 多年度アーカイブ（Λ-4・34県目）。
 *
 * 一次ソース: 鳥取県教育委員会「令和7年度鳥取県立高等学校入学者選抜 一般選抜志願状況（確定・
 * 志願変更後）」（2025年2月21日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/21/80931.html
 *
 * 既存Y-6 tottori.tsのURL（.../R08_ippan_saisyuu_shigansya.pdf）は年度桁数の単純置換
 * （R08→R07）が404となり原本PDFへの直接アクセスには至らなかった。教委発表を報じたリセモム記事
 * から「一般選抜の実質募集定員2,936人に対し、志願変更後の志願者数は2,586人」を直接引用
 * （2586/2936=0.8807…≈0.88で整合）。Y-6と同じ「一般選抜（特色選抜等を除く）」のスコープ。
 * 令和6年度は鳥取県公式サイトの一次PDF（4頁・R6saisyu.pdf）を直接発見できたため一次ソースで転記。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/21/80931.html',
  sourceTitle:
    'リセモム「鳥取県立高、一般選抜の志願状況（確定）」（鳥取県教育委員会 令和7年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 2936, applicants: 2586, rate: 0.88 },
};

/**
 * 令和6年度（2024年度）: 鳥取県教育委員会高等学校課の一次資料「令和6年度県立高等学校一般
 * 入学者選抜最終志願者数等について」（2024年2月22日資料提供）を直接発見（PDFは4頁で
 * pdftoppm不要のRead可）。全日制課程の「計」行（実質募集定員3,048・志願変更締切後の
 * 最終志願者数2,648・競争率0.87）を転記。同資料内の県計行（学校別一覧表側）とも完全一致。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.tottori.lg.jp/secure/1347424/R6saisyu.pdf',
  sourceTitle: '鳥取県教育委員会高等学校課 令和6年度県立高等学校一般入学者選抜最終志願者数等について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（実質募集定員）', quota: 3048, applicants: 2648, rate: 0.87 },
};

export const TOTTORI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'tottori',
  years: [REIWA_7, REIWA_6],
};
