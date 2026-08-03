/**
 * 和歌山県 多年度アーカイブ（Λ-4・36県目）。
 *
 * 一次ソース: 和歌山県教育委員会「令和7年度和歌山県立高等学校入学者選抜実施状況（一般選抜・
 * スポーツ推薦本出願状況）学校別・学科別状況(全日制)」（令和7年2月27日現在）。
 * https://www.pref.wakayama.lg.jp/prefg/500200/d00216812_d/fil/07honshutsugan.pdf
 *
 * 既存Y-6 wakayama.ts（令和8年度・08honsyutugan.pdf）とローマ字表記が異なる（R7は
 * "honshutsugan"・R8は"honsyutugan"）ため単純なURL置換は不発だったが、教委の年度別ハブページ
 * 経由で正しいURLを特定した。県立合計行を直接転記: 入学者枠数(quota)=5,915・スポーツ推薦本出願
 * 者数(D)=63＋一般選抜本出願者数(E)=5,044（applicants=D+E=5,107）・本出願倍率(D+E)/A=0.86
 * （5107/5915=0.8634…≈0.86で印字済み値と整合。Y-6と同じ列定義=D+E合算スコープ）。市立高校・
 * 定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00216812_d/fil/07honshutsugan.pdf',
  sourceTitle:
    '和歌山県教育委員会 令和7年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立 合計（全日制）', quota: 5915, applicants: 5107, rate: 0.86 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズの一次PDF（06honshutsugan.pdf・令和6年3月5日現在・
 * 全2頁）を教委の年度別ハブページ経由でWebSearchにより発見。Read toolで直読み成功。県立「合計」
 * 行（入学者枠数A=6,123・スポーツ推薦本出願者数D=88・一般選抜本出願者数E=5,344・本出願倍率
 * (D+E)/A=0.89）を転記（applicants=D+E=5,432・5432/6123=0.8871…≈0.89で印字済み値と整合・
 * Y-6/R7と同じD+E合算スコープ）。2頁目の大学科別状況の合計行とも完全一致し、同一資料内の
 * 二重検証が取れている。市立高校・定時制課程はR7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00212890_d/fil/06honshutsugan.pdf',
  sourceTitle:
    '和歌山県教育委員会 令和6年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立 合計（全日制）', quota: 6123, applicants: 5432, rate: 0.89 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズの一次PDF（05honshutsugan.pdf・令和5年3月3日
 * 現在・全2頁）を教委のR5年度用ハブページ経由で発見・Read toolで直読み。県立「合計」行
 * （入学者枠数A=6,131・スポーツ推薦本出願者数D=110・一般選抜本出願者数E=5,332・本出願倍率
 * (D+E)/A=0.89）を転記（applicants=D+E=5,442・5442/6131=0.8876…≈0.89で印字済み値と整合・
 * Y-6/R6/R7と同じD+E合算スコープ）。数値はリセモム確定記事（2023年3月3日発表・「入学者枠数
 * 6,131人に対し志願者数5,442人・出願倍率0.89倍」）でも独立確認済み。2頁目の大学科別状況の
 * 合計行とも完全一致し、資料内でも二重検証が取れている。市立高校・定時制課程はR6/R7と同じ
 * 理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00210122_d/fil/05honshutsugan.pdf',
  sourceTitle:
    '和歌山県教育委員会 令和5年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立 合計（全日制）', quota: 6131, applicants: 5442, rate: 0.89 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズの一次PDF（04honshutsugan.pdf・令和4年3月3日
 * 現在・全2頁）を教委のR4年度用ハブページ（d00207226.html）経由で発見・Read toolで直読み。
 * 県立「合計」行（入学者枠数A=6,042・スポーツ推薦本出願者数D=113・一般選抜本出願者数E=5,279・
 * 本出願倍率(D+E)/A=0.89）を転記（applicants=D+E=5,392・5392/6042=0.8924…≈0.89で印字済み値と
 * 整合・Y-6/R5/R6/R7と同じD+E合算スコープ）。2頁目の大学科別状況の合計行とも完全一致し、
 * 同一資料内の二重検証が取れている。市立高校・定時制課程はR5/R6/R7と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00207226_d/fil/04honshutsugan.pdf',
  sourceTitle:
    '和歌山県教育委員会 令和4年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立 合計（全日制）', quota: 6042, applicants: 5392, rate: 0.89 },
};

/**
 * 令和3年度（2021年度）: R4-R7と同一シリーズの一次PDF（03honshutsugan.pdf・令和3年3月5日
 * 現在・全2頁）を教委の年度別ハブページ（d00203744.html）経由でWebSearchにより発見。Read
 * toolで直読み成功。県立「合計」行（入学者枠数A=6,063・スポーツ推薦本出願者数D=108・一般選抜
 * 本出願者数E=5,281・本出願倍率(D+E)/A=0.89）を転記（applicants=D+E=5,389・
 * 5389/6063=0.8889…≈0.89で印字済み値と整合・R4/R5/R6/R7と同じD+E合算スコープ）。2頁目の
 * 大学科別状況の合計行とも完全一致し、同一資料内の二重検証が取れている。市立高校・定時制
 * 課程はR4-R7と同じ理由でスコープ外。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.wakayama.lg.jp/prefg/500200/d00203744_d/fil/03honshutsugan.pdf',
  sourceTitle:
    '和歌山県教育委員会 令和3年度和歌山県立高等学校入学者選抜実施状況（一般選抜・スポーツ推薦本出願状況）学校別・学科別状況(全日制)',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立 合計（全日制）', quota: 6063, applicants: 5389, rate: 0.89 },
};

export const WAKAYAMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'wakayama',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
