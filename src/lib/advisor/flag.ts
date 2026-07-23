/**
 * グラウンデッドAIアドバイザー（ZZ-3c）の公開フラグ判定。
 * NEXT_PUBLIC_ADVISOR_ENABLED='1' の時だけ公開する（既定off・§8 DoD「旗offで本番不可視」）。
 * AdSlot.tsxのisAdSlotEnabledと同じ「envを引数で受けて判定する」純粋関数パターンを踏襲する
 * （process.envを関数内で直接読まない＝テストで環境変数を差し替えずに判定を検証できる）。
 */
export function isAdvisorEnabled(envEnabled: string | undefined): boolean {
  return envEnabled === '1';
}
