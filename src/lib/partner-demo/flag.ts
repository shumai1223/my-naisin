/**
 * パートナー統合デモ（AA-2）の公開フラグ判定。
 * NEXT_PUBLIC_PARTNER_DEMO_ENABLED='1' の時だけ公開する（既定off）。
 * 実ブランド名・ロゴは一切使わずプレースホルダ「御社名」表示のみのため、
 * 万一旗がoffのまま長期間放置されても実害はないが、build-not-launchの原則
 * （isAdvisorEnabled/isJukuSaasEnabledと同じ「envを引数で受けて判定する」純粋関数パターン）を踏襲する。
 */
export function isPartnerDemoEnabled(envEnabled: string | undefined): boolean {
  return envEnabled === '1';
}
