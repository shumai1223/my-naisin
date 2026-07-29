/**
 * 山梨県 多年度アーカイブ（Λ-4・39県目）。
 *
 * 一次ソース: 山梨県教育委員会「令和7年度山梨県公立高等学校入学者選抜 全日制後期募集の最終志願
 * 状況について」（2025年2月27日発表・確定）を報じたリセモム記事。
 * https://resemom.jp/article/2025/02/27/81028.html
 *
 * 既存Y-6 yamanashi.tsのURL（documents/7061/r8saisyuusigansyasuu1.pdf）は年度prefix置換
 * （r8→r7）が404となり原本PDFへの直接発見には至らなかった。**教訓**: WebSearch要約が最初に
 * 返した「3,228人」は志願変更前（出願当初）の暫定値であり、実際の最終確定値は「3,227人」
 * （2/27付リセモム記事で確定と明記）だったため、記事本文への直接WebFetchで再確認して訂正した
 * （志願変更前後で1名差があり、単一のWebSearch要約だけに頼ると暫定値を確定値と誤認するリスクを
 * 再確認）。全日制課程「26校48学科の募集定員3,395人に対し、最終志願者数3,227人。志願倍率は
 * 0.95倍」を直接引用（3227/3395=0.9505…≈0.95で整合）。Y-6と同じ「全日制後期募集」のスコープ。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://resemom.jp/article/2025/02/27/81028.html',
  sourceTitle:
    'リセモム「山梨県公立高、後期選抜の志願状況（確定）」（山梨県教育委員会 令和7年度全日制後期募集の最終志願状況の発表を引用）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制後期募集（26校48学科）', quota: 3395, applicants: 3227, rate: 0.95 },
};

export const YAMANASHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'yamanashi',
  years: [REIWA_7],
};
