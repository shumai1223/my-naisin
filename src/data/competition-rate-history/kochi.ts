/**
 * 高知県 多年度アーカイブ（Λ-4・23県目）。
 *
 * 一次ソース: 高知県教育委員会「令和7年度Ａ日程等志願先変更後の状況（学校別）」
 * （令和7年2月6日発表・2月10日修正・全2ページ）。
 * https://www.pref.kochi.lg.jp/doc/r7_siganjokyo/file_contents/070206_Anittei_henkogo.pdf
 *
 * 既存Y-6 kochi.tsと同一資料シリーズ（Ａ日程のみ採用・Ｂ日程は他県の2次募集と同種のため対象外）。
 * 全日制「合計」行（県立計＋市立計）を直接転記: 募集定員(quota)=4,949・第1志望者数(applicants)
 * =3,399・志願率(rate)=0.69（印字済み値をそのまま採用）。Y-6が個票転記で直面した高知国際高校
 * グローバル探究学科（募集定員「若干名」で数値化不能）の扱いは、grand-total-onlyの本ファイルでは
 * 教委発表の合計行をそのまま採用するため影響しない。多部制単位制・連携型中高一貫特別選抜は
 * Y-6と同じ理由でスコープ外。
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

/**
 * 令和8年度（2026年度）: 既存Y-6 competition-rates/kochi.tsが一次ソースPDF(r8_A_henkougo0205.pdf)
 * から確定済みのofficialSubtotals「合計」行(県立計+市立計・募集定員4,372・第1志望者数3,144)を
 * そのまま転記（新規リサーチ不要・2026-08-05発見）。倍率は自前算出(3144/4372=0.7191…≈0.72)。
 */
const REIWA_8: YearSnapshot = {
  fiscalYear: '令和8年度（2026年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/2026010600090/file_contents/r8_A_henkougo0205.pdf',
  sourceTitle: '高知県教育委員会 令和8年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-08-05',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4372, applicants: 3144, rate: 0.72 },
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r7_siganjokyo/file_contents/070206_Anittei_henkogo.pdf',
  sourceTitle: '高知県教育委員会 令和7年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-07-29',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4949, applicants: 3399, rate: 0.69 },
};

/**
 * 令和6年度（2024年度）: R7と同一シリーズのハブページ(r6_siganjokyo)から同種の学校別一覧表
 * ［確定］PDF(令和6年2月22日発表・全2頁)を発見。全日制「合計」行（県立計4,810/4,644/3,186＋
 * 市立計280/280/357＝合計5,090/4,924/3,543）のうち募集定員・第1志望者数・志願率を転記:
 * quota=4,924・applicants=3,543・rate=0.72（3543/4924=0.7195…≈0.72で整合）。独立ソース
 * (WebSearchで拾えたR7発表比較文「令和6年度は0.72倍」)でも同一値を確認済み。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r6_siganjokyo/file_contents/060222_Anittei_henkogo.pdf',
  sourceTitle: '高知県教育委員会 令和6年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4924, applicants: 3543, rate: 0.72 },
};

/**
 * 令和5年度（2023年度）: R6/R7と同一シリーズのハブページ(r5_siganjokyo)から同種の学校別
 * 一覧表［確定］PDF(令和5年2月10日発表・全2頁)を発見。全日制「合計」行（県立計4,810
 * (A日程募集定員4,621)/3,109＋市立計280/333＝合計5,090(4,901)/3,442）のうち、R6/R7と同じ
 * 列定義（括弧内のA日程募集定員を分母とする志願率）で quota=4,901・applicants=3,442・
 * rate=0.70を転記（3442/4901=0.7023…≈0.70で印字済み値と整合）。
 */
const REIWA_5: YearSnapshot = {
  fiscalYear: '令和5年度（2023年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r5_siganjokyo/file_contents/050210_Anittei_henkogo.pdf',
  sourceTitle: '高知県教育委員会 令和5年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4901, applicants: 3442, rate: 0.7 },
};

/**
 * 令和4年度（2022年度）: R5/R6/R7と同一シリーズのハブページ(r4_siganjokyo)から学校別一覧表
 * ［確定］PDF(令和4年2月10日発表・全2頁)を発見・Read toolで直読み。全日制「合計」行（県立計
 * 4,810(A日程募集定員4,595)/3,224＋市立計280/331＝合計5,090(4,875)/3,555）のうち、R5/R6/R7と
 * 同じ列定義（括弧内のA日程募集定員を分母とする志願率）でquota=4,875・applicants=3,555・
 * rate=0.73を転記（3555/4875=0.7292…≈0.73で印字済み値と整合）。
 */
const REIWA_4: YearSnapshot = {
  fiscalYear: '令和4年度（2022年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r4_siganjokyo/file_contents/040210_Anittei_henkogo.pdf',
  sourceTitle: '高知県教育委員会 令和4年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4875, applicants: 3555, rate: 0.73 },
};

/**
 * 令和3年度（2021年度）: 4年→5年横展開。教委の年度別ハブページ(soshiki/311701/r3_siganjokyo.html)
 * 経由で同種の学校別一覧表［確定］PDF(令和3年2月12日発表・全2頁)を発見・Read toolで直読み。
 * 全日制「合計」行（県立計4,810(A日程募集定員4,601)/3,196＋市立計280/325＝合計5,090
 * (4,881)/3,521）のうち、R4/R5/R6/R7と同じ列定義（括弧内のA日程募集定員を分母とする志願率）
 * でquota=4,881・applicants=3,521・rate=0.72を転記（3521/4881=0.7215…≈0.72で印字済み値と整合）。
 */
const REIWA_3: YearSnapshot = {
  fiscalYear: '令和3年度（2021年度）',
  sourceUrl: 'https://www.pref.kochi.lg.jp/doc/r3_siganjokyo/file_contents/030212_Anittei_henkogo.pdf',
  sourceTitle: '高知県教育委員会 令和3年度Ａ日程等志願先変更後の状況（学校別）',
  fetchedAt: '2026-08-03',
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制 合計（県立計＋市立計）', quota: 4881, applicants: 3521, rate: 0.72 },
};

/**
 * ⚠️2026-08-24調査(令和2年度・見送り): リセモム記事(2020-02-17付「【高校受験2020】高知県公立高、
 * A日程志願状況（確定）」https://resemom.jp/article/2020/02/17/54810.html)で「全日制課程の
 * 募集人員5,330人に対して3,691人が志願し、志願倍率は...0.72倍」という記述を発見したが、
 * 5,330/3,691を自前計算すると0.69となり記事本文の0.72と一致しない(逆算すると倍率0.72の
 * 分母は約5,127で5,330とは異なる)。R3のコメントが指摘する「括弧内のA日程募集定員（全体の
 * 募集定員とは別の値）を分母に使う」という同型の罠に該当する可能性が高く、記事本文からは
 * A日程専用の正しい分母（括弧内の値）を確認できなかった。誤ったquotaで不変条件テストに
 * 抵触するリスクを避けるため、正しい分母を確認できるまでR2追加を見送る(捏造ゼロ原則)。
 */
export const KOCHI_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'kochi',
  years: [REIWA_8, REIWA_7, REIWA_6, REIWA_5, REIWA_4, REIWA_3],
};
