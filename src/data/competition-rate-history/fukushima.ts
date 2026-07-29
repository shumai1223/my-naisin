/**
 * 福島県 多年度アーカイブ（Λ-4・18県目）。
 *
 * 一次ソース: 福島県教育委員会「令和7年度福島県立高等学校入学者選抜後期選抜志願状況
 * （出願先変更後）について」（別紙2・令和7年3月19日公表・全日制2ページ）。
 * https://www.pref.fukushima.lg.jp/uploaded/attachment/679719.pdf
 *
 * 既存Y-6 fukushima.ts（令和8年度版）と同一資料シリーズ。画像スキャンPDF（テキスト層なし）だが
 * 300dpi相当の解像度でビジョン解析すると罫線・数字とも明瞭に読み取れた（Y-6と同じ罠と対策）。
 * 全日制「合計」行を直接転記: 後期選抜募集定員(quota)=1,603・志願者数(出願先変更後・applicants)
 * =175。倍率は資料に印字が無いため自前算出（175/1603=0.1092…→finalRate=0.11、Y-6と同じ計算
 * 方針）。前期選抜・連携型選抜・定時制課程はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.fukushima.lg.jp/uploaded/attachment/679719.pdf',
  sourceTitle: '福島県教育委員会 令和7年度福島県立高等学校入学者選抜後期選抜志願状況（出願先変更後）について',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計', quota: 1603, applicants: 175, rate: 0.11 },
};

export const FUKUSHIMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'fukushima',
  years: [REIWA_7],
};
