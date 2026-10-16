'use client';

import * as React from 'react';

import { COOKIE_CONSENT_KEY, COOKIE_CONSENT_RESET_EVENT, setAdPersonalization } from '@/lib/adsense-consent';

/**
 * フッターの「Cookie設定」。Cookie同意の選択をやり直せるようにする（同意画面は初回しか出ないため）。
 *
 * 押すと、保存済みの選択を消して「同意なし」の状態（アクセス解析のCookieなし・パーソナライズしない広告）に戻し、同意画面をもう一度出す。
 * 広告への反映は、ページを読み込み直したときから（読み込み済みの広告スクリプトには効き方の保証がないため）。
 */
export function CookieSettingsButton({ className = '' }: { className?: string }) {
  const onClick = () => {
    try {
      window.localStorage.removeItem(COOKIE_CONSENT_KEY);
    } catch {
      /* 保存領域が使えない環境でも、同意画面は出す */
    }
    // 次の広告リクエストからは「同意なし」＝パーソナライズしない広告を求める
    setAdPersonalization(window, 'non-personalized');
    // GA4：同一ページで即時に「同意なし」へ戻す（gtag 未ロード時は何もしない）
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('consent', 'update', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      });
    }
    window.dispatchEvent(new Event(COOKIE_CONSENT_RESET_EVENT));
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      Cookie設定
    </button>
  );
}
