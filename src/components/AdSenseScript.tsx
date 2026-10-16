'use client';

import * as React from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

import { isAdSenseExcludedPath } from '@/lib/adsense-paths';
import { adPersonalizationFor, COOKIE_CONSENT_KEY, setAdPersonalization } from '@/lib/adsense-consent';

/**
 * Google AdSense の読み込み（自動広告・手動ユニット共通の adsbygoogle.js）。
 *
 * - サイトのパブリッシャーID（ca-pub-…）は公開値（public/ads.txt と同じ）。
 * - URLに資格情報・成績が載るページでは読み込まない（除外パスは lib/adsense-paths.ts）。GoogleAnalytics.tsx の /admin 除外と同じ考え方。
 * - Cookie同意画面の選択に連動する（lib/adsense-consent.ts）: 「すべて許可」のときだけパーソナライズ広告を求め、
 *   それ以外（必須のみ・未選択）は非パーソナライズ広告を求める。指定は広告スクリプトを読み込む「前」に立てる
 *   （指定してからこの要素を描画するので、最初の広告リクエストに間に合う）。
 * - afterInteractive: 本文の描画後に読み込み、LCPを邪魔しない。
 * - どの形式（アンカー・全画面など）を出すかは AdSense 管理画面の「自動広告」設定で決まる。
 */
const ADSENSE_SRC = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7817682248719138';

export function AdSenseScript() {
  const pathname = usePathname();
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let consent: string | null = null;
    try {
      consent = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    } catch {
      /* 保存領域が使えない環境は「同意なし」として扱う（非パーソナライズ） */
    }
    setAdPersonalization(window, adPersonalizationFor(consent));
    setReady(true);
  }, []);

  if (!ready || isAdSenseExcludedPath(pathname)) return null;
  return <Script id="adsbygoogle-js" async strategy="afterInteractive" crossOrigin="anonymous" src={ADSENSE_SRC} />;
}
