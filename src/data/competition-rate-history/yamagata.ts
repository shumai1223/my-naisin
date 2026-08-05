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

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/yamagata.tsが確定済みのofficialSubtotals「全日制公立合計」行をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.yamagata.jp/documents/42443/r8koukiippannsigannjoukyouhp.pdf',
  sourceTitle: '山形県教育委員会 令和8年度山形県公立高等学校入学者選抜 後期（一般）選抜 志願状況',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 4404, applicants: 2973, rate: 0.68 },
};

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

/**
 * 令和3年度（2021年度）: R4-R7と同一シリーズの一次PDF（r3siganjoukyou.pdf・令和3年2月26日
 * 発表・全4頁）を教委の年度別ハブページ（r3nyuusennkannkei.html）経由でWebSearchにより発見。
 * Read toolで全頁直読み成功。「全日制公立合計」行（一般選抜定員6,227・一般選抜志願者数5,351・
 * 一般選抜志願倍率0.86）を直接転記（5351/6227=0.8593…≈0.86で印字済み値と整合・「全日制県立
 * 合計」6,011/5,077と「全日制市立合計」216/274の内訳合算(quota=6011+216=6227・
 * applicants=5077+274=5351)とも完全一致し資料内二重検証済み・R4/R5/R6/R7と同じ「全日制公立
 * 合計」スコープ）。定時制課程はR4-R7と同じ理由でスコープ外。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.yamagata.jp/documents/5056/r3siganjoukyou.pdf',
  sourceTitle: '山形県教育委員会 令和3年度山形県公立高等学校入学者選抜 一般入学者選抜 志願状況',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 6227, applicants: 5351, rate: 0.86 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3〜R7と同一シリーズのリセモム確定記事（2020年2月27日
 * 発表）をWebFetchで直接引用。「全日制課程の一般選抜定員6,143人に対し、5,710人が志願し、
 * 志願倍率は0.93倍」と明記（5710/6143=0.9295…≈0.93で整合）。「全日制県立の合計」5,924/5,407
 * と「全日制市立（山形市立商業）の合計」219/303の内訳合算(quota=5924+219=6143・
 * applicants=5407+303=5710)とも完全一致し、記事内二重検証が取れている。R3〜R7と同じ「全日制
 * 公立合計」スコープ。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/02/27/54995.html',
  sourceTitle:
    'リセモム「【高校受験2020】山形県公立高、一般選抜の志願状況（確定）山形東（探究）2.49倍など」（山形県教育委員会 令和2年度一般入学者選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制公立合計', quota: 6143, applicants: 5710, rate: 0.93 },
};

export const YAMAGATA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'yamagata',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
