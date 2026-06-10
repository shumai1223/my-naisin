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

const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  display: 'swap',
  preload: false,
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
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export const viewport: Viewport = {
  themeColor: '#4f46e5',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`h-full ${notoSansJp.variable}`}>
      <body className={`min-h-screen mesh-gradient text-slate-900 antialiased`}>
        <GoogleAnalytics />
        <AffiliateClickTracker />
        <SiteEngagementTracker />
        <SiteSchema />
        <GlobalHeaderBridge>
          <Header />
        </GlobalHeaderBridge>
        <main>{children}</main>
        <Footer />
        <CookieConsent />
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
