/**
 * 岐阜県 多年度アーカイブ（Λ-4・8県目）。
 *
 * 一次ソース: 岐阜県教育委員会高校教育課「令和7年度岐阜県公立高等学校第一次・連携型選抜
 * 変更後出願者数総括表」（2025年2月18日正午締切時）
 * https://www.pref.gifu.lg.jp/uploaded/attachment/433066.pdf
 *
 * 既存Y-6 gifu.tsと同一の資料シリーズ（総括表・全日制の課程・第一次選抜＋連携型選抜込み）。
 * 「Ⅰ 第一次選抜 1 全日制の課程」の「総計」行（定員12,885・出願者数12,376・倍率0.96）を
 * 直接転記した。テキスト抽出が明瞭でビジョン解析の誤読リスクは低い。定時制課程は
 * 既存Y-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.gifu.lg.jp/uploaded/attachment/433066.pdf',
  sourceTitle: '岐阜県教育委員会高校教育課 令和7年度岐阜県公立高等学校第一次・連携型選抜 変更後出願者数総括表',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 総計（第一次選抜＋連携型選抜込み）', quota: 12885, applicants: 12376, rate: 0.96 },
};

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版（2024-02-20正午締切時公表）を発見。
 * 「Ⅰ第一次選抜 1 全日制の課程」の「総計」行（定員13,121・出願者数12,829・倍率0.98）を
 * 直接転記。分野別11区分の内訳合計も総計と完全一致することを手計算で確認済み（R7と同じ
 * granularity='grand-total-only'に揃えた・区分別内訳は将来必要になれば追加できる）。
 * 出願者数12,829人はWebSearchで見つかった独立記事の要約（全日制12,829人）とも一致。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.gifu.lg.jp/uploaded/attachment/407489.pdf',
  sourceTitle: '岐阜県教育委員会高校教育課 令和6年度岐阜県公立高等学校第一次・連携型選抜 変更後出願者数総括表',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 総計（第一次選抜＋連携型選抜込み）', quota: 13121, applicants: 12829, rate: 0.98 },
};

/**
 * 令和5年度（2023年度）: 同一資料シリーズの令和5年度版原本PDF（attachment/339539.pdf）への
 * 直接アクセスは404で失効済みのため、教委発表を報じたリセモム確定記事（2023年2月22日発表）を
 * 採用。全日制の課程「総計」: 定員13,121・出願者数12,729・倍率0.97（12729/13121=0.9701…
 * ≈0.97で整合。学習塾サイト「同学塾」の独立記事要約でも出願者数12,729人が一致）。R6と定員が
 * 同一の13,121人である点は独立2ソースで確認済みのため誤記ではない。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/22/71077.html',
  sourceTitle:
    'リセモム「岐阜県公立高、第1次選抜の出願状況（確定）」（岐阜県教育委員会 令和5年度第一次選抜変更後出願者数総括表の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 総計（第一次選抜＋連携型選抜込み）', quota: 13121, applicants: 12729, rate: 0.97 },
};

export const GIFU_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'gifu',
  years: [REIWA_7, REIWA_6, REIWA_5],
};
