/**
 * 季節講習（夏期/冬期）モードの単一ソース。
 *
 * 北極星（[[google-trends-2026-06]] / [[fable5-master-plan-2026-06]]）：
 *   内申/S値/当日点/total-score の検索は 11〜2月にピーク（2月でS値11.7倍）。
 *   この山は「冬期講習の申込期（11〜12月）」「受験直前の通塾意欲」と完全に同期する。
 *   よって高インテント面のリードを、季節中だけ「塾の季節講習 無料体験」に寄せると換金効率が上がる。
 *
 * 設計：
 *  - 日付で自動判定（getActiveSeason）＝デプロイ不要で 11/1 に勝手に冬モードへ。受験中の本人は放置でよい。
 *  - 手動上書き（SEASON_OVERRIDE）＝塾が講習を出していない等で止めたい時に1行で制御。
 *  - コピーは購入を迫らない無料体験訴求のみ（コンプラ）。送客先IDは lead-config 側が解決する。
 */

export type Season = 'summer' | 'winter';

export interface SeasonCopy {
  /** 季節講習の語（見出し・note生成に使う）。 */
  kw: string;
  heading: string;
  body: string;
  ctaText: string;
}

export const SEASON_COPY: Record<Season, SeasonCopy> = {
  winter: {
    kw: '冬期講習',
    heading: '入試本番まで、残された時間で差を詰めるなら',
    body: 'この冬の使い方で、内申点・当日点の伸びは大きく変わります。多くの塾が受験直前期に冬期講習を実施するいま、まずは無料体験で「お子さまの弱点と、本番までにやるべきこと」を見える化しませんか。費用はかからず、その場で契約を迫られることはありません。',
    ctaText: '冬期講習の無料体験を申し込む',
  },
  summer: {
    kw: '夏期講習',
    heading: '夏は受験の天王山。この夏でリードを作るなら',
    body: '夏休みは内申点・偏差値をまとめて伸ばせる最大のチャンスです。多くの塾が夏期講習を実施するこの時期、まずは無料体験で「お子さまの弱点と、夏にやるべきこと」を確認しませんか。費用はかからず、その場で契約を迫られることはありません。',
    ctaText: '夏期講習の無料体験を申し込む',
  },
};

/**
 * 季節モードの手動上書き。
 *   null      … 日付で自動判定（既定）
 *   'off'     … 季節モードを完全停止（塾が講習を出していない等で通年コピーに戻す）
 *   'winter'  … 冬モードを強制
 *   'summer'  … 夏モードを強制
 * 受験期は基本 null（自動）でよい。止めたい時だけここを編集して push。
 */
export const SEASON_OVERRIDE: Season | 'off' | null = null;

/**
 * 日付から季節講習シーズンを判定（UTC月日で十分・JSTとの数時間差は窓の端で無視できる）。
 *  - 冬期講習〜受験直前: 11/1 〜 2/15
 *  - 夏期講習:           6/15 〜 8/10
 */
export function getActiveSeason(now: Date = new Date()): Season | null {
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  if (m === 11 || m === 12 || m === 1 || (m === 2 && d <= 15)) return 'winter';
  if ((m === 6 && d >= 15) || m === 7 || (m === 8 && d <= 10)) return 'summer';
  return null;
}

/**
 * 実シーズンを解決：明示指定 > 手動上書き > 日付自動。
 * explicit を渡さない（undefined）と自動。null を渡すと「季節なし」を明示。
 */
export function resolveSeason(explicit?: Season | null, now: Date = new Date()): Season | null {
  if (explicit !== undefined) return explicit;
  const ov: Season | 'off' | null = SEASON_OVERRIDE;
  if (ov === 'off') return null;
  if (ov === 'winter' || ov === 'summer') return ov;
  return getActiveSeason(now);
}
