import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';
import type { ReactNode } from 'react';

import './globals.css';

import { CookieConsent } from '@/components/CookieConsent';

const notoSansJp = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: '内申点シミュレーター | My Naishin - 成績可視化と学習アドバイス',
  description: '内申点の計算・可視化ツール。9教科の成績を入力するだけで合計点と達成率を自動計算。成績推移グラフ、教科別アドバイス、目標設定、勉強タイマー、高校受験に役立つ学習記事をワンストップで提供。東京都換算モードにも対応。',
  keywords: ['内申点', '内申点計算', '高校受験', '成績', '中学生', '内申書', '調査書', '成績管理', '学習アドバイス'],
  authors: [{ name: 'My Naishin' }],
  openGraph: {
    title: '内申点シミュレーター | My Naishin',
    description: '9教科の成績を入力するだけで内申点を自動計算。成績推移グラフや学習アドバイスも充実。',
    type: 'website',
    locale: 'ja_JP',
  },
  twitter: {
    card: 'summary_large_image',
    title: '内申点シミュレーター | My Naishin',
    description: '9教科の成績を入力するだけで内申点を自動計算。成績推移グラフや学習アドバイスも充実。',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${notoSansJp.className} min-h-screen mesh-gradient text-slate-900 antialiased`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
