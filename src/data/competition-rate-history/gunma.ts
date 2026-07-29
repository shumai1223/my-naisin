/**
 * 群馬県 多年度アーカイブ（Λ-4・13県目）。
 *
 * 一次ソース: 群馬県教育委員会「令和７年度群馬県公立高等学校入学者選抜　全日制課程選抜、
 * フレックススクール選抜志願状況」（テキスト埋め込み型PDF・pdftotext -layout相当で明瞭抽出）。
 * https://www.pref.gunma.jp/uploaded/attachment/649962.pdf
 *
 * 既存Y-6 gunma.ts（令和8年度・第２回志願先変更後）と同一の資料シリーズ。PDF末尾の
 * 「公立全日制・ﾌﾚｯｸｽｽｸｰﾙ合計」行を直接転記: 学校別募集定員(A)列=11,435（括弧内11,561は
 * 太田市立太田高校の内部進学者102人＋利根商業高校の県外募集24人を含めた学校別定員合計で、
 * 倍率算出の分母には使われていないため不採用。11561-11435=126=102+24で内部整合を確認済み）。
 * 学校別志願者数(D)列=11,525・倍率(D/A)=1.01（11525/11435=1.0079…≈1.01で整合）。
 * 定時制課程選抜・連携型選抜実施校志願状況は別表のためスコープ外（Y-6と同じ理由）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.gunma.jp/uploaded/attachment/649962.pdf',
  sourceTitle: '群馬県教育委員会 令和7年度群馬県公立高等学校入学者選抜 全日制課程選抜、フレックススクール選抜志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '公立全日制・フレックススクール合計', quota: 11435, applicants: 11525, rate: 1.01 },
};

export const GUNMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'gunma',
  years: [REIWA_7],
};
