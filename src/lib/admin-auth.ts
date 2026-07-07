/**
 * /admin/* 配下の共通トークン認証（ADMIN_REPORT_TOKEN）。
 * admin/report・admin/worklog等、複数の管理ページが同じトークンを共有する単一ソース
 * （実装が2箇所に分岐して片方だけセキュリティ修正されるドリフトを防ぐ・I-6）。
 */
export async function getAdminToken(): Promise<string | undefined> {
  try {
    const { getCloudflareContext } = await import('@opennextjs/cloudflare');
    const { env } = await getCloudflareContext({ async: true });
    return (
      (env as unknown as { ADMIN_REPORT_TOKEN?: string }).ADMIN_REPORT_TOKEN ??
      process.env.ADMIN_REPORT_TOKEN
    );
  } catch {
    return process.env.ADMIN_REPORT_TOKEN;
  }
}

/** ?token= と ADMIN_REPORT_TOKEN が一致するか（未設定/不一致はfalse＝可用性よりセキュリティ優先）。 */
export async function isAuthorizedAdminToken(token: string | undefined): Promise<boolean> {
  const expected = await getAdminToken();
  return Boolean(expected) && Boolean(token) && token === expected;
}
