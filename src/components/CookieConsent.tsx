'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasAccepted) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    // GA4 Consent Mode：同一セッションで即時に計測を許可（gtag未ロード時はno-op）
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof w.gtag === 'function') {
      w.gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted',
      });
    }
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // 2026-07-15: 旧実装は全画面バックドロップ+画面半分のモーダルで、初回訪問者の体験と
  // 換金導線(下部の常設LINEバー等)を丸ごと塞いでいた。コンパクトな下部バナーに変更。
  // 同意の選択肢(すべて許可/必須のみ)とプライバシーポリシー導線は維持=Consent Modeの建付けは不変。
  // 2026-10-16 UI改修: 固定バーなので shadow-overlay のみ許可。2つの選択肢は同じ大きさの主/副ボタンにそろえた。
  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] animate-fade-in sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2">
      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-overlay">
        <div className="flex items-start gap-3">
          <p className="flex-1 text-sm leading-relaxed text-slate-900">
            品質改善・利用状況の分析のためにCookieを使用します。「必須のみ許可」を選んでも、Google AdSenseの広告表示にともなうCookieは使われることがあります。詳細は
            <Link href="/privacy" className="text-brand-700 underline underline-offset-2 hover:text-brand-800">
              プライバシーポリシー
            </Link>
            へ。※18歳未満の方は保護者の同意を得てからご利用ください。
          </p>
          <button
            onClick={handleDecline}
            className="-mr-2 -mt-2 shrink-0 rounded p-3 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            aria-label="閉じる"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={handleAcceptEssential}
            className="min-h-[44px] rounded border border-brand-700 bg-white px-4 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
          >
            必須のみ許可
          </button>
          <button
            onClick={handleAcceptAll}
            className="min-h-[44px] rounded bg-brand-700 px-5 text-sm font-bold text-white transition-colors hover:bg-brand-800"
          >
            すべて許可
          </button>
        </div>
      </div>
    </div>
  );
}
