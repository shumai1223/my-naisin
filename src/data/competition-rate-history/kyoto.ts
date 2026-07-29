/**
 * 京都府 多年度アーカイブ（Λ-4・24県目）。
 *
 * 一次ソース: 京都府教育委員会「令和7年度京都府公立高等学校入学者選抜 中期選抜志願者数等一覧表」
 * （令和7年3月5日発表・全4ページ）。
 * https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/03/%E4%BB%A4%E5%92%8C%EF%BC%97%E5%B9%B4%E5%BA%A6%E4%B8%AD%E6%9C%9F%E9%81%B8%E6%8A%9C-%E5%BA%83%E5%A0%B1%E8%B3%87%E6%96%99%EF%BC%88%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%89.pdf
 *
 * 既存Y-6 kyoto.tsと同一資料シリーズ（中期選抜のみ採用・前期選抜は既に合格確定の別プロセスの
 * ためスコープ外）。全日制「計」行を直接転記: 中期選抜募集人員(quota)=6,006・志願者数
 * (applicants)=5,635（第1志望第1順位人数）・倍率(rate)=0.94（印字済み値・D/C=5635/6006=0.938
 * …≈0.94で整合）。Y-6と同じ列定義。定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2025/03/%E4%BB%A4%E5%92%8C%EF%BC%97%E5%B9%B4%E5%BA%A6%E4%B8%AD%E6%9C%9F%E9%81%B8%E6%8A%9C-%E5%BA%83%E5%A0%B1%E8%B3%87%E6%96%99%EF%BC%88%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%89.pdf',
  sourceTitle: '京都府教育委員会 令和7年度京都府公立高等学校入学者選抜 中期選抜志願者数等一覧表',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 6006, applicants: 5635, rate: 0.94 },
};

export const KYOTO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kyoto',
  years: [REIWA_7],
};
