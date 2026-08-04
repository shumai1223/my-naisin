/**
 * 大分県 多年度アーカイブ（Λ-4・29県目）。
 *
 * 一次ソース: 大分県教育委員会「令和7年度大分県立高等学校第一次入学者選抜最終志願状況」
 * （令和7年2月28日公表・全4ページ）。
 * https://www.pref.oita.jp/uploaded/attachment/2234489.pdf
 *
 * 既存Y-6 oita.tsと同一資料シリーズ。教委の年度別ハブページ（r07ichijisaisyuu.html）経由で
 * R7版を発見（attachment IDは年度と機械的に対応せずURL置換は不発）。「県立高校全日制課程合計」
 * 行を直接転記: 募集人員(quota)=5,666・最終志願者数(applicants)=5,783。倍率は資料に印字が無い
 * ためY-6と同じ方針で自前算出（5783/5666=1.0207…→finalRate=1.02）。定時制課程はY-6と同じ理由
 * でスコープ外。
 *
 * **2026-08-04追記(令和6年度追加)**: 教委公式ハブページの令和6年度版直接URLは発見できず
 * （r06ichijisaisyuu.html等は404）、地方紙系ニュースサイトTOSオンライン(2024-02-27付「県立高校
 * 最終志願状況が発表 全日制の各高校の倍率一覧 大分」)が「最終志願状況が発表」と明記した記事内で
 * 全日制課程全体の募集人員5,864・最終志願者数6,080・志願倍率1.04(過去10年で最低)を報じており、
 * 独立の別ソース(WebSearch経由で確認した教委発表の要約引用・quota5,864で完全一致・applicants
 * 6,081とほぼ一致)ともクロスチェックできたため採用。育伸社の学校別詳細PDF(04344.pdf・2024年度)
 * は全70行超の学校別内訳のみで合計行が無くOsaka型の手動合算リスクに該当するため合算には使わず、
 * TOSオンラインの明示的な合計値のみを転記した。
 *
 * **2026-08-05追記(令和8年度追加)**: 教委公式ページ(r08ichijisaisyuu.html)経由でPDF
 * (attachment/2261572.pdf・全4頁)を発見しRead toolで直読み。4頁目末尾の「県立高校全日制課程合計」
 * 行を直接転記(募集人員5,806・最終志願者数5,969)。倍率は資料に印字が無いため自前算出
 * (5969/5806=1.0281…→finalRate=1.03)。定時制課程(合計65人)はY-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.oita.jp/uploaded/attachment/2261572.pdf',
  sourceTitle: '大分県教育委員会 令和8年度大分県立高等学校第一次入学者選抜第一志願最終志願状況',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5806, applicants: 5969, rate: 1.03 },
};

const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://tosonline.jp/news/20240227/00000012.html',
  sourceTitle: 'TOSオンライン「県立高校 最終志願状況が発表 全日制の各高校の倍率一覧 大分」(2024-02-27)',
  fetchedAt: '2026-08-04',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5864, applicants: 6080, rate: 1.04 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.oita.jp/uploaded/attachment/2234489.pdf',
  sourceTitle: '大分県教育委員会 令和7年度大分県立高等学校第一次入学者選抜最終志願状況',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5666, applicants: 5783, rate: 1.02 },
};

export const OITA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'oita',
  years: [REIWA_8, REIWA_7, REIWA_6],
};
