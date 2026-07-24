/**
 * 塾SaaS MVP（ZZ-4d）の公開フラグ判定。
 * NEXT_PUBLIC_JUKU_SAAS_ENABLED='1' の時だけ公開する（既定off・build-not-launch）。
 * isAdvisorEnabled（ZZ-3c）と同じ「envを引数で受けて判定する」純粋関数パターンを踏襲する
 * （process.envを関数内で直接読まない＝テストで環境変数を差し替えずに判定を検証できる）。
 */
export function isJukuSaasEnabled(envEnabled: string | undefined): boolean {
  return envEnabled === '1';
}
