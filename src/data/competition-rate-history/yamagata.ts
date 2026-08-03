/**
 * 山形県 多年度アーカイブ（Λ-4・37県目）。
 *
 * 一次ソース: 山形県教育委員会「令和7年度山形県公立高等学校入学者選抜 一般入学者選抜 志願状況」
 * （令和7年2月21日発表・全4ページ）。
 * https://www.pref.yamagata.jp/documents/38710/r7ippanshigan.pdf
 *
 * 既存Y-6 yamagata.ts（令和8年度・「後期（一般）選抜」）とは呼称が異なる年度である点に注意:
 * 令和7年度時点では「一般選抜」という単独名称だったが、令和8年度から「後期（一般）選抜」という
 * 呼称に変わっている（前期(特色)選抜との対比を明確化する改称と推測されるが、選抜内容自体は同一
 * スコープ=前期(特色)選抜・連携型選抜内定者数等を控除した募集人員に対する志願状況）。
 * 「全日制公立合計」（県立＋市立）行を直接転記: 募集人員(quota)=5,609・志願者数(applicants)
 * =4,505・志願倍率(rate)=0.80（印字済み値をそのまま採用・Y-6と同じ「全日制公立合計」スコープ）。
 * 定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.yamagata.jp/documents/38710/r7ippanshigan.pdf',
  sourceTitle: '山形県教育委員会 令和7年度山形県公立高等学校入学者選抜 一般入学者選抜 志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 5609, applicants: 4505, rate: 0.8 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズの一次PDF（r6ippanshigan.pdf・令和6年2月22日発表・
 * 全4頁）を教委の年度別ハブページ経由でWebSearchにより発見。Read toolで全頁直読み成功。
 * 「全日制公立合計」行（一般選抜定員5,729・一般選抜志願者数4,518・一般選抜志願倍率0.79）を
 * 直接転記（4518/5729=0.7887…≈0.79で印字済み値と整合・R7と同じ「全日制公立合計」スコープ）。
 * 定時制課程はR7と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.yamagata.jp/documents/31253/r6ippanshigan.pdf',
  sourceTitle: '山形県教育委員会 令和6年度山形県公立高等学校入学者選抜 一般入学者選抜 志願状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 5729, applicants: 4518, rate: 0.79 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズの一次PDF（r5ippanbairitsu.pdf・令和5年2月21日
 * 発表・全5頁）を教委のR5年度用ハブページ経由で発見・Read toolで全頁直読み成功。「全日制公立
 * 合計」行（一般選抜定員5,948・一般選抜志願者数4,869・一般選抜志願倍率0.82）を直接転記
 * （4869/5948=0.8186…≈0.82で印字済み値と整合・R6/R7と同じ「全日制公立合計」スコープ）。
 * 定時制課程はR6/R7と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.yamagata.jp/documents/25535/r5ippanbairitsu.pdf',
  sourceTitle: '山形県教育委員会 令和5年度山形県公立高等学校入学者選抜 一般入学者選抜 志願状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 5948, applicants: 4869, rate: 0.82 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズの一次PDF（r4ippannyuugakusyasigan.pdf・
 * 令和4年2月25日発表・全4頁）を教委のR4年度用ハブページ経由で発見・Read toolで全頁直読み
 * 成功。「全日制公立合計」行（一般選抜定員6,067・一般選抜志願者数5,072・一般選抜志願倍率0.84）
 * を直接転記（5072/6067=0.8360…≈0.84で印字済み値と整合・R5/R6/R7と同じ「全日制公立合計」
 * スコープ）。定時制課程はR5/R6/R7と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.yamagata.jp/documents/18591/r4ippannyuugakusyasigan.pdf',
  sourceTitle: '山形県教育委員会 令和4年度山形県公立高等学校入学者選抜 一般入学者選抜 志願状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 6067, applicants: 5072, rate: 0.84 },
};

export const YAMAGATA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'yamagata',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
