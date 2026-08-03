/**
 * 石川県 多年度アーカイブ（Λ-4・11県目）。
 *
 * 一次ソース: 石川県教育委員会「令和7年度石川県公立高等学校一般入学（全日制）の出願状況」
 * （2025年3月4日公表・確定出願状況）。原本PDFの直接アクセスには至らなかったため、
 * リセモムの報道記事（教委発表を報じたもの）で二重確認した。
 * https://resemom.jp/article/2025/03/06/81145.html
 *
 * 「全日制課程の40校65学科9コースの一般入学枠6,666人に対し、確定出願者数は6,409人、
 * 出願倍率は0.96倍」という記述を直接引用。学校数40校は既存Y-6 ishikawa.tsの
 * officialSubtotals（全県合計・schoolCount40）と完全一致しており、同一スコープであることを
 * 確認済み。数値の内部整合性も確認済み（6,409÷6,666=0.9614→0.96に一致）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/03/06/81145.html',
  sourceTitle: 'リセモム「【高校受験2025】石川県公立高、一般入学の出願状況（確定）金沢錦丘1.53倍」（石川県教育委員会 令和7年度確定出願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全県合計・全日制一般入学', schoolCount: 40, quota: 6666, applicants: 6409, rate: 0.96 },
};

/**
 * 令和6年度（2024年度）: 石川県教育委員会の記者発表資料アーカイブ（r5kyoui/3gatsu.html＝
 * 令和6年3月分）から「令和6年度石川県公立高等学校一般入学(全日制)の受検状況（3月6日）」
 * （全3頁・テキスト埋め込み型PDF）を直接発見。ただしこの資料は入学者選抜学力検査当日
 * （3月7日）の前日公表で、印字済み「受検倍率」は受検者数(J=出願者数-欠席者数)を分母にした
 * 出席ベースの倍率であり、R7がresemom経由で引用した「確定出願倍率」（出願者数そのものを
 * 分子にした倍率）とは算出方法が異なる。scopeをR7に揃えるため、印字済み受検倍率(0.96)は
 * 採用せず、全県合計行の一般入学枠(C=A-B)=6,775・出願者数(H)=6,650を用いて
 * 6650/6775=0.9816…→0.98を自前算出した。学校数40校（40校65学科9コース）はR7と同一。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.ishikawa.lg.jp/kisya/r5kyoui/documents/20240306.pdf',
  sourceTitle: '石川県教育委員会 令和6年度石川県公立高等学校一般入学(全日制)の受検状況（3月6日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全県合計・全日制一般入学', schoolCount: 40, quota: 6775, applicants: 6650, rate: 0.98 },
};

/**
 * 令和5年度（2023年度）: R6と同一シリーズの記者発表資料アーカイブ（kisya/r4kyoui/3gatsu.html＝
 * 令和5年3月分）から「令和5年度石川県公立高等学校一般入学(全日制)の受検状況（3月7日）」
 * （全3頁・テキスト埋め込み型PDF）を直接発見。R6と同じ理由（印字済み「受検倍率」J/Cは
 * 受検者数=出願者数-欠席者数を分母にした出席ベースの倍率でR7とscopeが異なる）で、全県合計行
 * の一般入学枠(C=A-B)=7,003・出願者数(H)=7,067を用いて7067/7003=1.0091…→1.01を自前算出
 * した（R6と同じ計算方針）。学校数40校（40校65学科9コース）はR6/R7と同一。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.ishikawa.lg.jp/kisya/r4kyoui/documents/20230307.pdf',
  sourceTitle: '石川県教育委員会 令和5年度石川県公立高等学校一般入学(全日制)の受検状況（3月7日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全県合計・全日制一般入学', schoolCount: 40, quota: 7003, applicants: 7067, rate: 1.01 },
};

/**
 * 令和4年度（2022年度）: 石川県教育委員会の記者発表資料アーカイブ（kisya/r3kyoui/3gatukyoui.html＝
 * 令和4年3月分）から「令和4年度石川県公立高等学校一般入学(全日制)の受検状況（3月8日）」
 * （全3頁・テキスト埋め込み型PDF）を直接発見。R5/R6と同じ理由（印字済み「受検倍率」J/Cは
 * 受検者数=出願者数-欠席者数を分母にした出席ベースの倍率でR7とscopeが異なる）で、全県合計行
 * の一般入学枠(C=A-B)=6,933・出願者数(H)=6,927を用いて6927/6933=0.9991…→1.00を自前算出
 * した（R5/R6と同じ計算方針）。全県合計の数値は資料内の総括表(1頁目)と学校別内訳表の合計行
 * (3頁目)の2箇所に独立して印字されており、両者が完全一致することで内部整合性を二重確認済み。
 * 学校数40校（40校65学科9コース）はR5/R6/R7と同一。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.ishikawa.lg.jp/kisya/r3kyoui/documents/20220308_2hp.pdf',
  sourceTitle: '石川県教育委員会 令和4年度石川県公立高等学校一般入学(全日制)の受検状況（3月8日）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全県合計・全日制一般入学', schoolCount: 40, quota: 6933, applicants: 6927, rate: 1.0 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委の記者発表資料アーカイブ（kisya/r2kyoui/
 * 3gatukyoui.html＝令和3年3月分）から「令和3年度石川県公立高等学校一般入学(全日制)の
 * 受検状況（3月9日）」（全3頁・修正版・テキスト埋め込み型PDF）を発見・Read toolで直読み。
 * R4/R5/R6と同じ理由（印字済み「受検倍率」J/Cは受検者数=出願者数-欠席者数を分母にした
 * 出席ベースの倍率でR7とscopeが異なる）で、全県合計行の一般入学枠(C=A-B)=6,731・出願者数
 * (H)=6,725を用いて6725/6731=0.9991…→1.00を自前算出した（R4/R5/R6と同じ計算方針）。
 * 1頁目総括表と3頁目学校別内訳表の合計行が完全一致することで内部整合性を確認済み。
 * 学校数40校（40校65学科9コース）はR4/R5/R6/R7と同一。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.ishikawa.lg.jp/kisya/r2kyoui/documents/21210309c.pdf',
  sourceTitle: '石川県教育委員会 令和3年度石川県公立高等学校一般入学(全日制)の受検状況（3月9日・修正版）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全県合計・全日制一般入学', schoolCount: 40, quota: 6731, applicants: 6725, rate: 1.0 },
};

export const ISHIKAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'ishikawa',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
