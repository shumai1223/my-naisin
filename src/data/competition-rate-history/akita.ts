/**
 * 秋田県 多年度アーカイブ（Λ-4・14県目）。
 *
 * 一次ソース: 秋田県教育委員会「令和７年度秋田県公立高等学校入学者選抜１次募集 志願者数
 * （志願先変更後）」（公－２・2025年2月13日発表・全2ページ）。
 * https://www.pref.akita.lg.jp/uploads/public/archive_0000086830_00/20250213_１次募集　志願者数（志願先変更後）（公－２）.pdf
 *
 * 既存Y-6 akita.tsと同一の資料シリーズ（令和8年度版はY-6が転記元とした「公－２」）。
 * 全日制の課程「県合計」行を直接転記: 募集定員6,495・総志願者5,587・志願倍率0.86
 * （5587/6495=0.8602…≈0.86で整合）。注3に「大館国際情報学院等への中高一貫進学者を
 * 含めた場合6,668名となる」との注記があるが、これは印字済み倍率0.86の分母（6,495）とは
 * 一致しないため不採用（群馬県と同型の判断・[[fable5-loop-protocol]]参照）。定時制課程は
 * 他県と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl:
    'https://www.pref.akita.lg.jp/uploads/public/archive_0000086830_00/20250213_%EF%BC%91%E6%AC%A1%E5%8B%9F%E9%9B%86%E3%80%80%E5%BF%97%E9%A1%98%E8%80%85%E6%95%B0%EF%BC%88%E5%BF%97%E9%A1%98%E5%85%88%E5%A4%89%E6%9B%B4%E5%BE%8C%EF%BC%89%EF%BC%88%E5%85%AC%EF%BC%8D%EF%BC%92%EF%BC%89.pdf',
  sourceTitle: '秋田県教育委員会 令和7年度秋田県公立高等学校入学者選抜1次募集 志願者数（志願先変更後）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 県合計', quota: 6495, applicants: 5587, rate: 0.86 },
};

export const AKITA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'akita',
  years: [REIWA_7],
};
