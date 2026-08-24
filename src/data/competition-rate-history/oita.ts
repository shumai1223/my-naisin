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
 *
 * **2026-08-06追記(令和5/4/3年度追加)**: 教委公式サイトの旧年度ページ(r03/r04/r05ichijisaisyuu.html)は
 * いずれも404(削除済み)のため、報道系サイトの本文直読みで確認(要約転記ではない)。令和5・令和4年度は
 * リセモム記事＋個別指導NEXTAブログの2独立ソースが完全一致。令和3年度はリセモム記事1件のみ発見
 * (NEXTAの同年ブログは大分市内個別校の倍率のみで県全体合計の記載が無くクロスチェック不可だった)。
 * 3年度とも「志願者数÷募集人員」が発表倍率と近似することを検算済み。
 *
 * **2026-08-24追記(令和2年度追加・全47県中この時点で最古の7年度目に到達)**: リセモム記事
 * （2020-03-09付「大分県が2月28日に発表した最終志願状況」を引用）で確認。募集人員5,730・
 * 最終志願者数6,168・倍率1.08（2/25時点の速報値と数値が完全一致しており、志願変更による
 * 変動が無かったことも確認済み）。教委公式サイトの旧URL(r02ichijishigan1.html等)は404で
 * 削除済み・Wayback Machineはこの環境のツールから到達不可(既知の制約)だったため、確定値を
 * 直接報じたリセモム記事を一次資料として採用した。
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

const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://resemom.jp/article/2023/02/24/71107.html',
  sourceTitle: 'リセモム「【高校受験2023】大分県立高、一次入試出願状況（確定）」(個別指導NEXTAブログと一致確認済み)',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5825, applicants: 6134, rate: 1.05 },
};

const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://resemom.jp/article/2022/02/25/65994.html',
  sourceTitle: 'リセモム「【高校受験2022】大分県立高、一次入試出願状況（確定）」(個別指導NEXTAブログと一致確認済み)',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5889, applicants: 6181, rate: 1.05 },
};

/** 独立ソース1件のみ(リセモムのみ・NEXTAの同年ブログは個別校倍率のみで県全体合計の記載なし)。 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://resemom.jp/article/2021/03/09/60849.html',
  sourceTitle: 'リセモム「【高校受験2021】大分県公立高入試、TV・Web解答速報」(大分県教育委員会2月26日発表の再掲引用)',
  fetchedAt: '2026-08-06',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5635, applicants: 6070, rate: 1.08 },
};

const REIWA_2: YearSnapshot = {
  fiscalYear: '令和2年度（2020年度）',
  sourceUrl: 'https://resemom.jp/article/2020/03/09/55236.html',
  sourceTitle:
    'リセモム「大分県が2月28日に発表した最終志願状況」(第一次入学者選抜・県立高校全日制課程)',
  fetchedAt: '2026-08-24',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '県立高校全日制課程合計', quota: 5730, applicants: 6168, rate: 1.08 },
};

export const OITA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'oita',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3, REIWA_2],
};
