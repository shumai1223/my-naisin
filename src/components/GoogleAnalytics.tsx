'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { isAdminPath } from '@/lib/admin-path';

/**
 * GA4（gtag.js）。橋①の先行指標（gap_target_set / share_to_parent / met_bridge_click）を
 * 実計測するための受け皿。これが入ると src/lib/track.ts の no-op が実点火する。
 *
 * 設計：
 *  - 環境変数 NEXT_PUBLIC_GA_ID が無ければ何も読み込まない（= 既存本番に無影響）。
 *    Cloudflare の env に G-XXXXXXX を入れた瞬間に計測開始。
 *  - Consent Mode v2：既定は denied。Cookie同意が 'all' のときだけ analytics/ad を granted。
 *    （同一セッションでの同意更新は CookieConsent 側から gtag('consent','update') を発火）
 *  - window.gtag を定義するので track() がそのまま流れる。
 */
// GA4測定IDは公開値（HTMLに露出する非機密）なので既定値として焼き込み、env で上書き可能にする。
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-VRVSVK1X5Z';

export function GoogleAnalytics() {
  const pathname = usePathname();
  // /admin配下はADMIN_REPORT_TOKENが?token=でURLに乗るため、GA4のpage_viewに平文記録されないよう未読込にする（0-5）。
  if (!GA_ID || isAdminPath(pathname)) return null;

  return (
    <>
      <Script
        id="ga-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('consent', 'default', {
            ad_storage: 'denied',
            analytics_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
          });
          try {
            if (localStorage.getItem('cookie-consent-accepted') === 'all') {
              gtag('consent', 'update', {
                ad_storage: 'granted',
                analytics_storage: 'granted',
                ad_user_data: 'granted',
                ad_personalization: 'granted'
              });
            }
          } catch (e) {}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
