import type { Metadata, Viewport } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import Script from 'next/script';
import type { ReactNode } from 'react';

import './globals.css';

import { CookieConsent } from '@/components/CookieConsent';
import { GlobalHeaderBridge } from '@/components/GlobalHeaderBridge';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { SiteSchema } from '@/components/StructuredData/SiteSchema';
import { GoogleAnalytics } from '@/components/GoogleAnalytics';
import { AffiliateClickTracker } from '@/components/Affiliate/AffiliateClickTracker';
import { SiteEngagementTracker } from '@/components/SiteEngagementTracker';
import { ExitIntentLineModal } from '@/components/ExitIntentLineModal';

const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  display: 'swap',
  // 日本語フォントは巨大なので preload しない（フルfontのpreloadはLCPを悪化させる）。
  preload: false,
  // スワップ中は端末標準の日本語フォントで描画＝字形が近くCLS（レイアウトずれ）を抑える。
  fallback: ['system-ui', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', 'sans-serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-naishin.com'),
  title: '内申点 計算サイト【2026年度入試対応・全国47都道府県】| My Naishin',
  description: '中学生向けの無料内申点計算サイト。全国47都道府県の最新方式に対応し、9教科（5教科＋実技4教科）の評定を入れるだけで内申点を瞬時に自動計算。志望校からの逆算機能や、偏差値・評定平均の専用ツールも別ページに用意。2026年度（令和8年度）入試対策に最適です。',
  keywords: ['内申点', '内申点 計算', '内申点 計算サイト', '内申点 自動計算', '内申点 シミュレーション', '内申点 計算 中学生', '高校受験', '中学生', '47都道府県', '2026年度入試', '令和8年度入試'],
  authors: [{ name: 'My Naishin' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: '内申点 計算サイト【2026年度入試対応・全国47都道府県】| My Naishin',
    description: '全国47都道府県の内申点計算に対応。9教科の評定を入れるだけで自動計算、志望校からの逆算機能つき。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
    url: 'https://my-naishin.com',
    images: [{ url: '/og-image.png', alt: '内申点 計算サイト My Naishin｜全国47都道府県対応・無料' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: '内申点 計算サイト【2026年度入試対応・全国47都道府県】| My Naishin',
    description: '全国47都道府県の内申点計算に対応。9教科の評定を入れるだけで自動計算、志望校からの逆算機能つき。',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // サイト所有確認（env を入れた瞬間に <meta> が出る）。
  //  - Google Search Console: NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
  //  - Bing Webmaster Tools: NEXT_PUBLIC_BING_SITE_VERIFICATION（msvalidate.01 の content 値）
  //    ※ ChatGPT検索は Bing インデックスが母体＝Bing WMT 登録＋サイトマップ提出で AI 送客経路を開通させる。
  ...(() => {
    const verification: NonNullable<Metadata['verification']> = {};
    if (process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION) {
      verification.google = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
    }
    if (process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION) {
      verification.other = { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION };
    }
    return Object.keys(verification).length ? { verification } : {};
  })(),
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`h-full ${notoSansJp.variable}`}>
      <head>
        {/* 第三者オリジンへの接続を前倒し（CWV：LCP/INP改善）。フォントは next/font が自己ホストするため
            fonts.gstatic.com への preconnect は不要（むしろアンチパターン）。計測/広告のみ前倒しする。 */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://i.moshimo.com" />
      </head>
      <body className={`min-h-screen mesh-gradient text-slate-900 antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-indigo-700 focus:shadow-lg focus:ring-2 focus:ring-indigo-500"
        >
          本文へスキップ
        </a>
        <GoogleAnalytics />
        <AffiliateClickTracker />
        <SiteEngagementTracker />
        <SiteSchema />
        <GlobalHeaderBridge>
          <Header />
        </GlobalHeaderBridge>
        <main id="main-content">{children}</main>
        <Footer />
        <CookieConsent />
        <ExitIntentLineModal />
        <Script
          id="adsbygoogle-init"
          strategy="lazyOnload"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7817682248719138"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
