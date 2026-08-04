/**
 * 静岡県 多年度アーカイブ（Λ-4・45県目）。
 *
 * 一次ソース: 静岡県教育委員会「令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）」。
 * https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf
 *
 * Y-6のshizuoka.tsと同一資料のPDF9ページ目末尾「公立合計」行をそのまま転記（同一年度・
 * 現在年度分のみのためgranularity='grand-total-only'）。Y-6側で全日制90校162レコードの
 * 機械集計が公立合計（quota16,954・applicants16,895・倍率1.00）と完全一致することを
 * 確認済み（詳細はcompetition-rates/shizuoka.ts参照）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl:
    'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/072/279/r8shigansyasuusiganhennkougo1.pdf',
  sourceTitle: '静岡県教育委員会 令和8年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）',
  fetchedAt: '2026-07-25',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立合計', quota: 16954, applicants: 16895, rate: 1.0 },
};

/**
 * 令和7年度（2025年度）: R8と同一シリーズの一次PDF（r7sigansyasuuhenkougo.pdf・全12頁）を
 * R7年度発表資料ハブページ経由でWebSearchにより発見。全日制の全12頁をRead toolで直読みし、
 * 9頁目末尾「公立合計」行（募集定員17,084・志願者数（変更後）18,183・志願倍率1.06）を転記
 * （18183/17084=1.0643…≈1.06で印字済み倍率と整合）。独立したリセモム確定記事（2025年2月27日
 * 発表）でも同一の3数値（17,084/18,183/1.06）を確認済み。
 */
const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.pref.shizuoka.jp/_res/projects/default_project/_page_/001/063/460/r7sigansyasuuhenkougo.pdf',
  sourceTitle: '静岡県教育委員会 令和7年度静岡県公立高等学校入学者選抜 志願者数一覧（変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立合計', quota: 17084, applicants: 18183, rate: 1.06 },
};

/**
 * 令和6年度（2024年度）: R7/R8と同一シリーズのリセモム確定記事（2024年2月29日発表・志願変更後）
 * をWebFetchで直接引用。全日制「公立合計」: 募集定員17,699・志願者数18,702・志願倍率1.06
 * （18702/17699=1.0567…≈1.06で整合。記事は「前年度（令和5年度）同期比+0.02ポイント」とも
 * 明記）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/29/76172.html',
  sourceTitle: 'リセモム「【高校受験2024】静岡県公立高、一般選抜志願状況（確定）静岡1.18倍」（静岡県教育委員会 令和6年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立合計', quota: 17699, applicants: 18702, rate: 1.06 },
};

/**
 * 令和5年度（2023年度）: R6/R7/R8と同一シリーズのリセモム確定記事（2023年2月24日発表・
 * 志願変更後）をWebFetchで直接引用。全日制「公立合計」: 募集定員18,598・志願者数19,284・
 * 志願倍率1.04（19284/18598=1.0369…≈1.04で整合。記事本文にも同数値が明記）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/24/71106.html',
  sourceTitle: 'リセモム「【高校受験2023】静岡県公立高、一般選抜志願状況（確定）静岡1.14倍」（静岡県教育委員会 令和5年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立合計', quota: 18598, applicants: 19284, rate: 1.04 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7/R8と同一シリーズのリセモム確定記事（2022年2月24日発表・
 * 志願変更後）をWebFetchで直接引用。全日制「一般選抜」全体: 募集定員18,874・志願者数19,289・
 * 志願倍率1.02（19289/18874=1.0220…≈1.02で整合。記事本文に「募集定員1万8,874人に対し、
 * 志願者数は1万9,289人、志願倍率は1.02倍」と明記）。独立した第2ソース（教委一次PDF・他媒体
 * 記事）は複数回のWebSearchで発見できなかったため、正直にリセモム単一ソースとして収録
 * （捏造なし）。これでshizuokaは5年連続（R4〜R8）収録で満了。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/24/65961.html',
  sourceTitle: 'リセモム「【高校受験2022】静岡県公立高、一般選抜志願状況（確定）静岡1.20倍」（静岡県教育委員会 令和4年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制（公立合計相当）', quota: 18874, applicants: 19289, rate: 1.02 },
};

export const SHIZUOKA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'shizuoka',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
