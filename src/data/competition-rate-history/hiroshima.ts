/**
 * 広島県 多年度アーカイブ（Λ-4）。
 *
 * 一次ソース: 広島県教育委員会「公立高等学校入学者選抜一次選抜等の志願状況について」
 * 令和8年度: https://www.pref.hiroshima.lg.jp/uploaded/attachment/653718.pdf（2026-02-18最終志願者数）
 * 令和7年度: https://www.pref.hiroshima.lg.jp/uploaded/attachment/606791.pdf（2025-02-10現在志願者数）
 *
 * 全日制本校（学科系統別・11区分）の「小計」行を全日制合計として採用する
 * （全日制分校・定時制・フレキシブルは対象外。東京都等と同じ「全日制の課程」スコープ）。
 * 区分別内訳の合計はいずれの年度も原資料の小計行と完全一致することを確認済み
 * （__tests__/hiroshima.test.tsでsumCategories突合）。
 *
 * **粒度に関する注記**: 令和8年度は「2月18日最終志願者数」（志願変更後の確定値）を採用したが、
 * 令和7年度の一次資料は「2月10日現在志願者数」のみで「最終」版を発見できなかった（同年度の
 * 最終版PDFが見つからず、志願変更前の速報値の可能性がある）。年度間で速報値/確定値が混在する
 * 点は正直に記録し、令和7年度の最終確定値が見つかれば差し替えることを次回以降の課題とする。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/653718.pdf',
  sourceTitle: '広島県教育委員会 令和8年度公立高等学校入学者選抜一次選抜等の志願状況について（2月18日最終志願者数）',
  fetchedAt: '2026-08-01',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科', quota: 8604, applicants: 8581, rate: 1.0 },
    { label: '地域社会学科', quota: 240, applicants: 211, rate: 0.88 },
    { label: '農業科', quota: 589, applicants: 418, rate: 0.71 },
    { label: '工業科', quota: 1440, applicants: 1071, rate: 0.74 },
    { label: '商業科', quota: 1160, applicants: 934, rate: 0.81 },
    { label: '家庭科', quota: 240, applicants: 178, rate: 0.74 },
    { label: '看護科', quota: 40, applicants: 44, rate: 1.1 },
    { label: '福祉科', quota: 40, applicants: 13, rate: 0.33 },
    { label: '体育科', quota: 80, applicants: 80, rate: 1.0 },
    { label: '国際科', quota: 40, applicants: 17, rate: 0.43 },
    { label: '総合学科', quota: 2200, applicants: 2190, rate: 1.0 },
  ],
  grandTotal: { label: '全日制本校 小計', quota: 14673, applicants: 13737, rate: 0.94 },
};

/** 一次資料に「最終」版の注記が無く、志願変更前の速報値の可能性がある（上記コメント参照）。 */
const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/606791.pdf',
  sourceTitle: '広島県教育委員会 令和7年度公立高等学校入学者選抜一次選抜等の志願状況について（2月10日現在志願者数）',
  fetchedAt: '2026-08-01',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科', quota: 8599, applicants: 9088, rate: 1.06 },
    { label: '地域社会学科', quota: 240, applicants: 262, rate: 1.09 },
    { label: '農業科', quota: 589, applicants: 405, rate: 0.69 },
    { label: '工業科', quota: 1440, applicants: 1208, rate: 0.84 },
    { label: '商業科', quota: 1160, applicants: 1012, rate: 0.87 },
    { label: '家庭科', quota: 240, applicants: 170, rate: 0.71 },
    { label: '看護科', quota: 40, applicants: 67, rate: 1.68 },
    { label: '福祉科', quota: 40, applicants: 18, rate: 0.45 },
    { label: '体育科', quota: 80, applicants: 77, rate: 0.96 },
    { label: '国際科', quota: 40, applicants: 41, rate: 1.03 },
    { label: '総合学科', quota: 2200, applicants: 2432, rate: 1.11 },
  ],
  grandTotal: { label: '全日制本校 小計', quota: 14668, applicants: 14780, rate: 1.01 },
};

