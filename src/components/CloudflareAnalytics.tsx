'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { CF_BEACON_TOKEN, isCfAnalyticsExcludedPath } from '@/lib/cf-analytics';

/**
 * Cloudflare Web Analytics のビーコン（lib/cf-analytics.ts）。トークンが空なら何も出さない。
 * spa: true で、Next のクライアント遷移もページビューとして数える。
 */
export function CloudflareAnalytics() {
  const pathname = usePathname();
  if (!CF_BEACON_TOKEN || isCfAnalyticsExcludedPath(pathname)) return null;
  return (
    <Script
      id="cf-web-analytics"
      defer
      strategy="afterInteractive"
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN, spa: true })}
    />
  );
}
