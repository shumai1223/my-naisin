/**
 * 応援（投げ銭）リンクの解決。T-REV2 R5。
 *
 * 運営者の指示は「申し訳程度に、ちっちゃく」。フッターに小さな文字リンクを1つだけ置く。
 * 支払いは Stripe の Payment Link（運営者がStripeの管理画面で作る）。URLが未設定の間は何も表示しない。
 *
 * 点火スイッチ: `.env.production` の NEXT_PUBLIC_SUPPORT_URL（ビルド時に埋め込まれる。wrangler の vars では効かない）。
 * 戻すときはその行を削除して push する。
 *
 * ⚠️ 見返りを約束しない（「運営費にあてます」まで）。Stripe 以外のURL・http・任意ホストは受け付けない
 *    （環境変数の書き間違い・改ざんで、意図しない外部リンクがフッターに出るのを防ぐ）。
 */

const ALLOWED_HOSTS = new Set(['buy.stripe.com', 'donate.stripe.com']);

/** 許可された Stripe Payment Link の https URL だけを返す。それ以外（未設定・空・不正）は null。 */
export function resolveSupportUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const value = raw.trim();
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  if (!ALLOWED_HOSTS.has(url.hostname)) return null;
  if (url.username || url.password) return null;
  return url.toString();
}

/** ビルド時に埋め込まれる値。URL未設定なら null（フッターは何も描画しない）。 */
export const SUPPORT_URL: string | null = resolveSupportUrl(process.env.NEXT_PUBLIC_SUPPORT_URL);
