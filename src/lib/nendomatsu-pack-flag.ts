/**
 * T-TD1 TD-8: 年度末パック商品ページ(/nendomatsu-pack)の公開フラグ判定。
 * NEXT_PUBLIC_NENDOMATSU_PACK_ENABLED='1' の時だけ表示する（既定off）。点火（env変更）は👤のみ。
 * isInterimBulletinPreviewEnabled と同じ「envを引数で受けて判定する」純粋関数パターン。
 */
export function isNendomatsuPackEnabled(envEnabled: string | undefined): boolean {
  return envEnabled === '1';
}
