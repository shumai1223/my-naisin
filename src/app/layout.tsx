import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

import { CookieConsent } from '@/components/CookieConsent';
import { GlobalHeaderBridge } from '@/components/GlobalHeaderBridge';
import { Footer } from '@/components/Footer';

const notoSansJp = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://my-naishin.com'),
  title: {
    default: '内申点シミュレーター | My Naishin - 全国47都道府県対応',
    template: '%s | My Naishin'
  },
  description: '全国47都道府県の内申点計算に対応。9教科の成績を入力するだけで各地域の方式に合わせて自動計算。2026年度（令和8年度）入試の最新情報に基づき、成績推移グラフ、教科別アドバイス、目標設定、高校受験に役立つ学習記事を提供。',
  keywords: ['内申点', '内申点計算', '高校受験', '成績', '中学生', '内申書', '調査書', '成績管理', '学習アドバイス', '47都道府県', '2026年度入試'],
  authors: [{ name: 'My Naishin' }],
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
  openGraph: {
    title: '内申点シミュレーター | My Naishin - 全国47都道府県対応',
    description: '全国47都道府県の内申点計算に対応。9教科の成績を入力するだけで各地域の方式に合わせて自動計算。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'My Naishin - 内申点計算ツール',
    url: 'https://my-naishin.com',
  },
  twitter: {
    card: 'summary_large_image',
    title: '内申点シミュレーター | My Naishin - 全国47都道府県対応',
    description: '全国47都道府県の内申点計算に対応。9教科の成績を入力するだけで各地域の方式に合わせて自動計算。',
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
  verification: {
    google: 'your-google-verification-code', // 必要に応じてユーザーに設定してもらう
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={`h-full ${notoSansJp.variable}`}>
      <head>
        <link rel="canonical" href="https://my-naishin.com" />
        {/* AdSense script using standard tag to avoid data-nscript attribute issues */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7817682248719138"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`min-h-screen mesh-gradient text-slate-900 antialiased`}>
        <GlobalHeaderBridge />
        <main>{children}</main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}
