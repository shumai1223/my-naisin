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

export const ISHIKAWA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'ishikawa',
  years: [REIWA_7],
};