/**
 * 令和6年度（2024年度）: 「2月20日最終志願者数」（志願変更後の確定値・R8と同じ粒度）を採用。
 * R7/R8に存在する「地域社会学科」区分がこの年度にはまだ無い（10区分のみ）。これは学科新設に
 * 伴う正直な差分であり、区分別内訳合計（quota 14,660・applicants 14,739）が原資料の
 * 「全日制本校 小計」行と完全一致することを確認済み（__tests__/hiroshima.test.ts）。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/565763.pdf',
  sourceTitle: '広島県教育委員会 令和6年度公立高等学校入学者選抜一次選抜等の志願状況について（2月20日最終志願者数）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科', quota: 8832, applicants: 9401, rate: 1.06 },
    { label: '農業科', quota: 588, applicants: 414, rate: 0.70 },
    { label: '工業科', quota: 1440, applicants: 1084, rate: 0.75 },
    { label: '商業科', quota: 1160, applicants: 1156, rate: 1.00 },
    { label: '家庭科', quota: 240, applicants: 194, rate: 0.81 },
    { label: '看護科', quota: 40, applicants: 48, rate: 1.20 },
    { label: '福祉科', quota: 40, applicants: 16, rate: 0.40 },
    { label: '体育科', quota: 80, applicants: 80, rate: 1.00 },
    { label: '国際科', quota: 40, applicants: 41, rate: 1.03 },
    { label: '総合学科', quota: 2200, applicants: 2305, rate: 1.05 },
  ],
  grandTotal: { label: '全日制本校 小計', quota: 14660, applicants: 14739, rate: 1.01 },
};

/**
 * 令和5年度（2023年度）: 「令和5年度広島県公立高等学校入学者選抜一次選抜...の志願状況」
 * （最終志願状況・2月20日現在・全5頁・R6と同じ「最終」粒度）を発見・Read toolで全頁直読み成功
 * （前回セッションでは11頁超のPDFがpoppler未導入エラーでpages指定不可としてブロックされていたが、
 * 本セッションのsaitama R5追加で「pages指定は再試行の価値がある」ことを実証済みで、本ファイルは
 * 5頁のため素直に成功した）。R6と同じくこの年度も「地域社会学科」区分は未設置（10区分のみ）。
 * 区分別内訳合計（quota 14,870・applicants 14,938）が原資料の「全日制本校 小計」行と完全一致する
 * ことを確認済み（__tests__/hiroshima.test.ts）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.hiroshima.lg.jp/uploaded/attachment/520160.pdf',
  sourceTitle: '広島県教育委員会 令和5年度公立高等学校入学者選抜一次選抜等の志願状況について（2月20日最終志願者数）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'category-detail',
  categories: [
    { label: '普通科', quota: 9043, applicants: 9558, rate: 1.06 },
    { label: '農業科', quota: 587, applicants: 448, rate: 0.76 },
    { label: '工業科', quota: 1440, applicants: 1210, rate: 0.84 },
    { label: '商業科', quota: 1160, applicants: 1106, rate: 0.95 },
    { label: '家庭科', quota: 240, applicants: 173, rate: 0.72 },
    { label: '看護科', quota: 40, applicants: 50, rate: 1.25 },
    { label: '福祉科', quota: 40, applicants: 23, rate: 0.58 },
    { label: '体育科', quota: 80, applicants: 81, rate: 1.01 },
    { label: '国際科', quota: 40, applicants: 34, rate: 0.85 },
    { label: '総合学科', quota: 2200, applicants: 2255, rate: 1.03 },
  ],
  grandTotal: { label: '全日制本校 小計', quota: 14870, applicants: 14938, rate: 1.0 },
};

export const HIROSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'hiroshima',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5],
};
