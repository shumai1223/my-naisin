/**
 * Cloudflare Web Analytics（Cookieを使わず、個人を追跡しない全数のアクセス計測）。
 *
 * - 目的: GA4 は Cookie 同意が「すべて許可」の人しか数えられず、実際の訪問の1割未満しか見えない。
 *   Cloudflare Web Analytics は Cookie・ローカルストレージを使わず、個人を識別しないため、同意に関係なく全数が取れる。
 * - トークンは公開値（HTML に出る）。Cloudflare ダッシュボードの Web Analytics で my-naishin.com を追加して発行する。
 *   空のままなら何も読み込まず、プライバシーポリシーにも載せない（読み込む場合だけ載せる）。
 * - URLにトークン・成績が載るページでは読み込まない（lib/adsense-paths.ts と同じ考え方。/privacy・/contact は数える）。
 */
export const CF_BEACON_TOKEN: string = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN || '';

const EXCLUDED_PREFIXES = ['/admin', '/juku', '/hogosha', '/api'];

export function isCfAnalyticsExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return EXCLUDED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}
