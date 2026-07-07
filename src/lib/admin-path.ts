/**
 * /admin配下のパス判定（単一ソース）。
 * GA4計測除外に使う：ADMIN_REPORT_TOKENが?token=でpage_view経由でGA4へ平文記録される事故を防ぐ（0-5）。
 */
export function isAdminPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return pathname === '/admin' || pathname.startsWith('/admin/');
}
