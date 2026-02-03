'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ExternalLink, Shield, BarChart3, Settings, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

interface CookieCategory {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  required: boolean;
}

const COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: 'essential',
    icon: <Shield className="h-4 w-4" />,
    title: '必須Cookie',
    description: 'サイトの基本機能（保存設定の記憶など）に必要です。無効にできません。',
    required: true
  },
  {
    id: 'analytics',
    icon: <BarChart3 className="h-4 w-4" />,
    title: '分析Cookie',
    description: 'サイトの利用状況を匿名で収集し、サービス改善に役立てます（Google Analytics等）。',
    required: false
  },
  {
    id: 'advertising',
    icon: <Settings className="h-4 w-4" />,
    title: '広告Cookie',
    description: 'お客様の興味に基づいた広告を表示するために使用します（Google AdSense等）。',
    required: false
  }
];

export function CookieConsent() {
  const [isVisible, setIsVisible] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  React.useEffect(() => {
    const hasAccepted = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasAccepted) {
      const timer = setTimeout(() => setIsVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'all');
    setIsVisible(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'essential');
    setIsVisible(false);
  };

  const handleDecline = () => {
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm"
            onClick={handleDecline}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 30, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="fixed inset-x-4 bottom-4 top-auto z-[70] sm:inset-x-auto sm:left-1/2 sm:bottom-6 sm:w-full sm:max-w-xl sm:-translate-x-1/2"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/60 bg-white/95 shadow-[0_25px_80px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.8)_inset] backdrop-blur-xl">
              {/* Decorative gradients */}
              <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-gradient-to-br from-amber-200 to-orange-300 opacity-40 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 opacity-40 blur-3xl" />

              {/* Close button */}
              <button
                onClick={handleDecline}
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="閉じる"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="relative border-b border-slate-100 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-6 py-6 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-200">
                    <Cookie className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-800 sm:text-xl">Cookie設定</h2>
                    <p className="mt-0.5 text-sm text-slate-600">プライバシーを尊重したサービス提供のために</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="relative px-6 py-5 sm:px-8">
                <p className="text-sm leading-relaxed text-slate-700">
                  当サイトでは、サービス品質の向上・利用状況の分析・パーソナライズされた広告配信のためにCookieを使用しています。
                  「すべて許可」をクリックすると、すべてのCookieの使用に同意したことになります。
                </p>

                {/* Toggle details */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
                >
                  {showDetails ? '詳細を隠す' : 'Cookieの種類を詳しく見る'}
                  <motion.span
                    animate={{ rotate: showDetails ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="inline-block"
                  >
                    ▼
                  </motion.span>
                </button>

                {/* Cookie categories */}
                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 grid gap-3">
                        {COOKIE_CATEGORIES.map((cat) => (
                          <div
                            key={cat.id}
                            className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/80 p-4"
                          >
                            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white text-slate-600 shadow-sm">
                              {cat.icon}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-800">{cat.title}</span>
                                {cat.required && (
                                  <span className="rounded-md bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
                                    必須
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 text-xs leading-relaxed text-slate-600">{cat.description}</p>
                            </div>
                            {cat.required && (
                              <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Privacy link */}
                <div className="mt-5 flex items-center gap-1 text-xs text-slate-500">
                  <span>詳しくは</span>
                  <Link
                    href="/privacy"
                    className="inline-flex items-center gap-0.5 font-medium text-blue-600 underline decoration-blue-300 underline-offset-2 hover:text-blue-700"
                  >
                    プライバシーポリシー
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                  <span>をご覧ください。</span>
                </div>
              </div>

              {/* Actions */}
              <div className="relative border-t border-slate-100 bg-slate-50/50 px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    onClick={handleAcceptEssential}
                    className="order-2 rounded-xl px-5 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-200 sm:order-1"
                  >
                    必須のみ許可
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="order-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-blue-200 transition-all hover:shadow-xl hover:shadow-blue-300 sm:order-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    すべて許可
                  </button>
                </div>
                <p className="mt-3 text-center text-[11px] text-slate-400 sm:text-left">
                  ※ 18歳未満の方は保護者の同意を得てからご利用ください。
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
