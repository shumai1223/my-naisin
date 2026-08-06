/**
 * 香川県 多年度アーカイブ（Λ-4・21県目）。
 *
 * 一次ソース: 香川県教育委員会「令和7年度香川県公立高等学校 一般選抜 出願者数（全日制課程
 * 小学科・コース別）（一般選抜志願変更締切後）」（2025年2月26日公表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/26/80995.html
 *
 * 既存Y-6 kagawa.tsの一次ソースURL（documents/15096/syutugan8-3-2.pdf）はドキュメント管理IDが
 * 年度と機械的に対応しないため単純な置換が効かず、原本PDFの直接発見には至らなかった。教委発表を
 * 報じたリセモム記事から「入学定員から自己推薦選抜合格者などを除いた定員4,376人に対し出願者数が
 * 4,732人で、出願倍率は1.08倍」を直接引用。WebSearch要約でも同一の3数値が独立して繰り返し
 * 確認できたため採用（[[fable5-loop-protocol]]の「単一WebSearch要約のみに依存しない」原則を
 * 記事本文の直接引用で満たした）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: R4-R7と同一シリーズのリセモム記事（2026年2月24日・志願変更締切後確定）を
 * WebFetchで直接引用。全日制課程全体「入学定員（自己推薦選抜合格者等除く）4,208人・出願者数
 * 4,296人・出願倍率1.02倍」を転記（4296/4208=1.0209…≈1.02で整合。WebSearch要約とも独立一致）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://resemom.jp/article/2026/02/24/85197.html',
  sourceTitle:
    'リセモム「【高校受験2026】香川県公立高の出願状況（確定）高松（普通）1.09倍」（香川県教育委員会 令和8年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4208, applicants: 4296, rate: 1.02 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/26/80995.html',
  sourceTitle:
    'リセモム「香川県公立高の出願状況（確定）」（香川県教育委員会 令和7年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4376, applicants: 4732, rate: 1.08 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのリセモム記事（2024年2月22日・志願変更締切後確定）を
 * WebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。全日制課程全体「入学定員（自己
 * 推薦選抜合格者等除く）4,553人・出願者数5,056人・出願倍率1.11倍」を転記（5056/4553=1.1105…≈1.11
 * で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/22/76076.html',
  sourceTitle:
    'リセモム「香川県公立高の出願状況（確定）」（香川県教育委員会 令和6年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4553, applicants: 5056, rate: 1.11 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのリセモム記事（2023年2月22日・志願変更締切後
 * 確定）をWebFetchで直接引用。全日制課程全体「入学定員（自己推薦選抜合格者等除く）4,609人・
 * 出願者数5,299人・出願倍率1.15倍」を転記（5299/4609=1.1497…≈1.15で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/22/71059.html',
  sourceTitle:
    'リセモム「【高校受験2023】香川県公立高の出願状況（確定）高松（普通）1.14倍」（香川県教育委員会 令和5年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4609, applicants: 5299, rate: 1.15 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのリセモム記事（2022年2月24日・志願変更締切後
 * 確定）をWebFetchで直接引用。全日制課程全体「入学定員（自己推薦選抜合格者等除く）4,907人・
 * 出願者数5,538人・出願倍率1.13倍」を転記（5538/4907=1.1286…≈1.13で整合）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/24/65953.html',
  sourceTitle:
    'リセモム「【高校受験2022】香川県公立高の出願状況（確定）高松（普通）1.15倍」（香川県教育委員会 令和4年度香川県公立高等学校一般選抜出願者数の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4907, applicants: 5538, rate: 1.13 },
};

/**
 * 令和3年度（2021年度）: 5年→6年横展開。教委公式PDF(documents/15088/syutugan3-5.pdf)は
 * 現行サイトから削除済み(404)のため、Wayback Machine経由でダウンロードしRead toolで直読み。
 * 脚注に「競争率＝出願者数／（入学定員－自己推薦選抜合格者等数）」と明記されており、既存年度
 * (R4〜R8)と完全に同一のスコープ定義であることを確認済み。入学定員4,899・出願者数5,710・
 * 倍率1.17（5710/4899=1.1655…≈1.17で整合）。resemom速報記事(2/17締切時点・4899/5711/1.17)
 * とも出願者数1名差(志願変更期間中の減)を除きほぼ一致し、令和4年度記事の「前年度比0.04
 * ポイント低下」(1.13+0.04=1.17)という言及とも整合することを確認済み。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://web.archive.org/web/20210225122257/https://www.pref.kagawa.lg.jp/documents/15088/syutugan3-5.pdf',
  sourceTitle:
    '香川県教育委員会「（１１－１）令和３年度香川県公立高等学校 一般選抜 出願者数（全日制課程小学科・コース別）」（Wayback Machine経由・原本ページは現行サイトから削除済み）',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（自己推薦選抜合格者等除く）', quota: 4899, applicants: 5710, rate: 1.17 },
};

export const KAGAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kagawa',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
