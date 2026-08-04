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

/**
 * 令和6年度（2024年度）: 同一資料シリーズの令和6年度版「公－２」（美の国あきたネット
 * archive/79409から発見・全2頁）の「県合計」行（募集定員6,604・総志願者5,753・
 * 志願倍率0.87）を直接転記（5753/6604=0.8712…≈0.87で整合）。注3に中高一貫進学者を
 * 含めた場合6,781名となる旨の注記があるが、R7と同じ理由（印字済み倍率の分母と不一致）
 * で不採用。定時制課程は他県と同じ理由でスコープ外。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.akita.lg.jp/uploads/public/archive_0000079409_00/kou02_20240213.pdf',
  sourceTitle: '秋田県教育委員会 令和6年度秋田県公立高等学校入学者選抜1次募集 志願者数（志願先変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 県合計', quota: 6604, applicants: 5753, rate: 0.87 },
};

/**
 * 令和5年度（2023年度）: 同一資料シリーズの令和5年度版「公－２」（美の国あきたネット
 * archive/70494から発見・全2頁・Read toolで直読み成功）の「県合計」行（募集定員6,752・
 * 総志願者5,912・志願倍率0.88）を直接転記（5912/6752=0.8756…≈0.88で整合）。注3に
 * 中高一貫進学者を含めた場合6,926名となる旨の注記があるが、R6/R7と同じ理由（印字済み
 * 倍率の分母と不一致）で不採用。定時制課程は他県と同じ理由でスコープ外。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl:
    'https://www.pref.akita.lg.jp/uploads/public/archive_0000070494_00/20230213_%EF%BC%91%E6%AC%A1%E5%8B%9F%E9%9B%86%E5%BF%97%E9%A1%98%E7%8A%B6%E6%B3%81%EF%BC%88%E5%BF%97%E9%A1%98%E5%85%88%E5%A4%89%E6%9B%B4%E5%BE%8C%EF%BC%89%E5%85%AC%EF%BC%8D%EF%BC%92.pdf',
  sourceTitle: '秋田県教育委員会 令和5年度秋田県公立高等学校入学者選抜1次募集 志願者数（志願先変更後）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 県合計', quota: 6752, applicants: 5912, rate: 0.88 },
};

/**
 * 令和4年度（2022年度）: 教委の年度別ハブページ(archive/62318)から発見した「令和4年度 一般選抜
 * 志願者数（志願先変更後）公－２」（全2頁・Read toolで直読み成功・R5-R7と同じ「公－２」番号だが
 * タイトルは「1次募集」でなく「一般選抜」表記の年）。「全日制の課程」の「県合計」行には
 * 「募集定員」6,823と「前期選抜後の募集人数」5,597の2列が存在し、印字済み倍率0.89は
 * 4959/5597=0.8859…≈0.89と一致する（6,823を分母にすると0.73で不一致）ため、R5-R7と同じ
 * 「前期選抜後の募集人数」列をquotaとして採用（募集定員6,823・志願者数4,959・倍率0.89）。
 * 注1に中高一貫進学者を含めた場合7,036名となる旨の注記があるが、R5-R7と同じ理由
 * （印字済み倍率の分母と不一致）で不採用。定時制課程は他県と同じ理由でスコープ外。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.akita.lg.jp/uploads/public/archive_0000062318_00/R04一般選抜（志願変更後）公－２.pdf',
  sourceTitle: '秋田県教育委員会 令和4年度秋田県公立高等学校入学者選抜 一般選抜 志願者数（志願先変更後）',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 県合計', quota: 5597, applicants: 4959, rate: 0.89 },
};

/**
 * 令和3年度（2021年度）: 教委の年度別ハブページ(archive/55173)から発見した「令和3年度 一般選抜
 * 志願者数（志願先変更後）公－２」（全2頁・Read toolでPDFを直読み成功）。「全日制の課程」の
 * 「県合計」行には「募集定員」6,900と「前期選抜後の募集人数」5,675の2列が存在し、印字済み
 * 倍率0.87は4933/5675=0.8693…≈0.87と一致する（6,900を分母にすると0.71で不一致）ため、
 * R4-R7と同じ「前期選抜後の募集人数」列をquotaとして採用（募集定員5,675・志願者数4,933・
 * 倍率0.87）。注1に中高一貫進学者を含めた場合7,093名となる旨の注記があるが、他年度と同じ理由
 * （印字済み倍率の分母と不一致）で不採用。定時制課程は他県と同じ理由でスコープ外。これで
 * akitaは5年連続（R3〜R7）収録で満了。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.akita.lg.jp/uploads/public/archive_0000055173_00/R03一般選抜（志願変更後）公－２.pdf',
  sourceTitle: '秋田県教育委員会 令和3年度秋田県公立高等学校入学者選抜 一般選抜 志願者数（志願先変更後）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程 県合計', quota: 5675, applicants: 4933, rate: 0.87 },
};

export const AKITA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'akita',
  years: [REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
