/**
 * 高知県 多年度アーカイブ（Λ-4・23県目）。
 *
 * 一次ソース: 高知県教育委員会「令和7年度Ａ日程等志願先変更後の状況（学校別）」
 * （令和7年2月6日発表・2月10日修正・全2ページ）。
 * https://www.pref.kochi.lg.jp/doc/r7_siganjokyo/file_contents/070206_Anittei_henkogo.pdf
 *
 * 既存Y-6 kochi.tsと同一資料シリーズ（Ａ日程のみ採用・Ｂ日程は他県の2次募集と同種のため対象外）。
 * 全日制「合計」行（県立計＋市立計）を直接転記: 募集定員(quota)=4,949・第1志望者数(applicants)
 * =3,399・志願率(rate)=0.69（印字済み値をそのまま採用）。Y-6が個票転記で直面した高知国際高校
 * グローバル探究学科（募集定員「若干名」で数値化不能）の扱いは、grand-total-onlyの本ファイルでは
 * 教委発表の合計行をそのまま採用するため影響しない。多部制単位制・連携型中高一貫特別選抜は
 * Y-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r7_siganjokyo/file_contents/070206_Anittei_henkogo.pdf',
  sourceTitle: '高知県教育委員会 令和7年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4949, applicants: 3399, rate: 0.69 },
};

export const KOCHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kochi',
  years: [REIWA_7],
};
