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

/**
 * 令和6年度（2024年度）: 同一シリーズの令和6年度版広報資料
 * （https://www.kyoto-be.ne.jp/koukyou/cms/?p=4184 経由・令和6年3月1日発表・全4頁）を発見。
 * R7と同じ列定義（全日制「計」行の中期選抜募集人員C=A-B・志願者数D・倍率D/C）で
 * quota=6,108・applicants=6,027・rate=6027/6108=0.9867…→0.99（資料内印字済み倍率と一致）。
 * 学校別内訳表（2〜3頁目）の全日制合計行とも完全一致することを確認済み。定時制課程はR7と
 * 同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl:
    'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2024/03/%E4%BB%A4%E5%92%8C%EF%BC%96%E5%B9%B4%E5%BA%A6%E4%B8%AD%E6%9C%9F%E9%81%B8%E6%8A%9C-%E5%BA%83%E5%A0%B1%E8%B3%87%E6%96%99%EF%BC%88%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%89.pdf',
  sourceTitle: '京都府教育委員会 令和6年度京都府公立高等学校入学者選抜 中期選抜志願者数等一覧表',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 6108, applicants: 6027, rate: 0.99 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズの広報資料
 * （https://www.kyoto-be.ne.jp/koukyou/cms/?p=2856 経由・令和5年3月3日発表・全4頁）を発見。
 * R6/R7と同じ列定義（全日制「計」行の中期選抜募集人員C=A-B・志願者数D・倍率D/C）で
 * quota=6,096・applicants=5,935・rate=5935/6096=0.9736…→0.97（資料内印字済み倍率と一致）。
 * 学校別内訳表（2〜3頁目）の全日制計行とも完全一致することを確認済み。定時制課程はR6/R7と
 * 同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl:
    'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2023/03/15-3.3-令和５年度中期選抜広報資料（志願者数）.pdf',
  sourceTitle: '京都府教育委員会 令和5年度京都府公立高等学校入学者選抜 中期選抜志願者数等一覧表',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 6096, applicants: 5935, rate: 0.97 },
};

/**
 * 令和4年度（2022年度）: R5-R7と同一シリーズの広報資料
 * （https://www.kyoto-be.ne.jp/koukyou/cms/?p=1262 経由・令和4年3月3日発表・全5頁）を発見。
 * R5-R7と同じ列定義（全日制「計」行の中期選抜募集人員C=A-B・志願者数D・倍率D/C）で
 * quota=6,424・applicants=6,414・rate=6414/6424=0.9984…→1.00（資料内印字済み倍率と一致）。
 * 1頁目総括表と4頁目末尾行の両方で完全一致することを確認済み。定時制課程はR5-R7と
 * 同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl:
    'https://www.kyoto-be.ne.jp/koukyou/cms/wp-content/uploads/2022/12/01-【広報資料】-令和４年度中期選抜志願者数.pdf',
  sourceTitle: '京都府教育委員会 令和4年度京都府公立高等学校入学者選抜 中期選抜志願者数等一覧表',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制計', quota: 6424, applicants: 6414, rate: 1.0 },
};

export const KYOTO_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kyoto',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
