/**
 * 千葉県 多年度アーカイブ（Λ-4・3県目）。
 *
 * 千葉県教育委員会は総括表PDFを公表するが（Y-2のchiba.ts参照）、県全体の集計値
 * （募集人員・志願者確定数・倍率）は報道発表本文にのみ明記され、PDF内の学校別一覧は
 * 東京都・神奈川県のような区分別小計を持たない1行=1校×1学科のフラットな形式のため、
 * 全県集計にはA/B判定を伴う突合ロジックが必要（大阪府と同種の理由でgrand-total-only
 * 方針とスコープが合わない）。そのため本ファイルは**教委発表を報じる独立した報道記事
 * （よみうり進学メディア）1件から令和7・令和6年度の両方を同時に取得**し、
 * さらに令和6年度分は別の独立記事でも同じ数値(34,478人・1.12倍・125校201学科)を
 * クロスチェック済み（[[fable5-loop-protocol]]の「総括表PDFのビジョン解析は誤読しうる」
 * 教訓を踏まえ、そもそもビジョン解析を経由しない報道記事引用のみで構成した）。
 *
 * 一次ソース: 千葉県教育委員会「令和7年度千葉県公立高等学校入学者選抜...入学志願者確定数
 * について」の報道発表（2025-02-14公表）を報じたよみうり進学メディアの記事。
 * https://ysmedia.jp/admissions/24240/
 * 教委自身の一次配布資料ページ:
 * https://www.pref.chiba.lg.jp/kyouiku/shidou/press/2024/koukou/r7sigakakuitiran.html
 */
import type { PrefectureRateHistoryFile, YearSnapshot } from '@/lib/competition-rate-history';

const SOURCE = {
  sourceUrl: 'https://ysmedia.jp/admissions/24240/',
  sourceTitle: 'よみうり進学メディア「〈2025年度〉千葉県 公立高校「志願者確定数（2月14日付）」倍率1.14倍-令和7年度」（千葉県教育委員会 令和7年度入学志願者確定数の報道発表を引用）',
  fetchedAt: '2026-07-29',
};

const REIWA_7: YearSnapshot = {
  fiscalYear: '令和7年度（2025年度）',
  ...SOURCE,
  origin: 'current-year-column',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（一般入学者選抜・志願者確定数）', quota: 29720, applicants: 33854, rate: 1.14 },
};

/**
 * 令和6年度分は同記事内の「前年度」比較記述（quota/applicants）に加え、令和6年度発表時点の
 * 別の独立記事（よみうり進学メディア「志願者確定数（2月16日付）倍率1.12倍-令和6年度」・
 * 125校201学科・志願者確定数34,478人・倍率1.12倍）とも完全一致することを確認済み。
 */
const REIWA_6: YearSnapshot = {
  fiscalYear: '令和6年度（2024年度）',
  ...SOURCE,
  origin: 'prior-year-parenthetical',
  granularity: 'grand-total-only',
  categories: [],
  grandTotal: { label: '全日制の課程（一般入学者選抜・志願者確定数）', quota: 30680, applicants: 34478, rate: 1.12 },
};

export const CHIBA_COMPETITION_RATE_HISTORY: PrefectureRateHistoryFile = {
  prefectureCode: 'chiba',
  years: [REIWA_7, REIWA_6],
};
