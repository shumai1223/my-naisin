/**
 * 新潟県 多年度アーカイブ（Λ-4・28県目）。
 *
 * 一次ソース: 新潟県教育委員会「令和7年度新潟県公立高等学校入学者選抜一般選抜志願状況」
 * （2025年2月19日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/19/80880.html
 *
 * 既存Y-6 niigata.tsの一次ソースURLは年度非依存の常設パス（毎年上書きされる形式）のため、
 * 現在アクセスすると最新年度分に置き換わっており過去年度分の直接取得ができない。教委発表を
 * 報じたリセモム記事から「全日制課程は一般選抜の募集人数11,567人に対し、志願者数11,931人で、
 * 平均志願倍率は1.03倍」を直接引用（11931/11567=1.0315…≈1.03で整合。WebSearch要約とも
 * 独立一致）。Y-6と同じ「特色化選抜合格内定者数を除く一般選抜」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/niigata.tsが確定済みのofficialSubtotals「全日制合計」行をそのまま転記（新規リサーチ不要・2026-08-05発見）。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://kyouikucho.nein.ed.jp/koukoukyouiku/senbatu/koukou/ippan_henkogo.pdf',
  sourceTitle: '新潟県教育委員会 令和8年度新潟県公立高等学校入学者選抜一般選抜志願変更後の志願状況一覧',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制合計', quota: 11709, applicants: 11679, rate: 0.99 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/19/80880.html',
  sourceTitle:
    'リセモム「新潟県公立高、一般選抜の志願状況」（新潟県教育委員会 令和7年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 11567, applicants: 11931, rate: 1.03 },
};

/**
 * 令和6年度（2024年度）: R7と同じスコープ（特色化選抜合格内定者数を除く一般選抜）のリセモム
 * 確定記事（2024年2月29日発表）をWebSearch要約（新潟日報の独立記事も一致）とWebFetch直接
 * 引用の2回で同一数値を確認して採用。全日制課程「一般選抜」全体: 募集人数12,168・志願者数
 * 12,551・平均志願倍率1.03（12551/12168=1.0315…≈1.03で整合）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/29/76186.html',
  sourceTitle:
    'リセモム「新潟県公立高、一般選抜の志願状況（確定）」（新潟県教育委員会 令和6年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 12168, applicants: 12551, rate: 1.03 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同じスコープ（特色化選抜合格内定者数を除く一般選抜）の
 * リセモム確定記事（2023年3月1日発表）をWebFetchで直接引用。全日制課程「一般選抜」全体:
 * 募集人数12,366・志願者数12,893・志願倍率1.04（12893/12366=1.0426…≈1.04で整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/03/01/71176.html',
  sourceTitle:
    'リセモム「【高校受験2023】新潟県公立高、一般選抜の志願状況（確定）新潟（理数）1.85倍」（新潟県教育委員会 令和5年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 12366, applicants: 12893, rate: 1.04 },
};

/**
 * 令和4年度（2022年度）: 教委のR4年度用ハブページ経由で同一シリーズの一次PDF（令和4年度
 * 一般選抜志願変更後の志願状況発表資料・令和4年2月25日発表・全6頁）を発見・Read toolで
 * 直読み。「全日制合計」行（募集人数326学級/12,841・志願者数13,324・倍率1.03）を転記
 * （倍率は教委の注記通り小数第3位以下切り捨てのため13324/12841=1.0376…を切り捨てると1.03
 * で印字済み値と整合。標準的な四捨五入では1.04になる点に注意）。R6/R7と同じ「特色化選抜
 * 合格内定者数を除く一般選抜」のスコープ。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.niigata.lg.jp/uploaded/attachment/305241.pdf',
  sourceTitle: '新潟県教育委員会 令和4年度新潟県公立高等学校入学者選抜一般選抜志願変更後の志願状況発表資料',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 12841, applicants: 13324, rate: 1.03 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。R4〜R7と同一シリーズのリセモム確定記事（2021年2月26日
 * 発表）をWebFetchで直接引用。全日制課程「一般選抜」全体: 募集人数12,552・志願者数13,289・
 * 平均志願倍率1.05（教委発表の印字済み値をそのまま採用）。⚠️注記: 13289/12552を単純計算すると
 * 1.0587…となり通常の四捨五入では1.06になるが印字済み倍率は1.05（yamanashi R4エントリで
 * 既知の「単純計算と印字値の不一致」パターンと同型）と推測し、自前で丸め直さず印字済みの
 * 確定値をそのまま正直に転記した。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/01/60703.html',
  sourceTitle:
    'リセモム「【高校受験2021】新潟県公立高、一般選抜の志願状況（確定）新潟（理数）1.91倍」（新潟県教育委員会 令和3年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 12552, applicants: 13289, rate: 1.05 },
};

/**
 * 令和2年度（2020年度）: 5年→6年横展開。R3〜R7と同じスコープ（一般選抜）のリセモム確定記事
 * （2020年3月2日発表）をWebSearch要約とWebFetch直接引用の2回で同一数値を確認して採用。
 * 全日制課程「一般選抜」全体: 募集人員13,172・志願者数14,121・志願倍率1.07
 * （14121/13172=1.0721…≈1.07で整合。記事本文にも同数値が明記）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/03/02/55067.html',
  sourceTitle:
    'リセモム「【高校受験2020】新潟県公立高、一般選抜の志願状況・倍率（確定）新潟南（理数コース）2.05倍」（新潟県教育委員会 令和2年度一般選抜志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制課程（特色化選抜合格内定者数を除く）', quota: 13172, applicants: 14121, rate: 1.07 },
};

export const NIIGATA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'niigata',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
