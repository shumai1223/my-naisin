/**
 * 福岡県 多年度アーカイブ（Λ-4・4県目）。
 *
 * Y-2のfukuoka.ts（令和8年度・学校粒度）は県立と市組合立を別集計で完全収録済み
 * （県立22,200/22,854/1.03・市組合立2,120/2,350/1.11）。本ファイルは過去年度分を
 * 報道記事（リセマム）から取得するが、報道は県立分のみを報じているため、
 * **スコープを県立全日制に限定**して収録する（市組合立分は原資料が見つかり次第追加）。
 *
 * 一次ソース: 福岡県教育委員会 令和7年度公立高等学校一般入試確定志願状況の発表
 * （2025-02-21公表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/21/80929.html
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/fukuoka.tsが確定済みのofficialSubtotals「県立全日制合計」行(R7と同じ県立のみスコープ)をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.fukuoka.lg.jp/site/kyouiku/nyushi8.html',
  sourceTitle: '福岡県教育委員会 令和8年度公立高等学校一般入試志願状況（県立分PDF: uploaded/life/806459_62802786_misc.pdf）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制合計', quota: 22200, applicants: 22854, rate: 1.03 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/21/80929.html',
  sourceTitle: 'リセモム「【高校受験2025】福岡県公立高、一般入試の志願状況（確定）修猷館1.69倍」（福岡県教育委員会 令和7年度公立高等学校一般入試確定志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制（一般入試・確定志願状況）', quota: 22040, applicants: 24542, rate: 1.11 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム確定記事（2024年2月26日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。県立全日制（一般入試・確定志願状況）:
 * 入学定員22,160・志願者数25,128・志願倍率1.13（25128/22160=1.1339…≈1.13で整合）。市組合立分は
 * R7と同じ理由（原資料未発見）でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/26/76119.html',
  sourceTitle:
    'リセモム「福岡県公立高、一般入試の志願状況（確定）」（福岡県教育委員会 令和6年度公立高等学校一般入試確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制（一般入試・確定志願状況）', quota: 22160, applicants: 25128, rate: 1.13 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム確定記事（2023年2月27日発表）を
 * WebFetchで直接引用。県立全日制（一般入試・確定志願状況）: 入学定員22,200・志願者数25,260・
 * 志願倍率1.14（25260/22200=1.1378…≈1.14で整合）。市組合立分はR6/R7と同じ理由（原資料未発見）
 * でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/27/71130.html',
  sourceTitle:
    'リセモム「【高校受験2023】福岡県公立高、一般入試の志願状況（確定）修猷館1.70倍」（福岡県教育委員会 令和5年度公立高等学校一般入試確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制（一般入試・確定志願状況）', quota: 22200, applicants: 25260, rate: 1.14 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのリセモム確定記事（2022年2月28日発表）を
 * WebFetchで直接引用。県立全日制（一般入試・確定志願状況）: 入学定員21,800・志願者数24,808・
 * 志願倍率1.14（24808/21800=1.1380…≈1.14で整合）。市組合立分はR5/R6/R7と同じ理由（原資料
 * 未発見）でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/28/66016.html',
  sourceTitle:
    'リセモム「【高校受験2022】福岡県公立高、一般入試の志願状況（確定）修猷館1.64倍」（福岡県教育委員会 令和4年度公立高等学校一般入試確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制（一般入試・確定志願状況）', quota: 21800, applicants: 24808, rate: 1.14 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4/R5/R6/R7と同一シリーズのリセモム確定記事
 * （2021年3月2日発表）をWebFetchで直接引用。県立全日制（一般入試・確定志願状況）: 入学定員
 * 21,200・志願者数23,980・志願倍率1.13（23980/21200=1.1311…≈1.13で整合）。市組合立分は
 * R4/R5/R6/R7と同じ理由（原資料未発見）でスコープ外。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/03/60740.html',
  sourceTitle:
    'リセモム「【高校受験2021】福岡県公立高、一般入試の志願状況（確定）修猷館1.64倍」（福岡県教育委員会 令和3年度公立高等学校一般入試確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制（一般入試・確定志願状況）', quota: 21200, applicants: 23980, rate: 1.13 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3-R7と同一シリーズのリセモム確定記事（2020年2月27日
 * 発表）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。県立全日制（一般入試・
 * 確定志願状況）: 入学定員22,120・志願者数25,682・志願倍率1.16（25682/22120=1.1611…≈1.16で
 * 印字済み値と整合。記事本文にも同数値が明記）。市組合立分はR3-R7と同じ理由（原資料未発見）で
 * スコープ外。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/28/55012.html',
  sourceTitle:
    'リセモム「【高校受験2020】福岡県公立高、一般入試の志願状況・倍率（確定）修猷館1.64倍」（福岡県教育委員会 令和2年度公立高等学校一般入試確定志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制（一般入試・確定志願状況）', quota: 22120, applicants: 25682, rate: 1.16 },
};

export const FUKUOKA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'fukuoka',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
