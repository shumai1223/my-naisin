/**
 * 長崎県 多年度アーカイブ（Λ-4・26県目→2026-08-06に令和6〜3年度を追加）。
 *
 * 一次ソース: 長崎県教育委員会「令和7年度公立高等学校入学者選抜 一般選抜・定時制課程Ⅰ期選抜
 * 志願状況について」（2025年2月10日発表）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/10/80734.html
 *
 * 既存Y-6 nagasaki.tsと同一資料シリーズ。原本PDFのURL（uploads/{年}/{月}/{unixtime}.pdf）は
 * 年度と機械的に対応せず直接発見に至らなかったため、教委発表を報じたリセモム記事から
 * 「募集人員7,372人（全体8,840人から特別選抜等合格者1,469人を除外）・志願者数5,953人・
 * 志願倍率0.81倍」を直接引用（5953/7372=0.8075…≈0.81で内部整合を確認）。Y-6と同じ列定義
 * （全募集定員－特別選抜等合格者数＝一般選抜定員）。
 *
 * ⚠️制度名の変更（2026-08-06判明）: 長崎県の主要選抜は令和7年度（2025年度）入試から
 * 「特別選抜／一般選抜」の名称に変わった。令和6年度以前は「前期選抜／後期選抜」の
 * 名称で、後期選抜が実質的に一般選抜に相当する枠（実施時期・募集規模とも近い）。
 * このため令和6年度以前の3年分は「後期選抜」の全日制集計を収録している（一般選抜との
 * 単純な連続比較には制度変更の影響が乗る点に注意）。各年度ともリセモム記事をWebFetchで
 * 直接確認し、志願者数÷募集定員が発表倍率と整合することを検算済み。
 * ⚠️令和5年度・令和4年度は志願者数がいずれも4,277人で完全に同一（募集定員は異なる）。
 * 2回別々にリセモム記事本文を直接取得し、それぞれ引用文中に同じ数値が明記されているのを
 * 確認したため転記ミスではないと判断したが、珍しい一致であることを記録として残す。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/10/80734.html',
  sourceTitle:
    'リセモム「長崎県公立高、一般選抜の倍率（確定）」（長崎県教育委員会 令和7年度一般選抜・定時制課程Ⅰ期選抜志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '一般選抜 全日制（全募集定員－特別選抜等合格者数）', quota: 7372, applicants: 5953, rate: 0.81 },
};

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/26/76114.html',
  sourceTitle: 'リセモム「【高校受験2024】長崎県公立高、後期選抜志願状況（確定）」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '後期選抜 全日制', quota: 5250, applicants: 3906, rate: 0.74 },
};

const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/24/71093.html',
  sourceTitle: 'リセモム「【高校受験2023】長崎県公立高、後期選抜志願状況（確定）」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '後期選抜 全日制', quota: 5554, applicants: 4277, rate: 0.77 },
};

const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/25/65983.html',
  sourceTitle: 'リセモム「【高校受験2022】長崎県公立高、後期選抜志願状況（確定）」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '後期選抜 全日制', quota: 5577, applicants: 4277, rate: 0.77 },
};

const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/02/60728.html',
  sourceTitle: 'リセモム「【高校受験2021】長崎県公立高、後期選抜の志願状況（確定）」',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '後期選抜 全日制', quota: 5527, applicants: 4350, rate: 0.79 },
};

export const NAGASAKI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'nagasaki',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
