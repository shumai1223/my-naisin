/**
 * Google AdSense の「パーソナライズ広告」を、Cookie同意画面の選択に連動させる（2026-10-16 👤決定）。
 *
 *  - 「すべて許可」を選んだ場合だけ、閲覧履歴などに基づく広告（パーソナライズ広告）を求める。
 *  - 「必須のみ許可」を選んだ場合・まだ選んでいない場合・保存領域が使えない場合は、パーソナライズしない広告
 *    （非パーソナライズ広告）を求める。`adsbygoogle.requestNonPersonalizedAds = 1` を、広告の最初のリクエストより前に立てる。
 *
 * 注意: これは Google へ「非パーソナライズ配信を求める」設定。非パーソナライズ広告でも、広告の表示回数の制限・不正なクリックの防止・
 * 集計のために Cookie 等が使われることがある（広告そのものは表示される）。プライバシーポリシーにもそう書いてある。
 */

export const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

/** 「Cookie設定」ボタン（フッター）が、同意画面をもう一度出すために投げるイベント名。CookieConsent が受け取る。 */
export const COOKIE_CONSENT_RESET_EVENT = 'mn:cookie-consent-reset';

export type AdPersonalization = 'personalized' | 'non-personalized';

/** Cookie同意の保存値（'all' / 'essential' / 未選択=null）から、広告のパーソナライズ可否を決める。 */
export function adPersonalizationFor(consent: string | null | undefined): AdPersonalization {
  return consent === 'all' ? 'personalized' : 'non-personalized';
}

type AdsbygoogleArray = unknown[] & { requestNonPersonalizedAds?: number };
interface AdsWindow {
  adsbygoogle?: unknown;
}

/**
 * adsbygoogle の配列に、非パーソナライズの指定（1＝求める／0＝求めない）を立てる。
 * 最初の広告リクエストより前に立てること（公式: 1ページに1行・push より前）。広告スクリプトは読み込み後にこの指定を取り込んで
 * 配列を別のオブジェクトに置き換える（そのため後から読むと undefined になる）。リクエスト後に値を変えた場合の効き方は
 * 公式に明記が無い（次のページ読み込みでは localStorage から必ず反映される）。
 */
export function setAdPersonalization(w: AdsWindow, mode: AdPersonalization): void {
  const existing = w.adsbygoogle as AdsbygoogleArray | undefined;
  const ads: AdsbygoogleArray = existing ?? [];
  ads.requestNonPersonalizedAds = mode === 'non-personalized' ? 1 : 0;
  w.adsbygoogle = ads;
}
