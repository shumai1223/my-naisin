/**
 * 鹿児島県 多年度アーカイブ（Λ-4・22県目）。
 *
 * 一次ソース: 鹿児島県教育委員会「令和7年度鹿児島県公立高等学校入学最終出願者数」
 * （令和7年2月21日・学区別7学区分・全7ページ）。
 * https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/119293_20250221172257-1.pdf
 *
 * 既存Y-6 kagoshima.tsと同一資料シリーズ。教委の年度別ハブページ（r7saisyusyutugansya.html）
 * 経由でR7版を発見。1ページ目の県立・市立内訳表に「全日制 計」行があり、そのまま6ページ目末尾の
 * 「全日制　合計」行とも一致する: 募集定員11,641・学力検査定員(quota)=10,398・
 * 最終出願者数(applicants)=8,455（括弧内163は全日制普通科「一定枠」の内数再掲・Y-6と同じ理由で
 * 別枠加算しない）・倍率(rate)=0.81。Y-6と同じ列定義（学力検査定員＝募集定員－推薦等内定者数）
 * を採用。定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: R5〜R7と同一シリーズの一次PDF（令和8年3月4日付訂正版・
 * 126595_20260304191737-1.pdf・全7頁）を教委のR8年度用ハブページ（r8saisyuusyutugan.html）
 * 経由で発見・Read toolで直読み。1頁目の総括表「計」行と6頁目末尾の「全日制 合計」行の両方で
 * 完全一致確認: 学力検査定員(quota)=10,349・最終出願者数(applicants)=7,948（括弧内182は
 * 全日制普通科「一定枠」の再掲・既存年度と同じ理由で別枠加算しない）・倍率(rate)=0.77
 * （7948/10349=0.7680…≈0.77で印字済み値と整合）。R5-R7と同じ理由で定時制課程はスコープ外。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl:
    'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/126595_20260304191737-1.pdf',
  sourceTitle: '鹿児島県教育委員会 令和8年度公立高等学校入学者選抜学力検査最終出願者数（訂正版）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 10349, applicants: 7948, rate: 0.77 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r7/documents/119293_20250221172257-1.pdf',
  sourceTitle: '鹿児島県教育委員会 令和7年度鹿児島県公立高等学校入学最終出願者数',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 10398, applicants: 8455, rate: 0.81 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズの一次PDF（111707_20240221200102-1.pdf・全7頁）を
 * 教委のR6年度用ハブページ経由で発見・Read toolで直読み。1頁目の総括表「全日制 計」行
 * （学力検査定員(quota)=10,957・最終出願者数(applicants)=9,205・倍率(rate)=0.84）を転記
 * （9205/10957=0.8401…≈0.84で印字済み値と整合）。6頁目末尾の「全日制 合計」行とも完全一致
 * し、同一資料内の二重検証が取れている。R7と同じ理由で定時制課程はスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl:
    'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r6/documents/111707_20240221200102-1.pdf',
  sourceTitle: '鹿児島県教育委員会 令和6年度鹿児島県公立高等学校入学最終出願者数',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 10957, applicants: 9205, rate: 0.84 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズの一次PDF（104440_20230221160804-1.pdf・全7頁）を
 * 教委のR3年度用ハブページ（r5saisyuushutugannsyasuu.html・URLパスはr3配下だがタイトルはr5、
 * 年度とディレクトリが一致しない罠に注意）経由で発見・Read toolで直読み。1頁目の総括表「計」行
 * （学力検査定員(quota)=11,094・最終出願者数(applicants)=9,025・倍率(rate)=0.81）を転記
 * （9025/11094=0.8135…≈0.81で印字済み値と整合）。6頁目末尾の「全日制 合計」行とも完全一致
 * し、同一資料内の二重検証が取れている。R6/R7と同じ理由で定時制課程はスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl:
    'https://www.pref.kagoshima.jp/ba05/kyoiku-bunka/school/koukou/nyushi/r3/documents/104440_20230221160804-1.pdf',
  sourceTitle: '鹿児島県教育委員会 令和5年度鹿児島県公立高等学校入学最終出願者数',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 11094, applicants: 9025, rate: 0.81 },
};

/**
 * 令和4年度（2022年度）: 教委公式ページ(r4syutugansyasu.html)は404だったため、リセモム確定記事
 * （2022年2月25日発表・「県立・市立合計」で報道）をWebFetchで直接引用。学力検査定員(quota)=
 * 11,260・出願者数(applicants)=9,187・倍率(rate)=0.82（9187/11260=0.8159…≈0.82で整合）。
 * R5-R8の「全日制 合計」（県立+市立combined）と同一スコープであることを記事の「県立・市立合計」
 * という明記で確認済み。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/25/65975.html',
  sourceTitle:
    'リセモム「【高校受験2022】鹿児島県公立高、一般選抜の出願状況（確定）鶴丸1.45倍」（鹿児島県教育委員会 令和4年度公立高等学校入学者選抜学力検査確定出願状況の発表を引用）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 11260, applicants: 9187, rate: 0.82 },
};

export const KAGOSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kagoshima',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
