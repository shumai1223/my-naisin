/**
 * 愛媛県 多年度アーカイブ（Λ-4・16県目）。
 *
 * 一次ソース: 愛媛県教育委員会「令和7年度県立高等学校学科別入学志願者数（全日制）
 * （志願変更後）」（旧サイトehime-c.esnet.ed.jp配下・全1ページ・2段組）。
 * https://ehime-c.esnet.ed.jp/koukou/nyuusi/r07nyuusi/r07isi_ato/atozenniti.pdf
 *
 * 既存Y-6 ehime.ts（令和8年度・現サイトehime-kyoiku.esnet.ed.jp配下）とは別URL体系だが、
 * 同一資料シリーズ（学科別入学志願者数・志願変更後）のR7版を旧サイトのアーカイブ構造
 * （/koukou/nyuusi/r07nyuusi/配下）から発見。末尾の「合計」行を直接転記: 定員(A)8,590・
 * 入学志願者数(B)7,898・倍率(B/A)0.92（7898/8590=0.9194…≈0.92で整合）。定時制課程は
 * 他県と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://ehime-c.esnet.ed.jp/koukou/nyuusi/r07nyuusi/r07isi_ato/atozenniti.pdf',
  sourceTitle: '愛媛県教育委員会 令和7年度県立高等学校学科別入学志願者数（全日制）（志願変更後）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', quota: 8590, applicants: 7898, rate: 0.92 },
};

/**
 * 令和6年度（2024年度）: 同一URL体系（/koukou/nyuusi/r06nyuusi/r06isi_ato/atozenniti.pdf）で
 * R6版に直接アクセスできた（R7と異なりURLの年度桁単純置換で404にならなかった）。末尾の
 * 「合計」行を直接転記: 定員(A)8,765・入学志願者数(B)7,619・倍率(B/A)0.87
 * （7619/8765=0.8693…≈0.87で整合）。定時制課程は他県と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://ehime-c.esnet.ed.jp/koukou/nyuusi/r06nyuusi/r06isi_ato/atozenniti.pdf',
  sourceTitle: '愛媛県教育委員会 令和6年度県立高等学校学科別入学志願者数（全日制）（志願変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', quota: 8765, applicants: 7619, rate: 0.87 },
};

/**
 * 令和5年度（2023年度）: 同一URL体系（/koukou/nyuusi/r05nyuusi/r05isi_ato/atozenniti.pdf）で
 * R6と同様に年度桁単純置換のみで直接アクセスできた（Read toolで直読み成功）。末尾の「合計」行
 * を直接転記: 定員(A)8,965・入学志願者数(B)7,941・倍率(B/A)0.89（7941/8965=0.8858…≈0.89で
 * 整合）。定時制課程は他県と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://ehime-c.esnet.ed.jp/koukou/nyuusi/r05nyuusi/r05isi_ato/atozenniti.pdf',
  sourceTitle: '愛媛県教育委員会 令和5年度県立高等学校学科別入学志願者数（全日制）（志願変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', quota: 8965, applicants: 7941, rate: 0.89 },
};

/**
 * 令和4年度（2022年度）: 教委一次資料（旧サイトehime-c.esnet.ed.jp配下）への直接アクセス・
 * WebSearchによる年度別ハブページ探索とも404で失敗。教委発表を報じたリセモム記事
 * 「愛媛県立高の一般選抜志願状況（確定）」（2022年2月28日）から「定員9,025・志願者数7,980・
 * 志願倍率0.88倍（推薦入学確約者数を含む）」を引用（WebSearchのスニペットとWebFetch本文抽出の
 * 両方で同一数値を確認済み・7980/9025=0.8841…≈0.88で整合）。R5〜R7と同じ「全日制課程」の
 * スコープ（定員9,025はR5の8,965からの自然な減少傾向と整合）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/28/65999.html',
  sourceTitle: 'リセモム「愛媛県立高の一般選抜志願状況（確定）」（愛媛県教育委員会 令和4年度志願状況の発表を引用）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '合計', quota: 9025, applicants: 7980, rate: 0.88 },
};

export const EHIME_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'ehime',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4],
};
