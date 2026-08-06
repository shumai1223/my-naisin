/**
 * 滋賀県 多年度アーカイブ（Λ-4・32県目）。
 *
 * 一次ソース: 滋賀県教育委員会「令和7年度滋賀県立高等学校入学者選抜 一般選抜（一次募集相当）
 * 確定出願状況」（2025年3月3日確定発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/03/03/81057.html
 *
 * ⚠️既存Y-6 shiga.ts（令和8年度・学校独自型選抜+一般型選抜の二本立て）とは選抜制度が異なる年度
 * である点に注意: 滋賀県は令和8年度から入学者選抜を一本化する制度改正があり（2月・3月の2回実施
 * →「学校独自型選抜」「一般型選抜」の2通りに再編）、令和7年度は改正前の旧制度（推薦選抜・特色選抜・
 * スポーツ文化芸術推薦選抜＋一般選抜）。本ファイルは旧制度の「一般選抜」（他県の一般選抜相当・
 * 各種推薦/特色選抜の合格者は対象外）を採用した。全日制課程を直接引用: 学力検査定員(quota)=6,253・
 * 確定出願者数(applicants)=6,563・出願倍率(rate)=1.05（6563/6253=1.0496…≈1.05で整合。
 * WebSearch要約・記事本文の2件で独立確認）。原本PDF（19頁の「結果のまとめ」はこの環境の
 * poppler未導入によりページ指定読み取り不可のため未到達）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 2026-08-06にΛ-4深掘りで追加。**R2〜R7とは選抜制度が異なる年度**
 * （冒頭コメント参照・滋賀県は令和8年度より「学校独自型選抜」＋「一般型選抜」の二本立てに
 * 再編。一般型選抜の出願者数は学校独自型選抜を併願している者を含むため、R2〜R7の「一般選抜
 * のみ（推薦/特色選抜等を除く）」とは母集団の定義自体が異なる）。既存Y-6 competition-rates/
 * shiga.tsによれば、一般型選抜のみの「計」行は資料に印字が無く自己集計値（quota6,016・
 * applicants9,333）のため単独では未検証。一方、学校独自型＋一般型の合算「計①」（募集人数
 * 9,230・確定出願者数12,201・倍率1.32）は資料に印字済みで、外部二次情報（ベネッセ進研ゼミ
 * 高校入試情報サイト）が報じる同一年度の同一数値と一致することを確認済み。本エントリは
 * この検証済みの合算値「計①」を採用し、labelに「学校独自型選抜＋一般型選抜 合算」と明記して
 * R2〜R7の「一般選抜のみ」とは範囲が異なることを示す（gunma/naraの制度変更時と同じ扱い）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.shiga.lg.jp/file/attachment/5591236.pdf',
  sourceTitle: '滋賀県教育委員会 令和8年度滋賀県立高等学校入学者選抜の一次募集に係る公表資料（一次募集確定出願者数・「計①」行）',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '学校独自型選抜＋一般型選抜 合算（新制度・旧「一般選抜のみ」とは範囲が異なる）', quota: 9230, applicants: 12201, rate: 1.32 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/03/03/81057.html',
  sourceTitle:
    'リセモム「滋賀県公立高、一般選抜の出願状況（確定）」（滋賀県教育委員会 令和7年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6253, applicants: 6563, rate: 1.05 },
};

/**
 * 令和6年度（2024年度）: R7と同じ旧制度下でのリセモム確定記事（2024年3月1日発表）をWebSearch
 * 要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程「一般選抜」全体: 学力検査
 * 定員6,369・確定出願者数6,727・出願倍率1.06（6727/6369=1.0562…≈1.06で整合。記事は「前年度と
 * 同じ1.06倍」とも明記）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/03/01/76207.html',
  sourceTitle:
    'リセモム「滋賀県公立高、一般選抜の出願状況（確定）」（滋賀県教育委員会 令和6年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6369, applicants: 6727, rate: 1.06 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同じ旧制度下でのリセモム確定記事（2023年3月6日発表）を
 * WebFetchで直接引用。全日制課程「一般選抜」全体（44校66科）: 学力検査定員6,286・確定
 * 出願者数6,689・出願倍率1.06（6689/6286=1.0641…≈1.06で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/03/06/71248.html',
  sourceTitle:
    'リセモム「【高校受験2023】滋賀県公立高、一般選抜の出願状況（確定）膳所1.61倍」（滋賀県教育委員会 令和5年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6286, applicants: 6689, rate: 1.06 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同じ旧制度下でのリセモム確定記事（2022年3月7日発表）を
 * WebFetchで直接引用。全日制課程「一般選抜」全体: 学力検査定員6,308・出願者数6,912・
 * 出願倍率1.09（6912/6308=1.0958…≈1.09で整合。記事本文にも同数値が明記）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/03/07/66110.html',
  sourceTitle:
    'リセモム「【高校受験2022】滋賀県立高、一般選抜の出願状況（確定）膳所1.56倍」（滋賀県教育委員会 令和4年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6308, applicants: 6912, rate: 1.09 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4/R5/R6/R7と同じ旧制度下でのリセモム確定記事
 * （2021年3月5日発表）をWebFetchで直接引用。全日制課程「一般選抜」全体: 学力検査定員6,004・
 * 出願者数6,602・確定志願倍率1.10（6602/6004=1.0996…≈1.10で整合。記事本文にも同数値が明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/09/60855.html',
  sourceTitle:
    'リセモム「【高校受験2021】滋賀県公立高、一般選抜の出願状況（確定）膳所1.63倍」（滋賀県教育委員会 令和3年度一般選抜確定出願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6004, applicants: 6602, rate: 1.1 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。教委サイトのアーカイブページ（senbatsu/325134.html）
 * 経由で一次PDF「令和2年度滋賀県立高等学校入学者選抜（一般選抜）学力検査に関する確定出願状況
 * について」（令和2年3月6日発表・全3頁）を発見・Read toolで直読み成功。R3〜R7と同じ旧制度
 * （推薦選抜・特色選抜・スポーツ文化芸術推薦選抜＋一般選抜）下での全日制「合計」行（学力検査
 * 定員6,379・確定出願者数6,928・確定出願倍率1.09）を転記（6928/6379=1.0861…≈1.09で印字済み
 * 値と整合）。本文(3)の総括表と3頁目末尾の学校別内訳「計」行の両方で完全一致し、資料内二重
 * 検証が取れている（教委一次PDF直接発見のためリセモム経由より高精度）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://www.pref.shiga.lg.jp/file/attachment/5159573.pdf',
  sourceTitle: '滋賀県教育委員会 令和2年度滋賀県立高等学校入学者選抜（一般選抜）学力検査に関する確定出願状況について',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（旧制度・推薦/特色選抜等を除く）', quota: 6379, applicants: 6928, rate: 1.09 },
};

export const SHIGA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'shiga',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
