/**
 * 岡山県 多年度アーカイブ（Λ-4・9県目）。
 *
 * 一次ソース: 岡山県教育委員会「令和7年度岡山県公立高等学校一般入学者選抜志願者数について」
 * （2025年2月28日公表）
 * https://www.pref.okayama.jp/uploaded/life/1048890_10156774_misc.pdf
 *
 * 既存Y-6 okayama.tsと同一の資料シリーズ・同一の列定義（quota=一般入学募集人員(A-B)・
 * applicants=一般入学志願者数(C)）。「（１）総括表」の「県立全日制」行（募集定員10,625・
 * 特別入学等合格内定者数4,885・一般入学募集人員5,729・志願者数5,968・比率1.04）を直接転記した。
 * 市立全日制・県立/市立定時制は既存Y-6と同じ理由でスコープ外（Y-6は県立全日制のみを収録）。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.okayama.jp/uploaded/life/1048890_10156774_misc.pdf',
  sourceTitle: '岡山県教育委員会 令和7年度岡山県公立高等学校一般入学者選抜志願者数について',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制・一般入学', schoolCount: 50, quota: 5729, applicants: 5968, rate: 1.04 },
};

export const OKAYAMA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'okayama',
  years: [REIWA_7],
};
