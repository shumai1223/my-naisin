'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { isAdSenseExcludedPath } from '@/lib/adsense-paths';

/**
 * Google AdSense の読み込み（自動広告・手動ユニット共通の adsbygoogle.js）。
 *
 * - サイトのパブリッシャーID（ca-pub-…）は公開値（public/ads.txt と同じ）。
 * - URLに資格情報・成績が載るページでは読み込まない（除外パスは lib/adsense-paths.ts）。GoogleAnalytics.tsx の /admin 除外と同じ考え方。
 * - afterInteractive: 本文の描画後に読み込み、LCPを邪魔しない。
 * - どの形式（アンカー・全画面など）を出すかは AdSense 管理画面の「自動広告」設定で決まる。
 */
const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7817682248719138';

export function AdSenseScript() {
  const pathname = usePathname();
  if (isAdSenseExcludedPath(pathname)) return null;
  return <Script id="adsbygoogle-js" async strategy="afterInteractive" crossOrigin="anonymous" src={ADSENSE_SRC} />;
}
