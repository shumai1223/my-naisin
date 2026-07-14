'use client';

import * as React from 'react';
import { Cookie, X, CheckCircle2 } from 'lucide-react';
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
  return (
    <div className="fixed inset-x-3 bottom-3 z-[70] animate-fade-in sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-lg sm:-translate-x-1/2">
      <div className="rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur">
        <div className="flex items-start gap-3">
          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
            <Cookie className="h-5 w-5 text-white" />
          </div>
          <p className="flex-1 text-xs leading-relaxed text-slate-600">
            品質改善・利用状況の分析・広告配信のためにCookieを使用します。詳細は
            <Link href="/privacy" className="font-semibold text-blue-600 underline decoration-blue-300 underline-offset-2">
              プライバシーポリシー
            </Link>
            へ。※18歳未満の方は保護者の同意を得てからご利用ください。
          </p>
          <button
            onClick={handleDecline}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-3 flex items-center justify-end gap-2">
          <button
            onClick={handleAcceptEssential}
            className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-500 transition-colors hover:bg-slate-100"
          >
            必須のみ許可
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:shadow-lg"
          >
            <CheckCircle2 className="h-4 w-4" />
            すべて許可
          </button>
        </div>
      </div>
    </div>
  );
}
