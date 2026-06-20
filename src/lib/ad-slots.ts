/**
 * AdSense 手動広告ユニットの data-ad-slot ID を一元管理する。
 *
 * 設計：審査中（NEXT_PUBLIC_ADSENSE_ENABLED!=1）は <AdSlot> が null を返すため、
 * ここに仮IDが入っていても一切描画されない（審査リスクゼロ）。
 *
 * 承認後の手順（このファイル1枚の編集で全枠点火）:
 *   1) AdSenseコンソールで下記の各位置に対応する広告ユニットを作成し data-ad-slot を取得
 *   2) 下の '0000000000'（TODO）を取得したIDに置き換える
 *   3) 本番環境変数 NEXT_PUBLIC_ADSENSE_ENABLED=1 を設定して再デプロイ
 *
 * 位置の選定方針：保護者リード送客（ParentLeadCTA）と競合しない高エンゲージ位置に限定。
 * 広告は「床（AdSense）」、リード送客が「本命」。床が送客の邪魔をしないよう枠数は絞る。
 */
export const AD_SLOTS = {
  /** ブログ記事の本文末（読了直後＝高エンゲージ。関連記事の手前） */
  blogArticleEnd: '0000000000', // TODO: 承認後にAdSenseのスロットIDへ差し替え
  /**
   * ブログ本文中（記事内の `<!-- AD_PLACEHOLDER -->` の位置＝最初のスクロール後・H2間）。
   * 記事内フルイドユニット（format="fluid"）を想定。マーカーが無い記事には一切出ない（安全）。
   */
  blogInArticle: '0000000000', // TODO: 承認後にAdSenseの「記事内」ユニットのスロットIDへ差し替え
} as const;

export type AdSlotKey = keyof typeof AD_SLOTS;
