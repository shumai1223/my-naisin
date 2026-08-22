/**
 * 冬の倍率速報体制（Y-11）速報面プレビューの公開フラグ判定。
 * NEXT_PUBLIC_INTERIM_BULLETIN_ENABLED='1' の時だけ公開する（既定off）。
 * 実際のライブ速報データはまだ存在しない（出願シーズンにならないと取得できない）ため、
 * 本フラグが有効化する範囲はサンプルデータのみの内部プレビューに限る（build-not-launch）。
 * isPartnerDemoEnabled/isJukuSaasEnabledと同じ「envを引数で受けて判定する」純粋関数パターンを踏襲する。
 */
export function isInterimBulletinPreviewEnabled(envEnabled: string | undefined): boolean {
  return envEnabled === '1';
}
