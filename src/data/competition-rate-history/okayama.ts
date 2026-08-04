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
 *
 * **2026-08-04追記(令和6年度追加)**: 育伸社の学校別詳細PDF(2024年3月付・04333.pdf)は全70行超の
 * 学校別内訳のみで合計行が無くOsaka型の手動合算リスクに該当するため合算には使わなかった。代わりに
 * リセマム記事(2024-02-27付「岡山県公立高、一般選抜（第I期）志願状況（確定）」)を採用: 県立全日制
 * 50校(既存R7と学校数一致)・募集人員5,750・志願者数6,263・志願倍率1.09(6263/5750=1.089…≈1.09で
 * 内部整合を確認)。記事内で市立全日制(募集68・志願53・倍率0.78)が明確に別枠として記載されており、
 * 県立のみを抽出したことをスコープ面でも確認済み。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://resemom.jp/article/2024/02/27/76142.html',
  sourceTitle: 'リセマム「【高校受験2024】岡山県公立高、一般選抜（第I期）志願状況（確定）」(2024-02-27)',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立全日制・一般入学', schoolCount: 50, quota: 5750, applicants: 6263, rate: 1.09 },
};

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
  years: [REIWA_7, REIWA_6],
};
