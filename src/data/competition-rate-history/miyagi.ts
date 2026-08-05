/**
 * 宮城県 多年度アーカイブ（Λ-4・7県目）。
 *
 * 一次ソース: 宮城県教育庁高校教育課「令和7年度宮城県公立高等学校入学者選抜に係る
 * 第一次募集 出願状況について」（記者発表資料・2025年2月14日）
 * https://www.pref.miyagi.jp/documents/56099/r7_1st_soukatu_houdou.pdf
 *
 * 「２ 総括」の表に全日制課程の第一次募集（R7・R6）が並記されており、東京都の総括表と
 * 同型の「当年度＋前年度併記」形式（本資料はテキスト抽出が明瞭でビジョン解析の誤読リスクが低い）。
 * 令和8年度分は既存のcompetition-rates/miyagi.ts（学校粒度・68校129レコード・
 * grand total quota13,400/applicants12,516/倍率0.93）でカバー済みのため、本ファイルには
 * 令和7・令和6年度のみを収録する（tokyo/kanagawa/chiba/fukuoka/hyogo/kumamotoの各historyファイルと
 * 同じ設計方針）。定時制課程・連携型選抜・社会人特別選抜・全国募集選抜は既存Y-6と同じ理由で
 * スコープ外（全日制課程・第一次募集の通常枠のみ）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const SOURCE = {
  sourceUrl: 'https://www.pref.miyagi.jp/documents/56099/r7_1st_soukatu_houdou.pdf',
  sourceTitle: '宮城県教育庁高校教育課 令和7年度宮城県公立高等学校入学者選抜に係る第一次募集出願状況について（総括）',
  fetchedAt: '2026-07-29',
};

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/miyagi.tsが確定済みのofficialSubtotals「全日制合計」行(第一次募集スコープ・R7と同一)をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.miyagi.jp/documents/63612/0213_r8kouritukoukou_nyuugakusyasenbatsu_gakuryokukensa.pdf',
  sourceTitle: '宮城県教育庁高校教育課 令和8年度宮城県公立高等学校入学者選抜に係る第一次募集出願状況について（学校・学科別出願状況）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計（第一次募集）', quota: 13400, applicants: 12516, rate: 0.93 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  ...SOURCE,
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 13440, applicants: 13349, rate: 0.99 },
};

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  ...SOURCE,
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 13640, applicants: 13609, rate: 1.0 },
};

/**
 * 令和5年度（2023年度）: 令和6年度の「結果について」記者発表資料（2024-04-25公表・
 * https://www.pref.miyagi.jp/documents/51922/press_r6_kekka.pdf）の「１ 総括」表に
 * 令和6年度・令和5年度が併記されている。令和6年度分の数値（quota13,640/applicants13,609/
 * rate1.00）が既存REIWA_6と完全一致することを確認済み（独立した2つの記者発表資料が同じ
 * 令和6年度実績を報じている＝令和6年度分に限り相互クロスチェック成立）。令和5年度（募集定員
 * 13,760・出願者数14,095・出願倍率1.02）はこの1資料の前年度欄のみが根拠で、独立した第2資料
 * でのクロスチェックはできていない（正直に記録・将来R5年度自体の一次発表を発見できれば追加確認する）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.miyagi.jp/documents/51922/press_r6_kekka.pdf',
  sourceTitle: '宮城県教育庁高校教育課 令和6年度宮城県公立高等学校入学者選抜の結果について（総括表・前年度=令和5年度欄）',
  fetchedAt: '2026-08-03',
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 13760, applicants: 14095, rate: 1.02 },
};

/**
 * 令和4年度（2022年度）: 令和5年度分の一次資料（教委発表）を直接発見できなかったため、
 * リセモム確定記事（2022年2月18日発表）をWebSearch要約とWebFetch直接引用の2回で確認して
 * 採用。全日制課程・第一次募集全体: 募集定員13,880・出願者数14,005・出願倍率1.01
 * （14005/13880=1.0090…≈1.01で整合）。R5年度記事本文の「前年度比0.01ポイント増の1.02倍」
 * （＝前年度=令和4年度が1.01倍）という記述とも整合し、独立した2記事間でのクロスチェックが
 * 成立している。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/18/65862.html',
  sourceTitle:
    'リセモム「宮城県公立高、第一次募集出願状況（確定）」（宮城県教育庁 令和4年度第一次募集出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 13880, applicants: 14005, rate: 1.01 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4と同じ理由（一次資料未発見）でR4〜R7と同一シリーズの
 * リセモム確定記事（2021年2月18日発表）をWebFetchで直接引用。全日制課程・第一次募集全体:
 * 募集定員14,200・出願者数13,685・出願倍率0.96（13685/14200=0.9637…≈0.96で整合。記事本文にも
 * 同数値が明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/02/19/60549.html',
  sourceTitle:
    'リセモム「【高校受験2021】宮城県公立高、第一次募集出願状況（確定）宮城一1.48倍」（宮城県教育庁 令和3年度第一次募集出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 14200, applicants: 13685, rate: 0.96 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3〜R7と同一シリーズのリセモム確定記事（2020年2月21日
 * 発表）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程・第一次
 * 募集全体: 募集定員14,280・出願者数14,648・出願倍率1.03（14648/14280=1.0258…≈1.03で整合。
 * 記事本文にも同数値が明記）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/21/54902.html',
  sourceTitle:
    'リセモム「【高校受験2020】宮城県公立高、第1次募集の出願倍率…仙台一1.43倍」（宮城県教育庁 令和2年度第一次募集出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制課程・第一次募集', quota: 14280, applicants: 14648, rate: 1.03 },
};

export const MIYAGI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'miyagi',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
