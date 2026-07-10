/**
 * 保護者リード「県×面」出し分けエンジンの汎用部分。
 *
 * PLAYBOOK移植メモ（F-7⑤）: lead-config.ts は460行中ほとんどがmy-naishin固有のコンテンツ
 * （PROGRAM_PRESETの実際の文言・PLACEMENT/PREFECTURE_*_OVERRIDES・季節スワップの結線）で、
 * 分離コストの割に再利用できる行数が少ない。ここに切り出すのは「プログラムIDのプリセットを
 * 見出し/本文と合成してオファー断片を作る」というoffer解決パターンのみ＝他サイトへそのまま
 * コピー可能な唯一の汎用部分。
 */

/** オファー断片の共通の形（note/ctaText＝プリセット由来、heading/body＝呼び出し側のコピー）。 */
export interface OfferPreset {
  /** ボタン下の補足表記（PR/無料など）。送客先名に合わせる。 */
  note: string;
  /** CTAボタンの文言。 */
  ctaText: string;
}

/**
 * プログラムIDから note/ctaText をプリセット表で補完し、見出し/本文と合成してオファー断片を作る。
 * サイト固有の「プリセット表（PROGRAM_PRESET相当）」を渡すだけで使い回せる＝割当ミスを防ぐ
 * パターン自体の移植（実際のプリセット内容・IDの型は呼び出し側＝サイト固有のまま）。
 */
export function buildOfferFragment<Id extends string, Copy extends Record<string, unknown>>(
  affiliateId: Id,
  presets: Partial<Record<Id, OfferPreset>>,
  copy: Copy
): { affiliateId: Id } & Partial<OfferPreset> & Copy {
  return { affiliateId, ...presets[affiliateId], ...copy };
}
