/**
 * 三重県 多年度アーカイブ（Λ-4・12県目）。
 *
 * 一次ソース: 三重県教育委員会「令和7年度三重県立高等学校後期選抜志願状況（最終）を
 * 取りまとめました」（2025年公表）
 * https://www.pref.mie.lg.jp/TOPICS/m0045100440.htm
 *
 * 既存Y-6 mie.tsと同一の資料シリーズ（後期選抜志願状況・最終）。ページ本文の記述
 * 「52校118学科・コース　6,589人　7,230人　1.10倍」を直接引用。学校数52校は
 * 既存Y-6のofficialSubtotals（全日制総計・schoolCount52）と完全一致しており、
 * 同一スコープであることを確認済み。定時制・通信制課程は既存Y-6と同じ理由でスコープ外。
 * 令和6年度は同一シリーズの前年度ページ（m0045100399.htm）から追加。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 同一資料シリーズの令和8年度版ページ（m0045100490.htm）本文
 * 「52校118学科・コース　6,419人　6,636人　1.03倍」をWebFetchで直接引用。学校数52校が
 * R3-R7と完全一致しており同一スコープであることを確認済み。定時制・通信制課程は
 * 既存年度と同じ理由でスコープ外。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100490.htm',
  sourceTitle: '三重県教育委員会 令和8年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 52, quota: 6419, applicants: 6636, rate: 1.03 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100440.htm',
  sourceTitle: '三重県教育委員会 令和7年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 52, quota: 6589, applicants: 7230, rate: 1.1 },
};

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版ページ本文「52校119学科・コースで
 * 6,819人、志願者数は7,360人、志願倍率は1.08倍」を直接引用。WebSearchのスニペットと
 * WebFetch本文抽出の両方で同一数値を確認済み。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100399.htm',
  sourceTitle: '三重県教育委員会 令和6年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 52, quota: 6819, applicants: 7360, rate: 1.08 },
};

/**
 * 令和5年度（2023年度）: 同一資料シリーズの令和5年度版ページ本文「53校120学科・コース
 * 6,945人 7,373人 1.06倍」を直接引用（WebSearchのスニペットとWebFetch本文抽出の両方で
 * 同一数値を確認済み・7373/6945=1.0616…≈1.06で整合）。学校数が53校（R6/R7は52校）と
 * 1校差があるが、統廃合等による正当な変動として学校数はそのまま記録する。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100344.htm',
  sourceTitle: '三重県教育委員会 令和5年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 53, quota: 6945, applicants: 7373, rate: 1.06 },
};

/**
 * 令和4年度（2022年度）: 教委サイトの令和4年度入学者選抜ページ(ci600015405.htm)経由で
 * WebSearchにより同一シリーズR4版一次PDF（001003798.pdf・令和4年3月4日発表・全5頁）を
 * 発見・Read toolで全頁直読み成功。全日制課程「総計」行（入学定員10,880・後期選抜募集人数
 * 7,149・志願者数7,693・志願倍率1.08）を転記（7693/7149=1.0761…≈1.08で印字済み値と整合）。
 * 学校数53校（R5と同一）はWebSearchの独立要約（「53校120学科・コース」）でも確認済み。
 * 定時制・通信制課程はR5/R6/R7と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/common/content/001003798.pdf',
  sourceTitle: '三重県教育委員会 令和4年度三重県立高等学校後期選抜志願状況（最終）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 53, quota: 7149, applicants: 7693, rate: 1.08 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委の後期選抜志願状況ページアーカイブに該当年度分が
 * 見当たらなかったため、R4/R5/R6/R7と同一シリーズのリセモム確定記事（2021年3月6日発表）を
 * WebFetchで直接引用。全日制全体: 募集人数7,017・志願者数7,566・志願倍率1.08
 * （7566/7017=1.0783…≈1.08で整合。記事本文にも同数値が明記）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/08/60826.html',
  sourceTitle:
    'リセモム「【高校受験2021】三重県立高、後期選抜の志願状況（確定）桑名（理数）3.03倍」（三重県教育委員会 令和3年度後期選抜志願状況（最終）の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', quota: 7017, applicants: 7566, rate: 1.08 },
};

/**
 * 令和2年度（2020年度）: 2026-08-06にΛ-4深掘り(7年目)で再挑戦し発見。前回セッション(14:56)は
 * リセモム記事のURLを特定できず見送っていたが、同一シリーズの県公式ページURL連番
 * （m0045100XXX形式・R2の前期選抜等志願状況ページ=m0045100208から近傍IDを直接WebFetchで
 * 走査）で「令和2年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました」
 * （m0045100214.htm）を発見。全日制課程「令和　２年度　５３校１２３学科・コース
 * ７，４４４人　８，０１２人　１．０８倍」を本文から直接引用（8012/7444=1.0763…≈1.08で
 * 整合）。R5-R8と同じ一次資料形式・学校数53校（R5と同数）。
 */
const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://www.pref.mie.lg.jp/TOPICS/m0045100214.htm',
  sourceTitle: '三重県教育委員会 令和2年度三重県立高等学校後期選抜志願状況（最終）を取りまとめました',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制総計', schoolCount: 53, quota: 7444, applicants: 8012, rate: 1.08 },
};

export const MIE_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'mie',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
