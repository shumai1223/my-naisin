/**
 * 季節講習（夏期/冬期/直前）モードの単一ソース。
 *
 * 北極星（[[google-trends-2026-06]] / [[fable5-master-plan-2026-06]]）：
 *   内申/S値/当日点/total-score の検索は 11〜2月にピーク（2月でS値11.7倍）。
 *   この山は「冬期講習の申込期（11〜12月）」「受験直前の通塾意欲（1〜2月）」と完全に同期する。
 *   よって高インテント面のリードを、季節中だけ「塾の季節講習/直前フォロー 無料体験・相談」に寄せると換金効率が上がる。
 *   ただし1〜2月は大半の塾で講習募集自体が終わっているため「講習」訴求が的外れになる（D-7）。
 *   よって冬（11-12月・講習訴求）と直前（1-2月・個別フォロー訴求）を別シーズンとして分離する。
 *
 * 設計：
 *  - 日付で自動判定（getActiveSeason）＝デプロイ不要で 11/1 に勝手に冬モードへ、1/1 に直前モードへ。受験中の本人は放置でよい。
 *  - 手動上書き（SEASON_OVERRIDE）＝塾が講習を出していない等で止めたい時に1行で制御。
 *  - コピーは購入を迫らない無料体験・無料相談訴求のみ（コンプラ）。送客先IDは lead-config 側が解決する。
 */

export type Season = 'summer' | 'winter' | 'last-minute';

export interface SeasonCopy {
  /** 季節講習の語（見出し・note生成に使う）。 */
  kw: string;
  /** note生成に使う体験の種類（「無料体験」/「無料相談」等）。lead-config側で固定文言にしない＝季節でズレさせない。 */
  offerKind: string;
  heading: string;
  body: string;
  ctaText: string;
}

/**
 * PLAYBOOK移植メモ（F-7）: Season型・getActiveSeason・resolveSeasonの日付判定ロジックはサイト非依存で
 * そのままコピー可能（「受験シーズン」という概念自体は大学受験等でも成立する）。他サイトへ移植する際は
 * SEASON_COPY の文言（塾の季節講習という高校受験文脈）だけを対象サイトの訴求に書き換えること。
 */
export const SEASON_COPY: Record<Season, SeasonCopy> = {
  winter: {
    kw: '冬期講習',
    offerKind: '無料体験',
    heading: '入試本番まで、残された時間で差を詰めるなら',
    body: 'この冬の使い方で、内申点・当日点の伸びは大きく変わります。多くの塾が受験直前期に冬期講習を実施するいま、まずは無料体験で「お子さまの弱点と、本番までにやるべきこと」を見える化しませんか。費用はかからず、その場で契約を迫られることはありません。',
    ctaText: '冬期講習の無料体験を申し込む',
  },
  summer: {
    kw: '夏期講習',
    offerKind: '無料体験',
    heading: '夏は受験の天王山。この夏でリードを作るなら',
    body: '夏休みは内申点・偏差値をまとめて伸ばせる最大のチャンスです。多くの塾が夏期講習を実施するこの時期、まずは無料体験で「お子さまの弱点と、夏にやるべきこと」を確認しませんか。費用はかからず、その場で契約を迫られることはありません。',
    ctaText: '夏期講習の無料体験を申し込む',
  },
  // 1/1〜2/15＝出願・当日点の追い込み期。この時期はほとんどの塾で冬期講習の募集自体が終わっているため
  // 「講習」訴求は的外れ（in-market signalとズレる）。的を「直前の個別フォロー」に絞ったコピーへ切替える。
  'last-minute': {
    kw: '入試直前対策',
    offerKind: '無料相談',
    heading: '入試本番まで、あと少し。今からできる最後の一手を',
    body: '出願や当日の得点調整で慌ただしいこの時期でも、残り時間で伸ばせる範囲は必ずあります。多くの塾が直前期向けの個別フォロー・無料相談を受け付けているいま、まずは無料相談で「本番までにやるべきこと」を整理しませんか。費用はかからず、その場で契約を迫られることはありません。',
    ctaText: '入試直前の無料相談を申し込む',
  },
};

/**
 * 季節モードの手動上書き。
 *   null            … 日付で自動判定（既定）
 *   'off'           … 季節モードを完全停止（塾が講習を出していない等で通年コピーに戻す）
 *   'winter'        … 冬期講習モードを強制
 *   'summer'        … 夏期講習モードを強制
 *   'last-minute'   … 入試直前モードを強制
 * 受験期は基本 null（自動）でよい。止めたい時だけここを編集して push。
 */
export const SEASON_OVERRIDE: Season | 'off' | null = null;

/**
 * 日付から季節講習シーズンを判定（UTC月日で十分・JSTとの数時間差は窓の端で無視できる）。
 *  - 冬期講習（募集期）: 11/1 〜 12/31（「講習」訴求がin-marketな時期）
 *  - 入試直前（追い込み期）: 1/1 〜 2/15（大半の塾で講習募集自体が終わり「講習」訴求が的外れになる時期。D-7）
 *  - 夏期講習:             6/15 〜 8/10
 */
export function getActiveSeason(now: Date = new Date()): Season | null {
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate();
  if (m === 11 || m === 12) return 'winter';
  if (m === 1 || (m === 2 && d <= 15)) return 'last-minute';
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
  if (ov === 'winter' || ov === 'summer' || ov === 'last-minute') return ov;
  return getActiveSeason(now);
}

/**
 * 季節限定ページ（ZZ-8d：冬リードマグネット等・「公開は11月」の予約公開に使う）が
 * 今この瞬間に公開してよい季節かどうかを判定する（純粋関数）。
 * winter（11-12月・講習募集期）とlast-minute（1月〜2/15・出願直前期）のみtrue。
 * summer/nullでは非公開のまま（該当ページはnotFound()を返す設計を想定）。
 */
export function isSeasonalContentLive(season: Season | null): boolean {
  return season === 'winter' || season === 'last-minute';
}
